"use client"

import { useState } from "react"
import { useAuth } from "@/lib/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  UtensilsCrossed,
  LogOut,
  Package,
  Clock,
  User,
  CheckCircle,
  Home,
  Settings,
  Bell,
  TrendingUp,
  Star,
  DollarSign,
} from "lucide-react"
import { signOut } from "@/lib/supabase/auth"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AvailableOrders } from "./available-orders"
import { MyDeliveries } from "./my-deliveries"
import { DeliveryHistory } from "./delivery-history"
import { LocationTracker } from "./location-tracker"
import { formatCurrency } from "@/lib/utils/currency"

export function DeliveryDashboard() {
  const { userData } = useAuth()
  const router = useRouter()
  const [activeView, setActiveView] = useState<"dashboard" | "available" | "active" | "history" | "profile">(
    "dashboard",
  )
  const [isAvailable, setIsAvailable] = useState((userData as any)?.isAvailable || false)

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  const toggleAvailability = async () => {
    if (!userData?.uid) return

    try {
      const newStatus = !isAvailable
      const supabase = createClient()
      const { error } = await supabase
        .from("delivery_profiles")
        .update({ is_available: newStatus })
        .eq("user_id", userData.uid)

      if (error) throw error

      setIsAvailable(newStatus)
    } catch (error) {
      console.error("Error updating availability:", error)
      alert("Erreur lors de la mise à jour de la disponibilité")
    }
  }

  const renderDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Status Card */}
        <div className="bg-gradient-to-br from-primary via-primary to-accent rounded-3xl p-8 text-primary-foreground shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Bienvenue, {userData?.firstName}</h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {isAvailable ? (
                    <>
                      <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-sm font-medium">Vous êtes EN LIGNE et recevez des commandes.</span>
                    </>
                  ) : (
                    <>
                      <div className="h-3 w-3 bg-red-400 rounded-full" />
                      <span className="text-sm font-medium">Vous êtes HORS LIGNE</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
              <Label htmlFor="availability-toggle" className="cursor-pointer font-medium">
                {isAvailable ? "En ligne" : "Hors ligne"}
              </Label>
              <Switch id="availability-toggle" checked={isAvailable} onCheckedChange={toggleAvailability} />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-soft transition-smooth">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-500/10">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Revenus du jour</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(84.5)}</p>
            <p className="text-xs text-green-600 font-medium mt-1">+14%</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-soft transition-smooth">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Livraisons terminées</span>
            </div>
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-blue-600 font-medium mt-1">+4</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-soft transition-smooth">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Temps actif</span>
            </div>
            <p className="text-2xl font-bold">3h 20m</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-soft transition-smooth">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Note livreur</span>
            </div>
            <p className="text-2xl font-bold">4.9</p>
            <p className="text-xs text-green-600 font-medium mt-1">+0.3</p>
          </div>
        </div>

        {/* Location Tracker */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4">Partage de localisation</h3>
          <LocationTracker />
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4">Actions Rapides</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-24 flex-col gap-2 bg-transparent"
              onClick={() => setActiveView("available")}
            >
              <Package className="h-6 w-6" />
              <span className="text-sm">Commandes disponibles</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col gap-2 bg-transparent"
              onClick={() => setActiveView("active")}
            >
              <Clock className="h-6 w-6" />
              <span className="text-sm">Mes livraisons</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col gap-2 bg-transparent"
              onClick={() => setActiveView("history")}
            >
              <CheckCircle className="h-6 w-6" />
              <span className="text-sm">Historique</span>
            </Button>
          </div>
        </div>

        {/* Earnings Chart */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Revenus de la semaine</h3>
            <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
              <TrendingUp className="h-4 w-4" />
              +18.5%
            </div>
          </div>
          <div className="h-48 flex items-end gap-2">
            {[65, 78, 82, 95, 88, 92, 105].map((value, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-primary/20 rounded-t-lg relative overflow-hidden"
                  style={{ height: `${value}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-primary to-primary/50" />
                </div>
                <span className="text-xs text-muted-foreground">
                  {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50 safe-area-top">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
                <UtensilsCrossed className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <span className="text-xl font-bold hidden sm:block">CampusEats</span>
                <span className="text-xs text-muted-foreground hidden sm:block">Portail Livreur</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/settings")}>
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:w-64 border-r border-border bg-card min-h-[calc(100vh-89px)] flex-col p-4">
          <nav className="space-y-2 flex-1">
            <Button
              variant={activeView === "dashboard" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveView("dashboard")}
            >
              <Home className="h-4 w-4 mr-3" />
              Tableau de Bord
            </Button>
            <Button
              variant={activeView === "available" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveView("available")}
            >
              <Package className="h-4 w-4 mr-3" />
              Commandes disponibles
            </Button>
            <Button
              variant={activeView === "active" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveView("active")}
            >
              <Clock className="h-4 w-4 mr-3" />
              Mes livraisons
            </Button>
            <Button
              variant={activeView === "history" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveView("history")}
            >
              <CheckCircle className="h-4 w-4 mr-3" />
              Historique
            </Button>
            <Button
              variant={activeView === "profile" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveView("profile")}
            >
              <User className="h-4 w-4 mr-3" />
              Profil
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/dashboard/settings")}>
              <Settings className="h-4 w-4 mr-3" />
              Paramètres
            </Button>
          </nav>

          <div className="pt-4 border-t border-border mt-auto">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                {userData?.firstName?.charAt(0)}
                {userData?.lastName?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {userData?.firstName} {userData?.lastName}
                </p>
                <p className="text-xs text-muted-foreground">Livreur</p>
              </div>
            </div>
            <Button variant="outline" className="w-full bg-transparent" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Se déconnecter
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 safe-area-bottom">
          {activeView === "dashboard" && renderDashboard()}
          {activeView === "available" && <AvailableOrders />}
          {activeView === "active" && <MyDeliveries />}
          {activeView === "history" && <DeliveryHistory />}
          {activeView === "profile" && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Mon profil</h2>
              <div className="bg-card p-6 rounded-2xl border border-border space-y-4">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => router.push("/dashboard/settings")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Gérer ma photo de profil et paramètres
                </Button>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nom complet</label>
                  <p className="text-lg">
                    {userData?.firstName} {userData?.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-lg break-all">{userData?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">CampusID</label>
                  <p className="text-lg font-mono">{userData?.campusId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
                  <p className="text-lg">{userData?.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type de véhicule</label>
                  <p className="text-lg">{(userData as any)?.vehicleType || "Non défini"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Statut</label>
                  <p className="text-lg">
                    {isAvailable ? (
                      <span className="text-green-600 font-medium">Disponible</span>
                    ) : (
                      <span className="text-muted-foreground">Indisponible</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-bottom z-50">
        <div className="grid grid-cols-5 gap-1 p-2">
          <Button
            variant={activeView === "dashboard" ? "default" : "ghost"}
            size="sm"
            className="flex-col h-auto py-2 gap-1"
            onClick={() => setActiveView("dashboard")}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Accueil</span>
          </Button>
          <Button
            variant={activeView === "available" ? "default" : "ghost"}
            size="sm"
            className="flex-col h-auto py-2 gap-1"
            onClick={() => setActiveView("available")}
          >
            <Package className="h-5 w-5" />
            <span className="text-xs">Dispo</span>
          </Button>
          <Button
            variant={activeView === "active" ? "default" : "ghost"}
            size="sm"
            className="flex-col h-auto py-2 gap-1"
            onClick={() => setActiveView("active")}
          >
            <Clock className="h-5 w-5" />
            <span className="text-xs">Actif</span>
          </Button>
          <Button
            variant={activeView === "history" ? "default" : "ghost"}
            size="sm"
            className="flex-col h-auto py-2 gap-1"
            onClick={() => setActiveView("history")}
          >
            <CheckCircle className="h-5 w-5" />
            <span className="text-xs">Historique</span>
          </Button>
          <Button
            variant={activeView === "profile" ? "default" : "ghost"}
            size="sm"
            className="flex-col h-auto py-2 gap-1"
            onClick={() => setActiveView("profile")}
          >
            <User className="h-5 w-5" />
            <span className="text-xs">Profil</span>
          </Button>
        </div>
      </nav>
    </div>
  )
}
