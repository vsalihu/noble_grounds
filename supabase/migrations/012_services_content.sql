-- Editable service cards for Noble Grounds.

create extension if not exists pgcrypto;

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  customer_type text null,
  icon_key text null,
  image_url text null,
  image_storage_path text null,
  is_active boolean default true,
  display_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists services_set_updated_at on public.services;

create trigger services_set_updated_at
before update on public.services
for each row
execute function public.set_updated_at();

alter table public.services enable row level security;

create index if not exists services_active_order_idx
on public.services (is_active, display_order, created_at desc);

drop policy if exists "Public can read active services" on public.services;
create policy "Public can read active services"
on public.services
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Admins can read all services" on public.services;
create policy "Admins can read all services"
on public.services
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can insert services" on public.services;
create policy "Admins can insert services"
on public.services
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update services" on public.services;
create policy "Admins can update services"
on public.services
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete services" on public.services;
create policy "Admins can delete services"
on public.services
for delete
to authenticated
using (public.is_admin());
