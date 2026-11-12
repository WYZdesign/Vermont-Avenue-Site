create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null,
  role text not null default 'fan' check (role in ('owner', 'team', 'client', 'fan')),
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  token_hash text unique not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  event_date date,
  event_type text not null,
  act text not null,
  venue text,
  guests text,
  budget text,
  message text,
  status text not null default 'new' check (status in ('new', 'quoted', 'booked', 'closed', 'lost')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  name text not null,
  email text,
  phone text,
  company text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id) on delete set null,
  client_id uuid references clients(id) on delete set null,
  number text unique not null,
  amount_cents integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'sent', 'paid', 'void')),
  due_date date,
  stripe_payment_link text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists contracts (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id) on delete set null,
  client_id uuid references clients(id) on delete set null,
  title text not null,
  body text not null,
  status text not null default 'draft' check (status in ('draft', 'sent', 'signed', 'void')),
  signed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  channel text,
  status text not null default 'draft',
  audience text,
  sent_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  source text,
  created_at timestamptz not null default now()
);

create table if not exists logistics (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id) on delete set null,
  event_date date,
  venue text,
  crew text,
  equipment text,
  checklist text,
  status text not null default 'planning',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists content_blocks (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

create index if not exists idx_bookings_status on bookings(status);
create index if not exists idx_bookings_email on bookings(lower(email));
create index if not exists idx_bookings_created on bookings(created_at desc);
create index if not exists idx_sessions_token on sessions(token_hash);
create index if not exists idx_sessions_user on sessions(user_id);
create index if not exists idx_invoices_status on invoices(status);
create index if not exists idx_clients_email on clients(lower(email));
create index if not exists idx_logistics_date on logistics(event_date);

create table if not exists shows (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  date date not null,
  venue text not null,
  city text not null,
  state text not null,
  status text not null default 'tentative' check (status in ('tentative', 'confirmed', 'cancelled')),
  act text not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists roster (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  role text not null,
  instruments text,
  genres text,
  bio text,
  avatar_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_shows_date on shows(date);
create index if not exists idx_shows_status on shows(status);
create index if not exists idx_roster_name on roster(name);
create index if not exists idx_roster_active on roster(active);

/* -------------------------------------------------------------------------- */
/* CMS + MEDIA + ROLES (2026-11-10)                                           */
/* -------------------------------------------------------------------------- */

-- Roles: add "admin" (full access like owner). Team stays limited.
do $$
begin
  if exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'users_role_check' and table_name = 'users'
  ) then
    alter table users drop constraint users_role_check;
  end if;
  alter table users add constraint users_role_check
    check (role in ('owner', 'admin', 'team', 'client', 'fan'));
end $$;

-- Typed, grouped content blocks (CMS).
alter table content_blocks add column if not exists group_name text;
alter table content_blocks add column if not exists label text;
alter table content_blocks add column if not exists type text not null default 'text';
alter table content_blocks add column if not exists page text;
alter table content_blocks add column if not exists sort integer not null default 0;
alter table content_blocks add column if not exists meta jsonb not null default '{}'::jsonb;

-- Media library. storage = 'db' (bytes in media_blobs) | 'r2' (object key) | 'url'.
create table if not exists media (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  mime text not null,
  bytes integer not null default 0,
  width integer,
  height integer,
  alt text,
  tags text[] not null default '{}',
  storage text not null default 'db',
  key text,
  url text,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists media_blobs (
  media_id uuid primary key references media(id) on delete cascade,
  data bytea not null
);

create index if not exists idx_media_created on media(created_at desc);

-- Activity log (audit + simple progress).
create table if not exists activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  actor text,
  action text not null,
  entity text,
  entity_id text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_activity_created on activity(created_at desc);

-- Rate limiting (login/signup/forms). Keyed by client IP + action.
create table if not exists throttle (
  key text primary key,
  count integer not null default 1,
  window_start timestamptz not null default now()
);

-- Integrations / connectors. `config` holds one encrypted blob: { __enc: "<base64>" }.
create table if not exists connections (
  id uuid primary key default gen_random_uuid(),
  provider text unique not null,
  label text not null,
  status text not null default 'not_connected',
  config jsonb not null default '{}'::jsonb,
  connected_by uuid references users(id) on delete set null,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
