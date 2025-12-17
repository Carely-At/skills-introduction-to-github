"use client"

import type React from "react"
import Link from "next/link"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/supabase/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Mail, Lock, AlertCircle, Shield } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [initializingAdmin, setInitializingAdmin] = useState(false)
  const [showInitButton, setShowInitButton] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    setShowInitButton(false)

    console.log("[v0] Login form submitted")

    try {
      const result = await signIn(identifier, password)

      if (result.success && result.userData) {
        console.log("[v0] Login successful, redirecting to dashboard:", result.userData.role)
        const dashboardMap = {
          admin: "/dashboard/admin",
          vendor: "/dashboard/vendor",
          delivery: "/dashboard/delivery",
          client: "/dashboard/client",
        }

        // Use window.location for hard navigation to trigger middleware
        window.location.href = dashboardMap[result.userData.role]
      } else {
        console.log("[v0] Login failed:", result.error)
        setError(result.error || "Erreur de connexion")
        if (identifier === (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "kellyatemenou@gmail.com")) {
          setShowInitButton(true)
        }
      }
    } catch (err: any) {
      console.error("[v0] Login exception:", err)
      setError(err.message || "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  const handleInitializeAdmin = async () => {
    setInitializingAdmin(true)
    setError("")

    console.log("[v0] Initializing admin account")

    try {
      const response = await fetch("/api/init-admin", {
        method: "POST",
      })

      const result = await response.json()

      if (result.success) {
        console.log("[v0] Admin initialized successfully")
        setError("")
        setShowInitButton(false)

        await new Promise((resolve) => setTimeout(resolve, 1000))

        const signInResult = await signIn(identifier, password)
        if (signInResult.success && signInResult.userData) {
          console.log("[v0] Auto-login successful, redirecting")
          window.location.href = "/dashboard/admin"
        } else {
          setError("Admin créé. Veuillez vous reconnecter.")
        }
      } else {
        console.log("[v0] Admin initialization failed:", result.error)
        setError(result.error || "Erreur lors de l'initialisation")
      }
    } catch (err: any) {
      console.error("[v0] Init admin exception:", err)
      setError(err.message || "Erreur lors de l'initialisation")
    } finally {
      setInitializingAdmin(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-card p-8 rounded-2xl border border-border shadow-2xl shadow-primary/5"
    >
      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {showInitButton && (
        <Alert className="border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-900">Compte administrateur non initialisé</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p className="text-sm text-blue-800">
              Le compte administrateur n'existe pas encore. Cliquez ci-dessous pour l'initialiser.
            </p>
            <Button
              type="button"
              onClick={handleInitializeAdmin}
              disabled={initializingAdmin}
              size="sm"
              className="mt-2 bg-blue-600 hover:bg-blue-700"
            >
              {initializingAdmin ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Initialisation...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Initialiser l'administrateur
                </>
              )}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="identifier" className="text-sm font-medium text-gray-700">
          Email ou CampusID
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="identifier"
            type="text"
            placeholder="etudiant@univ.edu"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className="pl-11 h-12 border-gray-300 focus:border-[#4F46E5] focus:ring-[#4F46E5] text-base"
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Mot de passe
          </Label>
          <Link href="/forgot-password" className="text-xs text-[#EF4444] hover:text-[#DC2626] hover:underline">
            Mot de passe oublié ?
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pl-11 h-12 border-gray-300 focus:border-[#4F46E5] focus:ring-[#4F46E5] text-base"
            disabled={loading}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-12 text-base font-semibold bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-lg hover:shadow-xl transition-all"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Connexion en cours...
          </>
        ) : (
          "Se connecter"
        )}
      </Button>
    </form>
  )
}
