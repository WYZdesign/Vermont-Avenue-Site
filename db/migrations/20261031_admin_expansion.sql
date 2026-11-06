-- Admin expansion: contracts, invoices, social hub
-- Idempotent. Safe to run more than once.

-- Shows table
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

-- Roster table
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

-- Contracts: structured booking terms
alter table contracts add column if not exists client_name text;
alter table contracts add column if not exists client_email text;
alter table contracts add column if not exists client_phone text;
alter table contracts add column if not exists event_date date;
alter table contracts add column if not exists venue text;
alter table contracts add column if not exists act text;
alter table contracts add column if not exists contract_type text not null default 'performance';
alter table contracts add column if not exists fee_cents integer not null default 0;
alter table contracts add column if not exists deposit_cents integer not null default 0;
alter table contracts add column if not exists set_length_minutes integer;
alter table contracts add column if not exists updated_at timestamptz not null default now();

-- Invoices: line items and payment tracking
alter table invoices add column if not exists line_items jsonb not null default '[]'::jsonb;
alter table invoices add column if not exists tax_cents integer not null default 0;
alter table invoices add column if not exists deposit_cents integer not null default 0;
alter table invoices add column if not exists client_name text;
alter table invoices add column if not exists client_email text;
alter table invoices add column if not exists service_date date;
alter table invoices add column if not exists paid_at timestamptz;
alter table invoices add column if not exists updated_at timestamptz not null default now();

-- Social hub
create table if not exists social_posts (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  content text not null,
  media_urls jsonb not null default '[]'::jsonb,
  scheduled_for timestamptz,
  status text not null default 'draft' check (status in ('draft','scheduled','published','failed','archived')),
  external_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_social_status on social_posts(status);
create index if not exists idx_social_scheduled on social_posts(scheduled_for);
create index if not exists idx_contracts_booking on contracts(booking_id);
create index if not exists idx_invoices_booking on invoices(booking_id);
