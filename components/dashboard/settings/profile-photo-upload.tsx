"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"

interface ProfilePhotoUploadProps {
  userId: string
  currentPhoto?: string | null
}

export function ProfilePhotoUpload({ userId, currentPhoto }: ProfilePhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentPhoto || null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Fichier invalide",
        description: "Veuillez sélectionner une image (JPG, PNG ou WebP).",
        variant: "destructive",
      })
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale est de 5MB.",
        variant: "destructive",
      })
      return
    }

    setSelectedFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    const supabase = createClient()

    try {
      console.log("[v0] Starting photo upload...")

      // Generate unique filename
      const fileExt = selectedFile.name.split(".").pop()
      const fileName = `${userId}/${Date.now()}.${fileExt}`

      // Delete old photo if exists
      if (currentPhoto) {
        const oldPath = currentPhoto.split("/").slice(-2).join("/")
        await supabase.storage.from("profile-photos").remove([oldPath])
      }

      // Upload new photo
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("profile-photos")
        .upload(fileName, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage.from("profile-photos").getPublicUrl(fileName)

      const photoUrl = urlData.publicUrl

      console.log("[v0] Photo uploaded, URL:", photoUrl)

      // Update user profile in database
      const { error: updateError } = await supabase.from("users").update({ profile_photo: photoUrl }).eq("id", userId)

      if (updateError) throw updateError

      toast({
        title: "Photo mise à jour",
        description: "Votre photo de profil a été mise à jour avec succès.",
      })

      setSelectedFile(null)

      // Refresh the page to show new photo everywhere
      window.location.reload()
    } catch (error) {
      console.error("[v0] Error uploading photo:", error)
      toast({
        title: "Erreur",
        description: "Impossible de télécharger la photo. Réessayez.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = async () => {
    if (!currentPhoto) return

    setIsUploading(true)
    const supabase = createClient()

    try {
      // Delete from storage
      const photoPath = currentPhoto.split("/").slice(-2).join("/")
      await supabase.storage.from("profile-photos").remove([photoPath])

      // Update database
      const { error } = await supabase.from("users").update({ profile_photo: null }).eq("id", userId)

      if (error) throw error

      setPreview(null)
      setSelectedFile(null)

      toast({
        title: "Photo supprimée",
        description: "Votre photo de profil a été supprimée.",
      })

      window.location.reload()
    } catch (error) {
      console.error("[v0] Error removing photo:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la photo.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="gap-2"
        >
          <Camera className="w-4 h-4" />
          Choisir une photo
        </Button>

        {selectedFile && (
          <Button type="button" size="sm" onClick={handleUpload} disabled={isUploading} className="gap-2">
            <Check className="w-4 h-4" />
            {isUploading ? "Téléchargement..." : "Confirmer"}
          </Button>
        )}

        {currentPhoto && !selectedFile && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemove}
            disabled={isUploading}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Supprimer
          </Button>
        )}

        {selectedFile && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedFile(null)
              setPreview(currentPhoto || null)
            }}
            disabled={isUploading}
          >
            Annuler
          </Button>
        )}
      </div>

      {selectedFile && <p className="text-sm text-gray-600">Fichier sélectionné: {selectedFile.name}</p>}
    </div>
  )
}
