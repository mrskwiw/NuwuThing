"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { Profile } from "@/types/supabase"
import { useToast } from "@/hooks/use-toast"
import { createUserProfile } from "@/app/actions/auth"

type SupabaseAuthContextType = {
  user: User | null
  profile: Profile | null
  session: Session | null
  isLoading: boolean
  signUp: (email: string, password: string, username?: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType>({
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
})

export const useSupabaseAuth = () => useContext(SupabaseAuthContext)

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Function to fetch profile
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) {
        console.error("Error fetching profile:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Exception fetching profile:", error)
      return null
    }
  }

  useEffect(() => {
    const setData = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()
      if (error) {
        console.error("Error getting session:", error)
        setIsLoading(false)
        return
      }

      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        const profileData = await fetchProfile(session.user.id)
        setProfile(profileData)
      }

      setIsLoading(false)
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)

      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        const profileData = await fetchProfile(session.user.id)
        setProfile(profileData)

        // If user signed up but no profile exists, create one
        if (event === "SIGNED_IN" && !profileData) {
          console.log("User signed in but no profile found, creating one...")
          const username = session.user.email?.split("@")[0] || "user"

          const result = await createUserProfile(session.user.id, session.user.email || "", username, username)

          if (result.success) {
            setProfile(result.data)
          }
        }
      } else {
        setProfile(null)
      }

      setIsLoading(false)
      router.refresh()
    })

    setData()

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const signUp = async (email: string, password: string, username?: string) => {
    console.log("Signing up with email:", email)

    // Use the provided username or generate one from email
    const userUsername = username || email.split("@")[0]

    try {
    
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            username: userUsername,
            display_name: userUsername,
          },
        },
      })

      if (error) {
        console.error("Signup error:", error)
        let errorMessage = "An error occurred during signup";
        if (error.message.includes("duplicate key value violates unique constraint")) {
          errorMessage = "Email address already in use. Please use a different email or sign in.";
        } else if (error.message.includes("Invalid email format")) {
          errorMessage = "Invalid email format. Please check your email address.";
        }
        toast({
          title: "Signup failed",
          description: errorMessage,
          variant: "destructive",
        });
        throw error;
      }

      if (!data.user) {
        throw new Error("No user returned from signup")
      }

      console.log("Signup response:", data)

      // Check if email confirmation is required
      if (data.session === null) {
        toast({
          title: "Verification email sent",
          description: "Please check your email to confirm your account before signing in.",
        })
        return data
      }

      // If no email confirmation is required, create profile immediately
      const result = await createUserProfile(data.user.id, email, userUsername, userUsername)

      if (!result.success) {
        console.error("Error creating profile:", result.error)
        toast({
          title: "Profile creation failed",
          description: "Account created but profile setup failed. Please contact support.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Account created",
          description: "You can now sign in with your credentials",
        })
      }

      return data
    } catch (error: any) {
      console.error("Exception during signup:", error)
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup",
        variant: "destructive",
      })
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Sign in error:", error)
        throw error
      }

      console.log("Sign in successful:", data.user?.email)

      // Check if user has a profile, if not create one
      if (data.user) {
        const profileData = await fetchProfile(data.user.id)

        if (!profileData) {
          console.log("No profile found for user, creating one...")
          const username = email.split("@")[0]

          const result = await createUserProfile(data.user.id, email, username, username)

          if (!result.success) {
            console.error("Error creating profile during sign in:", result.error)
          } else {
            console.log("Profile created during sign in:", result.data)
            setProfile(result.data)
          }
        }
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in",
      })

      return data
    } catch (error: any) {
      console.error("Exception during sign in:", error)
      toast({
        title: "Sign in failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      })
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("Sign out error:", error)
        throw error
      }

      router.push("/")
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      })
    } catch (error: any) {
      console.error("Exception during sign out:", error)
      toast({
        title: "Sign out failed",
        description: error.message || "An error occurred during sign out",
        variant: "destructive",
      })
      throw error
    }
  }

  const value = {
    user,
    profile,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
  }

  return <SupabaseAuthContext.Provider value={value}>{children}</SupabaseAuthContext.Provider>
}
