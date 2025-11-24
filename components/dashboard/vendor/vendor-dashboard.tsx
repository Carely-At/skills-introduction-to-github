"use client"

import { useState } from "react"
import { useAuth } from "@/lib/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UtensilsCrossed, LogOut, ImageIcon, MenuSquare, ShoppingBag, Store } from "lucide-react"
import { signOut } from "@/lib/supabase/auth"
import { useRouter } from "next/navigation"
import { ImageUpload } from "./image-upload"
import { MenuManagement } from "./menu-management"
import { VendorOrders } from "./vendor-orders"

export function VendorDashboard() {
  const { userData } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("images")

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
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
            <span className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded-full">Vendeur</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">
                {(userData as any)?.businessName || `${userData?.firstName} ${userData?.lastName}`}
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
          <h1 className="text-3xl font-bold mb-2">Tableau de bord vendeur</h1>
          <p className="text-muted-foreground">Gérez vos images, votre menu et vos commandes</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="images">
              <ImageIcon className="h-4 w-4 mr-2" />
              Images
            </TabsTrigger>
            <TabsTrigger value="menu">
              <MenuSquare className="h-4 w-4 mr-2" />
              Menu
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Commandes
            </TabsTrigger>
            <TabsTrigger value="profile">
              <Store className="h-4 w-4 mr-2" />
              Profil
            </TabsTrigger>
          </TabsList>

          <TabsContent value="images">
            <ImageUpload />
          </TabsContent>

          <TabsContent value="menu">
            <MenuManagement />
          </TabsContent>

          <TabsContent value="orders">
            <VendorOrders />
          </TabsContent>

          <TabsContent value="profile">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-6">Mon profil</h2>
              <div className="bg-card p-6 rounded-lg border border-border space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nom de la cantine</label>
                  <p className="text-lg">{(userData as any)?.businessName || "Non défini"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nom du propriétaire</label>
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
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
