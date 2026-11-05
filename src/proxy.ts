// Next.js 16 uses proxy.ts. On Next 15 or earlier, rename this file to middleware.ts
// and rename the exported function to `middleware`.
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  // First line of defence only. Every admin page and server action re-checks admin status itself.
  if (!user && pathname !== "/admin/login") {
    const redirect = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    redirect.headers.set("X-Robots-Tag", "noindex, nofollow");
    return redirect;
  }

  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = { matcher: ["/admin/:path*"] };
