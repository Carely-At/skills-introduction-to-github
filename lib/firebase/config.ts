'use client'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
}

let firebaseApp: any = null
let firebaseAuth: any = null
let firebaseDB: any = null
let firebaseStorage: any = null
let isInitializing = false
let initPromise: Promise<void> | null = null

async function initializeFirebase() {
  if (firebaseApp || isInitializing) {
    return initPromise
  }

  isInitializing = true
  
  initPromise = (async () => {
    try {
      // Try to use CDN version first (compat mode)
      if (typeof window !== 'undefined' && (window as any).firebase) {
        console.log('[v0] Using Firebase from CDN')
        const firebase = (window as any).firebase
        
        if (!firebaseApp) {
          firebaseApp = firebase.apps.length 
            ? firebase.apps[0] 
            : firebase.initializeApp(firebaseConfig)
        }
        
        firebaseAuth = firebase.auth(firebaseApp)
        firebaseDB = firebase.firestore(firebaseApp)
        firebaseStorage = firebase.storage(firebaseApp)
        
        return
      }

      // Fallback to npm package
      console.log('[v0] Loading Firebase from npm package')
      const { initializeApp, getApps } = await import('firebase/app')
      const { getAuth } = await import('firebase/auth')
      const { getFirestore } = await import('firebase/firestore')
      const { getStorage } = await import('firebase/storage')

      if (!firebaseApp) {
        firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
      }
      
      firebaseAuth = getAuth(firebaseApp)
      firebaseDB = getFirestore(firebaseApp)
      firebaseStorage = getStorage(firebaseApp)
      
    } catch (error) {
      console.error('[v0] Failed to initialize Firebase:', error)
      throw new Error('Firebase initialization failed. Please check your configuration.')
    } finally {
      isInitializing = false
    }
  })()

  return initPromise
}

export async function getFirebaseApp() {
  if (typeof window === "undefined") {
    throw new Error("Firebase must be initialized client-side")
  }
  
  await initializeFirebase()
  return firebaseApp
}

export async function getFirebaseAuth() {
  if (typeof window === "undefined") {
    throw new Error("Firebase must be initialized client-side")
  }
  
  await initializeFirebase()
  return firebaseAuth
}

export async function getFirebaseDB() {
  if (typeof window === "undefined") {
    throw new Error("Firebase must be initialized client-side")
  }
  
  await initializeFirebase()
  return firebaseDB
}

export async function getFirebaseStorage() {
  if (typeof window === "undefined") {
    throw new Error("Firebase must be initialized client-side")
  }
  
  await initializeFirebase()
  return firebaseStorage
}

// Proxy exports for compatibility
export const auth = new Proxy({} as any, {
  get: (_, prop) => {
    if (!firebaseAuth) {
      throw new Error('Firebase Auth not initialized. Call getFirebaseAuth() first.')
    }
    return firebaseAuth[prop]
  }
})

export const db = new Proxy({} as any, {
  get: (_, prop) => {
    if (!firebaseDB) {
      throw new Error('Firebase Firestore not initialized. Call getFirebaseDB() first.')
    }
    return firebaseDB[prop]
  }
})

export const storage = new Proxy({} as any, {
  get: (_, prop) => {
    if (!firebaseStorage) {
      throw new Error('Firebase Storage not initialized. Call getFirebaseStorage() first.')
    }
    return firebaseStorage[prop]
  }
})

export const app = new Proxy({} as any, {
  get: (_, prop) => {
    if (!firebaseApp) {
      throw new Error('Firebase App not initialized. Call getFirebaseApp() first.')
    }
    return firebaseApp[prop]
  }
})
