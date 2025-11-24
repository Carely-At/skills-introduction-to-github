"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/hooks/useAuth"
import type { Order } from "@/lib/types/order"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Package, MapPin, Phone, TrendingUp } from "lucide-react"
import { formatCFA } from "@/lib/utils/currency"

export function AvailableOrders() {
  const { userData } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAvailableOrders()
  }, [])

  const fetchAvailableOrders = async () => {
    try {
      // Récupérer les commandes prêtes pour la livraison sans livreur assigné
      const supabase = createClient()
      const { data, error } = await supabase.from("orders").select("*").eq("status", "ready").is("delivery_id", null)

      if (error) throw error

      // Convert snake_case to camelCase
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
    } catch (error) {
      console.error("Error fetching available orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const acceptOrder = async (orderId: string) => {
    if (!userData?.uid) return

    try {
      // Replaced Firestore with Supabase update
      const supabase = createClient()
      const { error } = await supabase
        .from("orders")
        .update({
          delivery_id: userData.uid,
          status: "delivering",
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId)

      if (error) throw error

      fetchAvailableOrders()
    } catch (error) {
      console.error("Error accepting order:", error)
      alert("Erreur lors de l'acceptation de la commande")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Aucune commande disponible</h3>
        <p className="text-muted-foreground">Les nouvelles commandes apparaîtront ici dès qu'elles seront prêtes</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Commandes disponibles</h2>
        <Badge variant="secondary" className="text-sm">
          {orders.length} commande{orders.length > 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {orders.map((order) => (
          <Card key={order.id} className="hover:shadow-lg transition-shadow">
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
                <Badge variant="default">Prête</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Client Info */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Client</p>
                  <p className="font-medium">{order.clientName}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <Phone className="h-3 w-3" />
                    {order.clientPhone}
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Adresse de livraison</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{order.deliveryAddress}</p>
                  </div>
                </div>

                <Separator />

                {/* Order Summary */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Résumé de la commande</p>
                  <div className="space-y-1">
                    {order.items.slice(0, 3).map((item, index) => (
                      <p key={index} className="text-sm">
                        {item.quantity}x {item.name}
                      </p>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-xs text-muted-foreground">+{order.items.length - 3} autre(s) article(s)</p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-lg font-bold text-primary">{formatCFA(order.totalAmount)}</span>
                </div>

                <Button className="w-full" onClick={() => acceptOrder(order.id)}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Accepter la livraison
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
