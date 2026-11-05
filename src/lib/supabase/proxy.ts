import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseConfig } from "./config";

// Refreshes the auth cookie and reports who is signed in. Validates with getUser(), never getSession().
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const cfg = supabaseConfig();
  if (!cfg) return { response, user: null };

  const supabase = createServerClient(cfg.url, cfg.anon, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  return { response, user: data.user };
}
