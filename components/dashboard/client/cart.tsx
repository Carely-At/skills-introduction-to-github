"use client"

import { useState } from "react"
import { useAuth } from "@/lib/hooks/useAuth"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, Trash2, Plus, Minus, CheckCircle2 } from 'lucide-react'
import Image from "next/image"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  vendorId: string
}

interface CartProps {
  items: CartItem[]
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemove: (itemId: string) => void
  onClearCart: () => void
}

export function Cart({ items, onUpdateQuantity, onRemove, onClearCart }: CartProps) {
  const { userData } = useAuth()
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      alert("Veuillez entrer une adresse de livraison")
      return
    }

    if (items.length === 0) {
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()

      const itemsByVendor = items.reduce(
        (acc, item) => {
          if (!acc[item.vendorId]) {
            acc[item.vendorId] = []
          }
          acc[item.vendorId].push(item)
          return acc
        },
        {} as Record<string, CartItem[]>
      )

      for (const [vendorId, vendorItems] of Object.entries(itemsByVendor)) {
        const orderTotal = vendorItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

        // Insert order
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .insert({
            client_id: userData?.uid,
            vendor_id: vendorId,
            total_amount: orderTotal,
            status: "pending",
            delivery_address: deliveryAddress,
            notes: notes || null,
          })
          .select()
          .single()

        if (orderError) throw orderError

        // Insert order items
        const orderItems = vendorItems.map((item) => ({
          order_id: orderData.id,
          menu_item_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        }))

        const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

        if (itemsError) throw itemsError
      }

      setOrderPlaced(true)
      onClearCart()
      setDeliveryAddress("")
      setNotes("")

      setTimeout(() => {
        setOrderPlaced(false)
      }, 3000)
    } catch (error) {
      console.error("Error placing order:", error)
      alert("Erreur lors de la commande. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-2">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-green-900">Commande passée avec succès !</h2>
              <p className="text-green-800">
                Votre commande a été envoyée aux vendeurs. Vous serez notifié une fois qu'elle sera confirmée.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4 py-12">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
              <h3 className="text-xl font-semibold">Votre panier est vide</h3>
              <p className="text-muted-foreground">Parcourez le menu et ajoutez des plats à votre panier</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Mon panier</h2>

        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                  <Image
                    src={item.image || "/placeholder.svg?height=80&width=80"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-primary font-medium">{item.price.toFixed(2)} €</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => onRemove(item.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <Button variant="outline" size="sm" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                    <span className="ml-auto font-semibold">{(item.price * item.quantity).toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Summary */}
      <div>
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Récapitulatif</CardTitle>
            <CardDescription>Complétez votre commande</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Adresse de livraison</Label>
              <Textarea
                id="address"
                placeholder="Bâtiment A, Bureau 202..."
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Textarea
                id="notes"
                placeholder="Instructions spéciales..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sous-total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Frais de livraison</span>
                <span className="text-green-600">Gratuit</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{total.toFixed(2)} €</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              size="lg"
              onClick={handlePlaceOrder}
              disabled={loading || !deliveryAddress.trim()}
            >
              {loading ? "Commande en cours..." : "Passer la commande"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
