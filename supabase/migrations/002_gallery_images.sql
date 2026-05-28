-- Noble Grounds gallery metadata.
-- Public users can read gallery rows for the public website. Only authenticated
-- admin users can create, update, or delete gallery metadata.

create extension if not exists pgcrypto;

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  storage_path text not null,
  title text not null,
  description text null,
  location text null,
  alt_text text not null,
  is_featured boolean default false,
  display_order integer default 0,
  created_at timestamptz default now()
);

alter table public.gallery_images enable row level security;

comment on table public.gallery_images is
  'Public gallery image metadata for Noble Grounds project photos.';

create policy "Public can read gallery images"
on public.gallery_images
for select
to anon, authenticated
using (true);

create policy "Admins can insert gallery images"
on public.gallery_images
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update gallery images"
on public.gallery_images
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete gallery images"
on public.gallery_images
for delete
to authenticated
using (public.is_admin());

create index if not exists gallery_images_display_order_idx
on public.gallery_images (display_order, created_at desc);
