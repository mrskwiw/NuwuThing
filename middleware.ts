import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { updateSession } from "./utils/supabase/middleware"
import { createClient } from "@supabase/supabase-js"

export async function middleware(request: NextRequest) {
  // First, update the session using Supabase Server Component pattern
  const response = await updateSession(request)

  try {
    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Validate environment variables
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables in middleware")
      return response
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    })

    // Get the user (this will use the refreshed session)
    const { data, error } = await supabase.auth.getUser()
    const user = data?.user || null

    if (error) {
      console.error("Error getting user in middleware:", error)
      return response
    }

    // Check if the request is for the admin section
    if (request.nextUrl.pathname.startsWith("/admin")) {
      // Skip the admin login page itself
      if (request.nextUrl.pathname === "/admin/login") {
        return response
      }

      // If no user, redirect to login
      if (!user) {
        const url = new URL("/admin/login", request.url)
        url.searchParams.set("from", request.nextUrl.pathname)
        return NextResponse.redirect(url)
      }

      // Check if the user is an admin
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

      // If not an admin, redirect to unauthorized page
      if (!profile || profile.role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url))
      }
    }

    // Check if the request is for protected user routes
    const protectedUserRoutes = ["/profile", "/create", "/settings", "/dashboard"]

    if (protectedUserRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
      // If no user, redirect to login with the return URL
      if (!user) {
        const url = new URL("/login", request.url)
        url.searchParams.set("redirectTo", request.nextUrl.pathname)
        return NextResponse.redirect(url)
      }
    }

    return response
  } catch (error) {
    console.error("Middleware error:", error)
    return response
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    "/admin/:path*", 
    "/profile/:path*", 
    "/create/:path*", 
    "/settings/:path*", 
    "/dashboard/:path*"
  ],
}
