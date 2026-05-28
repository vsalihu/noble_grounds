-- Project/address based gallery structure for Noble Grounds.
-- Public users can read projects and gallery images. Authenticated admin users
-- can create, update, and delete projects/images through Supabase Auth + RLS.

create extension if not exists pgcrypto;

create table if not exists public.gallery_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  address text not null,
  location text null,
  customer_type text null,
  description text null,
  is_featured boolean default false,
  display_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists gallery_projects_set_updated_at on public.gallery_projects;

create trigger gallery_projects_set_updated_at
before update on public.gallery_projects
for each row
execute function public.set_updated_at();

alter table public.gallery_projects enable row level security;

alter table public.gallery_images
add column if not exists project_id uuid references public.gallery_projects(id) on delete cascade;

create index if not exists gallery_projects_display_order_idx
on public.gallery_projects (display_order, created_at desc);

create index if not exists gallery_images_project_order_idx
on public.gallery_images (project_id, display_order, created_at desc);

comment on table public.gallery_projects is
  'Public gallery project/address groupings. Avoid publishing exact private customer addresses without permission.';

comment on column public.gallery_images.project_id is
  'Gallery project/address section this image belongs to. New images should always set this.';

create policy "Public can read gallery projects"
on public.gallery_projects
for select
to anon, authenticated
using (true);

create policy "Admins can insert gallery projects"
on public.gallery_projects
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update gallery projects"
on public.gallery_projects
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete gallery projects"
on public.gallery_projects
for delete
to authenticated
using (public.is_admin());
