"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/hooks/useAuth"
import type { Order, OrderStatus } from "@/lib/types/order"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Package, Clock } from "lucide-react"
import { formatCFA } from "@/lib/utils/currency"

export function OrderHistory() {
  const { userData } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userData?.uid) return

      try {
        const supabase = createClient()

        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select(`
            *,
            order_items(*)
          `)
          .eq("client_id", userData.uid)
          .order("created_at", { ascending: false })

        if (ordersError) {
          console.error("Error fetching orders:", ordersError)
          return
        }

        const orders = ordersData.map((order: any) => ({
          id: order.id,
          clientId: order.client_id,
          clientName: `${userData.firstName} ${userData.lastName}`,
          clientPhone: userData.phone,
          vendorId: order.vendor_id,
          vendorName: order.vendor_name || "",
          deliveryId: order.delivery_id,
          items: order.order_items.map((item: any) => ({
            menuItemId: item.menu_item_id,
            name: item.name,
            price: Number(item.price),
            quantity: item.quantity,
            image: item.image,
          })),
          totalAmount: Number(order.total_amount),
          status: order.status,
          deliveryAddress: order.delivery_address,
          notes: order.notes,
          createdAt: new Date(order.created_at),
          updatedAt: new Date(order.updated_at),
        })) as Order[]

        setOrders(orders)
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [userData])

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
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Aucune commande</h3>
        <p className="text-muted-foreground">Vous n'avez pas encore passé de commande</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Mes commandes</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">Commande #{order.id.slice(0, 8)}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3" />
                    {order.createdAt?.toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
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
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Articles commandés :</p>
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

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <span className="text-lg font-bold text-primary">{formatCFA(order.totalAmount)}</span>
                </div>

                {order.deliveryAddress && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Adresse de livraison :</p>
                      <p className="text-sm">{order.deliveryAddress}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
