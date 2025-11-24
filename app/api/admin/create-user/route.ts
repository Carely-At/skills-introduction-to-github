import { type NextRequest, NextResponse } from "next/server"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { generateCampusId } from "@/lib/utils/generateCampusId"
import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { data: userData, error: userError } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (userError || userData?.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    const { email, password, firstName, lastName, phone, role, businessName, vehicleType } = await request.json()

    // Validation
    if (!email || !password || !firstName || !lastName || !phone || !role) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 })
    }

    if (!["vendor", "delivery"].includes(role)) {
      return NextResponse.json({ error: "Rôle invalide" }, { status: 400 })
    }

    const campusId = generateCampusId(role as "vendor" | "delivery")

    const adminClient = await createAdminClient()

    const { data: authData, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email for admin-created users
      user_metadata: {
        campus_id: campusId,
        role,
        first_name: firstName,
        last_name: lastName,
        phone,
      },
    })

    if (createError || !authData.user) {
      return NextResponse.json(
        { error: createError?.message || "Erreur lors de la création du compte" },
        { status: 400 },
      )
    }

    const uid = authData.user.id

    if (role === "vendor" && businessName) {
      const { error: profileError } = await adminClient.from("vendor_profiles").insert({
        user_id: uid,
        business_name: businessName,
        description: "",
        images_approved: false,
      })

      if (profileError) {
        console.error("Error creating vendor profile:", profileError)
      }
    } else if (role === "delivery") {
      const { error: profileError } = await adminClient.from("delivery_profiles").insert({
        user_id: uid,
        vehicle_type: vehicleType || null,
        is_available: true,
      })

      if (profileError) {
        console.error("Error creating delivery profile:", profileError)
      }
    }

    const roleNames = {
      vendor: "Vendeur",
      delivery: "Livreur",
    }

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || "noreply@campuseats.com",
      subject: `Bienvenue sur CampusEats - Compte ${roleNames[role as "vendor" | "delivery"]}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ef4444;">Bienvenue sur CampusEats, ${firstName} !</h1>
          <p>Un compte ${roleNames[role as "vendor" | "delivery"]} a été créé pour vous par l'administrateur.</p>
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
            <li>Utilisez votre email ou votre CampusID pour vous connecter</li>
          </ul>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" style="display: inline-block; background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
            Se connecter
          </a>
        </div>
      `,
    }

    await sgMail.send(msg)

    return NextResponse.json({
      success: true,
      uid,
      campusId,
      message: "Utilisateur créé avec succès",
    })
  } catch (error: any) {
    console.error("Create user error:", error)
    return NextResponse.json({ error: error.message || "Une erreur est survenue" }, { status: 500 })
  }
}
