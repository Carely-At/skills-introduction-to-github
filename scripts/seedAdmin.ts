/**
 * Script pour créer l'administrateur principal
 * À exécuter une seule fois lors de la configuration initiale
 *
 * Usage: node scripts/seedAdmin.ts
 */

import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import * as dotenv from "dotenv"

dotenv.config()

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "kellyatemenou@gmail.com"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "@Carely_21"

async function createAdminUser() {
  try {
    // Initialiser Firebase Admin (vous devrez télécharger votre service account key)
    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      })
    }

    const auth = getAuth()
    const db = getFirestore()

    // Vérifier si l'admin existe déjà
    let adminUser
    try {
      adminUser = await auth.getUserByEmail(ADMIN_EMAIL)
      console.log("✓ Admin user already exists")
    } catch (error) {
      // Créer l'utilisateur admin
      adminUser = await auth.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        emailVerified: true,
      })
      console.log("✓ Admin user created")
    }

    // Générer le CampusID admin
    const campusId = `ADM-${Math.floor(100000 + Math.random() * 900000)}${Date.now().toString().slice(-3)}`

    // Créer/Mettre à jour le document Firestore
    await db.collection("users").doc(adminUser.uid).set({
      uid: adminUser.uid,
      email: ADMIN_EMAIL,
      campusId,
      role: "admin",
      firstName: "Kelly",
      lastName: "Atemenou",
      phone: "+000000000",
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    })

    // Créer le mapping CampusID
    await db.collection("campusIdMapping").doc(campusId).set({
      email: ADMIN_EMAIL,
      uid: adminUser.uid,
    })

    console.log("✓ Admin document created in Firestore")
    console.log(`\n🎉 Admin setup complete!`)
    console.log(`Email: ${ADMIN_EMAIL}`)
    console.log(`CampusID: ${campusId}`)
    console.log(`Password: ${ADMIN_PASSWORD}\n`)
  } catch (error) {
    console.error("❌ Error creating admin:", error)
    process.exit(1)
  }
}

createAdminUser()
