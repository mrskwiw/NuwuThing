import { createClient } from "@supabase/supabase-js"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Initialize with fallback values
let supabaseInstance

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

// Create Supabase client with proper error handling
try {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables in lib/db.ts")
    supabaseInstance = createClient("https://example.supabase.co", "fallback-key")
  } else {
    // Fix URL if needed
    const fixedUrl = validateAndFixUrl(supabaseUrl)

    // Create the client
    supabaseInstance = createClient(fixedUrl, supabaseAnonKey)
    console.log("Supabase client initialized successfully in lib/db.ts with URL:", fixedUrl)
  }
} catch (error) {
  console.error("Error initializing Supabase client in lib/db.ts:", error)
  supabaseInstance = createClient("https://example.supabase.co", "fallback-key")
}

// Export the initialized client
export const supabase = supabaseInstance

export type Quiz = {
  id: string
  title: string
  description: string | null
  is_public: boolean
  created_at: string
  user_id: string
  category_id?: string
  creator?: {
    username: string
    display_name: string
    avatar_url: string | null
  }
}

export type Profile = {
  id: string
  username: string
  display_name: string
  avatar_url: string | null
  bio: string | null
  email: string
  created_at: string
  updated_at: string | null
  role: "user" | "admin" | "moderator"
}

export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  created_at: string
}

export type Question = {
  id: string
  quiz_id: string
  question_text: string
  options: Array<{
    id: string
    text: string
    isCorrect?: boolean
  }>
  correct_answer: string
  order: number
  created_at: string
}

// Get trending quizzes with creator information
export async function getQuizzes(limit = 10) {
  try {
    // First, fetch the quizzes
    const { data: quizzes, error: quizzesError } = await supabase
      .from("quizzes")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (quizzesError) throw quizzesError

    // If we have quizzes, fetch the creator profiles separately
    if (quizzes && quizzes.length > 0) {
      // Get unique user IDs from the quizzes
      const userIds = [...new Set(quizzes.map((quiz) => quiz.user_id))]

      // Fetch profiles for these users
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url")
        .in("id", userIds)

      if (profilesError) throw profilesError

      // Map profiles to quizzes
      const quizzesWithCreators = quizzes.map((quiz) => {
        const creator = profiles?.find((profile) => profile.id === quiz.user_id)
        return {
          ...quiz,
          creator: creator
            ? {
                username: creator.username,
                display_name: creator.display_name,
                avatar_url: creator.avatar_url,
              }
            : undefined,
        }
      })

      return quizzesWithCreators
    }

    return quizzes || []
  } catch (error) {
    console.error("Error fetching quizzes:", error)
    throw error
  }
}

// Get a single quiz by ID with its questions
export async function getQuizById(id: string) {
  try {
    // Fetch the quiz
    const { data: quiz, error: quizError } = await supabase.from("quizzes").select("*").eq("id", id).single()

    if (quizError) throw quizError

    // Fetch the creator profile
    const { data: creator, error: creatorError } = await supabase
      .from("profiles")
      .select("username, display_name, avatar_url")
      .eq("id", quiz.user_id)
      .single()

    if (creatorError) throw creatorError

    // Fetch the questions for this quiz
    const { data: questions, error: questionsError } = await supabase
      .from("questions")
      .select("*")
      .eq("quiz_id", id)
      .order("order", { ascending: true })

    if (questionsError) throw questionsError

    return {
      ...quiz,
      creator,
      questions: questions || [],
    }
  } catch (error) {
    console.error("Error fetching quiz:", error)
    throw error
  }
}

// Get user profile by ID
export async function getProfileById(id: string) {
  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error fetching profile:", error)
    throw error
  }
}

// Create a new quiz
export async function createQuiz(quizData: Partial<Quiz>, questions: Partial<Question>[]) {
  try {
    // Insert the quiz
    const { data: quiz, error: quizError } = await supabase.from("quizzes").insert([quizData]).select()

    if (quizError) throw quizError

    if (quiz && quiz.length > 0) {
      // Prepare questions with the quiz_id
      const questionsWithQuizId = questions.map((question, index) => ({
        ...question,
        quiz_id: quiz[0].id,
        order: index + 1,
      }))

      // Insert the questions
      const { error: questionsError } = await supabase.from("questions").insert(questionsWithQuizId)

      if (questionsError) throw questionsError

      return quiz[0]
    }

    return null
  } catch (error) {
    console.error("Error creating quiz:", error)
    throw error
  }
}

// Get quizzes created by a user
export async function getQuizzesByUser(userId: string) {
  try {
    const { data, error } = await supabase
      .from("quizzes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching user quizzes:", error)
    throw error
  }
}

export async function updateProfile(profile: Partial<Profile> & { id: string }) {
  const { data, error } = await supabase.from("profiles").update(profile).eq("id", profile.id).select().single()

  if (error) {
    console.error("Error updating profile:", error)
    throw error
  }

  return data
}

// Create a new profile after signup
export async function createProfile(profile: Profile) {
  const { data, error } = await supabase.from("profiles").insert(profile).select().single()

  if (error) {
    console.error("Error creating profile:", error)
    throw error
  }

  return data
}

// Admin functions

// Get all users (admin only)
export async function getAllUsers() {
  try {
    const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}

// Update user role (admin only)
export async function updateUserRole(userId: string, role: "user" | "admin" | "moderator") {
  try {
    const { data, error } = await supabase.from("profiles").update({ role }).eq("id", userId).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error updating user role:", error)
    throw error
  }
}

// Delete user (admin only)
export async function deleteUser(userId: string) {
  try {
    const { error } = await supabase.from("profiles").delete().eq("id", userId)

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error deleting user:", error)
    throw error
  }
}

// Category management (admin only)
export async function getAllCategories() {
  try {
    // Try to fetch categories
    const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true })

    // If there's an error with code 42P01 (relation does not exist), return empty array
    if (error && error.code === "42P01") {
      console.error("Categories table does not exist:", error)
      return []
    }

    // If there's any other error, log it and return empty array
    if (error) {
      console.error("Error fetching categories:", error)
      return []
    }

    // Return the data or empty array
    return data || []
  } catch (error) {
    // Catch any other exceptions and return empty array
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function createCategory(category: Omit<Category, "id" | "created_at">) {
  try {
    const { data, error } = await supabase.from("categories").insert([category]).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error creating category:", error)
    throw error
  }
}

export async function updateCategory(id: string, category: Partial<Omit<Category, "id" | "created_at">>) {
  try {
    const { data, error } = await supabase.from("categories").update(category).eq("id", id).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error updating category:", error)
    throw error
  }
}

export async function deleteCategory(id: string) {
  try {
    const { error } = await supabase.from("categories").delete().eq("id", id)

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error deleting category:", error)
    throw error
  }
}

// Quiz moderation (admin only)
export async function getAllQuizzes() {
  try {
    const { data, error } = await supabase.from("quizzes").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching all quizzes:", error)
    throw error
  }
}

export async function updateQuizStatus(id: string, is_public: boolean) {
  try {
    const { data, error } = await supabase.from("quizzes").update({ is_public }).eq("id", id).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error updating quiz status:", error)
    throw error
  }
}

export async function deleteQuiz(id: string) {
  try {
    // First delete all questions
    const { error: questionsError } = await supabase.from("questions").delete().eq("quiz_id", id)

    if (questionsError) throw questionsError

    // Then delete the quiz
    const { error: quizError } = await supabase.from("quizzes").delete().eq("id", id)

    if (quizError) throw quizError

    return true
  } catch (error) {
    console.error("Error deleting quiz:", error)
    throw error
  }
}

// Analytics (admin only)
export async function getQuizStats() {
  try {
    const { count: totalQuizzes, error: quizError } = await supabase
      .from("quizzes")
      .select("*", { count: "exact", head: true })

    if (quizError) throw quizError

    const { count: totalUsers, error: userError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })

    if (userError) throw userError

    const { count: totalQuestions, error: questionError } = await supabase
      .from("questions")
      .select("*", { count: "exact", head: true })

    if (questionError) throw questionError

    return {
      totalQuizzes: totalQuizzes || 0,
      totalUsers: totalUsers || 0,
      totalQuestions: totalQuestions || 0,
    }
  } catch (error) {
    console.error("Error fetching quiz stats:", error)
    throw error
  }
}

// Check if user is admin
export async function isUserAdmin(userId: string) {
  try {
    const { data, error } = await supabase.from("profiles").select("role").eq("id", userId).single()

    if (error) throw error
    return data?.role === "admin"
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}

