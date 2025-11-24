"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { VendorProfile } from "@/lib/types/user"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, Store, Mail, Award as IdCard } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

export function VendorApprovalList() {
  const [vendors, setVendors] = useState<VendorProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("vendor_profiles")
          .select(
            `
            *,
            user:users!vendor_profiles_user_id_fkey(
              id,
              email,
              campus_id,
              first_name,
              last_name,
              role
            )
          `,
          )
          .eq("images_approved", false)

        if (error) throw error

        const vendorsData = (data || []).map((vendor: any) => ({
          uid: vendor.user.id,
          email: vendor.user.email,
          campusId: vendor.user.campus_id,
          firstName: vendor.user.first_name,
          lastName: vendor.user.last_name,
          role: vendor.user.role,
          businessName: vendor.business_name,
          canteenImage: vendor.canteen_image_url,
          locationImages: vendor.location_image_urls || [],
          menuImages: vendor.menu_image_urls || [],
          imagesApproved: vendor.images_approved,
        }))

        setVendors(vendorsData)
      } catch (error) {
        console.error("Error fetching vendors:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVendors()
  }, [])

  const handleApprove = async (userId: string) => {
    try {
      setProcessing(userId)
      const supabase = createClient()
      const { error } = await supabase.from("vendor_profiles").update({ images_approved: true }).eq("user_id", userId)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Images du vendeur approuvées",
      })

      // Refresh the list
      setVendors((prev) => prev.filter((v) => v.uid !== userId))
    } catch (error) {
      console.error("Error approving vendor:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'approuver les images",
        variant: "destructive",
      })
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (userId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir refuser ces images ?")) return

    try {
      setProcessing(userId)
      const supabase = createClient()
      const { error } = await supabase
        .from("vendor_profiles")
        .update({
          canteen_image: null,
          images_approved: false,
        })
        .eq("user_id", userId)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Images du vendeur refusées",
      })

      // Refresh the list
      setVendors((prev) => prev.filter((v) => v.uid !== userId))
    } catch (error) {
      console.error("Error rejecting vendor:", error)
      toast({
        title: "Erreur",
        description: "Impossible de refuser les images",
        variant: "destructive",
      })
    } finally {
      setProcessing(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (vendors.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
            <p className="text-lg font-medium">Aucune image en attente</p>
            <p className="text-sm text-muted-foreground">Toutes les images des vendeurs ont été approuvées</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {vendors.map((vendor) => {
          const initials = vendor.businessName
            ? vendor.businessName.slice(0, 2).toUpperCase()
            : `${vendor.firstName[0]}${vendor.lastName[0]}`.toUpperCase()
          const isProcessing = processing === vendor.uid

          return (
            <Card key={vendor.uid} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarFallback className="bg-blue-600 text-white">
                      <Store className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">
                      {vendor.businessName || `${vendor.firstName} ${vendor.lastName}`}
                    </CardTitle>
                    <CardDescription className="space-y-1 mt-1">
                      <div className="flex items-center gap-1 text-xs truncate">
                        <Mail className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{vendor.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <IdCard className="h-3 w-3 flex-shrink-0" />
                        <code>{vendor.campusId}</code>
                      </div>
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="flex-shrink-0">
                    En attente
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-2">Images uploadées :</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {vendor.canteenImage && <li>Photo de la cantine</li>}
                    {vendor.locationImages?.length > 0 && (
                      <li>{vendor.locationImages.length} photo(s) d'emplacement</li>
                    )}
                    {vendor.menuImages?.length > 0 && <li>{vendor.menuImages.length} photo(s) de repas</li>}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-4 mt-4 border-t">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleApprove(vendor.uid)}
                    disabled={isProcessing}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {isProcessing ? "Traitement..." : "Approuver"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleReject(vendor.uid)}
                    disabled={isProcessing}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Refuser
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
