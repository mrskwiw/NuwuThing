import { getSupabaseAdmin } from "@/lib/supabaseAdmin"

export async function createUserProfile(userId: string, email: string, username: string, displayName?: string) {
  try {
    // Get the admin client
    const supabaseAdmin = getSupabaseAdmin()

    console.log("Creating profile for user:", { userId, email, username })

    // First, verify that the user exists in auth.users
    const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)

    if (userError) {
      console.error("Error fetching user:", userError)
      return { success: false, error: userError }
    }

    if (!user.user) {
      console.error("User not found in auth.users")
      return { success: false, error: new Error("User not found in auth system") }
    }

    // Check if profile already exists
    const { data: existingProfile, error: profileCheckError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle()

    if (profileCheckError) {
      console.error("Error checking existing profile:", profileCheckError)
      return { success: false, error: profileCheckError }
    }

    if (existingProfile) {
      console.log("Profile already exists for user:", userId)
      return { success: true, data: existingProfile }
    }

    // Create the profile
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: userId,
        username,
        display_name: displayName || username,
        email,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating profile:", error)
      return { success: false, error }
    }

    console.log("Profile created successfully:", data)
    return { success: true, data }
  } catch (error) {
    console.error("Exception in createUserProfile:", error)
    return { success: false, error }
  }
}

