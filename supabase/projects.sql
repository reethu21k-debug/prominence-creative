-- Run order: projects.sql, enquiries.sql, admin-policies.sql. Safe to re-run.
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  client_name text,
  category text not null check (category in ('product-shoots','meta-ads','ai-videos','social-media','podcasts')),
  description text,
  creative_objective text,
  production_approach text,
  project_year int,
  thumbnail_url text,
  video_url text,
  gallery_urls text[] not null default '{}',
  deliverables text[] not null default '{}',
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;

drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects"
  on public.projects for select
  using (published = true);
