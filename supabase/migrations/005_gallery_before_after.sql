-- Add before/after grouping to Noble Grounds gallery images.
-- Existing images default to "after" so current gallery content continues to
-- display without manual data repair.

alter table public.gallery_images
add column if not exists phase text not null default 'after';

alter table public.gallery_images
drop constraint if exists gallery_images_phase_check;

alter table public.gallery_images
add constraint gallery_images_phase_check
check (phase in ('before', 'after'));

create index if not exists gallery_images_project_phase_order_idx
on public.gallery_images (project_id, phase, display_order, created_at desc);

comment on column public.gallery_images.phase is
  'Before/after grouping for public project galleries. Allowed values: before, after.';
