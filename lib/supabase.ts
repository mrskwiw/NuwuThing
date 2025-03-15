import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Helper function to validate and fix URL
function validateAndFixUrl(url: string | undefined): string {
  if (!url) {
    console.error("Supabase URL is undefined")
    return "https://example.supabase.co"
  }

  // Check if URL starts with http:// or https://
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    // Try to prepend https://
    console.warn("Supabase URL doesn't include protocol, prepending https://")
    return `https://${url}`
  }

  return url
}

// Initialize with fallback values
let supabaseInstance: ReturnType<typeof createClient<Database>>

// Create Supabase client with proper error handling
try {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables in lib/supabase.ts")
    supabaseInstance = createClient<Database>("https://example.supabase.co", "fallback-key", {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  } else {
    // Fix URL if needed
    const fixedUrl = validateAndFixUrl(supabaseUrl)

    // Create the client
    supabaseInstance = createClient<Database>(fixedUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
    console.log("Supabase client initialized successfully in lib/supabase.ts with URL:", fixedUrl)
  }
} catch (error) {
  console.error("Error initializing Supabase client in lib/supabase.ts:", error)
  supabaseInstance = createClient<Database>("https://example.supabase.co", "fallback-key", {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

// Export the initialized client
export const supabase = supabaseInstance

