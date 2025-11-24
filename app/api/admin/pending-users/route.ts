import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()

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
      return NextResponse.json({ error: "Only main admins can view pending users" }, { status: 403 })
    }

    const { data: pendingUsers, error } = await supabase
      .from("users")
      .select(`
        *,
        creator:created_by(id, email, first_name, last_name)
      `)
      .eq("status", "pending")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching pending users:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ users: pendingUsers })
  } catch (error) {
    console.error("[v0] Error in pending-users API:", error)
    return NextResponse.json({ error: "Failed to fetch pending users" }, { status: 500 })
  }
}
