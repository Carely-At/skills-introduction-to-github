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
import { Loader2, Mail, Lock, AlertCircle, Shield, Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [initializingAdmin, setInitializingAdmin] = useState(false)
  const [showInitButton, setShowInitButton] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    setShowInitButton(false)

    try {
      const result = await signIn(identifier, password)

      if (result.success && result.userData) {
        const dashboardMap = {
          admin: "/dashboard/admin",
          "sub-admin": "/dashboard/admin",
          vendor: "/dashboard/vendor",
          delivery: "/dashboard/delivery",
          client: "/dashboard/client",
        }
        window.location.href = dashboardMap[result.userData.role as keyof typeof dashboardMap] || "/dashboard/client"
      } else {
        setError(result.error || "Erreur de connexion")
        if (identifier === (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "kellyatemenou@gmail.com")) {
          setShowInitButton(true)
        }
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  const handleInitializeAdmin = async () => {
    setInitializingAdmin(true)
    setError("")

    try {
      const response = await fetch("/api/init-admin", { method: "POST" })
      const result = await response.json()

      if (result.success) {
        setError("")
        setShowInitButton(false)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const signInResult = await signIn(identifier, password)
        if (signInResult.success && signInResult.userData) {
          window.location.href = "/dashboard/admin"
        } else {
          setError("Admin créé. Veuillez vous reconnecter.")
        }
      } else {
        setError(result.error || "Erreur lors de l'initialisation")
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'initialisation")
    } finally {
      setInitializingAdmin(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showInitButton && (
        <Alert className="bg-primary/10 border-primary/30">
          <Shield className="h-4 w-4 text-primary" />
          <AlertTitle className="text-foreground">Compte administrateur non initialisé</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p className="text-sm text-muted-foreground">
              Le compte administrateur n'existe pas encore. Cliquez ci-dessous pour l'initialiser.
            </p>
            <Button
              type="button"
              onClick={handleInitializeAdmin}
              disabled={initializingAdmin}
              size="sm"
              className="mt-2 btn-primary"
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

      <div className="card-dark p-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="identifier" className="text-sm font-medium text-foreground">
            Email ou CampusID
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="identifier"
              type="text"
              placeholder="etudiant@univ.edu"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="pl-11 h-12 input-dark"
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Mot de passe
            </Label>
            <Link href="/forgot-password" className="text-xs text-accent hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-11 pr-11 h-12 input-dark"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full h-12 btn-primary text-base font-semibold" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Connexion en cours...
            </>
          ) : (
            "Se connecter"
          )}
        </Button>
      </div>
    </form>
  )
}
