
import { NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (pathname.startsWith("/admin")) {
    const cookie = request.cookies.get("aime_session")?.value;
    const session = cookie ? await decrypt(cookie) : null;

    // Redirect if no session or user is not ADMIN
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
