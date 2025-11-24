"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@/lib/types/user"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Shield, Plus, Phone, UserIcon, Calendar } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function SubAdminManagement() {
  const [subAdmins, setSubAdmins] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchSubAdmins()
  }, [])

  async function fetchSubAdmins() {
    try {
      setLoading(true)
      const supabase = createClient()

      console.log("[v0] Fetching sub-admins")

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("role", "sub-admin")
        .order("created_at", { ascending: false })

      if (error) throw error

      const formatted: User[] = data.map((u: any) => ({
        uid: u.id,
        email: u.email,
        campusId: u.campus_id,
        role: u.role,
        firstName: u.first_name,
        lastName: u.last_name,
        phone: u.phone,
        createdAt: new Date(u.created_at),
        updatedAt: new Date(u.updated_at),
        isActive: u.is_active,
        createdBy: u.created_by,
        approvedBy: u.approved_by,
        status: u.status,
      }))

      setSubAdmins(formatted)
      console.log("[v0] Sub-admins loaded:", formatted.length)
    } catch (error) {
      console.error("[v0] Error fetching sub-admins:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les sous-admins",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateSubAdmin(e: React.FormEvent) {
    e.preventDefault()

    const password = formData.password || `SubAdmin${Date.now()}!`

    try {
      setCreating(true)
      console.log("[v0] Creating sub-admin")

      const response = await fetch("/api/admin/create-sub-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create sub-admin")
      }

      console.log("[v0] Sub-admin created:", data)

      toast({
        title: "Succès",
        description: `Sous-admin créé avec succès. Mot de passe temporaire: ${password}`,
      })

      setIsDialogOpen(false)
      setFormData({
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        password: "",
      })
      fetchSubAdmins()
    } catch (error: any) {
      console.error("[v0] Error creating sub-admin:", error)
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le sous-admin",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Administrateurs secondaires</h1>
          <p className="text-muted-foreground">Gérer les sous-admins de la plateforme</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Créer un sous-admin
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Créer un administrateur secondaire</DialogTitle>
              <DialogDescription>
                Les sous-admins peuvent créer des vendeurs, livreurs et clients, mais ne peuvent pas supprimer
                d'utilisateurs ni créer d'autres administrateurs.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSubAdmin}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe (optionnel)</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Généré automatiquement si vide"
                  />
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating ? "Création..." : "Créer"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {subAdmins.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Aucun sous-admin créé</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:hidden">
          {subAdmins.map((admin) => (
            <Card key={admin.uid}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {admin.firstName} {admin.lastName}
                  </CardTitle>
                  <Badge variant="secondary">
                    <Shield className="mr-1 h-3 w-3" />
                    Sous-admin
                  </Badge>
                </div>
                <CardDescription className="break-all">{admin.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center text-sm">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{admin.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{admin.campusId}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{admin.createdAt.toLocaleDateString("fr-FR")}</span>
                </div>
                <Badge variant={admin.isActive ? "default" : "destructive"}>
                  {admin.isActive ? "Actif" : "Inactif"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {subAdmins.length > 0 && (
        <Card className="hidden lg:block">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="p-4 font-medium">Nom</th>
                    <th className="p-4 font-medium">Email</th>
                    <th className="p-4 font-medium">Téléphone</th>
                    <th className="p-4 font-medium">Campus ID</th>
                    <th className="p-4 font-medium">Date de création</th>
                    <th className="p-4 font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {subAdmins.map((admin) => (
                    <tr key={admin.uid} className="border-b last:border-0 hover:bg-accent/50">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {admin.firstName} {admin.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 break-all">{admin.email}</td>
                      <td className="p-4">{admin.phone}</td>
                      <td className="p-4">
                        <code className="text-sm bg-muted px-2 py-1 rounded">{admin.campusId}</code>
                      </td>
                      <td className="p-4">{admin.createdAt.toLocaleDateString("fr-FR")}</td>
                      <td className="p-4">
                        <Badge variant={admin.isActive ? "default" : "destructive"}>
                          {admin.isActive ? "Actif" : "Inactif"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
