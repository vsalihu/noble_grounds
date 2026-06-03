-- Quote enquiry status workflow and admin quote photo access.
-- Public users still cannot read enquiries or quote photos. Authenticated
-- admins can manage enquiry status, delete enquiries, and view private quote
-- photos from the dashboard.

alter table public.quote_enquiries
add column if not exists status text default 'new';

update public.quote_enquiries
set status = 'new'
where status is null;

alter table public.quote_enquiries
alter column status set default 'new';

alter table public.quote_enquiries
drop constraint if exists quote_enquiries_status_check;

alter table public.quote_enquiries
add constraint quote_enquiries_status_check
check (status in ('new', 'contacted', 'quoted', 'completed', 'archived'));

create index if not exists quote_enquiries_status_created_at_idx
on public.quote_enquiries (status, created_at desc);

drop policy if exists "Admins can delete quote enquiries" on public.quote_enquiries;

create policy "Admins can delete quote enquiries"
on public.quote_enquiries
for delete
to authenticated
using (public.is_admin());

drop policy if exists "Admins can view quote photo objects" on storage.objects;

create policy "Admins can view quote photo objects"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'quote-photos'
  and public.is_admin()
);
