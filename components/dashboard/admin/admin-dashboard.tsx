"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UtensilsCrossed, LogOut, UserPlus, Users, Store, Truck, User } from "lucide-react"
import { signOut } from "@/lib/supabase/auth"
import { useRouter } from "next/navigation"
import { CreateUserForm } from "./create-user-form"
import { UsersList } from "./users-list"
import { VendorApprovalList } from "./vendor-approval-list"
import { createClient } from "@/lib/supabase/client"

export function AdminDashboard() {
  const { userData } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("create")
  const [userCounts, setUserCounts] = useState({
    vendors: 0,
    delivery: 0,
    clients: 0,
  })

  console.log("[v0] AdminDashboard rendering, userData:", userData)

  const fetchUserCounts = async () => {
    try {
      const supabase = createClient()

      const { data: users, error } = await supabase.from("users").select("role")

      if (error) {
        console.error("[v0] Error fetching user counts:", error)
        return
      }

      const counts = {
        vendors: users?.filter((u) => u.role === "vendor").length || 0,
        delivery: users?.filter((u) => u.role === "delivery").length || 0,
        clients: users?.filter((u) => u.role === "client").length || 0,
      }

      console.log("[v0] User counts:", counts)
      setUserCounts(counts)
    } catch (error) {
      console.error("[v0] Error fetching user counts:", error)
    }
  }

  useEffect(() => {
    fetchUserCounts()
  }, [activeTab])

  const handleSignOut = async () => {
    console.log("[v0] Admin signing out")
    await signOut()
    router.push("/login")
  }

  if (!userData) {
    console.log("[v0] AdminDashboard: userData not available yet")
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
                Admin
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center gap-3 sm:gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/dashboard/settings")}
                  className="touch-target"
                >
                  <User className="h-4 w-4 lg:mr-2" />
                  <span className="hidden lg:inline">Paramètres</span>
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
              <div className="sm:hidden flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/settings")}>
                  <User className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 safe-area-bottom">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Tableau de bord administrateur</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gérez les utilisateurs et supervisez la plateforme CampusEats
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendeurs</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userCounts.vendors}</div>
              <p className="text-xs text-muted-foreground">Actifs sur la plateforme</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Livreurs</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userCounts.delivery}</div>
              <p className="text-xs text-muted-foreground">Disponibles</p>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 md:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userCounts.clients}</div>
              <p className="text-xs text-muted-foreground">Inscrits</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Gestion des utilisateurs</CardTitle>
            <CardDescription className="text-sm">Créez et gérez les comptes vendeurs et livreurs</CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 h-auto">
                <TabsTrigger
                  value="create"
                  className="text-xs sm:text-sm py-2 sm:py-2.5 flex-col sm:flex-row gap-1 sm:gap-2"
                >
                  <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Créer un utilisateur</span>
                  <span className="sm:hidden">Créer</span>
                </TabsTrigger>
                <TabsTrigger
                  value="users"
                  className="text-xs sm:text-sm py-2 sm:py-2.5 flex-col sm:flex-row gap-1 sm:gap-2"
                >
                  <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Liste des utilisateurs</span>
                  <span className="sm:hidden">Liste</span>
                </TabsTrigger>
                <TabsTrigger
                  value="approvals"
                  className="text-xs sm:text-sm py-2 sm:py-2.5 flex-col sm:flex-row gap-1 sm:gap-2"
                >
                  <Store className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Approbations</span>
                  <span className="sm:hidden">Approb.</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="create" className="space-y-4 mt-4 sm:mt-6">
                <CreateUserForm />
              </TabsContent>

              <TabsContent value="users" className="mt-4 sm:mt-6">
                <UsersList onUserDeleted={fetchUserCounts} />
              </TabsContent>

              <TabsContent value="approvals" className="mt-4 sm:mt-6">
                <VendorApprovalList />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
