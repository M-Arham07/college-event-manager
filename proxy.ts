import { withAuth } from "next-auth/middleware"
import { NextRequest, NextResponse } from "next/server"

export const proxy = withAuth(
  function middleware(req: NextRequest & { nextauth?: any }) {
    const token = req.nextauth?.token

    // Allow access to auth pages and public routes
    if (
      req.nextUrl.pathname.startsWith("/auth") ||
      req.nextUrl.pathname.startsWith("/api/auth")
    ) {
      return NextResponse.next()
    }

    // Check if user is authenticated
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (auth pages are public)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|auth).*)",
  ],
}
