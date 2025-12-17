"use client"

import { useState } from "react"
import { useAuth } from "@/lib/hooks/useAuth"
import { Button } from "@/components/ui/button"
import {
  UtensilsCrossed,
  LogOut,
  ImageIcon,
  MenuSquare,
  ShoppingBag,
  Store,
  User,
  Bell,
  Settings,
  Home,
} from "lucide-react"
import { signOut } from "@/lib/supabase/auth"
import { useRouter } from "next/navigation"
import { ImageUpload } from "./image-upload"
import { MenuManagement } from "./menu-management"
import { VendorOrders } from "./vendor-orders"

export function VendorDashboard() {
  const { userData } = useAuth()
  const router = useRouter()
  const [activeView, setActiveView] = useState<"dashboard" | "images" | "menu" | "orders" | "profile">("dashboard")

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

  const renderDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Welcome Card */}
        <div className="bg-gradient-to-br from-primary via-primary to-accent rounded-3xl p-8 text-primary-foreground shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">
              {(userData as any)?.businessName || `${userData?.firstName} ${userData?.lastName}`}
            </h2>
            <p className="text-primary-foreground/90">Rav de vous revoir, Le Burger Joint.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-2xl p-6">
            <p className="text-sm font-medium text-muted-foreground mb-2">Commandes en cours</p>
            <p className="text-3xl font-bold">12</p>
            <p className="text-sm text-muted-foreground mt-1">+2 nouvelles</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <p className="text-sm font-medium text-muted-foreground mb-2">Revenus du jour</p>
            <p className="text-3xl font-bold">450,00 FCFA</p>
            <p className="text-sm text-green-600 mt-1">+13%</p>
          </div>

          <div className="col-span-2 lg:col-span-1 bg-card border border-border rounded-2xl p-6">
            <p className="text-sm font-medium text-muted-foreground mb-2">Note Moyenne</p>
            <p className="text-3xl font-bold">4.8</p>
            <p className="text-sm text-muted-foreground mt-1">Sur la base de 45 avis</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4">Actions Rapides</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-24 flex-col gap-2 bg-transparent"
              onClick={() => setActiveView("orders")}
            >
              <ShoppingBag className="h-6 w-6" />
              <span className="text-sm">Voir les commandes</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col gap-2 bg-transparent"
              onClick={() => setActiveView("menu")}
            >
              <MenuSquare className="h-6 w-6" />
              <span className="text-sm">Gérer le menu</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col gap-2 bg-transparent"
              onClick={() => setActiveView("images")}
            >
              <ImageIcon className="h-6 w-6" />
              <span className="text-sm">Ajouter des images</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col gap-2 bg-transparent"
              onClick={() => router.push("/dashboard/settings")}
            >
              <Store className="h-6 w-6" />
              <span className="text-sm">Paramètres</span>
            </Button>
          </div>
        </div>

        {/* Restaurant Profile Card */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Store className="h-24 w-24 text-muted-foreground/30" />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">Profil Restaurant</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Nom de la carte de déplacement</p>
                <p className="font-medium">{(userData as any)?.businessName || "Non défini"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Photo de couverture</p>
                <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                  Changer image
                </Button>
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent" onClick={() => setActiveView("profile")}>
                Modifier les détails
              </Button>
            </div>
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
                <span className="text-xs text-muted-foreground hidden sm:block">Portail Vendeur</span>
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
              variant={activeView === "images" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveView("images")}
            >
              <ImageIcon className="h-4 w-4 mr-3" />
              Gestion Menu
            </Button>
            <Button
              variant={activeView === "menu" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveView("menu")}
            >
              <MenuSquare className="h-4 w-4 mr-3" />
              Menus
            </Button>
            <Button
              variant={activeView === "orders" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveView("orders")}
            >
              <ShoppingBag className="h-4 w-4 mr-3" />
              Commandes
            </Button>
            <Button
              variant={activeView === "profile" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveView("profile")}
            >
              <Store className="h-4 w-4 mr-3" />
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
                <p className="text-xs text-muted-foreground">Vendeur</p>
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
          {activeView === "images" && <ImageUpload />}
          {activeView === "menu" && <MenuManagement />}
          {activeView === "orders" && <VendorOrders />}
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
            variant={activeView === "images" ? "default" : "ghost"}
            size="sm"
            className="flex-col h-auto py-2 gap-1"
            onClick={() => setActiveView("images")}
          >
            <ImageIcon className="h-5 w-5" />
            <span className="text-xs">Images</span>
          </Button>
          <Button
            variant={activeView === "menu" ? "default" : "ghost"}
            size="sm"
            className="flex-col h-auto py-2 gap-1"
            onClick={() => setActiveView("menu")}
          >
            <MenuSquare className="h-5 w-5" />
            <span className="text-xs">Menu</span>
          </Button>
          <Button
            variant={activeView === "orders" ? "default" : "ghost"}
            size="sm"
            className="flex-col h-auto py-2 gap-1"
            onClick={() => setActiveView("orders")}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="text-xs">Commandes</span>
          </Button>
          <Button
            variant={activeView === "profile" ? "default" : "ghost"}
            size="sm"
            className="flex-col h-auto py-2 gap-1"
            onClick={() => setActiveView("profile")}
          >
            <Store className="h-5 w-5" />
            <span className="text-xs">Profil</span>
          </Button>
        </div>
      </nav>
    </div>
  )
}
