-- Optional customer lawn photos for quote enquiries.
-- Photos are uploaded through the server-side quote API using the Supabase
-- service role key. The quote-photos bucket is private by default.

alter table public.quote_enquiries
add column if not exists photo_urls text[] null,
add column if not exists photo_storage_paths text[] null;

comment on column public.quote_enquiries.photo_urls is
  'Signed or storage URLs associated with optional quote request lawn photos.';

comment on column public.quote_enquiries.photo_storage_paths is
  'Private Supabase Storage paths for optional quote request lawn photos.';

insert into storage.buckets (id, name, public)
values ('quote-photos', 'quote-photos', false)
on conflict (id) do update set public = excluded.public;

-- No public read/list policy is added for quote photos. The website API uses
-- the server-only service role key to upload files and create signed links for
-- notification emails where needed.
