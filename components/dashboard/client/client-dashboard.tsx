"use client"

import { useState } from "react"
import { useAuth } from "@/lib/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UtensilsCrossed, LogOut, ShoppingBag, Clock, User, Search } from "lucide-react"
import { signOut } from "@/lib/supabase/auth"
import { useRouter } from "next/navigation"
import { MenuBrowser } from "./menu-browser"
import { OrderHistory } from "./order-history"
import { Cart } from "./cart"

export function ClientDashboard() {
  const { userData } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("menu")
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50 safe-area-top">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 justify-between sm:justify-start">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
                <span className="text-lg sm:text-2xl font-bold">CampusEats</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="relative bg-transparent touch-target sm:hidden"
                onClick={() => setActiveTab("cart")}
              >
                <ShoppingBag className="h-4 w-4" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Button>
            </div>

            <div className="flex-1 max-w-full sm:max-w-md order-last sm:order-none">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 sm:h-11"
                />
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3 sm:gap-4">
              <Button
                variant="outline"
                size="sm"
                className="relative bg-transparent touch-target"
                onClick={() => setActiveTab("cart")}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                <span className="hidden lg:inline">Panier</span>
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Button>
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 sm:mb-8 w-full grid grid-cols-2 sm:grid-cols-4 h-auto">
            <TabsTrigger value="menu" className="text-xs sm:text-sm py-2 sm:py-2.5 flex-col sm:flex-row gap-1 sm:gap-2">
              <UtensilsCrossed className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Menu</span>
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="text-xs sm:text-sm py-2 sm:py-2.5 flex-col sm:flex-row gap-1 sm:gap-2"
            >
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Mes commandes</span>
              <span className="sm:hidden">Commandes</span>
            </TabsTrigger>
            <TabsTrigger value="cart" className="text-xs sm:text-sm py-2 sm:py-2.5 flex-col sm:flex-row gap-1 sm:gap-2">
              <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Panier</span>
              {cartItems.length > 0 && (
                <span className="ml-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="text-xs sm:text-sm py-2 sm:py-2.5 flex-col sm:flex-row gap-1 sm:gap-2"
            >
              <User className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Profil</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="menu">
            <MenuBrowser searchQuery={searchQuery} onAddToCart={addToCart} />
          </TabsContent>

          <TabsContent value="orders">
            <OrderHistory />
          </TabsContent>

          <TabsContent value="cart">
            <Cart
              items={cartItems}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
              onClearCart={() => setCartItems([])}
            />
          </TabsContent>

          <TabsContent value="profile">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Mon profil</h2>
              <div className="bg-card p-4 sm:p-6 rounded-lg border border-border space-y-4">
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
                <div className="sm:hidden pt-4">
                  <Button variant="outline" className="w-full touch-target bg-transparent" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
