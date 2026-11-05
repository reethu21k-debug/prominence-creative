-- Run AFTER projects.sql and enquiries.sql. Safe to re-run.
-- Admin model: a row in public.admins = admin. Chosen over an app_metadata role because
-- access can be revoked instantly (a JWT claim stays valid until it expires), it is easy
-- to audit in SQL, and RLS policies can check it directly with is_admin().

-- 1. Admins ---------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

-- A signed-in user can see only their own row (used by the app to confirm admin status).
-- No insert/update/delete policies: admins are managed from the SQL editor or service role only.
drop policy if exists "Users can read own admin row" on public.admins;
create policy "Users can read own admin row"
  on public.admins for select to authenticated
  using (user_id = auth.uid());

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- 2. Projects -------------------------------------------------------------
alter table public.projects enable row level security;

drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects"
  on public.projects for select to anon, authenticated
  using (published = true);

drop policy if exists "Admins can read all projects" on public.projects;
create policy "Admins can read all projects"
  on public.projects for select to authenticated
  using (public.is_admin());

drop policy if exists "Admins can insert projects" on public.projects;
create policy "Admins can insert projects"
  on public.projects for insert to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update projects" on public.projects;
create policy "Admins can update projects"
  on public.projects for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete projects" on public.projects;
create policy "Admins can delete projects"
  on public.projects for delete to authenticated
  using (public.is_admin());

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- 3. Enquiries ------------------------------------------------------------
-- Inserts come only from the contact-form server action (service role, bypasses RLS).
alter table public.enquiries enable row level security;

drop policy if exists "Admins can read enquiries" on public.enquiries;
create policy "Admins can read enquiries"
  on public.enquiries for select to authenticated
  using (public.is_admin());

drop policy if exists "Admins can update enquiries" on public.enquiries;
create policy "Admins can update enquiries"
  on public.enquiries for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Defence in depth: table privileges as well as RLS. Admins may change only `status`.
revoke all on public.enquiries from anon;
revoke insert, delete, truncate, update on public.enquiries from authenticated;
grant select on public.enquiries to authenticated;
grant update (status) on public.enquiries to authenticated;

-- 4. First admin ----------------------------------------------------------
-- 1) Supabase dashboard > Authentication > Users > Add user (email + password, auto-confirm).
-- 2) Authentication > Sign In / Providers: turn OFF "Allow new users to sign up".
-- 3) Run, with your own email:
--
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'you@example.com'
--   on conflict do nothing;
