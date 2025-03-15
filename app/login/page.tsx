"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthForm } from "@/components/auth-form"
import { useSupabaseAuth } from "@/components/providers/supabase-auth-provider"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || "/"
  const { user, isLoading } = useSupabaseAuth()

  // If user is already logged in, redirect to the intended destination
  useEffect(() => {
    if (!isLoading && user) {
      router.push(redirectTo)
    }
  }, [user, isLoading, redirectTo, router])

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to QuizSquirrel</h1>
        <p className="text-muted-foreground">
          Sign in to your account or create a new one to start creating and taking quizzes.
        </p>
      </div>

      <AuthForm redirectTo={redirectTo} />
    </div>
  )
}

