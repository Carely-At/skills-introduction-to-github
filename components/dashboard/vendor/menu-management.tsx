"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/hooks/useAuth"
import { createClient } from "@/lib/supabase/client"
import type { MenuItem } from "@/lib/types/order"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Plus, Trash2, CheckCircle2, Upload, X } from "lucide-react"
import Image from "next/image"
import { formatCFA } from "@/lib/utils/currency"

export function MenuManagement() {
  const { userData } = useAuth()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  })
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  useEffect(() => {
    fetchMenuItems()
  }, [userData])

  const fetchMenuItems = async () => {
    if (!userData?.uid) return

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("vendor_id", userData.uid)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching menu items:", error)
        return
      }

      const items = data.map((item) => ({
        id: item.id,
        vendorId: item.vendor_id,
        name: item.name,
        description: item.description || "",
        price: Number(item.price),
        image: item.image,
        category: item.category,
        isAvailable: item.is_available,
        createdAt: new Date(item.created_at),
      })) as MenuItem[]

      setMenuItems(items)
    } catch (error) {
      console.error("Error fetching menu items:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }))
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setFormError("Veuillez sélectionner une image")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFormError("L'image ne doit pas dépasser 5MB")
      return
    }

    setSelectedFile(file)
    setImagePreview(URL.createObjectURL(file))
    setFormError("")
  }

  const uploadImage = async (): Promise<string> => {
    if (!selectedFile) return formData.image || "/diverse-food-spread.png"

    try {
      setUploadingImage(true)
      const supabase = createClient()
      const fileExt = selectedFile.name.split(".").pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `menu/${userData?.uid}/${fileName}`

      const { error: uploadError } = await supabase.storage.from("menu-images").upload(filePath, selectedFile, {
        cacheControl: "3600",
        upsert: false,
      })

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("menu-images").getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error("[v0] Error uploading image:", error)
      throw error
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")
    setFormSuccess("")
    setSubmitting(true)

    if (!formData.name || !formData.price || !formData.category) {
      setFormError("Veuillez remplir tous les champs obligatoires")
      setSubmitting(false)
      return
    }

    try {
      let imageUrl = formData.image || "/diverse-food-spread.png"
      if (selectedFile) {
        imageUrl = await uploadImage()
      }

      const supabase = createClient()

      const { error } = await supabase.from("menu_items").insert({
        vendor_id: userData?.uid,
        name: formData.name,
        description: formData.description || null,
        price: Number.parseFloat(formData.price),
        category: formData.category,
        image: imageUrl,
        is_available: true,
      })

      if (error) throw error

      setFormSuccess("Plat ajouté avec succès !")
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
      })
      setSelectedFile(null)
      setImagePreview("")
      setShowAddForm(false)
      fetchMenuItems()
    } catch (error: any) {
      console.error("Error adding menu item:", error)
      setFormError(error.message || "Erreur lors de l'ajout")
    } finally {
      setSubmitting(false)
    }
  }

  const toggleAvailability = async (itemId: string, currentStatus: boolean) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("menu_items").update({ is_available: !currentStatus }).eq("id", itemId)

      if (error) throw error

      fetchMenuItems()
    } catch (error) {
      console.error("Error updating availability:", error)
    }
  }

  const deleteItem = async (itemId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce plat ?")) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from("menu_items").delete().eq("id", itemId)

      if (error) throw error

      fetchMenuItems()
    } catch (error) {
      console.error("Error deleting item:", error)
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion du menu</h2>
          <p className="text-muted-foreground">Ajoutez et gérez les plats de votre menu</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un plat
        </Button>
      </div>

      {formSuccess && (
        <Alert className="bg-green-50 text-green-900 border-green-200">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{formSuccess}</AlertDescription>
        </Alert>
      )}

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Ajouter un nouveau plat</CardTitle>
            <CardDescription>Remplissez les informations du plat</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <Alert variant="destructive">
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du plat *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Prix (FCFA) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="1"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Catégorie *</Label>
                <Select value={formData.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entree">Entrée</SelectItem>
                    <SelectItem value="plat">Plat principal</SelectItem>
                    <SelectItem value="dessert">Dessert</SelectItem>
                    <SelectItem value="boisson">Boisson</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Photo du plat</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={submitting}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("image")?.click()}
                    disabled={submitting || uploadingImage}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choisir une photo
                  </Button>
                  {imagePreview && (
                    <div className="relative h-16 w-16 rounded overflow-hidden">
                      <Image src={imagePreview || "/placeholder.svg"} alt="Aperçu" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null)
                          setImagePreview("")
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Formats acceptés: JPG, PNG, WebP. Taille max: 5MB</p>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={submitting || uploadingImage}>
                  {submitting || uploadingImage ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {uploadingImage ? "Upload..." : "Ajout..."}
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)} disabled={submitting}>
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {menuItems.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Aucun plat dans votre menu. Ajoutez-en un pour commencer !
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Card key={item.id}>
              <div className="relative h-40 bg-muted">
                <Image
                  src={item.image || "/placeholder.svg?height=160&width=320&query=food"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
                <Badge variant={item.isAvailable ? "default" : "secondary"} className="absolute top-2 right-2">
                  {item.isAvailable ? "Disponible" : "Indisponible"}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <CardDescription className="line-clamp-2">{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-primary">{formatCFA(item.price)}</p>
                  <Badge variant="outline" className="capitalize">
                    {item.category}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => toggleAvailability(item.id, item.isAvailable)}
                >
                  {item.isAvailable ? "Masquer" : "Afficher"}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteItem(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
