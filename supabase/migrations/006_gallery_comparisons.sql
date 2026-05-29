-- Before/after comparison cards for the Noble Grounds gallery.
-- Old gallery_images rows are kept for compatibility, but the public gallery
-- should prefer this paired comparison table from this migration onward.

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

create table if not exists public.gallery_comparisons (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.gallery_projects(id) on delete cascade not null,
  before_image_url text not null,
  before_storage_path text not null,
  after_image_url text not null,
  after_storage_path text not null,
  title text null,
  description text null,
  location text null,
  alt_text text null,
  is_featured boolean default false,
  display_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists gallery_comparisons_set_updated_at on public.gallery_comparisons;

create trigger gallery_comparisons_set_updated_at
before update on public.gallery_comparisons
for each row
execute function public.set_updated_at();

alter table public.gallery_comparisons enable row level security;

create index if not exists gallery_comparisons_project_order_idx
on public.gallery_comparisons (project_id, display_order, created_at desc);

comment on table public.gallery_comparisons is
  'Paired before/after public gallery cards for Noble Grounds projects.';

comment on column public.gallery_comparisons.alt_text is
  'Optional shared accessible description for the paired before/after images.';

create policy "Public can read gallery comparisons"
on public.gallery_comparisons
for select
to anon, authenticated
using (true);

create policy "Admins can insert gallery comparisons"
on public.gallery_comparisons
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update gallery comparisons"
on public.gallery_comparisons
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete gallery comparisons"
on public.gallery_comparisons
for delete
to authenticated
using (public.is_admin());
