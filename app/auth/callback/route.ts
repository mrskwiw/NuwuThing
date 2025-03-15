import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { type CookieOptions } from '@supabase/ssr'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'

  if (code) {
    // Create a Supabase client using the server-side client utility
    const cookieStore = cookies()
    const supabase = createClient()

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=Authentication failed`)
    }
  }

  // Redirect to the requested page or home
  return NextResponse.redirect(`${requestUrl.origin}${next}`)
}
