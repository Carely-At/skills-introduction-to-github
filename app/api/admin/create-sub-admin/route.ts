import { NextResponse } from "next/server"
import { createAdminClient, createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const adminSupabase = createAdminClient()

    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: adminData, error: adminCheckError } = await supabase
      .from("users")
      .select("role")
      .eq("id", authUser.id)
      .single()

    if (adminCheckError || adminData?.role !== "admin") {
      return NextResponse.json({ error: "Only main admins can create sub-admins" }, { status: 403 })
    }

    const body = await request.json()
    const { email, password, firstName, lastName, phone } = body

    // Generate campus ID for sub-admin
    const campusId = `SUB-${Date.now()}`

    console.log("[v0] Creating sub-admin with email:", email)

    const { data: newUser, error: createError } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: "sub-admin",
        campus_id: campusId,
        first_name: firstName,
        last_name: lastName,
        phone,
        is_active: true,
      },
    })

    if (createError) {
      console.error("[v0] Error creating sub-admin:", createError)
      return NextResponse.json({ error: createError.message }, { status: 400 })
    }

    console.log("[v0] Sub-admin auth user created:", newUser.user?.id)

    // Wait for trigger to create user profile
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const { error: updateError } = await adminSupabase
      .from("users")
      .update({
        created_by: authUser.id,
        status: "approved", // Sub-admins are auto-approved
      })
      .eq("id", newUser.user!.id)

    if (updateError) {
      console.error("[v0] Error updating sub-admin record:", updateError)
    }

    await supabase.from("admin_actions").insert({
      admin_id: authUser.id,
      action_type: "create_user",
      target_user_id: newUser.user!.id,
      details: {
        role: "sub-admin",
        campus_id: campusId,
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.user!.id,
        email,
        campusId,
        role: "sub-admin",
      },
      tempPassword: password,
    })
  } catch (error) {
    console.error("[v0] Error in create-sub-admin API:", error)
    return NextResponse.json({ error: "Failed to create sub-admin" }, { status: 500 })
  }
}
