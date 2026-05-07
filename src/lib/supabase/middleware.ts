import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import type { Database } from "@/types/database";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh the session on every request — required for Server Components.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isProtected =
    // Trainer surface
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/students") ||
    pathname.startsWith("/workouts") ||
    pathname.startsWith("/exercises") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/community") ||
    pathname.startsWith("/plans") ||
    // Student surface (PT-BR URLs to avoid collisions with trainer routes)
    pathname.startsWith("/home") ||
    pathname.startsWith("/treinos") ||
    pathname.startsWith("/feed") ||
    pathname.startsWith("/perfil") ||
    pathname.startsWith("/planos") ||
    // Shared post-auth landing
    pathname.startsWith("/welcome");

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}
