import { NextResponse } from "next/server"
import { createClient, createAdminClient } from "@/lib/supabase/server"

export async function DELETE(request: Request) {
  try {
    console.log("[v0] Delete user API called")

    const supabase = await createClient()

    console.log("[v0] Supabase client created, getting user...")

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("[v0] User check result:", { user: user?.id, error: authError })

    if (authError || !user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    // Verify requesting user is admin
    const { data: adminUser, error: adminCheckError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()

    console.log("[v0] Admin check result:", { role: adminUser?.role, error: adminCheckError })

    if (adminCheckError || adminUser?.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    // Get userId from request body
    const { userId } = await request.json()

    console.log("[v0] Attempting to delete user:", userId)

    if (!userId) {
      return NextResponse.json({ error: "ID utilisateur requis" }, { status: 400 })
    }

    // Prevent admin from deleting themselves
    if (userId === user.id) {
      return NextResponse.json({ error: "Vous ne pouvez pas supprimer votre propre compte" }, { status: 400 })
    }

    const adminSupabase = await createAdminClient()
    const { error: deleteError } = await adminSupabase.auth.admin.deleteUser(userId)

    if (deleteError) {
      console.error("[v0] Error deleting user from auth:", deleteError)
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    console.log("[v0] User deleted successfully from auth:", userId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete user error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erreur inconnue" }, { status: 500 })
  }
}
