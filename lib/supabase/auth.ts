'use client'

import { createClient } from "@/lib/supabase/client"
import { generateCampusId, isCampusId } from "@/lib/utils/generateCampusId"
import type { User } from "@/lib/types/user"

/**
 * Résout un CampusID vers un email
 */
export async function resolveCampusIdToEmail(campusId: string): Promise<string | null> {
  try {
    console.log("[v0] Resolving CampusID:", campusId)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("users")
      .select("email")
      .eq("campus_id", campusId)
      .maybeSingle()

    if (error) {
      console.error("[v0] Error resolving CampusID:", error)
      return null
    }

    if (!data) {
      console.log("[v0] CampusID not found")
      return null
    }

    console.log("[v0] CampusID resolved to email")
    return data.email
  } catch (error) {
    console.error("[v0] Error resolving CampusID:", error)
    return null
  }
}

/**
 * Inscription d'un client
 */
export async function registerClient(data: {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
}) {
  try {
    console.log("[v0] Starting client registration for:", data.email)
    const supabase = createClient()
    
    // Generate CampusID
    const campusId = generateCampusId("client")
    console.log("[v0] Generated CampusID:", campusId)

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard/client`,
        data: {
          campus_id: campusId,
          role: "client",
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
        },
      },
    })

    if (authError) {
      console.error("[v0] Auth signup error:", authError)
      throw authError
    }

    if (!authData.user) {
      throw new Error("No user returned from signup")
    }

    console.log("[v0] Auth user created, user ID:", authData.user.id)

    await new Promise(resolve => setTimeout(resolve, 1000))

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .single()

    if (userError) {
      console.error("[v0] Error fetching user profile:", userError)
    } else {
      console.log("[v0] User profile created successfully")
    }

    // Send CampusID via email
    try {
      await fetch("/api/send-campus-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          firstName: data.firstName,
          campusId,
        }),
      })
      console.log("[v0] CampusID email sent")
    } catch (emailError) {
      console.error("[v0] Error sending CampusID email:", emailError)
      // Don't fail registration if email fails
    }

    return { success: true, user: authData.user, campusId }
  } catch (error: any) {
    console.error("[v0] Registration error:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Connexion avec email ou CampusID
 */
export async function signIn(identifier: string, password: string) {
  try {
    console.log("[v0] Sign in attempt with identifier:", identifier)

    let email = identifier

    // Check if identifier is a CampusID
    if (isCampusId(identifier)) {
      console.log("[v0] Identifier is CampusID, resolving...")
      const resolvedEmail = await resolveCampusIdToEmail(identifier)
      if (!resolvedEmail) {
        console.log("[v0] CampusID not found")
        return { success: false, error: "CampusID invalide" }
      }
      email = resolvedEmail
      console.log("[v0] CampusID resolved to email")
    }

    const supabase = createClient()

    console.log("[v0] Attempting Supabase sign in with email...")
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      console.error("[v0] Sign in error:", authError.message)
      let errorMessage = "Email/CampusID ou mot de passe incorrect"

      if (authError.message.includes("Invalid login credentials")) {
        errorMessage = "Email/CampusID ou mot de passe incorrect"
      } else if (authError.message.includes("Email not confirmed")) {
        errorMessage = "Veuillez confirmer votre email avant de vous connecter"
      }

      return { success: false, error: errorMessage }
    }

    if (!authData.user) {
      console.log("[v0] No user data returned")
      return { success: false, error: "Utilisateur introuvable" }
    }

    console.log("[v0] Auth successful, user ID:", authData.user.id)
    console.log("[v0] User metadata:", authData.user.user_metadata)

    await new Promise(resolve => setTimeout(resolve, 1500))

    // Fetch user data from users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .maybeSingle()

    if (userError) {
      console.error("[v0] Error fetching user profile:", userError)
      return { success: false, error: "Erreur lors de la récupération du profil utilisateur." }
    }

    if (!userData) {
      console.error("[v0] User profile not found after auth")
      return { success: false, error: "Profil utilisateur introuvable. Veuillez réessayer ou contacter le support." }
    }

    console.log("[v0] User profile found:", userData.campus_id, userData.role)

    if (!userData.is_active) {
      await supabase.auth.signOut()
      console.log("[v0] User account is inactive")
      return { success: false, error: "Compte désactivé. Contactez l'administrateur." }
    }

    console.log("[v0] Sign in completed successfully for role:", userData.role)

    // Convert snake_case to camelCase for userData
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

    return {
      success: true,
      user: authData.user,
      userData: formattedUserData,
    }
  } catch (error: any) {
    console.error("[v0] Sign in error:", error)
    return { success: false, error: "Une erreur est survenue lors de la connexion" }
  }
}

/**
 * Déconnexion
 */
export async function signOut() {
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    
    if (error) throw error
    
    return { success: true }
  } catch (error: any) {
    console.error("Sign out error:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Créer un utilisateur (vendor ou delivery) - Admin uniquement
 */
export async function createUserByAdmin(data: {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  role: "vendor" | "delivery"
  businessName?: string
  vehicleType?: string
}) {
  try {
    const response = await fetch("/api/admin/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    const result = await response.json()
    return result
  } catch (error: any) {
    console.error("Create user error:", error)
    return { success: false, error: error.message }
  }
}
