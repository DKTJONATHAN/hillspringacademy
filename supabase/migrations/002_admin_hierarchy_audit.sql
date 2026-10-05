-- Hill Springs Academy: admin hierarchy and audit trail
-- Owner = can manage administrators; admin/editor = operational access.
-- The earliest active admin becomes the initial owner so existing access is preserved.

alter table public.school_admins drop constraint if exists school_admins_role_check;
alter table public.school_admins add constraint school_admins_role_check
  check (role in ('owner','admin','editor'));

update public.school_admins
set role = 'owner'
where user_id = (
  select user_id from public.school_admins
  where active = true
  order by created_at asc
  limit 1
)
and not exists (
  select 1 from public.school_admins where active = true and role = 'owner'
);

create table if not exists public.school_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  target text,
  details jsonb not null default '{}'::jsonb,
  ip text,
  created_at timestamptz not null default now()
);

create index if not exists school_audit_log_created_idx
  on public.school_audit_log (created_at desc);
create index if not exists school_audit_log_actor_idx
  on public.school_audit_log (actor_id, created_at desc);

alter table public.school_audit_log enable row level security;

-- Audit records are written only by trusted Edge Functions using the secret key.
-- No browser policy is intentionally granted.
