"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/hooks/useAuth"
import type { Order } from "@/lib/types/order"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Package, MapPin, Phone, CheckCircle, Navigation } from "lucide-react"
import { formatCFA } from "@/lib/utils/currency"

export function MyDeliveries() {
  const { userData } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyDeliveries()
  }, [userData])

  const fetchMyDeliveries = async () => {
    if (!userData?.uid) return

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("delivery_id", userData.uid)
        .eq("status", "delivering")

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
    } catch (error) {
      console.error("Error fetching my deliveries:", error)
    } finally {
      setLoading(false)
    }
  }

  const completeDelivery = async (orderId: string) => {
    if (!userData?.uid) return

    if (!confirm("Confirmer que la livraison est terminée ?")) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("orders")
        .update({
          status: "delivered",
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId)

      if (error) throw error

      fetchMyDeliveries()
    } catch (error) {
      console.error("Error completing delivery:", error)
      alert("Erreur lors de la finalisation de la livraison")
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
        <h3 className="text-lg font-semibold mb-2">Aucune livraison en cours</h3>
        <p className="text-muted-foreground">Acceptez une commande depuis l'onglet "Commandes disponibles"</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mes livraisons en cours</h2>
        <Badge variant="default" className="text-sm">
          {orders.length} en cours
        </Badge>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="border-primary">
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
                <Badge variant="default">
                  <Navigation className="h-3 w-3 mr-1" />
                  En livraison
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Client Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Client</p>
                    <p className="font-medium">{order.clientName}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <Phone className="h-3 w-3" />
                      <a href={`tel:${order.clientPhone}`} className="hover:underline">
                        {order.clientPhone}
                      </a>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Adresse de livraison</p>
                    <div className="flex items-start gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{order.deliveryAddress}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Order Items */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Articles à livrer :</p>
                  <ul className="space-y-1">
                    {order.items.map((item, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-medium">{formatCFA(item.price * item.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {order.notes && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Notes :</p>
                      <p className="text-sm">{order.notes}</p>
                    </div>
                  </>
                )}

                <Separator />

                {/* Total and Action */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-lg font-bold text-primary">{formatCFA(order.totalAmount)}</span>
                  </div>

                  <Button className="w-full" size="lg" onClick={() => completeDelivery(order.id)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marquer comme livrée
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
