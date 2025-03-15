import { redirect } from "next/navigation"
import { getCurrentUser } from "./auth"

/**
 * Checks if a user is authenticated and redirects to login if not
 * @param redirectTo The path to redirect back to after login
 * @returns The authenticated user or redirects
 */
export async function requireAuth(redirectTo?: string) {
  const user = await getCurrentUser()

  if (!user) {
    const loginPath = redirectTo ? `/login?redirectTo=${encodeURIComponent(redirectTo)}` : "/login"
    redirect(loginPath)
  }

  return user
}

