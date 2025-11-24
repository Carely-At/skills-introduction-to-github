"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { signIn } from "@/lib/supabase/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Mail, Lock, AlertCircle, Shield } from 'lucide-react'

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
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        
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
      className="space-y-6 bg-card p-8 rounded-2xl border border-border shadow-2xl shadow-primary/5"
    >
      {error && (
        <Alert variant="destructive" className="border-destructive/50 bg-destructive/5">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showInitButton && (
        <Alert className="border-primary/50 bg-primary/5">
          <Shield className="h-4 w-4" />
          <AlertTitle>Compte administrateur non initialisé</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p className="text-sm">Le compte administrateur n'existe pas encore. Cliquez ci-dessous pour l'initialiser.</p>
            <Button
              type="button"
              onClick={handleInitializeAdmin}
              disabled={initializingAdmin}
              size="sm"
              className="mt-2"
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
        <Label htmlFor="identifier" className="text-sm font-semibold">
          Email ou CampusID
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="identifier"
            type="text"
            placeholder="exemple@email.com ou CLI-123456789"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className="pl-10 h-11 border-border focus:border-primary transition-colors"
            disabled={loading}
          />
        </div>
        <p className="text-xs text-muted-foreground">Utilisez votre email ou votre identifiant CampusID</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-semibold">
          Mot de passe
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pl-10 h-11 border-border focus:border-primary transition-colors"
            disabled={loading}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
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
