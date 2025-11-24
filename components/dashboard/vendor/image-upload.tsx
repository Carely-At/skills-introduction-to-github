"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/hooks/useAuth"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Upload, Loader2, CheckCircle2, XCircle, ImageIcon } from 'lucide-react'
import Image from "next/image"

export function ImageUpload() {
  const { userData } = useAuth()
  const [canteenImage, setCanteenImage] = useState<File | null>(null)
  const [locationImages, setLocationImages] = useState<File[]>([])
  const [menuImages, setMenuImages] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [currentImages, setCurrentImages] = useState<any>(null)

  useEffect(() => {
    const fetchCurrentImages = async () => {
      if (!userData?.uid) return

      try {
        const supabase = createClient()
        
        const { data, error } = await supabase
          .from("vendor_profiles")
          .select("*")
          .eq("user_id", userData.uid)
          .single()

        if (error) {
          console.error("Error fetching images:", error)
          return
        }

        setCurrentImages({
          canteenImage: data.canteen_image,
          locationImages: data.location_images || [],
          menuImages: data.menu_images || [],
          imagesApproved: data.images_approved,
        })
      } catch (error) {
        console.error("Error fetching images:", error)
      }
    }

    fetchCurrentImages()
  }, [userData])

  const handleCanteenImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCanteenImage(e.target.files[0])
    }
  }

  const handleLocationImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setLocationImages(Array.from(e.target.files))
    }
  }

  const handleMenuImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMenuImages(Array.from(e.target.files))
    }
  }

  const handleUpload = async () => {
    if (!userData?.uid) return

    if (!canteenImage && locationImages.length === 0 && menuImages.length === 0) {
      setError("Veuillez sélectionner au moins une image")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const supabase = createClient()
      const updates: any = {}

      if (canteenImage) {
        const canteenPath = `vendors/${userData.uid}/canteen/${Date.now()}_${canteenImage.name}`
        const { error: uploadError } = await supabase.storage
          .from("vendor-images")
          .upload(canteenPath, canteenImage, {
            cacheControl: "3600",
            upsert: false,
          })

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from("vendor-images")
          .getPublicUrl(canteenPath)

        updates.canteen_image = publicUrl
      }

      if (locationImages.length > 0) {
        const locationUrls = await Promise.all(
          locationImages.map(async (file) => {
            const locationPath = `vendors/${userData.uid}/location/${Date.now()}_${file.name}`
            const { error: uploadError } = await supabase.storage
              .from("vendor-images")
              .upload(locationPath, file, {
                cacheControl: "3600",
                upsert: false,
              })

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
              .from("vendor-images")
              .getPublicUrl(locationPath)

            return publicUrl
          })
        )
        updates.location_images = [...(currentImages?.locationImages || []), ...locationUrls]
      }

      if (menuImages.length > 0) {
        const menuUrls = await Promise.all(
          menuImages.map(async (file) => {
            const menuPath = `vendors/${userData.uid}/menu/${Date.now()}_${file.name}`
            const { error: uploadError } = await supabase.storage
              .from("vendor-images")
              .upload(menuPath, file, {
                cacheControl: "3600",
                upsert: false,
              })

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
              .from("vendor-images")
              .getPublicUrl(menuPath)

            return publicUrl
          })
        )
        updates.menu_images = [...(currentImages?.menuImages || []), ...menuUrls]
      }

      updates.images_approved = false // Reset approval status

      const { error: updateError } = await supabase
        .from("vendor_profiles")
        .update(updates)
        .eq("user_id", userData.uid)

      if (updateError) throw updateError

      setSuccess("Images uploadées avec succès ! En attente d'approbation par l'administrateur.")
      setCanteenImage(null)
      setLocationImages([])
      setMenuImages([])

      // Refresh current images
      const { data } = await supabase
        .from("vendor_profiles")
        .select("*")
        .eq("user_id", userData.uid)
        .single()

      if (data) {
        setCurrentImages({
          canteenImage: data.canteen_image,
          locationImages: data.location_images || [],
          menuImages: data.menu_images || [],
          imagesApproved: data.images_approved,
        })
      }
    } catch (err: any) {
      console.error("Upload error:", err)
      setError(err.message || "Erreur lors de l'upload")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion des images</h2>
          <p className="text-muted-foreground">Uploadez les photos de votre cantine, emplacement et repas</p>
        </div>
        {currentImages?.imagesApproved !== undefined && (
          <Badge variant={currentImages.imagesApproved ? "default" : "secondary"} className="text-sm">
            {currentImages.imagesApproved ? (
              <>
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Approuvé
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3 mr-1" />
                En attente
              </>
            )}
          </Badge>
        )}
      </div>

      {!currentImages?.imagesApproved && currentImages?.canteenImage && (
        <Alert>
          <AlertDescription>
            Vos images sont en attente d'approbation par l'administrateur. Une fois approuvées, elles seront visibles
            par tous les utilisateurs.
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 text-green-900 border-green-200">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Current Images */}
        {currentImages && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Images actuelles</CardTitle>
                <CardDescription>Vos images uploadées</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentImages.canteenImage && (
                  <div>
                    <Label className="mb-2 block">Photo de la cantine</Label>
                    <div className="relative h-40 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={currentImages.canteenImage || "/placeholder.svg"}
                        alt="Cantine"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}

                {currentImages.locationImages?.length > 0 && (
                  <div>
                    <Label className="mb-2 block">Photos d'emplacement ({currentImages.locationImages.length})</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {currentImages.locationImages.map((url: string, index: number) => (
                        <div key={index} className="relative h-24 rounded-md overflow-hidden bg-muted">
                          <Image
                            src={url || "/placeholder.svg"}
                            alt={`Emplacement ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentImages.menuImages?.length > 0 && (
                  <div>
                    <Label className="mb-2 block">Photos de repas ({currentImages.menuImages.length})</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {currentImages.menuImages.map((url: string, index: number) => (
                        <div key={index} className="relative h-24 rounded-md overflow-hidden bg-muted">
                          <Image
                            src={url || "/placeholder.svg"}
                            alt={`Repas ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!currentImages.canteenImage &&
                  !currentImages.locationImages?.length &&
                  !currentImages.menuImages?.length && (
                    <div className="text-center py-8 text-muted-foreground">
                      <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                      <p>Aucune image uploadée</p>
                    </div>
                  )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Upload Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ajouter de nouvelles images</CardTitle>
              <CardDescription>Toutes les images doivent être approuvées par l'admin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="canteen">Photo de la cantine</Label>
                <Input
                  id="canteen"
                  type="file"
                  accept="image/*"
                  onChange={handleCanteenImageChange}
                  disabled={loading}
                />
                {canteenImage && (
                  <p className="text-xs text-muted-foreground">Fichier sélectionné : {canteenImage.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Photos d'emplacement (plusieurs)</Label>
                <Input
                  id="location"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleLocationImagesChange}
                  disabled={loading}
                />
                {locationImages.length > 0 && (
                  <p className="text-xs text-muted-foreground">{locationImages.length} fichier(s) sélectionné(s)</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="menu">Photos de repas (plusieurs)</Label>
                <Input
                  id="menu"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMenuImagesChange}
                  disabled={loading}
                />
                {menuImages.length > 0 && (
                  <p className="text-xs text-muted-foreground">{menuImages.length} fichier(s) sélectionné(s)</p>
                )}
              </div>

              <Button
                className="w-full"
                onClick={handleUpload}
                disabled={loading || (!canteenImage && locationImages.length === 0 && menuImages.length === 0)}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Upload en cours...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Uploader les images
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    />
  )
}
