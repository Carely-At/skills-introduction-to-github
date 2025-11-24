import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { generateCampusId } from "@/lib/utils/generateCampusId"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "kellyatemenou@gmail.com"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "@Carely_21"

export async function POST() {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Check if admin already exists
    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", ADMIN_EMAIL)
      .single()

    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: "Admin déjà initialisé",
        alreadyExists: true,
      })
    }

    const campusId = generateCampusId("admin")

    // Create auth user with Supabase Admin API
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: {
        campus_id: campusId,
        role: "admin",
        first_name: "Kelly",
        last_name: "Atemenou",
        phone: "+000000000",
      },
    })

    if (authError) {
      console.error("Error creating admin auth user:", authError)
      throw authError
    }

    if (!authData.user) {
      throw new Error("No user returned from createUser")
    }

    // The user profile is automatically created by the database trigger
    // But we need to ensure it's created with the correct data
    await new Promise(resolve => setTimeout(resolve, 500)) // Wait for trigger

    // Verify user was created
    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .single()

    return NextResponse.json({
      success: true,
      message: "Administrateur créé avec succès",
      campusId,
      email: ADMIN_EMAIL,
      user: userData,
    })
  } catch (error: any) {
    console.error("Error initializing admin:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Erreur lors de l'initialisation de l'administrateur",
      },
      { status: 500 },
    )
  }
}
