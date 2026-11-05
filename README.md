# Prominence Creative

Marketing site and small admin panel for Prominence Creative. Next.js (App Router), TypeScript,
Tailwind CSS v4, Framer Motion, Supabase (Postgres, Auth, RLS) and Cloudinary (media).

- Public site: `src/app/(site)` (home, work, services, about, contact)
- Admin: `src/app/admin` (`/admin/login` is public; everything under `(panel)` is protected)
- Design tokens: `src/app/globals.css` (`@theme`). There is no `tailwind.config`.

## 1. Local setup

Requirements: Node.js 20.9 or newer (Next.js 16 requirement) and npm.

```powershell
npm install
Copy-Item .env.example .env.local     # then fill in the values (section 2)
npm run dev                           # http://localhost:3000
```

The site runs without any env vars (work grid shows its empty state, the contact form says it is
unavailable, `/admin/login` says sign-in is not configured). Add Supabase to bring it to life.

Checks (all must be clean before deploying):

```powershell
npx tsc --noEmit
npm run lint
npm run build
```

### Next.js version note

`src/proxy.ts` is the Next.js **16** convention. If you are on Next 15 or earlier, rename it to
`src/middleware.ts` and rename the exported function `proxy` to `middleware`. Check with
`npx next --version`.

## 2. Environment variables

Copy `.env.example` to `.env.local`. Never commit `.env.local`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes in production | Canonical origin, no trailing slash (e.g. `https://prominencecreative.com`). Used by the sitemap, robots.txt, canonical links, Open Graph and JSON-LD. Falls back to `VERCEL_PROJECT_PRODUCTION_URL`, then `http://localhost:3000`. Inlined at **build** time. |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon (public) key. Safe in the browser; RLS protects the data. |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | **Secret.** Used only by the contact-form server action to insert enquiries (the `enquiries` table has no public policies). Never prefix with `NEXT_PUBLIC_`. |
| `CLOUDINARY_CLOUD_NAME` | For uploads | Cloudinary cloud name. Needed at **build** time too: `next.config.ts` uses it to restrict `next/image` to your account path, and the admin validates that stored image URLs belong to it. |
| `CLOUDINARY_API_KEY` | For uploads | Used to sign browser uploads and to delete assets. |
| `CLOUDINARY_API_SECRET` | For uploads | **Secret.** Signs uploads on the server only. |
| `RESEND_API_KEY` | Optional | Enables email notification of new enquiries. |
| `ENQUIRY_FROM_EMAIL` | Optional | Sender address on a domain verified in Resend. |
| `ENQUIRY_NOTIFY_EMAIL` | Optional | Inbox that receives enquiry notifications. All three Resend variables must be set, otherwise notifications are skipped silently. Enquiries are always saved in the database regardless. |
| `NEXT_PUBLIC_HERO_VIDEO_URL` | Optional | Absolute URL of a homepage hero video. Blank = plain typographic hero. |
| `NEXT_PUBLIC_HERO_POSTER_URL` | Optional | Absolute URL of the hero poster image. |

## 3. Supabase

1. Create a project at supabase.com. Copy the project URL, anon key and service-role key from
   **Project Settings > API** into `.env.local`.
2. In the **SQL editor**, run these files **in this order**. Each is safe to re-run.
   1. `supabase/projects.sql`
   2. `supabase/enquiries.sql`
   3. `supabase/admin-policies.sql`

   Running `admin-policies.sql` before the others fails, because it adds policies to their tables.

### Creating the first admin

An admin is simply a row in `public.admins`. There is no public registration.

1. **Authentication > Users > Add user.** Enter your email and a strong password and tick
   auto-confirm.
2. **Authentication > Sign In / Providers**: turn **off** "Allow new users to sign up". Without
   this, anyone could create an auth account. They still could not become an admin (the `admins`
   table cannot be written with the anon key), but there is no reason to leave it open.
3. In the SQL editor, with your own email:

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'you@example.com'
   on conflict do nothing;
   ```

4. Visit `/admin/login` and sign in.

To revoke an admin, delete their row from `public.admins`; access ends on their next request.

### How access is enforced (defence in depth)

1. `src/proxy.ts` redirects any `/admin/*` request without a valid Supabase user to the login page.
2. Every admin **page** calls `requireAdmin()` itself (layouts do not re-run on client navigation).
3. Every **server action** calls `assertAdmin()` before reading input.
4. Row Level Security and table grants enforce it again in the database (`is_admin()`; admins can
   change only `enquiries.status`).

## 4. Cloudinary

1. Create a free account at cloudinary.com. Copy the cloud name, API key and API secret from the
   dashboard into `.env.local`.
2. No upload preset is needed. The admin asks the server for a short-lived **signed** upload, then
   the browser uploads directly to Cloudinary into the folder `prominence/projects`. The API
   secret never reaches the browser.
3. Limits enforced in the admin: JPG, PNG, WebP or AVIF, up to 10 MB each; one thumbnail and up to
   12 gallery images. Only URLs from your own cloud are accepted.
4. Videos are stored as links only (YouTube, Vimeo or a direct https file). There is no video
   upload.
5. Deleting a project also deletes its thumbnail and gallery files from Cloudinary (best effort:
   a Cloudinary outage never blocks the delete). Images you **replace or remove while editing** a
   project are not deleted automatically; remove them in the Cloudinary media library if needed.

## 5. Vercel deployment checklist

- [ ] Push the repo and import it in Vercel (framework preset: Next.js).
- [ ] Add **every** variable from section 2 under **Settings > Environment Variables**, for
      Production (and Preview if you want previews to work).
- [ ] `NEXT_PUBLIC_SITE_URL` is the real production origin (https, no trailing slash).
- [ ] `CLOUDINARY_CLOUD_NAME` is set **before** the build, not only at runtime.
- [ ] `NEXT_PUBLIC_*` values are baked into the build. After changing one, **redeploy**.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` and `CLOUDINARY_API_SECRET` are not prefixed `NEXT_PUBLIC_`.
- [ ] The three SQL files have been run on the production Supabase project, in order.
- [ ] First admin created, and public sign-ups disabled.
- [ ] After deploy, open `/robots.txt` and `/sitemap.xml` and confirm they show your domain, not
      `localhost`.
- [ ] Sign in at `/admin/login`, create and publish a test project, confirm it appears on `/work`
      within a minute, then unpublish and confirm it disappears.
- [ ] Submit the contact form once; confirm the row appears under `/admin/enquiries`.
- [ ] Confirm the owner has approved the open items in `HANDOFF.md` (client names, hero line,
      WhatsApp use of the phone numbers).

## 6. Behaviour worth knowing

- **Caching.** Public work pages are statically generated and revalidate every 60 seconds; saving,
  publishing, unpublishing or deleting a project in the admin also revalidates them immediately.
- **Contact form protection.** A hidden honeypot field, server-side validation, an in-memory
  limit of 5 submissions per IP per 10 minutes, and a database check of at most 3 enquiries per
  email per hour. The in-memory limit is per server instance (serverless hosting runs several), so
  treat it as a speed bump; the per-email check is the durable one. For a hard global limit, add a
  shared store such as Upstash Redis.
- **No secrets in client code.** Only `NEXT_PUBLIC_*` values reach the browser.

## 7. Browser audit (optional, recommended before launch)

`scripts/audit.mjs` loads the main pages at 360, 390, 768, 1024 and 1440 px with the body's
`overflow-x: clip` turned off (so hidden horizontal overflow is exposed), reports console errors,
and exercises the mobile menu and work filters.

```powershell
npm i -D playwright
npx playwright install chromium
npm run build
npm run start                      # leave running; open a second terminal
node scripts/audit.mjs http://localhost:3000
```

## 8. Known limits

- Admin sign-in, project CRUD and Cloudinary upload need real Supabase and Cloudinary credentials
  to exercise end to end. See the checklist in section 5.
- The Open Graph image is a typographic placeholder and no logo has been supplied, so the
  Organization JSON-LD has no `logo`.
- Client names in `src/lib/content.ts` (`CLIENTS`) and the hero line are placeholders pending
  owner confirmation. The team section is intentionally omitted.
