"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2 } from "lucide-react"

export function CreateUserForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "vendor" as "vendor" | "delivery" | "sub-admin",
    businessName: "",
    vehicleType: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [createdCampusId, setCreatedCampusId] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value as "vendor" | "delivery" | "sub-admin",
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const response = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setCreatedCampusId(result.campusId)
        setSuccess(`Utilisateur créé avec succès ! CampusID: ${result.campusId}`)
        setFormData({
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          phone: "",
          role: "vendor",
          businessName: "",
          vehicleType: "",
        })
      } else {
        setError(result.error || "Erreur lors de la création")
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 text-green-900 border-green-200">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="role">Rôle</Label>
          <Select value={formData.role} onValueChange={handleRoleChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vendor">Vendeur</SelectItem>
              <SelectItem value="delivery">Livreur</SelectItem>
              <SelectItem value="sub-admin">Administrateur secondaire</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.role === "vendor" && (
          <div className="space-y-2">
            <Label htmlFor="businessName">Nom de la cantine</Label>
            <Input
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="La Bonne Bouffe"
              disabled={loading}
            />
          </div>
        )}

        {formData.role === "delivery" && (
          <div className="space-y-2">
            <Label htmlFor="vehicleType">Type de véhicule</Label>
            <Input
              id="vehicleType"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              placeholder="Vélo, Scooter, Voiture..."
              disabled={loading}
            />
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe temporaire</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
          placeholder="Minimum 6 caractères"
        />
        <p className="text-xs text-muted-foreground">Ce mot de passe sera envoyé par email à l'utilisateur</p>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Création en cours...
          </>
        ) : (
          "Créer l'utilisateur"
        )}
      </Button>
    </form>
  )
}
