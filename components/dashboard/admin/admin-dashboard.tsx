"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/hooks/useAuth"
import { Button } from "@/components/ui/button"
import {
  UtensilsCrossed,
  LogOut,
  UserPlus,
  Users,
  Store,
  Truck,
  User,
  Home,
  Settings,
  Bell,
  Search,
  BarChart3,
  MessageSquare,
  FileText,
  CheckCircle,
  XCircle,
  TrendingUp,
  DollarSign,
} from "lucide-react"
import { signOut } from "@/lib/supabase/auth"
import { useRouter } from "next/navigation"
import { CreateUserForm } from "./create-user-form"
import { UsersList } from "./users-list"
import { VendorApprovalList } from "./vendor-approval-list"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency } from "@/lib/utils/currency"

export function AdminDashboard() {
  const { userData } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [userCounts, setUserCounts] = useState({
    vendors: 0,
    delivery: 0,
    clients: 0,
  })
  const [expandedMenu, setExpandedMenu] = useState<string | null>("gestion")

  const fetchUserCounts = async () => {
    try {
      const supabase = createClient()
      const { data: users, error } = await supabase.from("users").select("role")
      if (error) return
      const counts = {
        vendors: users?.filter((u) => u.role === "vendor").length || 0,
        delivery: users?.filter((u) => u.role === "delivery").length || 0,
        clients: users?.filter((u) => u.role === "client").length || 0,
      }
      setUserCounts(counts)
    } catch (error) {
      console.error("Error fetching user counts:", error)
    }
  }

  useEffect(() => {
    fetchUserCounts()
  }, [activeTab])

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

  const sidebarItems = [
    { id: "overview", label: "Vue d'ensemble", icon: Home },
    {
      id: "gestion",
      label: "GESTION",
      isSection: true,
      children: [
        { id: "users", label: "Utilisateurs", icon: Users },
        { id: "approvals", label: "Approbations", icon: CheckCircle, badge: 12 },
        { id: "vendors", label: "Vendeurs", icon: Store },
        { id: "delivery", label: "Livreurs", icon: Truck },
      ],
    },
    {
      id: "system",
      label: "SYSTÈME",
      isSection: true,
      children: [
        { id: "reports", label: "Rapports", icon: FileText },
        { id: "settings", label: "Paramètres", icon: Settings },
      ],
    },
  ]

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/10">
              <Store className="h-6 w-6 text-emerald-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-400 text-sm">
              <TrendingUp className="h-4 w-4" />
              +3%
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Vendeurs Actifs</p>
          <p className="text-3xl font-bold text-white">{userCounts.vendors}</p>
          <p className="text-xs text-gray-500 mt-1">cette semaine</p>
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 hover:border-orange-500/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-orange-500/10">
              <CheckCircle className="h-6 w-6 text-orange-400" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Approbations en Attente</p>
          <p className="text-3xl font-bold text-white">12</p>
          <p className="text-xs text-orange-400 mt-1">Action Requise - 4 urgentes</p>
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-blue-500/10">
              <DollarSign className="h-6 w-6 text-blue-400" />
            </div>
            <div className="flex items-center gap-1 text-red-400 text-sm">
              <TrendingUp className="h-4 w-4 rotate-180" />
              -0.5%
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Revenu Total</p>
          <p className="text-3xl font-bold text-white">{formatCurrency(15400)}</p>
          <p className="text-xs text-gray-500 mt-1">stable</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Approval Requests Table */}
        <div className="lg:col-span-2 bg-[#141414] border border-[#262626] rounded-xl overflow-hidden">
          <div className="p-5 border-b border-[#262626] flex items-center justify-between">
            <h3 className="font-semibold text-white">Demandes d'approbation</h3>
            <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300">
              Voir Toutes
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1a1a1a]">
                <tr className="text-left text-xs text-gray-500 uppercase">
                  <th className="px-4 py-3">Rôle</th>
                  <th className="px-4 py-3">Soumis Par</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                {[
                  { role: "Vendeur", user: "Sarah J.", date: "24 Oct 2023" },
                  { role: "Livreur", user: "Mike R.", date: "23 Oct 2023" },
                  { role: "Vendeur", user: "Sarah J.", date: "22 Oct 2023" },
                ].map((item, i) => (
                  <tr key={i} className="hover:bg-[#1a1a1a]">
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.role === "Vendeur" ? "bg-orange-500/10 text-orange-400" : "bg-blue-500/10 text-blue-400"
                        }`}
                      >
                        {item.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                          {item.user.charAt(0)}
                        </div>
                        <span className="text-sm text-white">{item.user}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{item.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-emerald-400 hover:bg-emerald-500/10"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:bg-red-500/10">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t border-[#262626] flex items-center justify-between text-sm">
            <span className="text-gray-500">Affichage de 3 sur 12 demandes</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="bg-transparent border-[#333] text-gray-400">
                Précédent
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent border-[#333] text-gray-400">
                Suivant
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-5">
            <h3 className="font-semibold text-white mb-4">Actions Rapides</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 bg-[#1a1a1a] border-[#262626] text-white hover:bg-[#262626]"
                onClick={() => setActiveTab("create")}
              >
                <UserPlus className="h-5 w-5" />
                <span className="text-xs">Ajouter Admin</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 bg-[#1a1a1a] border-[#262626] text-white hover:bg-[#262626]"
              >
                <FileText className="h-5 w-5" />
                <span className="text-xs">Rapports</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 bg-[#1a1a1a] border-[#262626] text-white hover:bg-[#262626]"
                onClick={() => setActiveTab("create")}
              >
                <Store className="h-5 w-5" />
                <span className="text-xs">Nouveau Vendeur</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 bg-[#1a1a1a] border-[#262626] text-white hover:bg-[#262626]"
              >
                <MessageSquare className="h-5 w-5" />
                <span className="text-xs">Support</span>
              </Button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Activité Récente</h3>
              <Button variant="ghost" size="sm" className="text-emerald-400 text-xs">
                Tout voir
              </Button>
            </div>
            <div className="space-y-3">
              {[
                {
                  icon: User,
                  text: "Inscription Client",
                  subtext: "Alex Johnson a rejoint il y a 2 min",
                  color: "blue",
                },
                {
                  icon: FileText,
                  text: "Rapport Système",
                  subtext: "Finances hebdo prêtes pour révision.",
                  color: "orange",
                },
                {
                  icon: Store,
                  text: "Vendeur Approuvé",
                  subtext: '"Taco Fiesta" est maintenant en ligne.',
                  color: "emerald",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-${item.color}-500/10`}>
                    <item.icon className={`h-4 w-4 text-${item.color}-400`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{item.text}</p>
                    <p className="text-xs text-gray-500">{item.subtext}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 fixed left-0 top-0 bottom-0 border-r border-[#1f1f1f] bg-[#0f0f0f] flex-col z-50">
        {/* Logo */}
        <div className="p-6 border-b border-[#1f1f1f]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <UtensilsCrossed className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">CampusEats</span>
              <p className="text-xs text-gray-500">Console Admin</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === "overview"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
            }`}
          >
            <Home className="h-5 w-5" />
            <span>Vue d'ensemble</span>
          </button>

          {/* GESTION Section */}
          <div className="pt-4">
            <p className="px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">GESTION</p>
            {[
              { id: "users", label: "Utilisateurs", icon: Users },
              { id: "approvals", label: "Approbations", icon: CheckCircle, badge: 12 },
              { id: "vendors", label: "Vendeurs", icon: Store },
              { id: "delivery", label: "Livreurs", icon: Truck },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* SYSTÈME Section */}
          <div className="pt-4">
            <p className="px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">SYSTÈME</p>
            {[
              { id: "reports", label: "Rapports", icon: BarChart3 },
              { id: "settings", label: "Paramètres", icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => (item.id === "settings" ? router.push("/dashboard/settings") : setActiveTab(item.id))}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-[#1f1f1f]">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#141414] mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold">
              {userData?.firstName?.charAt(0)}
              {userData?.lastName?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {userData?.firstName} {userData?.lastName}
              </p>
              <p className="text-xs text-gray-500">Admin Principal</p>
            </div>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-white" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0f0f0f]/95 backdrop-blur-xl border-b border-[#1f1f1f]">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <UtensilsCrossed className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-white">CampusEats Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-orange-500 rounded-full" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0 pb-20 lg:pb-0">
        <div className="p-4 lg:p-8">
          {/* Page Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {activeTab === "overview" && "Vue d'ensemble"}
                {activeTab === "users" && "Liste des Utilisateurs"}
                {activeTab === "approvals" && "Approbations"}
                {activeTab === "vendors" && "Vendeurs"}
                {activeTab === "delivery" && "Livreurs"}
                {activeTab === "create" && "Créer un utilisateur"}
                {activeTab === "reports" && "Rapports"}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {activeTab === "overview" && "Gérez et supervisez la plateforme CampusEats"}
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Rechercher commandes, utilis..."
                  className="pl-10 pr-4 py-2 bg-[#141414] border border-[#262626] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 w-64"
                />
              </div>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-orange-500 rounded-full" />
              </Button>
            </div>
          </div>

          {/* Content */}
          {activeTab === "overview" && renderOverview()}
          {activeTab === "users" && <UsersList onUserDeleted={fetchUserCounts} />}
          {activeTab === "approvals" && <VendorApprovalList />}
          {activeTab === "create" && <CreateUserForm />}
          {activeTab === "vendors" && <UsersList onUserDeleted={fetchUserCounts} />}
          {activeTab === "delivery" && <UsersList onUserDeleted={fetchUserCounts} />}
          {activeTab === "reports" && (
            <div className="text-center py-20">
              <BarChart3 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Rapports</h2>
              <p className="text-gray-500">Bientôt disponible</p>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f0f]/95 backdrop-blur-xl border-t border-[#1f1f1f] z-50">
        <div className="grid grid-cols-5 gap-1 p-2">
          {[
            { id: "overview", icon: Home, label: "Accueil" },
            { id: "users", icon: Users, label: "Utilisateurs" },
            { id: "approvals", icon: CheckCircle, label: "Approb." },
            { id: "create", icon: UserPlus, label: "Créer" },
            { id: "settings", icon: Settings, label: "Param." },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => (item.id === "settings" ? router.push("/dashboard/settings") : setActiveTab(item.id))}
              className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all ${
                activeTab === item.id ? "text-emerald-400 bg-emerald-500/10" : "text-gray-500 hover:text-gray-300"
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
