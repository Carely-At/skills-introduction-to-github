"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  User,
  Shield,
  Moon,
  Sun,
  Monitor,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  Bell,
  Palette,
  ChevronRight,
  Check,
  Camera,
} from "lucide-react"
import { ProfilePhotoUpload } from "./profile-photo-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface UserSettingsProps {
  user: any
}

type Theme = "dark" | "light" | "system"

export function UserSettings({ user }: UserSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [firstName, setFirstName] = useState(user.first_name || "")
  const [lastName, setLastName] = useState(user.last_name || "")
  const [phone, setPhone] = useState(user.phone || "")

  // Theme state
  const [theme, setTheme] = useState<Theme>("dark")

  // Password change state
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [orderUpdates, setOrderUpdates] = useState(true)
  const [promotions, setPromotions] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  // Theme effect
  useEffect(() => {
    const savedTheme = (localStorage.getItem("campuseats-theme") as Theme) || "dark"
    setTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    if (newTheme === "system") {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      root.classList.toggle("light", !systemDark)
    } else {
      root.classList.toggle("light", newTheme === "light")
    }
  }

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem("campuseats-theme", newTheme)
    applyTheme(newTheme)
    toast({
      title: "Thème mis à jour",
      description: `Le thème ${newTheme === "dark" ? "sombre" : newTheme === "light" ? "clair" : "système"} a été appliqué.`,
    })
  }

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

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      })
      return
    }

    if (newPassword.length < 8) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 8 caractères.",
        variant: "destructive",
      })
      return
    }

    setIsChangingPassword(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      toast({
        title: "Mot de passe modifié",
        description: "Votre mot de passe a été mis à jour avec succès.",
      })

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setShowPasswordSection(false)
    } catch (error) {
      console.error("[v0] Error changing password:", error)
      toast({
        title: "Erreur",
        description: "Impossible de modifier le mot de passe.",
        variant: "destructive",
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push("/login")
    } catch (error) {
      console.error("[v0] Error logging out:", error)
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter.",
        variant: "destructive",
      })
    }
  }

  const themeOptions = [
    { id: "dark" as Theme, label: "Sombre", icon: Moon, description: "Interface sombre par défaut" },
    { id: "light" as Theme, label: "Clair", icon: Sun, description: "Interface claire" },
    { id: "system" as Theme, label: "Système", icon: Monitor, description: "Suit les paramètres du système" },
  ]

  return (
    <div className="space-y-6">
      {/* Profile Photo Card */}
      <div className="card-dark p-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative group">
            {user.profile_photo ? (
              <img
                src={user.profile_photo || "/placeholder.svg"}
                alt={`${user.first_name} ${user.last_name}`}
                className="w-28 h-28 rounded-2xl object-cover border-2 border-[#262626] group-hover:border-emerald-500/50 transition-all duration-300"
              />
            ) : (
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-orange-500/20 flex items-center justify-center border-2 border-[#262626] group-hover:border-emerald-500/50 transition-all duration-300">
                <User className="w-12 h-12 text-emerald-400" />
              </div>
            )}
            <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-semibold text-white mb-1">
              {user.first_name} {user.last_name}
            </h2>
            <p className="text-gray-400 text-sm mb-1">{user.email}</p>
            <span className="badge-primary inline-block mt-2">
              {user.role === "client"
                ? "Étudiant"
                : user.role === "vendor"
                  ? "Vendeur"
                  : user.role === "delivery"
                    ? "Livreur"
                    : "Admin"}
            </span>
            <div className="mt-4">
              <ProfilePhotoUpload userId={user.id} currentPhoto={user.profile_photo} />
            </div>
          </div>
        </div>
      </div>

      {/* Theme Selector Card */}
      <div className="card-dark p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Palette className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Apparence</h3>
            <p className="text-sm text-gray-500">Personnalisez l'apparence de l'application</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {themeOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleThemeChange(option.id)}
              className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                theme === option.id
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-[#262626] bg-[#1a1a1a] hover:border-[#363636]"
              }`}
            >
              {theme === option.id && (
                <div className="absolute top-3 right-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-black" />
                  </div>
                </div>
              )}
              <option.icon className={`w-6 h-6 mb-3 ${theme === option.id ? "text-emerald-400" : "text-gray-400"}`} />
              <p className={`font-medium ${theme === option.id ? "text-white" : "text-gray-300"}`}>{option.label}</p>
              <p className="text-xs text-gray-500 mt-1">{option.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Personal Information Card */}
      <div className="card-dark p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <User className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Informations personnelles</h3>
            <p className="text-sm text-gray-500">Mettez à jour vos informations de profil</p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-gray-300 mb-2 block">
                Prénom
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Votre prénom"
                className="input-dark"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-gray-300 mb-2 block">
                Nom
              </Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Votre nom"
                className="input-dark"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-300 mb-2 block">
              Email
            </Label>
            <Input id="email" value={user.email} disabled className="input-dark opacity-60 cursor-not-allowed" />
            <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
          </div>

          <div>
            <Label htmlFor="campusId" className="text-gray-300 mb-2 block">
              Campus ID
            </Label>
            <div className="relative">
              <Input
                id="campusId"
                value={user.campus_id}
                disabled
                className="input-dark opacity-60 cursor-not-allowed pl-10"
              />
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
            </div>
          </div>

          <div>
            <Label htmlFor="phone" className="text-gray-300 mb-2 block">
              Téléphone
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+33 6 12 34 56 78"
              className="input-dark"
            />
          </div>

          <Button type="submit" disabled={isLoading} className="btn-primary w-full sm:w-auto">
            {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </form>
      </div>

      {/* Notifications Card */}
      <div className="card-dark p-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
            <Bell className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
            <p className="text-sm text-gray-500">Gérez vos préférences de notification</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#1a1a1a] border border-[#262626]">
            <div>
              <p className="text-white font-medium">Notifications par email</p>
              <p className="text-sm text-gray-500">Recevez des mises à jour par email</p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-[#1a1a1a] border border-[#262626]">
            <div>
              <p className="text-white font-medium">Notifications push</p>
              <p className="text-sm text-gray-500">Recevez des notifications sur votre appareil</p>
            </div>
            <Switch
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-[#1a1a1a] border border-[#262626]">
            <div>
              <p className="text-white font-medium">Mises à jour de commande</p>
              <p className="text-sm text-gray-500">Soyez informé du statut de vos commandes</p>
            </div>
            <Switch
              checked={orderUpdates}
              onCheckedChange={setOrderUpdates}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-[#1a1a1a] border border-[#262626]">
            <div>
              <p className="text-white font-medium">Promotions et offres</p>
              <p className="text-sm text-gray-500">Recevez des offres exclusives</p>
            </div>
            <Switch
              checked={promotions}
              onCheckedChange={setPromotions}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Password Change Card */}
      <div className="card-dark p-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
        <button
          onClick={() => setShowPasswordSection(!showPasswordSection)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-white">Sécurité</h3>
              <p className="text-sm text-gray-500">Modifier votre mot de passe</p>
            </div>
          </div>
          <ChevronRight
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
              showPasswordSection ? "rotate-90" : ""
            }`}
          />
        </button>

        {showPasswordSection && (
          <form
            onSubmit={handleChangePassword}
            className="mt-6 pt-6 border-t border-[#262626] space-y-4 animate-slide-up"
          >
            <div>
              <Label htmlFor="currentPassword" className="text-gray-300 mb-2 block">
                Mot de passe actuel
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-dark pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="newPassword" className="text-gray-300 mb-2 block">
                Nouveau mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-dark pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum 8 caractères</p>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-gray-300 mb-2 block">
                Confirmer le mot de passe
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="input-dark"
              />
            </div>

            <Button
              type="submit"
              disabled={isChangingPassword || !newPassword || !confirmPassword}
              className="btn-primary w-full sm:w-auto"
            >
              {isChangingPassword ? "Modification..." : "Modifier le mot de passe"}
            </Button>
          </form>
        )}
      </div>

      {/* Logout Card */}
      <div className="card-dark p-6 animate-fade-in" style={{ animationDelay: "0.5s" }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Déconnexion</h3>
              <p className="text-sm text-gray-500">Se déconnecter de votre compte</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full sm:w-auto bg-transparent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Se déconnecter
          </Button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card-dark border-red-500/30 p-6 animate-fade-in" style={{ animationDelay: "0.6s" }}>
        <h3 className="text-lg font-semibold text-red-400 mb-2">Zone de danger</h3>
        <p className="text-sm text-gray-500 mb-4">
          La suppression de votre compte est irréversible. Toutes vos données seront effacées.
        </p>
        <Button
          variant="outline"
          className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 bg-transparent"
        >
          Supprimer mon compte
        </Button>
      </div>
    </div>
  )
}
