import "server-only";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { supabaseConfig } from "./config";

// Cookie-session client acting as the signed-in user (anon key; RLS applies).
// Returns null when Supabase is not configured.
export async function createSupabaseServerClient(): Promise<SupabaseClient | null> {
  // Read cookies first so every caller opts into dynamic rendering, even when Supabase is
  // unconfigured (otherwise a build without env would bake admin pages in as static redirects).
  const store = await cookies();
  const cfg = supabaseConfig();
  if (!cfg) return null;
  return createServerClient(cfg.url, cfg.anon, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Called from a Server Component: cookies are read-only there. proxy.ts refreshes the session.
        }
      },
    },
  }) as unknown as SupabaseClient;
}
