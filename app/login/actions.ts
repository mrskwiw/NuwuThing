'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  // type-casting here for convenience
  // in a real app you'd want to validate the form data first
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = formData.get('redirectTo') as string || '/'
  
  const cookieStore = cookies()
  const supabase = await createClient()
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    return redirect(`/login?error=${encodeURIComponent(error.message)}&redirectTo=${redirectTo}`)
  }
  
  return redirect(redirectTo)
}

export async function signup(formData: FormData) {
  // type-casting here for convenience
  // in a real app you'd want to validate the form data first
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string || email.split('@')[0]
  const redirectTo = formData.get('redirectTo') as string || '/'
  
  const cookieStore = cookies()
  const supabase = await createClient()
  
  // This is where the issue was happening
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=${redirectTo}`,
      data: {
        username: username,
        display_name: username,
      },
    },
  })
  
  if (error) {
    return redirect(`/signup?error=${encodeURIComponent(error.message)}&redirectTo=${redirectTo}`)
  }
  
  // If email confirmation is enabled, user will need to confirm their email
  return redirect('/signup?message=Check your email to confirm your account')
}

export async function logout() {
  const cookieStore = cookies()
  const supabase = await createClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Error signing out:', error)
  }
  
  return redirect('/')
}
