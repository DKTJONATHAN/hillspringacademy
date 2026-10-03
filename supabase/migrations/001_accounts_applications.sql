-- Hill Springs Academy: parent accounts, applications, reset codes
-- Run in Supabase SQL editor. Safe to re-run.

create table if not exists public.school_admins (
  email text primary key,
  created_at timestamptz not null default now()
);

create table if not exists public.school_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  created_at timestamptz not null default now()
);

-- One-time 6-digit codes (stored hashed, never in plain text)
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

-- Link enquiries made by signed-in parents (table already exists from school-submit)
alter table public.school_conversations add column if not exists user_id uuid;

-- All access goes through Edge Functions using the secret key.
-- RLS on with no policies = the browser (publishable key) can read nothing directly.
alter table public.school_admins enable row level security;
alter table public.school_profiles enable row level security;
alter table public.school_codes enable row level security;
alter table public.school_applications enable row level security;

-- Add your admin email(s). Replace the example, then run:
-- insert into public.school_admins (email) values ('admin@example.com') on conflict do nothing;
