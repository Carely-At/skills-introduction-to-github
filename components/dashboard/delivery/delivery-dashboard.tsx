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
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">CampusEats</span>
            </div>
            <span className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded-full">Livreur</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg">
              <Label htmlFor="availability" className="cursor-pointer">
                {isAvailable ? "Disponible" : "Indisponible"}
              </Label>
              <Switch id="availability" checked={isAvailable} onCheckedChange={toggleAvailability} />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">
                {userData?.firstName} {userData?.lastName}
              </p>
              <p className="text-xs text-muted-foreground">{userData?.campusId}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tableau de bord livreur</h1>
          <p className="text-muted-foreground">Gérez vos livraisons et restez disponible pour les commandes</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="available">
              <Package className="h-4 w-4 mr-2" />
              Commandes disponibles
            </TabsTrigger>
            <TabsTrigger value="active">
              <Clock className="h-4 w-4 mr-2" />
              Mes livraisons
            </TabsTrigger>
            <TabsTrigger value="history">
              <CheckCircle className="h-4 w-4 mr-2" />
              Historique
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profil
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
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-6">Mon profil</h2>
              <div className="bg-card p-6 rounded-lg border border-border space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nom complet</label>
                  <p className="text-lg">
                    {userData?.firstName} {userData?.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-lg">{userData?.email}</p>
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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
