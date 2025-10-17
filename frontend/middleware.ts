import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Public paths
  if (pathname.startsWith("/login") || pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  // Very light check: require client auth cookie hint (set below) else send to /login
  const signedIn = req.cookies.get("x-signed-in")?.value === "1"
  if (!signedIn) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
}
