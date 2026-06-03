-- Editable quote price factors for Noble Grounds.

create extension if not exists pgcrypto;

create table if not exists public.price_factors (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  is_active boolean default true,
  display_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists price_factors_set_updated_at on public.price_factors;

create trigger price_factors_set_updated_at
before update on public.price_factors
for each row
execute function public.set_updated_at();

alter table public.price_factors enable row level security;

create index if not exists price_factors_active_order_idx
on public.price_factors (is_active, display_order, created_at desc);

drop policy if exists "Public can read active price factors" on public.price_factors;
create policy "Public can read active price factors"
on public.price_factors
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Admins can read all price factors" on public.price_factors;
create policy "Admins can read all price factors"
on public.price_factors
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can insert price factors" on public.price_factors;
create policy "Admins can insert price factors"
on public.price_factors
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update price factors" on public.price_factors;
create policy "Admins can update price factors"
on public.price_factors
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete price factors" on public.price_factors;
create policy "Admins can delete price factors"
on public.price_factors
for delete
to authenticated
using (public.is_admin());
