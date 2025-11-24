import { initializeApp, getApps, cert, type App } from "firebase-admin/app"
import { getAuth, type Auth } from "firebase-admin/auth"
import { getFirestore, type Firestore } from "firebase-admin/firestore"

let app: App | undefined
let auth: Auth | undefined
let db: Firestore | undefined

export function initializeAdmin() {
  if (app && auth && db) {
    return { app, auth, db }
  }

  try {
    if (!getApps().length) {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")

      if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
        throw new Error(
          "Missing Firebase Admin credentials. Please set FIREBASE_PRIVATE_KEY and FIREBASE_CLIENT_EMAIL environment variables.",
        )
      }

      app = initializeApp({
        credential: cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
      })
    } else {
      app = getApps()[0]
    }

    auth = getAuth(app)
    db = getFirestore(app)

    return { app, auth, db }
  } catch (error) {
    console.error("Firebase Admin initialization error:", error)
    throw error
  }
}

export function getAdminAuth(): Auth {
  const { auth } = initializeAdmin()
  if (!auth) {
    throw new Error("Firebase Admin Auth not initialized")
  }
  return auth
}

export function getAdminDb(): Firestore {
  const { db } = initializeAdmin()
  if (!db) {
    throw new Error("Firebase Admin Firestore not initialized")
  }
  return db
}

export function getAdminApp(): App {
  const { app } = initializeAdmin()
  if (!app) {
    throw new Error("Firebase Admin App not initialized")
  }
  return app
}
