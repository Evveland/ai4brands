import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin routes
  if (pathname.startsWith("/admin")) {
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Deny all if env var is not configured
    if (!adminPassword) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.search = `?error=config&from=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(loginUrl);
    }

    const token = req.cookies.get("admin_token")?.value;

    if (token !== adminPassword) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.search = `?from=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Match /admin and all sub-paths
  matcher: ["/admin", "/admin/:path*"],
};
