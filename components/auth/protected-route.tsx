"use client"

import type React from "react"

import { useAuth } from "@/lib/hooks/useAuth"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"
import type { UserRole } from "@/lib/types/user"
import { createClient } from "@/lib/supabase/client"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, userData, loading } = useAuth()
  const router = useRouter()
  const [showTimeout, setShowTimeout] = useState(false)

  console.log("[v0] ProtectedRoute - loading:", loading, "user:", !!user, "userData:", userData?.role, "allowedRoles:", allowedRoles)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (loading) {
      timer = setTimeout(() => {
        setShowTimeout(true)
      }, 10000) // 10 seconds timeout
    }
    return () => clearTimeout(timer)
  }, [loading])

  useEffect(() => {
    console.log("[v0] ProtectedRoute useEffect - loading:", loading, "user:", !!user, "userData:", userData)
    
    if (!loading) {
      if (!user) {
        console.log("[v0] ProtectedRoute: No user, redirecting to login")
        router.push("/login")
      } else if (allowedRoles && userData) {
        if (!allowedRoles.includes(userData.role)) {
          console.log("[v0] ProtectedRoute: User role", userData.role, "not in allowed roles", allowedRoles)
          // Rediriger vers le dashboard approprié
          const dashboardMap: Record<UserRole, string> = {
            admin: "/dashboard/admin",
            vendor: "/dashboard/vendor",
            delivery: "/dashboard/delivery",
            client: "/dashboard/client",
          }
          const targetDashboard = dashboardMap[userData.role]
          console.log("[v0] ProtectedRoute: Redirecting to", targetDashboard)
          router.push(targetDashboard)
        } else {
          console.log("[v0] ProtectedRoute: Access granted for role", userData.role)
        }
      } else if (allowedRoles && !userData) {
        console.log("[v0] ProtectedRoute: User authenticated but userData not loaded yet, waiting...")
      }
    }
  }, [user, userData, loading, allowedRoles, router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  if (loading) {
    console.log("[v0] ProtectedRoute: Showing loading spinner")
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Chargement de votre session...</p>
          
          {showTimeout && (
            <div className="mt-4 p-4 bg-destructive/10 rounded-md max-w-md mx-auto">
              <p className="text-sm text-destructive mb-2">Le chargement prend plus de temps que prévu.</p>
              <button 
                onClick={handleLogout}
                className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/90 transition-colors"
              >
                Se déconnecter et réessayer
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (!user) {
    console.log("[v0] ProtectedRoute: No user and not loading, should redirect")
    return null
  }

  if (allowedRoles && !userData) {
    console.log("[v0] ProtectedRoute: Waiting for userData to load")
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Chargement de votre profil...</p>
          
          {showTimeout && (
            <div className="mt-4 p-4 bg-destructive/10 rounded-md max-w-md mx-auto">
              <p className="text-sm text-destructive mb-2">Impossible de charger votre profil.</p>
              <button 
                onClick={handleLogout}
                className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/90 transition-colors"
              >
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (allowedRoles && userData && !allowedRoles.includes(userData.role)) {
    console.log("[v0] ProtectedRoute: Wrong role, should redirect")
    return null
  }

  console.log("[v0] ProtectedRoute: Rendering children")
  return <>{children}</>
}
