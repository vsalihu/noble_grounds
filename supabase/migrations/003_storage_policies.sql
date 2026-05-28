-- Noble Grounds gallery storage bucket and policies.
-- Bucket name: gallery
-- Recommended object path after migration 004: gallery/{project_id}/{timestamp}-{safe-file-name}
-- Public users can view gallery images. Only authenticated admin users can
-- upload, update, or delete files.

insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do update set public = excluded.public;

create policy "Public can view gallery storage objects"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'gallery');

create policy "Admins can upload gallery storage objects"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'gallery'
  and name like 'gallery/%'
  and public.is_admin()
);

create policy "Admins can update gallery storage objects"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'gallery'
  and public.is_admin()
)
with check (
  bucket_id = 'gallery'
  and name like 'gallery/%'
  and public.is_admin()
);

create policy "Admins can delete gallery storage objects"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'gallery'
  and public.is_admin()
);
