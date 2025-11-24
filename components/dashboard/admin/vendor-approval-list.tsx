"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { VendorProfile } from "@/lib/types/user"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export function VendorApprovalList() {
  const [vendors, setVendors] = useState<VendorProfile[]>([])
  const [loading, setLoading] = useState(true)

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
      const supabase = createClient()
      const { error } = await supabase.from("vendor_profiles").update({ images_approved: true }).eq("user_id", userId)

      if (error) throw error

      // Refresh the list
      setVendors((prev) => prev.filter((v) => v.uid !== userId))
    } catch (error) {
      console.error("Error approving vendor:", error)
      alert("Erreur lors de l'approbation")
    }
  }

  const handleReject = async (userId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir refuser ces images ?")) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("vendor_profiles")
        .update({
          canteen_image_url: null,
          location_image_urls: [],
          menu_image_urls: [],
          images_approved: false,
        })
        .eq("user_id", userId)

      if (error) throw error

      // Refresh the list
      setVendors((prev) => prev.filter((v) => v.uid !== userId))
    } catch (error) {
      console.error("Error rejecting vendor:", error)
      alert("Erreur lors du refus")
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
      <div className="text-center py-12">
        <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
        <p className="text-muted-foreground">Aucune image en attente d'approbation</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {vendors.map((vendor) => (
        <Card key={vendor.uid}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{vendor.businessName || `${vendor.firstName} ${vendor.lastName}`}</CardTitle>
                <CardDescription>
                  {vendor.email} • {vendor.campusId}
                </CardDescription>
              </div>
              <Badge variant="secondary">En attente</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Images uploadées :</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {vendor.canteenImage && <li>Photo de la cantine</li>}
                  {vendor.locationImages?.length > 0 && <li>{vendor.locationImages.length} photo(s) d'emplacement</li>}
                  {vendor.menuImages?.length > 0 && <li>{vendor.menuImages.length} photo(s) de repas</li>}
                </ul>
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="flex-1" onClick={() => handleApprove(vendor.uid)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approuver
                </Button>
                <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleReject(vendor.uid)}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Refuser
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
