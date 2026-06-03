-- Public review submissions are held for admin approval before publishing.

alter table public.reviews
add column if not exists is_approved boolean default false;

update public.reviews
set is_approved = true
where is_approved is null;

alter table public.reviews
alter column is_approved set default false;

create index if not exists reviews_approval_display_order_idx
on public.reviews (is_approved, display_order, created_at desc);

comment on column public.reviews.is_approved is
  'Only approved reviews should be displayed publicly.';

drop policy if exists "Public can read reviews" on public.reviews;
drop policy if exists "Public can read approved reviews" on public.reviews;

create policy "Public can read approved reviews"
on public.reviews
for select
to anon, authenticated
using (is_approved = true);

drop policy if exists "Admins can read all reviews" on public.reviews;

create policy "Admins can read all reviews"
on public.reviews
for select
to authenticated
using (public.is_admin());

drop policy if exists "Public can submit pending reviews" on public.reviews;

create policy "Public can submit pending reviews"
on public.reviews
for insert
to anon, authenticated
with check (
  is_approved = false
  and is_featured = false
);
