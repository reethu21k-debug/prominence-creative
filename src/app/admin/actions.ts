"use server";
import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type LoginState = { error?: string; email?: string };

const GENERIC = "Incorrect email or password.";

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200 || password.length < 1 || password.length > 200) {
    return { error: "Enter a valid email address and password.", email };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "Admin sign-in is not configured on this deployment.", email };

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: GENERIC, email };

  // Valid credentials but not an admin: end the session and give the same generic message.
  if (!(await isAdminUser(supabase, data.user.id))) {
    await supabase.auth.signOut();
    return { error: GENERIC, email };
  }

  redirect("/admin");
}

// Safe for anyone to call: it only ends the caller's own session.
export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}
