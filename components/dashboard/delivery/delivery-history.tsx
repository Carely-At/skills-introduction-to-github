"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/hooks/useAuth"
import type { Order } from "@/lib/types/order"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Package, CheckCircle } from "lucide-react"
import { formatCFA } from "@/lib/utils/currency"

export function DeliveryHistory() {
  const { userData } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, earnings: 0 })

  useEffect(() => {
    fetchHistory()
  }, [userData])

  const fetchHistory = async () => {
    if (!userData?.uid) return

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("delivery_id", userData.uid)
        .eq("status", "delivered")
        .order("updated_at", { ascending: false })

      if (error) throw error

      const ordersData = (data || []).map((order: any) => ({
        id: order.id,
        clientId: order.client_id,
        clientName: order.client_name,
        clientPhone: order.client_phone,
        vendorId: order.vendor_id,
        deliveryId: order.delivery_id,
        items: order.items,
        totalAmount: order.total_amount,
        deliveryAddress: order.delivery_address,
        notes: order.notes,
        status: order.status,
        createdAt: new Date(order.created_at),
        updatedAt: new Date(order.updated_at),
      }))

      setOrders(ordersData)

      const totalDeliveries = ordersData.length
      const totalEarnings = ordersData.reduce((sum, order) => sum + order.totalAmount * 0.1, 0)

      setStats({ total: totalDeliveries, earnings: totalEarnings })
    } catch (error) {
      console.error("Error fetching delivery history:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Historique des livraisons</h2>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardDescription>Livraisons effectuées</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Gains estimés</CardDescription>
              <CardTitle className="text-3xl text-primary">{formatCFA(stats.earnings)}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucune livraison effectuée</h3>
          <p className="text-muted-foreground">Votre historique de livraisons apparaîtra ici</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">Commande #{order.id.slice(0, 8)}</CardTitle>
                    <CardDescription className="mt-1">
                      Livrée le{" "}
                      {order.updatedAt?.toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Livrée
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Client</span>
                    <span className="font-medium">{order.clientName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Adresse</span>
                    <span className="font-medium text-right max-w-xs">{order.deliveryAddress}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span className="font-semibold">Montant</span>
                    <span className="text-lg font-bold text-primary">{formatCFA(order.totalAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
