-- Run in the Supabase SQL editor. Phase 6 adds admin read/update policies.
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 100),
  company text,
  email text not null,
  phone text not null,
  service text not null,
  budget text,
  project_details text not null check (char_length(project_details) between 10 and 4000),
  reference_links text,
  status text not null default 'new' check (status in ('new','contacted','converted')),
  created_at timestamptz not null default now()
);

-- RLS on with no public policies: the anon key cannot read or write enquiries.
-- The contact form inserts through a server action using the service role key.
alter table public.enquiries enable row level security;
