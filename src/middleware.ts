import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  try {


    // Check if user has a valid NextAuth session
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // Protect only certain routes (e.g., dashboard & admin)
    const protectedPaths = ["/dashboard"]
    const isProtected = protectedPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    )

    if (isProtected && !token) {
      // If not authenticated, redirect to /login
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", request.url) // optional: return user after login
      return NextResponse.redirect(loginUrl)
    }

    // Allow request if authenticated or not a protected route
    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    return NextResponse.redirect(new URL("/error", request.url)) // optional error page
  }
}

// Apply middleware only to selected routes
export const config = {
  matcher: ["/dashboard/:path*"],
}
