"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Store, Truck, Shield, TrendingUp, ShoppingCart, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Stats {
  totalClients: number
  totalVendors: number
  totalDelivery: number
  totalSubAdmins: number
  pendingUsers: number
  ordersToday: number
  ordersThisWeek: number
  totalRevenue: number
  activeVendors: number
  availableDelivery: number
}

interface RecentActivity {
  id: string
  type: string
  description: string
  timestamp: Date
  status?: string
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats>({
    totalClients: 0,
    totalVendors: 0,
    totalDelivery: 0,
    totalSubAdmins: 0,
    pendingUsers: 0,
    ordersToday: 0,
    ordersThisWeek: 0,
    totalRevenue: 0,
    activeVendors: 0,
    availableDelivery: 0,
  })
  const [recentOrders, setRecentOrders] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOverviewData()
  }, [])

  async function fetchOverviewData() {
    try {
      setLoading(true)
      const supabase = createClient()

      console.log("[v0] Fetching admin overview data")

      const { data: users, error: usersError } = await supabase.from("users").select("role, status, is_active")

      if (usersError) throw usersError

      const clientCount = users?.filter((u) => u.role === "client").length || 0
      const vendorCount = users?.filter((u) => u.role === "vendor").length || 0
      const deliveryCount = users?.filter((u) => u.role === "delivery").length || 0
      const subAdminCount = users?.filter((u) => u.role === "sub-admin").length || 0
      const pendingCount = users?.filter((u) => u.status === "pending").length || 0

      const { data: activeVendors, error: vendorsError } = await supabase
        .from("vendor_profiles")
        .select("user_id")
        .eq("images_approved", true)

      const { data: availableDelivery, error: deliveryError } = await supabase
        .from("delivery_profiles")
        .select("user_id")
        .eq("is_available", true)

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const { data: ordersToday, error: ordersTodayError } = await supabase
        .from("orders")
        .select("id, total_amount")
        .gte("created_at", today.toISOString())

      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)

      const { data: ordersWeek, error: ordersWeekError } = await supabase
        .from("orders")
        .select("id, total_amount, status")
        .gte("created_at", weekAgo.toISOString())

      const totalRevenue =
        ordersWeek?.reduce(
          (sum, order) => (order.status === "delivered" ? sum + Number(order.total_amount) : sum),
          0,
        ) || 0

      const { data: recentOrdersData, error: recentError } = await supabase
        .from("orders")
        .select(`
          id,
          status,
          total_amount,
          created_at,
          client:users!orders_client_id_fkey(first_name, last_name),
          vendor:users!orders_vendor_id_fkey(first_name, last_name)
        `)
        .order("created_at", { ascending: false })
        .limit(10)

      const activities: RecentActivity[] =
        recentOrdersData?.map((order: any) => ({
          id: order.id,
          type: "order",
          description: `${order.client.first_name} ${order.client.last_name} a commandé chez ${order.vendor.first_name} ${order.vendor.last_name} - ${Number(order.total_amount).toFixed(2)} FCFA`,
          timestamp: new Date(order.created_at),
          status: order.status,
        })) || []

      setStats({
        totalClients: clientCount,
        totalVendors: vendorCount,
        totalDelivery: deliveryCount,
        totalSubAdmins: subAdminCount,
        pendingUsers: pendingCount,
        ordersToday: ordersToday?.length || 0,
        ordersThisWeek: ordersWeek?.length || 0,
        totalRevenue,
        activeVendors: activeVendors?.length || 0,
        availableDelivery: availableDelivery?.length || 0,
      })

      setRecentOrders(activities)

      console.log("[v0] Overview data loaded:", stats)
    } catch (error) {
      console.error("[v0] Error fetching overview data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Vue d'ensemble</h1>
          <p className="text-muted-foreground">Dashboard administrateur CampusEats</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {stats.pendingUsers > 0 && (
            <Link href="/dashboard/admin/pending-users" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full bg-transparent">
                <AlertCircle className="mr-2 h-4 w-4" />
                {stats.pendingUsers} en attente
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">Utilisateurs actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Vendeurs</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVendors}</div>
            <p className="text-xs text-muted-foreground">{stats.activeVendors} actifs avec images approuvées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Livreurs</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDelivery}</div>
            <p className="text-xs text-muted-foreground">{stats.availableDelivery} disponibles maintenant</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sous-admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubAdmins}</div>
            <p className="text-xs text-muted-foreground">Administrateurs secondaires</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Commandes aujourd'hui</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ordersToday}</div>
            <p className="text-xs text-muted-foreground">Nouvelles commandes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Commandes cette semaine</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ordersThisWeek}</div>
            <p className="text-xs text-muted-foreground">7 derniers jours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenu total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)} FCFA</div>
            <p className="text-xs text-muted-foreground">Commandes livrées cette semaine</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
          <CardDescription>Dernières commandes sur la plateforme</CardDescription>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">Aucune activité récente</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((activity) => (
                <div
                  key={activity.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 last:border-0"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium break-words">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.timestamp.toLocaleDateString("fr-FR")} à{" "}
                      {activity.timestamp.toLocaleTimeString("fr-FR")}
                    </p>
                  </div>
                  <Badge
                    variant={
                      activity.status === "delivered"
                        ? "default"
                        : activity.status === "cancelled"
                          ? "destructive"
                          : "secondary"
                    }
                    className="self-start sm:self-center"
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/dashboard/admin/users" className="block">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base">Gérer les utilisateurs</CardTitle>
              <CardDescription>Voir et gérer tous les utilisateurs</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/admin/pending-users" className="block">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                Utilisateurs en attente
                {stats.pendingUsers > 0 && <Badge variant="destructive">{stats.pendingUsers}</Badge>}
              </CardTitle>
              <CardDescription>Approuver ou rejeter les demandes</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/admin/sub-admins" className="block">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base">Gérer les sous-admins</CardTitle>
              <CardDescription>Créer et gérer les administrateurs secondaires</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}
