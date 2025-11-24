"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@/lib/types/user"
import type { Order } from "@/lib/types/order"
import { useAuth } from "@/lib/hooks/useAuth"
import { getMaskedEmail } from "@/lib/utils/permissions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Mail, Phone, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface UserWithDetails extends User {
  vendorProfile?: {
    businessName: string
    description: string
    imagesApproved: boolean
  }
  deliveryProfile?: {
    vehicleType: string
    isAvailable: boolean
  }
}

export default function UserProfileDetail({ userId }: { userId: string }) {
  const { user: currentUser } = useAuth()
  const [user, setUser] = useState<UserWithDetails | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageRating: 0,
    completedDeliveries: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUserProfile()
  }, [userId])

  async function fetchUserProfile() {
    try {
      setLoading(true)
      setError(null)
      const supabase = createClient()

      console.log("[v0] Fetching user profile for:", userId)

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select(`
          *,
          vendor_profiles(business_name, description, images_approved),
          delivery_profiles(vehicle_type, is_available)
        `)
        .eq("id", userId)
        .single()

      if (userError) {
        console.error("[v0] Error fetching user:", userError)
        throw userError
      }

      if (!userData) {
        throw new Error("User not found")
      }

      // Only check for sub-admins trying to view admin/sub-admin accounts
      if (currentUser?.role === "sub-admin" && ["admin", "sub-admin"].includes(userData.role)) {
        throw new Error("Insufficient permissions to view this user")
      }

      console.log("[v0] User data fetched:", userData)

      const formattedUser: UserWithDetails = {
        uid: userData.id,
        email: userData.email,
        campusId: userData.campus_id,
        role: userData.role,
        firstName: userData.first_name,
        lastName: userData.last_name,
        phone: userData.phone,
        createdAt: new Date(userData.created_at),
        updatedAt: new Date(userData.updated_at),
        isActive: userData.is_active,
        createdBy: userData.created_by,
        approvedBy: userData.approved_by,
        status: userData.status,
        vendorProfile: userData.vendor_profiles?.[0]
          ? {
              businessName: userData.vendor_profiles[0].business_name,
              description: userData.vendor_profiles[0].description,
              imagesApproved: userData.vendor_profiles[0].images_approved,
            }
          : undefined,
        deliveryProfile: userData.delivery_profiles?.[0]
          ? {
              vehicleType: userData.delivery_profiles[0].vehicle_type,
              isAvailable: userData.delivery_profiles[0].is_available,
            }
          : undefined,
      }

      setUser(formattedUser)

      if (formattedUser.role === "client") {
        await fetchClientHistory(userId)
      } else if (formattedUser.role === "vendor") {
        await fetchVendorHistory(userId)
      } else if (formattedUser.role === "delivery") {
        await fetchDeliveryHistory(userId)
      }
    } catch (err: any) {
      console.error("[v0] Error in fetchUserProfile:", err)
      setError(err.message || "Failed to load user profile")
    } finally {
      setLoading(false)
    }
  }

  async function fetchClientHistory(clientId: string) {
    const supabase = createClient()

    const { data: orderData, error } = await supabase
      .from("orders")
      .select(`
        *,
        vendor:users!orders_vendor_id_fkey(first_name, last_name),
        delivery:users!orders_delivery_id_fkey(first_name, last_name),
        order_items(*)
      `)
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching client orders:", error)
      return
    }

    if (orderData) {
      const formattedOrders = orderData.map((order: any) => ({
        id: order.id,
        clientId: order.client_id,
        clientName: "",
        clientPhone: "",
        vendorId: order.vendor_id,
        vendorName: order.vendor ? `${order.vendor.first_name} ${order.vendor.last_name}` : "",
        deliveryId: order.delivery_id,
        items: order.order_items || [],
        totalAmount: Number(order.total_amount),
        status: order.status,
        deliveryAddress: order.delivery_address,
        createdAt: new Date(order.created_at),
        updatedAt: new Date(order.updated_at),
        notes: order.notes,
      }))

      setOrders(formattedOrders)
      setStats({
        totalOrders: formattedOrders.length,
        totalRevenue: formattedOrders.reduce((sum, o) => sum + o.totalAmount, 0),
        averageRating: 0,
        completedDeliveries: formattedOrders.filter((o) => o.status === "delivered").length,
      })
    }
  }

  async function fetchVendorHistory(vendorId: string) {
    const supabase = createClient()

    const { data: orderData, error } = await supabase
      .from("orders")
      .select(`
        *,
        client:users!orders_client_id_fkey(first_name, last_name, phone),
        order_items(*)
      `)
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching vendor orders:", error)
      return
    }

    if (orderData) {
      const formattedOrders = orderData.map((order: any) => ({
        id: order.id,
        clientId: order.client_id,
        clientName: order.client ? `${order.client.first_name} ${order.client.last_name}` : "",
        clientPhone: order.client?.phone || "",
        vendorId: order.vendor_id,
        vendorName: "",
        deliveryId: order.delivery_id,
        items: order.order_items || [],
        totalAmount: Number(order.total_amount),
        status: order.status,
        deliveryAddress: order.delivery_address,
        createdAt: new Date(order.created_at),
        updatedAt: new Date(order.updated_at),
        notes: order.notes,
      }))

      setOrders(formattedOrders)

      const totalRevenue = formattedOrders.reduce((sum, o) => sum + o.totalAmount, 0)

      setStats({
        totalOrders: formattedOrders.length,
        totalRevenue,
        averageRating: 0,
        completedDeliveries: formattedOrders.filter((o) => o.status === "delivered").length,
      })
    }
  }

  async function fetchDeliveryHistory(deliveryId: string) {
    const supabase = createClient()

    const { data: orderData, error } = await supabase
      .from("orders")
      .select(`
        *,
        client:users!orders_client_id_fkey(first_name, last_name),
        vendor:users!orders_vendor_id_fkey(first_name, last_name)
      `)
      .eq("delivery_id", deliveryId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching delivery orders:", error)
      return
    }

    if (orderData) {
      const formattedOrders = orderData.map((order: any) => ({
        id: order.id,
        clientId: order.client_id,
        clientName: order.client ? `${order.client.first_name} ${order.client.last_name}` : "",
        clientPhone: "",
        vendorId: order.vendor_id,
        vendorName: order.vendor ? `${order.vendor.first_name} ${order.vendor.last_name}` : "",
        deliveryId: order.delivery_id,
        items: [],
        totalAmount: Number(order.total_amount),
        status: order.status,
        deliveryAddress: order.delivery_address,
        createdAt: new Date(order.created_at),
        updatedAt: new Date(order.updated_at),
        notes: order.notes,
      }))

      setOrders(formattedOrders)

      const completedDeliveries = formattedOrders.filter((o) => o.status === "delivered").length
      const successRate = formattedOrders.length > 0 ? (completedDeliveries / formattedOrders.length) * 100 : 0

      setStats({
        totalOrders: formattedOrders.length,
        totalRevenue: 0,
        averageRating: 0,
        completedDeliveries,
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-600">{error || "User not found"}</p>
        <Link href="/dashboard/admin">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    )
  }

  const displayEmail = getMaskedEmail(user.email, currentUser?.role)
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()

  return (
    <div className="space-y-6">
      <Link href="/dashboard/admin">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Admin Dashboard
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl bg-blue-600 text-white">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <CardTitle className="text-2xl">
                  {user.firstName} {user.lastName}
                </CardTitle>
                <Badge variant={user.role === "admin" || user.role === "sub-admin" ? "destructive" : "secondary"}>
                  {user.role}
                </Badge>
                <Badge variant={user.status === "approved" ? "default" : "secondary"}>{user.status}</Badge>
              </div>
              <CardDescription className="text-base">
                {user.vendorProfile?.businessName || `CampusID: ${user.campusId}`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-medium break-all">{displayEmail}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Téléphone
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{user.phone}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Inscription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{user.createdAt.toLocaleDateString("fr-FR")}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full grid grid-cols-2 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Commandes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </CardContent>
            </Card>

            {user.role === "vendor" && (
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Revenu Total</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)} FCFA</p>
                </CardContent>
              </Card>
            )}

            {user.role === "delivery" && (
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Livraisons Complétées</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stats.completedDeliveries}</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Statut</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant={user.isActive ? "default" : "destructive"} className="text-base">
                  {user.isActive ? "Actif" : "Inactif"}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {user.vendorProfile && (
            <Card>
              <CardHeader>
                <CardTitle>Profil Vendeur</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Nom de l'entreprise</p>
                  <p className="font-medium">{user.vendorProfile.businessName}</p>
                </div>
                {user.vendorProfile.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="font-medium">{user.vendorProfile.description}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Images approuvées</p>
                  <Badge variant={user.vendorProfile.imagesApproved ? "default" : "secondary"}>
                    {user.vendorProfile.imagesApproved ? "Oui" : "Non"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {user.deliveryProfile && (
            <Card>
              <CardHeader>
                <CardTitle>Profil Livreur</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Type de véhicule</p>
                  <p className="font-medium">{user.deliveryProfile.vehicleType || "Non spécifié"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Disponibilité</p>
                  <Badge variant={user.deliveryProfile.isAvailable ? "default" : "secondary"}>
                    {user.deliveryProfile.isAvailable ? "Disponible" : "Indisponible"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Aucun historique disponible</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <CardTitle className="text-base">Commande #{order.id.slice(0, 8)}</CardTitle>
                      <Badge
                        variant={
                          order.status === "delivered"
                            ? "default"
                            : order.status === "cancelled"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      {order.createdAt.toLocaleDateString("fr-FR")} à {order.createdAt.toLocaleTimeString("fr-FR")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {user.role === "client" && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Vendeur:</span>{" "}
                        <span className="font-medium">{order.vendorName}</span>
                      </p>
                    )}
                    {user.role === "vendor" && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Client:</span>{" "}
                        <span className="font-medium">{order.clientName}</span>
                      </p>
                    )}
                    {user.role === "delivery" && (
                      <>
                        <p className="text-sm">
                          <span className="text-muted-foreground">Client:</span>{" "}
                          <span className="font-medium">{order.clientName}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-muted-foreground">Vendeur:</span>{" "}
                          <span className="font-medium">{order.vendorName}</span>
                        </p>
                      </>
                    )}
                    <p className="text-sm">
                      <span className="text-muted-foreground">Montant:</span>{" "}
                      <span className="font-bold">{order.totalAmount.toFixed(2)} FCFA</span>
                    </p>
                    <p className="text-sm break-all">
                      <span className="text-muted-foreground">Adresse:</span>{" "}
                      <span className="font-medium">{order.deliveryAddress}</span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
