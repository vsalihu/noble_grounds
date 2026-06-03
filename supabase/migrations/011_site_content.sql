-- Editable site content sections for Noble Grounds.

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

create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  section_key text unique not null,
  title text null,
  subtitle text null,
  body text null,
  button_label text null,
  button_href text null,
  image_url text null,
  image_storage_path text null,
  extra jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

drop trigger if exists site_content_set_updated_at on public.site_content;

create trigger site_content_set_updated_at
before update on public.site_content
for each row
execute function public.set_updated_at();

alter table public.site_content enable row level security;

insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
on public.site_content
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert site content" on public.site_content;
create policy "Admins can insert site content"
on public.site_content
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update site content" on public.site_content;
create policy "Admins can update site content"
on public.site_content
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete site content" on public.site_content;
create policy "Admins can delete site content"
on public.site_content
for delete
to authenticated
using (public.is_admin());

drop policy if exists "Public can view site assets" on storage.objects;
create policy "Public can view site assets"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'site-assets');

drop policy if exists "Admins can upload site assets" on storage.objects;
create policy "Admins can upload site assets"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'site-assets'
  and name like 'site-assets/%'
  and public.is_admin()
);

drop policy if exists "Admins can update site assets" on storage.objects;
create policy "Admins can update site assets"
on storage.objects
for update
to authenticated
using (bucket_id = 'site-assets' and public.is_admin())
with check (
  bucket_id = 'site-assets'
  and name like 'site-assets/%'
  and public.is_admin()
);

drop policy if exists "Admins can delete site assets" on storage.objects;
create policy "Admins can delete site assets"
on storage.objects
for delete
to authenticated
using (bucket_id = 'site-assets' and public.is_admin());
