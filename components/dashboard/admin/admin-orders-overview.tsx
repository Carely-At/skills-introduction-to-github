"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Package, TrendingUp, Clock } from "lucide-react"
import type { Order, OrderStatus } from "@/lib/types/order"
import { formatCFA } from "@/lib/utils/currency"

export function AdminOrdersOverview() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "pending" | "active" | "delivered">("all")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items(*),
          client:users!orders_client_id_fkey(first_name, last_name),
          vendor:users!orders_vendor_id_fkey(first_name, last_name)
        `)
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) throw error

      const ordersData = data.map((order: any) => ({
        id: order.id,
        clientId: order.client_id,
        clientName: `${order.client.first_name} ${order.client.last_name}`,
        vendorId: order.vendor_id,
        vendorName: `${order.vendor.first_name} ${order.vendor.last_name}`,
        items: order.order_items,
        totalAmount: Number(order.total_amount),
        status: order.status,
        deliveryAddress: order.delivery_address,
        createdAt: new Date(order.created_at),
        updatedAt: new Date(order.updated_at),
      }))

      setOrders(ordersData)
    } catch (error) {
      console.error("[v0] Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getFilteredOrders = () => {
    switch (filter) {
      case "pending":
        return orders.filter((o) => o.status === "pending")
      case "active":
        return orders.filter((o) => ["confirmed", "preparing", "ready", "delivering"].includes(o.status))
      case "delivered":
        return orders.filter((o) => o.status === "delivered")
      default:
        return orders
    }
  }

  const getTotalRevenue = () => {
    return orders.filter((o) => o.status === "delivered").reduce((sum, order) => sum + order.totalAmount, 0)
  }

  const getStatusBadge = (status: OrderStatus) => {
    const config: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> =
      {
        pending: { label: "En attente", variant: "secondary" },
        confirmed: { label: "Confirmée", variant: "default" },
        preparing: { label: "En préparation", variant: "default" },
        ready: { label: "Prête", variant: "default" },
        delivering: { label: "En livraison", variant: "default" },
        delivered: { label: "Livrée", variant: "outline" },
        cancelled: { label: "Annulée", variant: "destructive" },
      }

    const { label, variant } = config[status]
    return <Badge variant={variant}>{label}</Badge>
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  const filteredOrders = getFilteredOrders()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commandes</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">Toutes les commandes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                orders.filter((o) => ["pending", "confirmed", "preparing", "ready", "delivering"].includes(o.status))
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">Commandes actives</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCFA(getTotalRevenue())}</div>
            <p className="text-xs text-muted-foreground">Commandes livrées</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aperçu des commandes</CardTitle>
          <CardDescription>Gérez toutes les commandes de la plateforme</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="active">Actives</TabsTrigger>
              <TabsTrigger value="delivered">Livrées</TabsTrigger>
            </TabsList>

            <TabsContent value={filter} className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucune commande trouvée</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">Commande #{order.id.slice(0, 8)}</CardTitle>
                          <CardDescription className="mt-1">
                            {order.createdAt?.toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </CardDescription>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Client:</span>
                            <p className="font-medium">{order.clientName}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Vendeur:</span>
                            <p className="font-medium">{order.vendorName}</p>
                          </div>
                        </div>

                        <Separator />

                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total</span>
                          <span className="text-lg font-bold text-primary">{formatCFA(order.totalAmount)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
