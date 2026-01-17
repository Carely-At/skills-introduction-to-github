"use client"

import { useState } from "react"
import { useAuth } from "@/lib/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  UtensilsCrossed,
  Package,
  Clock,
  User,
  CheckCircle,
  Home,
  Settings,
  Bell,
  Star,
  DollarSign,
  MapPin,
  Phone,
  MessageSquare,
  Bike,
} from "lucide-react"
import { signOut } from "@/lib/supabase/auth"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AvailableOrders } from "./available-orders"
import { MyDeliveries } from "./my-deliveries"
import { DeliveryHistory } from "./delivery-history"
import { formatCurrency } from "@/lib/utils/currency"

export function DeliveryDashboard() {
  const { userData } = useAuth()
  const router = useRouter()
  const [activeView, setActiveView] = useState<
    "dashboard" | "available" | "active" | "history" | "profile" | "planning"
  >("dashboard")
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
    }
  }

  const navItems = [
    { id: "dashboard", label: "Tableau de bord", icon: Home },
    { id: "available", label: "Revenus", icon: DollarSign },
    { id: "planning", label: "Planning", icon: Clock },
    { id: "active", label: "Paramètres", icon: Settings },
  ]

  const renderDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Status Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/20 via-blue-600/10 to-transparent border border-blue-500/20 p-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Bienvenue, {userData?.firstName}</h1>
              <div className="flex items-center gap-2">
                {isAvailable ? (
                  <>
                    <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-sm text-emerald-400">Vous êtes EN LIGNE et recevez des commandes.</span>
                  </>
                ) : (
                  <>
                    <div className="h-2 w-2 bg-red-400 rounded-full" />
                    <span className="text-sm text-red-400">Vous êtes HORS LIGNE</span>
                  </>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              className="bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
              onClick={() => {}}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Voir la carte de chaleur
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 hover:border-emerald-500/30 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <DollarSign className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Revenus du jour</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(84.5)}</p>
            <p className="text-xs text-emerald-400 mt-1">+12%</p>
          </div>

          <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 hover:border-blue-500/30 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Package className="h-5 w-5 text-blue-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Livraisons terminées</p>
            <p className="text-2xl font-bold text-white">12</p>
            <p className="text-xs text-blue-400 mt-1">+4</p>
          </div>

          <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 hover:border-orange-500/30 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Clock className="h-5 w-5 text-orange-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Temps actif</p>
            <p className="text-2xl font-bold text-white">3h 20m</p>
          </div>

          <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 hover:border-purple-500/30 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Star className="h-5 w-5 text-purple-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Note livreur</p>
            <p className="text-2xl font-bold text-white">4.9</p>
            <p className="text-xs text-emerald-400 mt-1">+0.1</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Current Task */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden">
              <div className="p-4 border-b border-[#262626] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">Tâche en cours</h3>
                  <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                    15 min restantes
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex gap-4">
                  {/* Map Preview */}
                  <div className="w-32 h-32 rounded-xl bg-[#1a1a1a] border border-[#262626] overflow-hidden flex-shrink-0">
                    <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-emerald-500/10 flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-gray-600" />
                    </div>
                    <p className="text-xs text-gray-500 text-center -mt-6">1.9 km de la destination</p>
                  </div>

                  {/* Order Details */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full">
                        EN COURS
                      </span>
                      <span className="text-xs text-gray-500">#3920</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Burger King</h4>
                    <div className="space-y-1 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-500" />
                        <span>RETRAIT</span>
                      </div>
                      <p className="text-xs">Bâtiment Étudiant, Restauration</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-400" />
                        <span>LIVRAISON</span>
                      </div>
                      <p className="text-xs">Hall Nord, Salle 304</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Articles: 2x Menu Whopper, 1x Grand Coca</p>
                    <div className="flex items-center gap-2 mt-4">
                      <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                        Mettre à jour le statut
                      </Button>
                      <Button variant="outline" size="icon" className="bg-transparent border-[#333]">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="bg-transparent border-[#333]">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Incoming Requests */}
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-4">
              <h3 className="font-semibold text-white mb-4">Demandes entrantes</h3>
              <div className="space-y-3">
                {[
                  { name: "Panda Express", distance: "2.2 km", price: 6.5 },
                  { name: "Starbucks", distance: "1.2 km", price: 4.25 },
                ].map((request, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-xl border border-[#262626]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                        <Bike className="h-5 w-5 text-orange-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">{request.name}</p>
                        <p className="text-xs text-gray-500">
                          {request.distance} - {formatCurrency(request.price)} est.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent border-[#333] text-gray-400 hover:text-white"
                      >
                        Refuser
                      </Button>
                      <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                        Accepter
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Recent Reviews */}
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Commentaires récents</h3>
                <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                  Voir tout
                </Button>
              </div>
              <div className="text-center py-4">
                <div className="text-4xl font-bold text-white mb-1">4.9</div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-500">Basé sur les 50 dernières livraisons</p>
              </div>
              <div className="space-y-3 mt-4">
                {[
                  {
                    name: "Sarah M.",
                    comment: '"Livraison super rapide et la nourriture était encore chaude ! Merci Alex."',
                    tags: ["RAPIDE", "SYMPA"],
                    time: "Il y a 3h",
                  },
                  { name: "Mike T.", comment: '"Instructions de livraison suivies à la lettre."', time: "1h+" },
                ].map((review, i) => (
                  <div key={i} className="p-3 bg-[#1a1a1a] rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white text-sm">{review.name}</span>
                      <span className="text-xs text-gray-500">{review.time}</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{review.comment}</p>
                    {review.tags && (
                      <div className="flex gap-1">
                        {review.tags.map((tag, j) => (
                          <span key={j} className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Today's History */}
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Historique du jour</h3>
              </div>
              <div className="space-y-2">
                {[
                  { name: "Subway", time: "11h58", price: 8.5 },
                  { name: "Taco Bell", time: "10h45", price: 6.25 },
                  { name: "Chick-fil-A", time: "10h15", price: 9.0 },
                  { name: "McDonald's", time: "09h30", price: 5.5 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                      <div>
                        <p className="text-sm font-medium text-white">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.time}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-white">{formatCurrency(item.price)}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent border-[#333] text-gray-400">
                Voir l'historique complet
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Desktop Header */}
      <header className="hidden lg:flex fixed top-0 left-0 right-0 z-50 bg-[#0f0f0f]/95 backdrop-blur-xl border-b border-[#1f1f1f]">
        <div className="flex items-center justify-between w-full px-6 py-3">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <UtensilsCrossed className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-white">CampusEats Livreur</span>
            </div>
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeView === item.id || (item.id === "dashboard" && activeView === "dashboard")
                      ? "text-blue-400 bg-blue-500/10"
                      : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {/* Availability Toggle */}
            <div className="flex items-center gap-3 bg-[#141414] px-4 py-2 rounded-xl border border-[#262626]">
              <Label htmlFor="avail" className="text-sm text-gray-400 cursor-pointer">
                {isAvailable ? "En ligne" : "Hors ligne"}
              </Label>
              <Switch id="avail" checked={isAvailable} onCheckedChange={toggleAvailability} />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent border-[#333] text-gray-400"
              onClick={handleSignOut}
            >
              Se déconnecter
            </Button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
              {userData?.firstName?.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0f0f0f]/95 backdrop-blur-xl border-b border-[#1f1f1f]">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <UtensilsCrossed className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-white">CampusEats Livreur</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white relative">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
              {userData?.firstName?.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen pt-16 lg:pt-16 pb-20 lg:pb-8">
        <div className="p-4 lg:p-8">
          {activeView === "dashboard" && renderDashboard()}
          {activeView === "available" && <AvailableOrders />}
          {activeView === "active" && <MyDeliveries />}
          {activeView === "history" && <DeliveryHistory />}
          {activeView === "planning" && (
            <div className="text-center py-20">
              <Clock className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Planning</h2>
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
                  Paramètres du compte
                </Button>
                <div>
                  <label className="text-sm font-medium text-gray-500">Nom complet</label>
                  <p className="text-lg text-white">
                    {userData?.firstName} {userData?.lastName}
                  </p>
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
            { id: "available", icon: Package, label: "Dispo" },
            { id: "active", icon: Clock, label: "Actif" },
            { id: "history", icon: CheckCircle, label: "Historique" },
            { id: "profile", icon: User, label: "Profil" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all ${
                activeView === item.id ? "text-blue-400 bg-blue-500/10" : "text-gray-500 hover:text-gray-300"
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
