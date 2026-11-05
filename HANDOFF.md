# PROMINENCE CREATIVE: handoff (Phases 1-8)

Status: Phases 1-7 were first built in Phase 8. With ASSUMED configs (Next 16.4.5, React 19, Tailwind 4,
standard tsconfig/eslint/postcss; the root package.json, tsconfig.json, postcss.config.mjs, eslint.config.mjs were written by me, not the owner; prefer the owner's own) `tsc`, `eslint` and `next build` pass with zero errors.
Not yet verified against real Supabase/Cloudinary credentials or in a real browser: see README section 5 and 7.

## Not in this zip (exist only on the owner's machine)
package.json, package-lock.json, tsconfig.json, postcss.config.mjs, eslint config, .env.local, node_modules.
If the owner also uploads these, use them. Otherwise ask for package.json and `npx next --version`.

## Dependencies required
next, react, react-dom, framer-motion, lucide-react, @supabase/supabase-js, @supabase/ssr, server-only,
tailwindcss v4 (+ @tailwindcss/postcss). next/og is built into Next.

## Structure
- src/app/layout.tsx: root (fonts, metadata, no navbar). src/app/(site)/: public pages + navbar/footer + template.tsx fade.
- src/app/admin/: login (public), (panel)/ = protected dashboard, projects, enquiries. src/proxy.ts = Next 16 guard
  (rename to middleware.ts and export `middleware` on Next 15 or earlier).
- src/lib/auth.ts: getAdmin/requireAdmin/assertAdmin (admins table). Every admin page and server action re-checks.
- src/lib/supabase/{config,server,proxy}.ts; src/lib/cloudinary.ts (signed uploads); src/lib/admin/project-input.ts (validation).
- supabase/: projects.sql, enquiries.sql, admin-policies.sql (run in that order; all re-runnable).
- sitemap.ts, robots.ts, opengraph-image.tsx, components/seo/JsonLd.tsx.

## Known limits / open items
- Deleting a project now deletes its Cloudinary thumbnail/gallery (best effort). Images removed while EDITING a
  project are not deleted. Videos are URL-only (no upload).
- Contact form: honeypot + in-memory per-IP limit (per instance) + DB per-email limit (3/hour).
- Owner must confirm: client names in src/lib/content.ts (CLIENTS), hero line "Independent creative production studio",
  WhatsApp use of the phone numbers.
- OG image is a typographic placeholder. No logo supplied, so Organization JSON-LD has none.
- Needs a manual 360/390/768/1024/1440 px check (overflow-x is `clip`, which can hide bugs).
- README.md written. `scripts/audit.mjs` is the browser overflow/nav/filter audit (needs Playwright; run on owner machine).
