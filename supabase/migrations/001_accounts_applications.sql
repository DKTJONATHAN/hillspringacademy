-- Hill Springs Academy: parent accounts, applications, reset codes
-- Canonical schema for the production Supabase project.
-- Safe to re-run; existing production tables/data are preserved.

create table if not exists public.school_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  role text not null default 'admin' check (role in ('admin','editor')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.school_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists public.school_codes (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  purpose text not null check (purpose in ('signup','reset')),
  code_hash text not null,
  attempts int not null default 0,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists school_codes_email_idx on public.school_codes (email, purpose, created_at desc);

create table if not exists public.school_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  parent_name text not null,
  parent_email text not null,
  phone text,
  learner_name text not null,
  learner_dob date,
  gender text,
  current_level text,
  requested_level text not null,
  previous_school text,
  entry_term text,
  notes text,
  status text not null default 'pending' check (status in ('pending','accepted','rejected')),
  decision_note text,
  decided_by text,
  decided_at timestamptz,
  decision_email_id text,
  decision_email_error text,
  created_at timestamptz not null default now()
);
create index if not exists school_applications_status_idx on public.school_applications (status, created_at desc);
create index if not exists school_applications_user_idx on public.school_applications (user_id);

alter table public.school_conversations add column if not exists user_id uuid;

alter table public.school_admins enable row level security;
alter table public.school_profiles enable row level security;
alter table public.school_codes enable row level security;
alter table public.school_applications enable row level security;

-- IMPORTANT:
-- Do not add browser RLS policies to these protected tables.
-- All access is intentionally routed through Edge Functions using the Supabase secret key.
-- Admin membership is identified by school_admins.user_id, not an email column.
