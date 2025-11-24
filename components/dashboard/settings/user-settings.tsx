"use client"

import type React from "react"
import { useState } from "react"
import { User, Shield } from "lucide-react"
import { ProfilePhotoUpload } from "./profile-photo-upload"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"

interface UserSettingsProps {
  user: any
}

export function UserSettings({ user }: UserSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [firstName, setFirstName] = useState(user.first_name || "")
  const [lastName, setLastName] = useState(user.last_name || "")
  const [phone, setPhone] = useState(user.phone || "")
  const { toast } = useToast()

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("users")
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: phone,
        })
        .eq("id", user.id)

      if (error) throw error

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès.",
      })
    } catch (error) {
      console.error("[v0] Error updating profile:", error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Photo Section */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="flex-shrink-0">
            {user.profile_photo ? (
              <img
                src={user.profile_photo || "/placeholder.svg"}
                alt={`${user.first_name} ${user.last_name}`}
                className="w-32 h-32 rounded-full object-cover border-4 border-primary/10 shadow-sm"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-4 border-primary/10 shadow-sm">
                <User className="w-16 h-16 text-primary/60" />
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left w-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Photo de profil</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto md:mx-0">
              Ajoutez une photo pour personnaliser votre profil. Cette photo sera visible par les autres utilisateurs
              (clients, vendeurs, livreurs).
              <br />
              Format JPG, PNG ou WebP. Taille maximale 5MB.
            </p>
            <div className="flex justify-center md:justify-start">
              <ProfilePhotoUpload userId={user.id} currentPhoto={user.profile_photo} />
            </div>
          </div>
        </div>
      </Card>

      {/* Personal Information Section */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6 border-b pb-4">
          <User className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-gray-900">Informations personnelles</h2>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Votre prénom"
              />
            </div>

            <div>
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Votre nom"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email} disabled className="bg-gray-50" />
            <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
          </div>

          <div>
            <Label htmlFor="campusId">Campus ID</Label>
            <div className="relative">
              <Input id="campusId" value={user.campus_id} disabled className="bg-gray-50 pl-10" />
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Identifiant unique généré par CampusEats</p>
          </div>

          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+33 6 12 34 56 78"
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </form>
      </Card>
    </div>
  )
}
