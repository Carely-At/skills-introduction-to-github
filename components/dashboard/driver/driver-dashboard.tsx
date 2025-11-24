"use client"

import { useState } from "react"
import { useAuth } from "@/lib/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UtensilsCrossed, LogOut, MapPin, Package, User } from "lucide-react"
import { signOut } from "@/lib/supabase/auth"
import { useRouter } from "next/navigation"

export function DriverDashboard() {
  const { userData } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("available")

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
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
              <div className="text-right hidden lg:block">
                <p className="text-sm font-medium truncate max-w-[150px]">
                  {userData?.firstName} {userData?.lastName}
                </p>
                <p className="text-xs text-muted-foreground">{userData?.campusId}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="touch-target bg-transparent">
                <LogOut className="h-4 w-4 lg:mr-0" />
                <span className="hidden xl:inline ml-2">Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 safe-area-bottom">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Tableau de bord livreur</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Gérez vos livraisons et votre historique</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 sm:mb-8 w-full grid grid-cols-3 h-auto">
            <TabsTrigger
              value="available"
              className="text-xs sm:text-sm py-2 sm:py-2.5 flex-col sm:flex-row gap-1 sm:gap-2"
            >
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Disponibles</span>
              <span className="sm:hidden">Dispo</span>
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="text-xs sm:text-sm py-2 sm:py-2.5 flex-col sm:flex-row gap-1 sm:gap-2"
            >
              <Package className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">En cours</span>
              <span className="sm:hidden">Actif</span>
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="text-xs sm:text-sm py-2 sm:py-2.5 flex-col sm:flex-row gap-1 sm:gap-2"
            >
              <User className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Profil</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available">
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Aucune livraison disponible</h3>
              <p className="text-muted-foreground">
                Les nouvelles livraisons apparaîtront ici dès qu'elles seront disponibles.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="active">
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Aucune livraison en cours</h3>
              <p className="text-muted-foreground">Vos livraisons actives apparaîtront ici.</p>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Mon profil</h2>
              <div className="bg-card p-4 sm:p-6 rounded-lg border border-border space-y-4">
                <Button
                  variant="outline"
                  className="w-full touch-target mb-4 bg-transparent"
                  onClick={() => router.push("/dashboard/settings")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Gérer ma photo de profil et paramètres
                </Button>

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
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
