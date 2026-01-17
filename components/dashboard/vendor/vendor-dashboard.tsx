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
  Star,
  DollarSign,
  ChefHat,
  BarChart3,
  MessageSquare,
  Search,
} from "lucide-react"
import { signOut } from "@/lib/supabase/auth"
import { useRouter } from "next/navigation"
import { ImageUpload } from "./image-upload"
import { MenuManagement } from "./menu-management"
import { VendorOrders } from "./vendor-orders"
import { formatCurrency } from "@/lib/utils/currency"

export function VendorDashboard() {
  const { userData } = useAuth()
  const router = useRouter()
  const [activeView, setActiveView] = useState<
    "dashboard" | "images" | "menu" | "orders" | "profile" | "analytics" | "reviews"
  >("dashboard")
  const [isOpen, setIsOpen] = useState(true)

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  const navItems = [
    { id: "dashboard", label: "Tableau de Bord", icon: Home },
    { id: "orders", label: "Commandes", icon: ShoppingBag, badge: 3 },
    { id: "menu", label: "Gestion Menu", icon: MenuSquare },
    { id: "images", label: "Profil & Photos", icon: ImageIcon },
    { id: "analytics", label: "Analytique", icon: BarChart3 },
    { id: "reviews", label: "Avis", icon: MessageSquare },
  ]

  const renderDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/20 via-orange-600/10 to-transparent border border-orange-500/20 p-6 lg:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-emerald-400 text-sm font-medium">Ouvert</span>
              <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Tableau de Bord</h1>
            <p className="text-gray-400">
              Ravi de vous revoir, {(userData as any)?.businessName || `${userData?.firstName}`}.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 hover:border-emerald-500/30 transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                <ShoppingBag className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Commandes en cours</p>
            <p className="text-2xl font-bold text-white">12</p>
            <p className="text-xs text-emerald-400 mt-1">+2 nouvelles</p>
          </div>

          <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 hover:border-orange-500/30 transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
                <DollarSign className="h-5 w-5 text-orange-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Revenu du jour</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(450)}</p>
            <p className="text-xs text-emerald-400 mt-1">+15%</p>
          </div>

          <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 hover:border-purple-500/30 transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                <Star className="h-5 w-5 text-purple-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Note Moyenne</p>
            <p className="text-2xl font-bold text-white">4.8</p>
            <p className="text-xs text-purple-400 mt-1">+0.2</p>
          </div>

          <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 hover:border-blue-500/30 transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                <ChefHat className="h-5 w-5 text-blue-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Articles au Menu</p>
            <p className="text-2xl font-bold text-white">35</p>
            <p className="text-xs text-gray-500 mt-1">35 total</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-[#141414] border border-[#262626] rounded-xl overflow-hidden">
            <div className="p-5 border-b border-[#262626] flex items-center justify-between">
              <h3 className="font-semibold text-white">Commandes Entrantes</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                onClick={() => setActiveView("orders")}
              >
                Tout voir
              </Button>
            </div>
            <div className="divide-y divide-[#262626]">
              {[
                {
                  id: "#ORD-002",
                  client: "Sarah Lee",
                  items: "1x Wrap Végé...",
                  total: 12,
                  status: "Nouveau",
                  statusColor: "bg-emerald-500",
                },
                {
                  id: "#ORD-001",
                  client: "Alex Johnson",
                  items: "2x Cheesebur...",
                  total: 24.5,
                  status: "En Préparation",
                  statusColor: "bg-orange-500",
                },
                {
                  id: "#ORD-003",
                  client: "Mike Chen",
                  items: "1x Bol Poulet",
                  total: 16,
                  status: "Prêt",
                  statusColor: "bg-blue-500",
                },
              ].map((order) => (
                <div key={order.id} className="p-4 hover:bg-[#1a1a1a] transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm font-medium text-white">{order.id}</p>
                        <p className="text-xs text-gray-500">{order.client}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">{formatCurrency(order.total)}</p>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${order.statusColor} text-white`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Restaurant Profile Card */}
          <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden">
            <div className="h-32 bg-gradient-to-br from-orange-500/20 to-purple-500/20 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Store className="h-16 w-16 text-white/20" />
              </div>
              <Button size="sm" className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white text-xs">
                Changer Photo
              </Button>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-white mb-1">Profil Restaurant</h3>
              <p className="text-sm text-gray-500 mb-4">Photo de couverture</p>

              <div className="h-24 bg-[#1a1a1a] rounded-lg border border-dashed border-[#333] flex items-center justify-center mb-4">
                <p className="text-xs text-gray-500">Carte d'emplacement</p>
              </div>

              <Button
                variant="outline"
                className="w-full bg-transparent border-[#333] text-white hover:bg-[#1a1a1a]"
                onClick={() => setActiveView("images")}
              >
                Modifier les détails
              </Button>
            </div>
          </div>
        </div>

        {/* Popular Items */}
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Articles Populaires</h3>
            <Button
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => setActiveView("menu")}
            >
              + Ajouter un Article
            </Button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Double Chees...", price: 12.5, sales: 24, image: "/classic-beef-burger.png" },
              { name: "Assiette Poul...", price: 16, sales: 18, image: "/chicken-plate.jpg" },
              { name: "Bol de Pâtes É...", price: 11, sales: 0, image: "/pasta-bowl.jpg" },
              { name: "Part Pizza Pe...", price: 4.5, sales: 50, image: "/pizza-slice.png" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#1a1a1a] rounded-xl p-3 border border-[#262626] hover:border-[#333] transition-colors"
              >
                <div className="w-full h-20 rounded-lg bg-[#262626] mb-3 overflow-hidden">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-sm font-medium text-white truncate">{item.name}</p>
                <p className="text-xs text-gray-500">
                  {formatCurrency(item.price)} - {item.sales} commandes/auj.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Avis Récents</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-emerald-400 hover:text-emerald-300"
              onClick={() => setActiveView("reviews")}
            >
              Voir Tout
            </Button>
          </div>
          <div className="space-y-4">
            {[
              {
                name: "John Doe",
                rating: 5,
                comment: "Super burgers ! Les frites étaient un peu froides cependant.",
                time: "Il y a 2h",
              },
            ].map((review, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  {review.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white text-sm">{review.name}</span>
                    <span className="text-xs text-gray-500">{review.time}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-400">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 fixed left-0 top-0 bottom-0 border-r border-[#1f1f1f] bg-[#0f0f0f] flex-col z-50">
        {/* Logo */}
        <div className="p-6 border-b border-[#1f1f1f]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <UtensilsCrossed className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">CampusEats</span>
              <p className="text-xs text-gray-500">Portail Vendeur</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeView === item.id
                  ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                  : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">{item.badge}</span>
              )}
            </button>
          ))}

          <button
            onClick={() => router.push("/dashboard/settings")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-all"
          >
            <Settings className="h-5 w-5" />
            <span>Paramètres</span>
          </button>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-[#1f1f1f]">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#141414] mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-purple-500 flex items-center justify-center text-white font-bold">
              {userData?.firstName?.charAt(0)}
              {userData?.lastName?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {userData?.firstName} {userData?.lastName}
              </p>
              <p className="text-xs text-gray-500">Vendeur</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full bg-transparent border-[#262626] text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Se déconnecter
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0f0f0f]/95 backdrop-blur-xl border-b border-[#1f1f1f]">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <UtensilsCrossed className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-white">CampusEats</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-orange-500 rounded-full" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
              {userData?.firstName?.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0 pb-20 lg:pb-0">
        <div className="p-4 lg:p-8">
          {activeView === "dashboard" && renderDashboard()}
          {activeView === "images" && <ImageUpload />}
          {activeView === "menu" && <MenuManagement />}
          {activeView === "orders" && <VendorOrders />}
          {activeView === "analytics" && (
            <div className="text-center py-20">
              <BarChart3 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Analytique</h2>
              <p className="text-gray-500">Bientôt disponible</p>
            </div>
          )}
          {activeView === "reviews" && (
            <div className="text-center py-20">
              <MessageSquare className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Avis clients</h2>
              <p className="text-gray-500">Bientôt disponible</p>
            </div>
          )}
          {activeView === "profile" && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-6">Mon profil</h2>
              <div className="bg-[#141414] p-6 rounded-2xl border border-[#262626] space-y-4">
                <Button
                  variant="outline"
                  className="w-full bg-transparent border-[#333] text-white hover:bg-[#1a1a1a]"
                  onClick={() => router.push("/dashboard/settings")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Gérer ma photo de profil et paramètres
                </Button>
                <div>
                  <label className="text-sm font-medium text-gray-500">Nom de la cantine</label>
                  <p className="text-lg text-white">{(userData as any)?.businessName || "Non défini"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-lg text-white break-all">{userData?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">CampusID</label>
                  <p className="text-lg font-mono text-white">{userData?.campusId}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f0f]/95 backdrop-blur-xl border-t border-[#1f1f1f] z-50">
        <div className="grid grid-cols-5 gap-1 p-2">
          {[
            { id: "dashboard", icon: Home, label: "Accueil" },
            { id: "orders", icon: ShoppingBag, label: "Commandes" },
            { id: "menu", icon: MenuSquare, label: "Menu" },
            { id: "images", icon: ImageIcon, label: "Photos" },
            { id: "profile", icon: User, label: "Profil" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all ${
                activeView === item.id ? "text-orange-400 bg-orange-500/10" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
