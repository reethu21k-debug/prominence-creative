import "server-only";
import { redirect } from "next/navigation";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminContext = { supabase: SupabaseClient; user: User };

export async function isAdminUser(supabase: SupabaseClient, userId: string): Promise<boolean> {
  // RLS lets a user read only their own row, so a row here means this user is an admin.
  const { data, error } = await supabase.from("admins").select("user_id").eq("user_id", userId).maybeSingle();
  return !error && !!data;
}

// Validates the session with Supabase Auth, then confirms membership of public.admins.
export async function getAdmin(): Promise<AdminContext | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  if (!(await isAdminUser(supabase, data.user.id))) return null;
  return { supabase, user: data.user };
}

// For pages. Layouts do not re-run on client navigation, so EVERY admin page calls this itself.
export async function requireAdmin(): Promise<AdminContext> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export class UnauthorizedError extends Error {
  constructor() { super("Unauthorized"); }
}

// For server actions: call first, before reading any input. Never rely on the route guard alone.
export async function assertAdmin(): Promise<AdminContext> {
  const admin = await getAdmin();
  if (!admin) throw new UnauthorizedError();
  return admin;
}
