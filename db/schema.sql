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
