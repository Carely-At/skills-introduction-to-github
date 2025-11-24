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
      return NextResponse.json({ error: "Only main admins can approve users" }, { status: 403 })
    }

    const body = await request.json()
    const { userId } = body

    console.log("[v0] Approving user:", userId)

    const { error: updateError } = await adminSupabase
      .from("users")
      .update({
        status: "approved",
        approved_by: authUser.id,
      })
      .eq("id", userId)

    if (updateError) {
      console.error("[v0] Error approving user:", updateError)
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    await supabase.from("admin_actions").insert({
      admin_id: authUser.id,
      action_type: "approve_user",
      target_user_id: userId,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in approve-user API:", error)
    return NextResponse.json({ error: "Failed to approve user" }, { status: 500 })
  }
}
