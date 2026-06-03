-- Admin-managed public reviews for Noble Grounds.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_type text null,
  location text null,
  rating integer not null default 5,
  review_text text not null,
  is_featured boolean default false,
  display_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint reviews_rating_check check (rating between 1 and 5)
);

drop trigger if exists reviews_set_updated_at on public.reviews;

create trigger reviews_set_updated_at
before update on public.reviews
for each row
execute function public.set_updated_at();

alter table public.reviews enable row level security;

create index if not exists reviews_display_order_idx
on public.reviews (display_order, created_at desc);

comment on table public.reviews is
  'Public reviews managed by authenticated Noble Grounds admins.';

create policy "Public can read reviews"
on public.reviews
for select
to anon, authenticated
using (true);

create policy "Admins can insert reviews"
on public.reviews
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update reviews"
on public.reviews
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete reviews"
on public.reviews
for delete
to authenticated
using (public.is_admin());
