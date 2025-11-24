import { getFirebaseAuth, getFirebaseDB } from "./config"
import { generateCampusId, isCampusId } from "@/lib/utils/generateCampusId"
import type { User } from "@/lib/types/user"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"

/**
 * Résout un CampusID vers un email
 */
export async function resolveCampusIdToEmail(campusId: string): Promise<string | null> {
  try {
    const db = getFirebaseDB()
    const mappingRef = doc(db, "campusIdMapping", campusId)
    const mappingSnap = await getDoc(mappingRef)

    if (mappingSnap.exists()) {
      return mappingSnap.data().email
    }
    return null
  } catch (error) {
    console.error("Error resolving CampusID:", error)
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
    const auth = getFirebaseAuth()
    const db = getFirebaseDB()
    
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)

    const campusId = generateCampusId("client")

    const userDoc: Partial<User> = {
      uid: userCredential.user.uid,
      email: data.email,
      campusId,
      role: "client",
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    }

    await setDoc(doc(db, "users", userCredential.user.uid), userDoc)

    await setDoc(doc(db, "campusIdMapping", campusId), {
      email: data.email,
      uid: userCredential.user.uid,
    })

    await sendEmailVerification(userCredential.user)

    await fetch("/api/send-campus-id", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email,
        firstName: data.firstName,
        campusId,
      }),
    })

    return { success: true, user: userCredential.user, campusId }
  } catch (error: any) {
    console.error("Registration error:", error)
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

    const auth = getFirebaseAuth()
    const db = getFirebaseDB()

    if (!auth) {
      console.error("[v0] Auth object not initialized")
      return {
        success: false,
        error: "Service d'authentification non disponible. Vérifiez votre configuration Firebase.",
      }
    }

    console.log("[v0] Attempting Firebase sign in...")
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    console.log("[v0] Sign in successful")

    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid))

    if (!userDoc.exists()) {
      console.log("[v0] User document not found in Firestore")
      return { success: false, error: "Utilisateur introuvable" }
    }

    const userData = userDoc.data() as User

    if (!userData.isActive) {
      await firebaseSignOut(auth)
      console.log("[v0] User account is inactive")
      return { success: false, error: "Compte désactivé. Contactez l'administrateur." }
    }

    console.log("[v0] Sign in completed successfully for role:", userData.role)
    return {
      success: true,
      user: userCredential.user,
      userData,
    }
  } catch (error: any) {
    console.error("[v0] Sign in error:", error)
    console.error("[v0] Error code:", error.code)
    console.error("[v0] Error message:", error.message)

    let errorMessage = "Email/CampusID ou mot de passe incorrect"

    if (error.code === "auth/operation-not-allowed") {
      errorMessage =
        "🔒 L'authentification Email/Password n'est pas activée. Veuillez activer Email/Password dans Firebase Console → Authentication → Sign-in method."
    } else if (error.code === "auth/configuration-not-found") {
      errorMessage =
        "Configuration Firebase manquante. Veuillez activer l'authentification Email/Password dans la console Firebase."
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Format d'email invalide"
    } else if (error.code === "auth/user-not-found") {
      errorMessage = "Aucun compte trouvé avec cet identifiant"
    } else if (error.code === "auth/wrong-password") {
      errorMessage = "Mot de passe incorrect"
    } else if (error.code === "auth/too-many-requests") {
      errorMessage = "Trop de tentatives. Veuillez réessayer plus tard."
    } else if (error.code === "auth/user-disabled") {
      errorMessage = "Ce compte a été désactivé. Contactez l'administrateur."
    } else if (error.code === "auth/invalid-credential") {
      errorMessage = "Identifiants invalides. Vérifiez votre email/CampusID et mot de passe."
    }

    return { success: false, error: errorMessage }
  }
}

/**
 * Déconnexion
 */
export async function signOut() {
  try {
    const auth = getFirebaseAuth()
    await firebaseSignOut(auth)
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
