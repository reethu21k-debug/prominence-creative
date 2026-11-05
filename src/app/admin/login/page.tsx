import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOut } from "../actions";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");

  // Signed in, but not an admin: explain and offer sign-out (avoids a redirect loop).
  const supabase = await createSupabaseServerClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  return (
    <main className="container-x flex min-h-screen max-w-md flex-col justify-center py-20">
      <p className="micro">Prominence Creative</p>
      <h1 className="h-display mt-6 text-4xl">Admin</h1>
      <div className="mt-12">
        {data.user ? (
          <div className="space-y-6">
            <p role="alert" className="border border-line p-4 text-sm text-white">This account does not have admin access.</p>
            <form action={signOut}>
              <button className="border border-white/40 px-7 py-4 text-[0.6875rem] uppercase tracking-[0.2em] transition-colors hover:bg-white hover:text-bg">Sign out</button>
            </form>
          </div>
        ) : (
          <LoginForm />
        )}
      </div>
    </main>
  );
}
