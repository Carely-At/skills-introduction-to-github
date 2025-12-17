"use client"

import { useState } from "react"
import { useAuth } from "@/lib/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  UtensilsCrossed,
  ShoppingBag,
  Bell,
  User,
  MapPin,
  Sparkles,
  Clock,
  Star,
  Phone,
  MessageCircle,
  Truck,
  Home,
  Settings,
  LogOut,
} from "lucide-react"
import { signOut } from "@/lib/supabase/auth"
import { useRouter } from "next/navigation"
import { MenuBrowser } from "./menu-browser"
import { OrderHistory } from "./order-history"
import { Cart } from "./cart"
import { formatCurrency } from "@/lib/utils/currency"
import Link from "next/link"

export function ClientDashboard() {
  const { userData } = useAuth()
  const router = useRouter()
  const [activeView, setActiveView] = useState<"home" | "menu" | "orders" | "cart" | "profile">("home")
  const [searchQuery, setSearchQuery] = useState("")
  const [cartItems, setCartItems] = useState<any[]>([])

  console.log("[v0] ClientDashboard rendering, userData:", userData)

  const handleSignOut = async () => {
    console.log("[v0] Client signing out")
    await signOut()
    router.push("/login")
  }

  const addToCart = (item: any) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setCartItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, quantity } : i)))
  }

  if (!userData) {
    console.log("[v0] ClientDashboard: userData not available yet")
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const renderHomeView = () => {
    return (
      <div className="space-y-6">
        {/* Greeting Card */}
        <div className="bg-gradient-to-br from-primary via-primary to-accent rounded-3xl p-6 sm:p-8 text-primary-foreground shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Bienvenue, {userData?.firstName}</h2>
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <Clock className="h-4 w-4" />
              <p className="text-sm sm:text-base">Vous êtes EN LIGNE et recevez des commandes.</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="mt-4 bg-white/20 hover:bg-white/30 text-primary-foreground border-white/20"
              onClick={() => router.push("/dashboard/cart")}
            >
              Voir la carte de chaleur
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-soft transition-smooth">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-500/10">
                <UtensilsCrossed className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Revenus du jour</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(84.5)}</p>
            <p className="text-xs text-green-600 font-medium mt-1">+14%</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-soft transition-smooth">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <ShoppingBag className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Livraisons terminées</span>
            </div>
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-blue-600 font-medium mt-1">+4</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-soft transition-smooth">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Temps actif</span>
            </div>
            <p className="text-2xl font-bold">3h 20m</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-soft transition-smooth">
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

        {/* Current Order Section */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Ma Commande en Cours</h3>
            <Link href="#" className="text-sm text-primary font-medium hover:underline">
              EN LIVRAISON
            </Link>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-muted overflow-hidden flex-shrink-0">
                <img src="/classic-beef-burger.png" alt="Le Burger Étudiant" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground mb-1">EN COURS</p>
                <h4 className="font-semibold mb-1">Le Burger Étudiant</h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>Bâtiment Étudiant, Restauration</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">{formatCurrency(12.5)}</p>
                <p className="text-xs text-muted-foreground">12:45</p>
                <p className="text-xs text-muted-foreground">Aujourd'hui</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-2/3 rounded-full transition-all" />
              </div>
              <span className="text-xs font-medium text-primary">En cuisine</span>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent">
                <Phone className="h-4 w-4 mr-2" />
                Appeler
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </Button>
            </div>
          </div>
        </div>

        {/* Special Offers */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Offres Spéciales</h3>
            <Button variant="ghost" size="sm" className="text-primary font-medium">
              Voir tout →
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                PROMO
              </div>
              <div className="relative z-10">
                <Sparkles className="h-8 w-8 mb-3" />
                <h4 className="text-xl font-bold mb-2">Menu Tacos -20%</h4>
                <p className="text-sm text-white/90 mb-4">Valable jusqu'au 31 janvier sur le campus</p>
                <Button variant="secondary" size="sm" className="bg-white text-blue-700 hover:bg-white/90">
                  En profiter
                </Button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                LIVRAISON
              </div>
              <div className="relative z-10">
                <Truck className="h-8 w-8 mb-3" />
                <h4 className="text-xl font-bold mb-2">Frais offerts</h4>
                <p className="text-sm text-white/90 mb-4">Sur votre prochain repas ce weekend</p>
                <Button variant="secondary" size="sm" className="bg-white text-orange-700 hover:bg-white/90">
                  Voir les restos
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurants à proximité */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Restaurants à proximité</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs bg-transparent">
                Tous
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                Sur le campus
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                Hors campus
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                Favori
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: "Sushi Campus",
                time: "20-30 min",
                rating: 4.8,
                image: "/assorted-sushi-platter.png",
              },
              {
                name: "Mama Pizza",
                time: "15-20 min",
                rating: 4.9,
                image: "/delicious-pizza.png",
              },
              {
                name: "Le Bistrot B...",
                time: "10-14 min",
                rating: 4.2,
                image: "/classic-beef-burger.png",
              },
            ].map((restaurant, index) => (
              <button
                key={index}
                onClick={() => setActiveView("menu")}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-soft-lg transition-smooth text-left"
              >
                <div className="relative h-32 bg-muted overflow-hidden">
                  <img
                    src={restaurant.image || "/placeholder.svg"}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {restaurant.time}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold mb-1 group-hover:text-primary transition-colors">{restaurant.name}</h4>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium">{restaurant.rating}</span>
                    <span className="text-muted-foreground">★</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Commentaires Récents</h3>
            <Button variant="ghost" size="sm" className="text-primary font-medium">
              Voir tout →
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[
              {
                name: "Sarah M.",
                time: "Il y a 2h",
                rating: 5,
                comment: "L'excitation pour repas rapide et la nourriture était encore chaude ! Merci Alex !",
                restaurant: "Le Bistro",
                badges: ["RAPIDE", "5 ÉTOILES"],
              },
              {
                name: "Mike T.",
                time: "il y a 45m",
                rating: 3,
                comment: "L'attention livrer était bonne mais est arrivés tarde. Dommage car les saveurs sum i...",
                restaurant: "Sushi World",
                badges: [],
              },
            ].map((review, index) => (
              <div key={index} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{review.name}</p>
                      <p className="text-xs text-muted-foreground">{review.time}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{review.comment}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-primary">{review.restaurant}</span>
                  {review.badges.map((badge, i) => (
                    <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Main render with navigation
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50 safe-area-top">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
                <UtensilsCrossed className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold hidden sm:block">CampusEats</span>
            </div>

            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher un resto, un repas ou un article..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
              </Button>
              <Button variant="ghost" size="icon" className="relative" onClick={() => setActiveView("cart")}>
                <ShoppingBag className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/settings")}>
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Side Navigation */}
      <div className="flex">
        <aside className="hidden lg:flex lg:w-64 border-r border-border bg-card min-h-[calc(100vh-73px)] flex-col p-4">
          <nav className="space-y-2 flex-1">
            <Button
              variant={activeView === "home" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveView("home")}
            >
              <Home className="h-4 w-4 mr-3" />
              Accueil
            </Button>
            <Button
              variant={activeView === "menu" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveView("menu")}
            >
              <UtensilsCrossed className="h-4 w-4 mr-3" />
              Restaurants
            </Button>
            <Button
              variant={activeView === "orders" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveView("orders")}
            >
              <Clock className="h-4 w-4 mr-3" />
              Mes Commandes
            </Button>
            <Button
              variant={activeView === "profile" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveView("profile")}
            >
              <User className="h-4 w-4 mr-3" />
              Mon Profil
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
                <p className="text-xs text-muted-foreground">Client</p>
              </div>
            </div>
            <Button variant="outline" className="w-full bg-transparent" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Se déconnecter
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 safe-area-bottom">
          {activeView === "home" && renderHomeView()}
          {activeView === "menu" && <MenuBrowser searchQuery={searchQuery} onAddToCart={addToCart} />}
          {activeView === "orders" && <OrderHistory />}
          {activeView === "cart" && (
            <Cart
              items={cartItems}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
              onClearCart={() => setCartItems([])}
            />
          )}
          {activeView === "profile" && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Mon Profil</h2>
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
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-bottom z-50">
        <div className="grid grid-cols-5 gap-1 p-2">
          <Button
            variant={activeView === "home" ? "default" : "ghost"}
            size="sm"
            className="flex-col h-auto py-2 gap-1"
            onClick={() => setActiveView("home")}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Accueil</span>
          </Button>
          <Button
            variant={activeView === "menu" ? "default" : "ghost"}
            size="sm"
            className="flex-col h-auto py-2 gap-1"
            onClick={() => setActiveView("menu")}
          >
            <UtensilsCrossed className="h-5 w-5" />
            <span className="text-xs">Restaurants</span>
          </Button>
          <Button
            variant={activeView === "orders" ? "default" : "ghost"}
            size="sm"
            className="flex-col h-auto py-2 gap-1"
            onClick={() => setActiveView("orders")}
          >
            <Clock className="h-5 w-5" />
            <span className="text-xs">Commandes</span>
          </Button>
          <Button
            variant={activeView === "cart" ? "default" : "ghost"}
            size="sm"
            className="flex-col h-auto py-2 gap-1 relative"
            onClick={() => setActiveView("cart")}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="text-xs">Panier</span>
            {cartItems.length > 0 && (
              <span className="absolute top-1 right-2 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
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
