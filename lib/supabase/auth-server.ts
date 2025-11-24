import { createClient } from "@/lib/supabase/server"
import type { User } from "@/lib/types/user"

/**
 * Get current user (server-side only)
 * Use this in Server Components, Server Actions, and API Routes
 */
export async function getCurrentUser() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return null
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()

    if (userError) {
      console.error("Error fetching user data:", userError)
      return null
    }

    if (!userData) {
      console.error("User profile not found for authenticated user")
      return null
    }

    const formattedUserData: User = {
      uid: userData.id,
      email: userData.email,
      campusId: userData.campus_id,
      role: userData.role,
      firstName: userData.first_name,
      lastName: userData.last_name,
      phone: userData.phone,
      createdAt: new Date(userData.created_at),
      updatedAt: new Date(userData.updated_at),
      isActive: userData.is_active,
    }

    return formattedUserData
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}
