-- Phase 2 security hardening — run in Supabase SQL Editor if not applied via CLI.

-- 2a. Ensure RLS on all public tables (adjust names if your schema differs)
do $$
declare r record;
begin
  for r in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', r.tablename);
  end loop;
end $$;

revoke all on all tables in schema public from anon, authenticated;
revoke all on all functions in schema public from anon, authenticated;
alter default privileges in schema public revoke all on tables from anon, authenticated;

-- 2b. Atomic rate limiter
create table if not exists public.school_rate_limits(
  key text not null,
  bucket timestamptz not null,
  hits int not null default 1,
  primary key (key, bucket)
);
alter table public.school_rate_limits enable row level security;

create or replace function public.rl_hit(p_key text, p_window int, p_max int)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  b timestamptz := to_timestamp(floor(extract(epoch from now()) / p_window) * p_window);
  h int;
begin
  insert into public.school_rate_limits(key, bucket) values (p_key, b)
  on conflict (key, bucket) do update set hits = public.school_rate_limits.hits + 1
  returning hits into h;
  return h <= p_max;
end;
$$;

revoke all on function public.rl_hit from public, anon, authenticated;
grant execute on function public.rl_hit to service_role;

-- 2c. Code attempts + fast user lookup
create or replace function public.school_code_fail(p_id uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.school_codes set attempts = attempts + 1 where id = p_id;
$$;

create or replace function public.school_find_user(p_email text)
returns table (id uuid, email_confirmed_at timestamptz)
language sql
security definer
set search_path = ''
as $$
  select id, email_confirmed_at from auth.users where lower(email) = lower(p_email) limit 1;
$$;

revoke all on function public.school_code_fail, public.school_find_user from public, anon, authenticated;
grant execute on function public.school_code_fail, public.school_find_user to service_role;

-- 2e. Audit log
create table if not exists public.school_audit_log (
  id bigserial primary key,
  at timestamptz not null default now(),
  actor_id uuid,
  action text not null,
  target text,
  ip text
);
alter table public.school_audit_log enable row level security;
