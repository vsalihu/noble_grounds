-- Noble Grounds quote enquiry storage.
-- Public visitors submit through the Next.js API route, which should use the
-- Supabase service role key server-side. The public browser client must not be
-- able to read, update, or delete enquiries.

create extension if not exists pgcrypto;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$;

comment on function public.is_admin() is
  'Returns true when the authenticated Supabase user has app_metadata.role = admin. Set this manually in Supabase for Albert/admin users.';

create table if not exists public.quote_enquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text null,
  property_area text not null,
  customer_type text not null,
  service_needed text not null,
  message text null,
  source text default 'website',
  status text default 'new',
  created_at timestamptz default now()
);

alter table public.quote_enquiries enable row level security;

comment on table public.quote_enquiries is
  'Private quote enquiries submitted from the Noble Grounds website. Public users must not read this table.';

-- No public insert policy is created. Website submissions should go through
-- app/api/quote using SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS server-side.

create policy "Admins can read quote enquiries"
on public.quote_enquiries
for select
to authenticated
using (public.is_admin());

create policy "Admins can update quote enquiry status"
on public.quote_enquiries
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());
