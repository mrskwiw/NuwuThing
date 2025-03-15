"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { useSupabaseAuth } from "@/components/providers/supabase-auth-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

// Add a password validation function at the top of the file, after the imports
function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("Password must contain at least one special character")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

interface AuthFormProps {
  redirectTo?: string
}

// Update the AuthForm component to include password validation
export function AuthForm({ redirectTo = "/" }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("signin")
  const [password, setPassword] = useState("")
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  const router = useRouter()
  const { signIn, signUp } = useSupabaseAuth()

  // Add this function to handle password changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)

    if (newPassword) {
      const validation = validatePassword(newPassword)
      setPasswordErrors(validation.errors)
    } else {
      setPasswordErrors([])
    }
  }

  // Update the handleSignIn function
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await signIn(email, password)
      router.push(redirectTo)
    } catch (error: any) {
      console.error("Sign in error:", error)
      setError(error.message || "Failed to sign in")
    } finally {
      setIsLoading(false)
    }
  }

  // Update the handleSignUp function to include password validation
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const username = (formData.get("username") as string) || email.split("@")[0]

    // Validate password
    const validation = validatePassword(password)
    if (!validation.isValid) {
      setError("Password does not meet requirements")
      setIsLoading(false)
      return
    }

    try {
      await signUp(email, password, username)
      setSuccess("Account created successfully! You can now sign in.")
      // Switch to sign in tab after successful signup
      setTimeout(() => {
        setActiveTab("signin")
      }, 2000)
    } catch (error: any) {
      console.error("Sign up error:", error)
      setError(error.message || "Failed to sign up")
    } finally {
      setIsLoading(false)
    }
  }

  // Update the signup form to include password validation UI
  return (
    <Card className="w-full max-w-md mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="signin">
          <form onSubmit={handleSignIn}>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Enter your email and password to access your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input id="signin-email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input id="signin-password" name="password" type="password" required />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>

        <TabsContent value="signup">
          <form onSubmit={handleSignUp}>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>Create a new account to start creating quizzes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-username">Username</Label>
                <Input id="signup-username" name="username" required />
                <p className="text-xs text-muted-foreground">This will be your display name</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={handlePasswordChange}
                />
                <div className="text-xs space-y-1 mt-2">
                  <p className="font-medium">Password must:</p>
                  <ul className="space-y-1 pl-4 list-disc">
                    <li className={password.length >= 8 ? "text-green-600" : "text-muted-foreground"}>
                      Be at least 8 characters long
                    </li>
                    <li className={/[A-Z]/.test(password) ? "text-green-600" : "text-muted-foreground"}>
                      Contain at least one uppercase letter
                    </li>
                    <li className={/[a-z]/.test(password) ? "text-green-600" : "text-muted-foreground"}>
                      Contain at least one lowercase letter
                    </li>
                    <li className={/[0-9]/.test(password) ? "text-green-600" : "text-muted-foreground"}>
                      Contain at least one number
                    </li>
                    <li className={/[^A-Za-z0-9]/.test(password) ? "text-green-600" : "text-muted-foreground"}>
                      Contain at least one special character
                    </li>
                  </ul>
                </div>
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading || passwordErrors.length > 0}>
                {isLoading ? "Signing up..." : "Sign Up"}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

