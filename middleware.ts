import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  }) as any // Cast to any to access isBanned

  if (token && token.isBanned) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  const pathname = request.nextUrl.pathname

  // Protect teacher routes - only admins can access
  if (pathname.startsWith("/teacher")) {
    if (!token) {
      return NextResponse.redirect(new URL("/sign-in", request.url))
    }
    
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // Protect admin routes - only admins can access
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/sign-in", request.url))
    }
    
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // Protect dashboard routes - require authentication
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/sign-in", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/teacher/:path*",
    "/admin/:path*", 
    "/dashboard/:path*",
  ],
}
