import { NextResponse } from "next/server"
import { createAdminClient, createClient } from "@/lib/supabase/server"
import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "")

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const adminSupabase = await createAdminClient()

    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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

    const campusId = `ADM-${Date.now().toString().slice(-8)}`

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

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const { error: updateError } = await adminSupabase
      .from("users")
      .update({
        created_by: authUser.id,
        status: "approved",
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

    try {
      const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL || "noreply@campuseats.com",
        subject: "Bienvenue sur CampusEats - Compte Administrateur",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #ef4444;">Bienvenue sur CampusEats, ${firstName} !</h1>
            <p>Un compte administrateur a été créé pour vous par l'administrateur principal.</p>
            <div style="background-color: #ffedd5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-weight: bold; color: #c2410c;">Vos identifiants :</p>
              <p style="margin: 10px 0 0;"><strong>Email :</strong> ${email}</p>
              <p style="margin: 5px 0 0;"><strong>CampusID :</strong> ${campusId}</p>
              <p style="margin: 5px 0 0;"><strong>Mot de passe temporaire :</strong> ${password}</p>
            </div>
            <p><strong>Important :</strong></p>
            <ul>
              <li>Conservez précieusement ces identifiants</li>
              <li>Changez votre mot de passe lors de votre première connexion</li>
              <li>En tant qu'administrateur, vous pouvez gérer les utilisateurs et superviser la plateforme</li>
            </ul>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" style="display: inline-block; background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
              Se connecter
            </a>
          </div>
        `,
      }

      await sgMail.send(msg)
      console.log("[v0] Email sent to sub-admin")
    } catch (emailError) {
      console.error("[v0] Error sending email:", emailError)
      // Don't fail the request if email fails
    }

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
