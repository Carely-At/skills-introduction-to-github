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
  Search,
  ChevronRight,
  Coffee,
  IceCreamCone,
  ShoppingCart,
  Utensils,
} from "lucide-react"
import { signOut } from "@/lib/supabase/auth"
import { useRouter } from "next/navigation"
import { MenuBrowser } from "./menu-browser"
import { OrderHistory } from "./order-history"
import { Cart } from "./cart"
import { formatCurrency } from "@/lib/utils/currency"
import { cn } from "@/lib/utils"

export function ClientDashboard() {
  const { userData } = useAuth()
  const router = useRouter()
  const [activeView, setActiveView] = useState<"home" | "menu" | "orders" | "cart" | "profile">("home")
  const [searchQuery, setSearchQuery] = useState("")
  const [cartItems, setCartItems] = useState<any[]>([])

  const handleSignOut = async () => {
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
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Categories data
  const categories = [
    { label: "Food", icon: <UtensilsCrossed className="w-6 h-6" />, href: "#", active: true },
    { label: "Snacks", icon: <Coffee className="w-6 h-6" />, href: "#" },
    { label: "Drinks", icon: <IceCreamCone className="w-6 h-6" />, href: "#" },
    { label: "Groceries", icon: <ShoppingCart className="w-6 h-6" />, href: "#" },
    { label: "Services", icon: <Utensils className="w-6 h-6" />, href: "#" },
  ]

  // Featured restaurants
  const featuredRestaurants = [
    {
      id: "1",
      name: "Sushi Campus",
      image: "/assorted-sushi-platter.png",
      rating: 4.8,
      deliveryTime: "20-30 min",
      location: "Bâtiment A",
      category: "Japonais",
    },
    {
      id: "2",
      name: "Mama Pizza",
      image: "/delicious-pizza.png",
      rating: 4.9,
      deliveryTime: "15-20 min",
      location: "Campus Nord",
      category: "Italien",
    },
    {
      id: "3",
      name: "Le Bistrot B.",
      image: "/classic-beef-burger.png",
      rating: 4.2,
      deliveryTime: "10-15 min",
      location: "RDC Sciences",
      category: "Américain",
    },
  ]

  const renderHomeView = () => {
    return (
      <div className="space-y-8 pb-24 lg:pb-8">
        {/* Hero Slider */}
        <div className="relative">
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-4" style={{ width: "max-content" }}>
              {featuredRestaurants.map((restaurant) => (
                <button
                  key={restaurant.id}
                  onClick={() => setActiveView("menu")}
                  className="relative w-[85vw] sm:w-[400px] aspect-[16/9] rounded-2xl overflow-hidden group flex-shrink-0"
                >
                  <img
                    src={restaurant.image || "/placeholder.svg"}
                    alt={restaurant.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="badge-primary">{restaurant.category}</span>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-xl font-bold text-foreground mb-2">{restaurant.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-warning fill-warning" />
                        <span className="text-foreground font-medium">{restaurant.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{restaurant.location}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4">Catégories</h3>
          <div className="grid grid-cols-5 gap-3">
            {categories.map((cat, index) => (
              <button
                key={index}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200",
                  cat.active
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50",
                )}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    cat.active ? "bg-primary/20" : "bg-muted/50",
                  )}
                >
                  {cat.icon}
                </div>
                <span className="text-xs font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Promotions */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4">Offres Spéciales</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/80 to-primary p-6 glow-primary">
              <div className="absolute top-3 right-3 badge-accent">PROMO</div>
              <Sparkles className="h-8 w-8 text-primary-foreground mb-3" />
              <h4 className="text-xl font-bold text-primary-foreground mb-2">Menu Tacos -20%</h4>
              <p className="text-sm text-primary-foreground/80 mb-4">Tous les mardis sur le campus</p>
              <Button size="sm" className="bg-background text-foreground hover:bg-background/90">
                En profiter
              </Button>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent/80 to-accent p-6 glow-accent">
              <div className="absolute top-3 right-3 badge-primary">LIVRAISON</div>
              <Truck className="h-8 w-8 text-accent-foreground mb-3" />
              <h4 className="text-xl font-bold text-accent-foreground mb-2">Frais offerts</h4>
              <p className="text-sm text-accent-foreground/80 mb-4">{"Dès 15€ d'achat ce weekend"}</p>
              <Button size="sm" className="bg-background text-foreground hover:bg-background/90">
                Voir les restos
              </Button>
            </div>
          </div>
        </div>

        {/* Active Order Card */}
        <div className="card-dark p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground">Ma Commande en Cours</h3>
            <span className="badge-success">EN LIVRAISON</span>
          </div>

          <div className="flex gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
              <img src="/classic-beef-burger.png" alt="Order" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground">Le Burger Étudiant</h4>
              <p className="text-sm text-muted-foreground">Menu XL + Boisson</p>
              <p className="text-primary font-bold mt-1">{formatCurrency(12.5)}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">12:45</p>
              <p className="text-xs text-muted-foreground">Arrivée estimée</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Confirmée</span>
              <span>Préparation</span>
              <span className="text-primary font-medium">En route</span>
              <span>Livrée</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary w-3/4 rounded-full transition-all" />
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 btn-outline bg-transparent">
              <Phone className="h-4 w-4 mr-2" />
              Appeler
            </Button>
            <Button variant="outline" className="flex-1 btn-outline bg-transparent">
              <MessageCircle className="h-4 w-4 mr-2" />
              Message
            </Button>
          </div>
        </div>

        {/* Nearby Restaurants */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">Restaurants à proximité</h3>
            <Button variant="ghost" size="sm" className="text-primary">
              Voir tout
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-2">
            {["Tous", "Sur le campus", "Hors campus", "Favoris"].map((filter, index) => (
              <Button
                key={filter}
                variant={index === 0 ? "default" : "outline"}
                size="sm"
                className={cn("whitespace-nowrap", index === 0 ? "btn-primary" : "btn-outline")}
              >
                {filter}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredRestaurants.map((restaurant) => (
              <button
                key={restaurant.id}
                onClick={() => setActiveView("menu")}
                className="card-dark-hover overflow-hidden text-left"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={restaurant.image || "/placeholder.svg"}
                    alt={restaurant.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 badge-primary">{restaurant.category}</div>
                  <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium text-foreground">
                    {restaurant.deliveryTime}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-foreground mb-2">{restaurant.name}</h4>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-warning fill-warning" />
                      <span className="font-medium text-foreground">{restaurant.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{restaurant.location}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">Commandes Récentes</h3>
            <Button variant="ghost" size="sm" className="text-primary" onClick={() => setActiveView("orders")}>
              Voir tout
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="space-y-3">
            {[
              { name: "Sushi Campus", items: "2 articles", total: 18.5, time: "Hier" },
              { name: "Cafétéria Lettres", items: "1 article", total: 4.2, time: "12 Oct" },
              { name: "Burger King", items: "3 articles", total: 24.7, time: "10 Oct" },
            ].map((order, index) => (
              <div key={index} className="card-dark p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <UtensilsCrossed className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{order.name}</p>
                    <p className="text-xs text-muted-foreground">{order.items}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{formatCurrency(order.total)}</p>
                  <p className="text-xs text-muted-foreground">{order.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Help Card */}
        <div className="card-dark p-5 bg-highlight/10 border-highlight/30">
          <h4 className="font-bold text-foreground mb-2">{"Besoin d'aide ?"}</h4>
          <p className="text-sm text-muted-foreground mb-4">Un problème avec votre commande en cours ?</p>
          <Button variant="outline" className="btn-outline bg-transparent">
            Contacter le support
          </Button>
        </div>
      </div>
    )
  }

  const renderProfileView = () => {
    return (
      <div className="space-y-6 pb-24 lg:pb-8">
        {/* Profile Header */}
        <div className="card-dark p-6 text-center">
          <div className="w-24 h-24 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
            <User className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {userData?.firstName} {userData?.lastName}
          </h2>
          <p className="text-muted-foreground">{userData?.email}</p>
          <div className="mt-4">
            <span className="badge-primary">{userData?.campusId}</span>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card-dark p-4 text-center">
            <p className="text-2xl font-bold text-primary">12</p>
            <p className="text-xs text-muted-foreground">Commandes</p>
          </div>
          <div className="card-dark p-4 text-center">
            <p className="text-2xl font-bold text-accent">4.8</p>
            <p className="text-xs text-muted-foreground">Note moyenne</p>
          </div>
          <div className="card-dark p-4 text-center">
            <p className="text-2xl font-bold text-highlight">{formatCurrency(245)}</p>
            <p className="text-xs text-muted-foreground">Total dépensé</p>
          </div>
        </div>

        {/* Profile Menu */}
        <div className="card-dark overflow-hidden">
          {[
            { icon: <User className="w-5 h-5" />, label: "Informations personnelles" },
            { icon: <MapPin className="w-5 h-5" />, label: "Adresses de livraison" },
            { icon: <Bell className="w-5 h-5" />, label: "Notifications" },
            { icon: <Settings className="w-5 h-5" />, label: "Paramètres" },
          ].map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border last:border-0"
              onClick={() => router.push("/dashboard/settings")}
            >
              <div className="flex items-center gap-3">
                <div className="text-muted-foreground">{item.icon}</div>
                <span className="text-foreground">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full btn-outline text-destructive border-destructive/30 hover:bg-destructive/10 bg-transparent"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </Button>
      </div>
    )
  }

  // Sidebar items
  const sidebarItems = [
    { icon: <Home className="w-5 h-5" />, label: "Accueil", view: "home" as const },
    { icon: <UtensilsCrossed className="w-5 h-5" />, label: "Restaurants", view: "menu" as const },
    { icon: <Clock className="w-5 h-5" />, label: "Mes Commandes", view: "orders" as const },
    {
      icon: <ShoppingBag className="w-5 h-5" />,
      label: "Panier",
      view: "cart" as const,
      badge: cartItems.length || undefined,
    },
    { icon: <User className="w-5 h-5" />, label: "Mon Profil", view: "profile" as const },
  ]

  // Bottom nav items
  const bottomNavItems = [
    { icon: <Home className="w-5 h-5" />, label: "Accueil", view: "home" as const },
    { icon: <Search className="w-5 h-5" />, label: "Rechercher", view: "menu" as const },
    { icon: <ShoppingBag className="w-5 h-5" />, label: "Commandes", view: "orders" as const },
    { icon: <Bell className="w-5 h-5" />, label: "Notifs", view: "home" as const },
    { icon: <User className="w-5 h-5" />, label: "Profil", view: "profile" as const },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-40 hidden lg:flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold text-lg">CE</span>
            </div>
            <div>
              <h1 className="font-bold text-foreground">CampusEats</h1>
              <p className="text-xs text-muted-foreground">Étudiant</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="space-y-1 px-2">
            {sidebarItems.map((item) => (
              <button
                key={item.view}
                onClick={() => setActiveView(item.view)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  activeView === item.view
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
              >
                {item.icon}
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && <span className="badge-primary text-[10px]">{item.badge}</span>}
              </button>
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-50 glass-dark">
          <div className="container-responsive py-3">
            <div className="flex items-center justify-between">
              {/* Mobile logo */}
              <div className="flex items-center gap-2 lg:hidden">
                <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold">CE</span>
                </div>
              </div>

              {/* Search */}
              <div className="flex-1 max-w-md mx-4 hidden sm:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Rechercher un plat ou un resto..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 input-dark"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="relative w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>
                <button
                  onClick={() => setActiveView("cart")}
                  className="relative w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => router.push("/dashboard/settings")}
                  className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary hover:bg-primary/30 transition-all"
                >
                  <User className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="container-responsive py-6">
          {activeView === "home" && renderHomeView()}
          {activeView === "menu" && <MenuBrowser onAddToCart={addToCart} />}
          {activeView === "orders" && <OrderHistory />}
          {activeView === "cart" && (
            <Cart cartItems={cartItems} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} />
          )}
          {activeView === "profile" && renderProfileView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border safe-area-bottom z-50 lg:hidden">
        <div className="flex items-center justify-around py-2">
          {bottomNavItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setActiveView(item.view)}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-4 transition-all duration-200",
                activeView === item.view ? "text-primary" : "text-muted-foreground",
              )}
            >
              {item.icon}
              <span className="text-[10px] mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
