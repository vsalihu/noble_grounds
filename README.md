# Noble Grounds

Premium, mobile-first website foundation for Noble Grounds, a grass mowing business in Leverington, Wisbech.

## Stack

- Next.js App Router with TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- Supabase JS client setup

## Setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment

Add the Supabase project values to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-for-server-side-inserts
RESEND_API_KEY=re_your_api_key
QUOTE_NOTIFICATION_EMAIL=hello@noblegrounds.co.uk
FROM_EMAIL=Noble Grounds <quotes@your-verified-domain.co.uk>
```

The quote API works without Supabase or Resend configured, but production should save enquiries and send email notifications. Keep `SUPABASE_SERVICE_ROLE_KEY` and `RESEND_API_KEY` server-side only; never expose them in browser code.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Responsive Testing Notes

Design from mobile outward:

- Check 375px and 430px widths first.
- Confirm there is no horizontal scrolling.
- Buttons should remain at least 48px tall for thumb-friendly taps.
- Tablet and desktop layouts should enhance spacing and columns without replacing the mobile flow.
- Keep animation subtle and verify reduced-motion preferences still produce a usable page.

Useful browser widths: `375`, `390`, `430`, `768`, `1024`, `1440`.

## SEO Setup Notes

The local SEO configuration lives in:

- `data/site.ts` for domain, contact placeholders, service areas, navigation, and Open Graph image path.
- `lib/seo.ts` for metadata helpers, canonical URLs, and JSON-LD builders.
- `app/sitemap.ts` and `app/robots.ts` for search crawler discovery.

To change the production domain, update `siteConfig.domain` in `data/site.ts`.

To change contact details, update `siteConfig.email`, `siteConfig.phone`, and `siteConfig.whatsapp` in `data/site.ts`. Do not add a full physical address unless the business wants that public.

The current Open Graph image is a lightweight placeholder at `public/images/og-noble-grounds.svg`. Replace it with a real 1200x630 branded image before launch if possible.

After deployment:

- Add and verify the site in Google Search Console.
- Submit `https://noblegrounds.co.uk/sitemap.xml`.
- Create or connect a Google Business Profile for Noble Grounds.
- Replace placeholder contact details with real business contact details.

## Quote API Notes

The contact form posts JSON to `app/api/quote/route.ts`.

Server-side validation requires:

- Full name
- Phone number
- Property address or area
- Customer type
- Service needed

Email is optional, but must be valid if supplied. The API trims submitted strings, includes a honeypot field, and rejects very fast submissions as likely spam.

If `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` exist, the API tries to insert into a `quote_enquiries` table. If Supabase is not configured, the API returns success without saving so the site does not break during setup.

The table is defined in `supabase/migrations/001_quote_enquiries.sql`:

```sql
id uuid primary key default gen_random_uuid()
full_name text not null
phone text not null
email text
property_area text not null
customer_type text not null
service_needed text not null
message text
source text default 'website'
status text default 'new'
created_at timestamptz default now()
```

Quote notifications are sent with Resend when `RESEND_API_KEY`, `QUOTE_NOTIFICATION_EMAIL`, and `FROM_EMAIL` are configured. If email sending fails but the enquiry is accepted, the form still returns success and logs the server-side email issue.

## Resend Email Notifications

The quote API sends an email notification after validation using `lib/contact.ts`.

Set these environment variables in Vercel:

```bash
RESEND_API_KEY=...
QUOTE_NOTIFICATION_EMAIL=hello@noblegrounds.co.uk
FROM_EMAIL=Noble Grounds <quotes@your-verified-domain.co.uk>
```

Resend setup:

1. Create a Resend account.
2. Add and verify the sending domain.
3. Create an API key.
4. Set `FROM_EMAIL` to an address on the verified domain.
5. Set `QUOTE_NOTIFICATION_EMAIL` to the inbox where Noble Grounds should receive enquiries.

For local testing, Resend may require a verified sender or verified domain depending on account state. After deployment, submit the quote form and confirm:

- The browser shows the success message.
- The enquiry is saved in Supabase if configured.
- The notification email arrives at `QUOTE_NOTIFICATION_EMAIL`.
- Resend logs show a successful send.

## Supabase Backend Setup

1. Create a Supabase project.
2. Copy the project URL and anon key into `.env.local`.
3. Copy the service role key into `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`.
4. Keep the service role key private. It must only be used in server code such as `app/api/quote/route.ts`.

Apply the SQL migrations manually in Supabase SQL Editor, in this order:

```text
supabase/migrations/001_quote_enquiries.sql
supabase/migrations/002_gallery_images.sql
supabase/migrations/003_storage_policies.sql
supabase/migrations/004_gallery_projects.sql
supabase/migrations/005_gallery_before_after.sql
supabase/migrations/006_gallery_comparisons.sql
```

The migrations create:

- `quote_enquiries` for private quote submissions.
- `gallery_images` for future public gallery metadata.
- `gallery_projects` for address/project gallery sections.
- `gallery_images.phase` for Before and After image sections.
- `gallery_comparisons` for paired before/after flip cards.
- A public Storage bucket named `gallery`.
- RLS policies so public users cannot read quote enquiries.
- RLS policies so public users can read gallery images.
- Admin-only insert, update, and delete policies for gallery rows and storage objects.

Gallery storage paths should use:

```text
gallery/{project_id}/{timestamp}-{safe-file-name}
```

## Admin User Setup

Create Albert/admin users in Supabase Auth manually. Do not put credentials in code.

After creating the user, mark them as an admin by setting app metadata:

```json
{
  "role": "admin"
}
```

The SQL policies use `auth.jwt()->'app_metadata'->>'role' = 'admin'` through the `public.is_admin()` helper.

The admin dashboard uses `gallery_projects`, `gallery_comparisons`, and the `gallery` bucket to store paired before/after photos and display them publicly. The old `gallery_images` table remains for compatibility, but the public gallery now prefers `gallery_comparisons`.

## Admin Dashboard

Admin routes:

- `/login`
- `/dashboard`

The admin area uses Supabase email/password auth. There are no hardcoded admin credentials.

To create an admin:

1. Create a user in Supabase Auth.
2. Set the user's app metadata to:

```json
{
  "role": "admin"
}
```

3. Make sure the SQL migrations have been applied.
4. Sign in at `/login`.

The dashboard checks the logged-in user's `app_metadata.role`. Non-admin users are signed out and redirected to `/login`. Gallery inserts, updates, deletes, and storage writes are also protected by Supabase RLS policies.

## Project-Based Before/After Gallery Uploads

The dashboard is project-based so public photos are grouped by address or project instead of appearing as one random image dump. Each public card is now one before/after comparison: the visitor sees the Before image first, taps the card, and it flips to the After image.

Admin workflow:

1. Create a project/address section.
2. Select that project.
3. Upload a before image and an after image together.
4. Add optional title, description, location, alt text, featured status, and display order.
5. Edit project details or comparison metadata when needed.
6. Replace the before image, replace the after image, delete a comparison, or delete the whole project.

Project fields:

- Project title
- Address or public location label
- Location
- Customer type
- Description
- Featured status
- Display order

Avoid publishing exact private customer addresses without permission. Use public labels such as `Leverington, Wisbech` where possible.

Captions and text fields are optional so Albert can upload photos quickly from a phone.

The dashboard uploads images to the public Supabase Storage bucket named `gallery`.

Upload path format:

```text
gallery/{project_id}/comparisons/{timestamp}/before-{safe-file-name}
gallery/{project_id}/comparisons/{timestamp}/after-{safe-file-name}
```

The upload form accepts image files only and limits files to 5MB. After upload, it stores metadata in `gallery_comparisons`:

- project id
- before public image URL and storage path
- after public image URL and storage path
- optional title
- description
- optional location
- optional alt text
- featured status
- display order

The public `/gallery` page fetches `gallery_projects` with nested `gallery_comparisons`. Projects are ordered by `display_order` then `created_at`, and comparisons are ordered by `display_order` then `created_at`. Each comparison card shows the Before image on the front and flips to the After image when tapped or clicked. A fullscreen button opens a lightweight viewer with Before/After toggle buttons and zoom controls. If Supabase is missing, unreachable, or has no comparisons, premium placeholder flip cards remain visible.

Deleting a project:

- removes the related storage objects first where possible
- deletes the project row
- cascades related `gallery_comparisons` rows through the database foreign key

Common Supabase setup issues:

- Missing `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`: login and gallery reads cannot work.
- Missing `SUPABASE_SERVICE_ROLE_KEY`: quote API accepts requests but does not save them.
- Admin user missing `app_metadata.role = admin`: login may succeed, but dashboard access and gallery writes will fail.
- Migrations not applied: tables, bucket, or RLS policies will be missing.
- Storage path not starting with `gallery/`: upload policy will reject the file.
- Missing `004_gallery_projects.sql`: dashboard project management and grouped public gallery will not work.
- Missing `005_gallery_before_after.sql`: before/after image grouping will not work.
- Missing `006_gallery_comparisons.sql`: before/after flip cards and paired uploads will not work.

### Gallery images not showing?

Check these in order:

- Vercel has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- The Supabase `gallery` bucket exists and is public.
- Storage policies from `003_storage_policies.sql` were applied.
- `gallery_projects` rows exist.
- `gallery_comparisons.project_id` points to an existing project.
- `gallery_comparisons.before_image_url` and `after_image_url` are full public URLs.
- `gallery_comparisons.before_storage_path` and `after_storage_path` point to real files in the `gallery` bucket.
- If using `next/image` in the future, add the Supabase storage domain to `next.config.ts`. The current gallery uses normal `<img>` tags to avoid remote image domain blocking.

## Deployment Checklist

Before deploying to Vercel:

- Replace placeholder contact details in `data/site.ts`.
- Confirm `siteConfig.domain` is the production domain.
- Replace the placeholder Open Graph image with a real branded 1200x630 image if available.
- Apply all Supabase migrations in order.
- Create the `gallery` bucket and confirm it is public.
- Create the admin user in Supabase Auth.
- Set admin app metadata to `{ "role": "admin" }`.
- Keep real reviews off the site until they are available.

Vercel environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=...
QUOTE_NOTIFICATION_EMAIL=...
FROM_EMAIL=...
```

Do not add `SUPABASE_SERVICE_ROLE_KEY` or `RESEND_API_KEY` to any client-exposed variable name. They must not start with `NEXT_PUBLIC_`.

Post-deployment checks:

- Test the public quote form.
- Confirm a quote enquiry is saved in Supabase.
- Confirm a quote notification email is delivered.
- Test `/login` with the admin account.
- Test `/dashboard` image upload from desktop and mobile.
- Confirm uploaded images appear on `/gallery`.
- Test delete from the dashboard.
- Check the site at 375px, 430px, 768px, 1024px, and desktop widths.
- Confirm `https://noblegrounds.co.uk/sitemap.xml` loads.
- Confirm `https://noblegrounds.co.uk/robots.txt` loads.
- Submit the sitemap in Google Search Console.
- Create or connect the Google Business Profile.

Optional production improvements:

- Connect Resend or similar for quote enquiry email notifications.
- Add a privacy policy and cookie notice if analytics or tracking are added.
- Replace placeholder gallery content with real project images.
- Add real customer reviews only when they are available.
