You are continuing the PROMINENCE CREATIVE website (premium creative production agency). Act as a senior frontend/full-stack engineer with a creative director's eye. Read HANDOFF.md in the uploaded project first.

CRITICAL: Phases 1-7 were written WITHOUT ever being built or run. The upload does not include package.json, tsconfig, lockfile or node_modules. Your first job is to make it build.

STEP 0 - STABILISE
1. Read the whole project. If package.json is missing, ask me for it and for `npx next --version` (do not invent one; if you must create one, tell me exactly what you assumed).
2. Install deps: next, react, framer-motion, lucide-react, @supabase/supabase-js, @supabase/ssr, server-only.
3. Run `npm run build`, `npx tsc --noEmit`, `npm run lint`; fix every error. Check the dev server console. If your environment has no network, say so, review by inspection, and give me PowerShell commands to run and ask me to paste the output.
4. Check Next version: src/proxy.ts is for Next 16; for Next 15 or earlier rename to middleware.ts and export `middleware`.
5. Tell me what you fixed, then continue. Do not redesign what works.

STACK: Next.js App Router, TypeScript, Tailwind v4 (tokens in src/app/globals.css @theme, no tailwind.config), Framer Motion, Lucide, Supabase (Postgres, Auth via cookie sessions, RLS), Cloudinary signed uploads, optional Resend. Public routes live in src/app/(site); admin in src/app/admin (login public, (panel) protected). Admin = a row in public.admins; every admin page calls requireAdmin() and every server action calls assertAdmin() first.

NON-NEGOTIABLE RULES
- Strict monochrome luxury-editorial. No colour accents, gradients, neon, glassmorphism, glow, blobs, emoji, heavy rounded cards. Square or barely-rounded corners.
- Never fabricate clients, testimonials, metrics, history, team members, locations or results. Use clearly marked placeholders. Team section stays omitted.
- No secrets in client code. Respect prefers-reduced-motion. Semantic accessible HTML. Mobile designed deliberately. Server components by default.
- Phones: +91 8778416902, +91 9941297695 (WhatsApp use pending owner confirmation).
- Windows development: give shell commands in PowerShell.

REMAINING WORK
Verify Phases 6A-7 actually work (admin login/logout, unauthorised /admin access and unauthorised server actions, project CRUD, Cloudinary upload, publish/unpublish reflected on public site, enquiry status, sitemap/robots/JSON-LD, 360/390/768/1024/1440 px overflow audit, empty/error states). Then:

PHASE 8 - Test and ship
- Zero errors from build, tsc and lint.
- Manually verify: navigation desktop+mobile, work filters, project detail with and without media, contact form (valid, invalid, success, Supabase failure), admin flows above, empty states.
- Write README.md: setup steps, every env variable and its purpose, Supabase SQL run order (projects.sql, enquiries.sql, admin-policies.sql), creating the first admin (disable public sign-ups), Cloudinary setup, Vercel deployment checklist (NEXT_PUBLIC_SITE_URL, CLOUDINARY_CLOUD_NAME at build time, etc.).
- Optional hardening: rate limiting on the contact form; Cloudinary asset cleanup on project delete.

Implement directly in the project. Small verifiable changes. At the end summarise what changed, what you tested, and what needs my input (credentials, assets, content). Never invent credentials.
