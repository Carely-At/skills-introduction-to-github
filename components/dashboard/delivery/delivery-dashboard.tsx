"use client"

import { useState } from "react"
import { useAuth } from "@/lib/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { UtensilsCrossed, LogOut, Package, Clock, User, CheckCircle } from "lucide-react"
import { signOut } from "@/lib/supabase/auth"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AvailableOrders } from "./available-orders"
import { MyDeliveries } from "./my-deliveries"
import { DeliveryHistory } from "./delivery-history"

export function DeliveryDashboard() {
  const { userData } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("available")
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50 safe-area-top">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <UtensilsCrossed className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
                <span className="text-lg sm:text-2xl font-bold truncate">CampusEats</span>
              </div>
              <span className="text-xs sm:text-sm bg-primary text-primary-foreground px-2 sm:px-3 py-0.5 sm:py-1 rounded-full flex-shrink-0">
                Livreur
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-muted px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg">
                <Label htmlFor="availability" className="cursor-pointer text-xs sm:text-sm">
                  {isAvailable ? "Disponible" : "Indisponible"}
                </Label>
                <Switch id="availability" checked={isAvailable} onCheckedChange={toggleAvailability} />
              </div>
              <div className="sm:hidden">
                <Switch id="availability-mobile" checked={isAvailable} onCheckedChange={toggleAvailability} />
              </div>
              <div className="hidden lg:block text-right">
                <p className="text-sm font-medium truncate max-w-[150px]">
                  {userData?.firstName} {userData?.lastName}
                </p>
                <p className="text-xs text-muted-foreground">{userData?.campusId}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard/settings")}
                className="hidden sm:flex touch-target"
              >
                <User className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Paramètres</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="hidden sm:flex touch-target bg-transparent"
              >
                <LogOut className="h-4 w-4 lg:mr-0" />
                <span className="hidden xl:inline ml-2">Déconnexion</span>
              </Button>
              <div className="sm:hidden flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/settings")}>
                  <User className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 safe-area-bottom">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Tableau de bord livreur</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gérez vos livraisons et restez disponible pour les commandes
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 sm:mb-8 grid w-full grid-cols-4 h-auto">
            <TabsTrigger
              value="available"
              className="text-xs sm:text-sm py-2 sm:py-2.5 flex-col sm:flex-row gap-1 sm:gap-2"
            >
              <Package className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Disponibles</span>
              <span className="sm:hidden">Dispo</span>
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="text-xs sm:text-sm py-2 sm:py-2.5 flex-col sm:flex-row gap-1 sm:gap-2"
            >
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Mes livraisons</span>
              <span className="sm:hidden">Actif</span>
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="text-xs sm:text-sm py-2 sm:py-2.5 flex-col sm:flex-row gap-1 sm:gap-2"
            >
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Historique</span>
              <span className="sm:hidden">Hist.</span>
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="text-xs sm:text-sm py-2 sm:py-2.5 flex-col sm:flex-row gap-1 sm:gap-2"
            >
              <User className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Profil</span>
              <span className="sm:hidden">Profil</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available">
            <AvailableOrders />
          </TabsContent>

          <TabsContent value="active">
            <MyDeliveries />
          </TabsContent>

          <TabsContent value="history">
            <DeliveryHistory />
          </TabsContent>

          <TabsContent value="profile">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Mon profil</h2>
              <div className="bg-card p-4 sm:p-6 rounded-lg border border-border space-y-3 sm:space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nom complet</label>
                  <p className="text-base sm:text-lg">
                    {userData?.firstName} {userData?.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-base sm:text-lg break-all">{userData?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">CampusID</label>
                  <p className="text-base sm:text-lg font-mono">{userData?.campusId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
                  <p className="text-base sm:text-lg">{userData?.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type de véhicule</label>
                  <p className="text-base sm:text-lg">{(userData as any)?.vehicleType || "Non défini"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Statut</label>
                  <p className="text-base sm:text-lg">
                    {isAvailable ? (
                      <span className="text-green-600 font-medium">Disponible</span>
                    ) : (
                      <span className="text-muted-foreground">Indisponible</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
