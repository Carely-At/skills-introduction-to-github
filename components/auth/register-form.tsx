"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { registerClient } from "@/lib/supabase/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, Mail, Phone, Lock, CheckCircle2, AlertCircle, Sparkles } from "lucide-react"

export function RegisterForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [campusId, setCampusId] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    console.log("[v0] Registration form submitted")

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères")
      setLoading(false)
      return
    }

    try {
      const result = await registerClient({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      })

      if (result.success && result.campusId) {
        console.log("[v0] Registration successful, CampusID:", result.campusId)
        setCampusId(result.campusId)
        setSuccess(true)
        setTimeout(() => {
          router.push("/login?registered=true")
        }, 2000)
      } else {
        console.log("[v0] Registration failed:", result.error)
        setError(result.error || "Erreur lors de l'inscription")
      }
    } catch (err: any) {
      console.error("[v0] Registration exception:", err)
      setError(err.message || "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-green-100 mb-2">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Bienvenue sur CampusEats !</h2>
          <div className="space-y-3">
            <p className="text-gray-600">Votre compte a été créé avec succès.</p>
            <div className="relative overflow-hidden bg-gradient-to-br from-[#4F46E5] to-[#3B82F6] p-6 rounded-xl shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <div className="relative">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-white" />
                  <p className="text-sm font-semibold text-white">Votre CampusID</p>
                </div>
                <p className="text-3xl font-bold text-white tracking-wide">{campusId}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Votre CampusID vous a été envoyé par email. Vous pouvez maintenant vous connecter !
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 pt-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Redirection vers la connexion...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
            Prénom
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Jean"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="pl-10 h-11 border-gray-300 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
            Nom
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Dupont"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="pl-10 h-11 border-gray-300 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="jean.dupont@email.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="pl-10 h-11 border-gray-300 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
          Numéro de téléphone
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+33 6 12 34 56 78"
            value={formData.phone}
            onChange={handleChange}
            required
            className="pl-10 h-11 border-gray-300 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Mot de passe
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Min. 8 caractères"
            value={formData.password}
            onChange={handleChange}
            required
            className="pl-10 h-11 border-gray-300 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
          Confirmer le mot de passe
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Répétez votre mot de passe"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="pl-10 h-11 border-gray-300 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
            disabled={loading}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-11 text-base font-semibold bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-lg hover:shadow-xl transition-all"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Création du compte...
          </>
        ) : (
          "Créer un compte"
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center leading-relaxed">
        En vous inscrivant, vous acceptez nos{" "}
        <Link href="/terms" className="text-[#4F46E5] hover:underline">
          conditions d'utilisation
        </Link>{" "}
        et notre{" "}
        <Link href="/privacy" className="text-[#4F46E5] hover:underline">
          politique de confidentialité
        </Link>
        .
      </p>
    </form>
  )
}
