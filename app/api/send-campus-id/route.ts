import { type NextRequest, NextResponse } from "next/server"
import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, campusId } = await request.json()

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || "noreply@campuseats.com",
      subject: "Bienvenue sur CampusEats - Votre CampusID",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ef4444;">Bienvenue sur CampusEats, ${firstName} !</h1>
          <p>Votre compte a été créé avec succès. Voici votre identifiant unique :</p>
          <div style="background-color: #ffedd5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #c2410c;">Votre CampusID :</p>
            <p style="margin: 10px 0 0; font-size: 24px; font-weight: bold; color: #c2410c;">${campusId}</p>
          </div>
          <p><strong>Important :</strong> Conservez précieusement ce CampusID. Vous pourrez l'utiliser pour vous connecter à votre compte en plus de votre email.</p>
          <p>Comment utiliser votre CampusID :</p>
          <ul>
            <li>Pour vous connecter : utilisez votre CampusID ou votre email</li>
            <li>Pour partager avec vos amis : donnez-leur votre CampusID</li>
            <li>Pour les commandes : votre CampusID est votre identifiant unique sur le campus</li>
          </ul>
          <p>Commencez dès maintenant à explorer les meilleurs repas de votre campus !</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" style="display: inline-block; background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
            Se connecter
          </a>
          <p style="margin-top: 30px; color: #666; font-size: 12px;">
            Si vous n'avez pas créé de compte sur CampusEats, vous pouvez ignorer cet email.
          </p>
        </div>
      `,
    }

    await sgMail.send(msg)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("SendGrid error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
