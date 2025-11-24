"use client"

import { useEffect, useState } from "react"
import type { User } from "@/lib/types/user"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, XCircle, Clock, Mail, Phone, UserIcon, Calendar, Shield } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface PendingUser extends User {
  creator?: {
    id: string
    email: string
    firstName: string
    lastName: string
  }
}

export default function PendingUsersManagement() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchPendingUsers()
  }, [])

  async function fetchPendingUsers() {
    try {
      setLoading(true)
      console.log("[v0] Fetching pending users")

      const response = await fetch("/api/admin/pending-users")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch pending users")
      }

      const formatted: PendingUser[] = data.users.map((u: any) => ({
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
        creator: u.creator
          ? {
              id: u.creator.id,
              email: u.creator.email,
              firstName: u.creator.first_name,
              lastName: u.creator.last_name,
            }
          : undefined,
      }))

      setPendingUsers(formatted)
      console.log("[v0] Pending users loaded:", formatted.length)
    } catch (error) {
      console.error("[v0] Error fetching pending users:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs en attente",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove(userId: string) {
    try {
      setProcessing(userId)
      console.log("[v0] Approving user:", userId)

      const response = await fetch("/api/admin/approve-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to approve user")
      }

      toast({
        title: "Succès",
        description: "Utilisateur approuvé avec succès",
      })

      fetchPendingUsers()
    } catch (error: any) {
      console.error("[v0] Error approving user:", error)
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'approuver l'utilisateur",
        variant: "destructive",
      })
    } finally {
      setProcessing(null)
    }
  }

  async function handleReject(userId: string) {
    try {
      setProcessing(userId)
      console.log("[v0] Rejecting user:", userId)

      const response = await fetch("/api/admin/reject-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to reject user")
      }

      toast({
        title: "Succès",
        description: "Utilisateur rejeté avec succès",
      })

      fetchPendingUsers()
    } catch (error: any) {
      console.error("[v0] Error rejecting user:", error)
      toast({
        title: "Erreur",
        description: error.message || "Impossible de rejeter l'utilisateur",
        variant: "destructive",
      })
    } finally {
      setProcessing(null)
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
      <div>
        <h1 className="text-3xl font-bold">Utilisateurs en attente</h1>
        <p className="text-muted-foreground">Approuver ou rejeter les utilisateurs créés par les sous-admins</p>
      </div>

      {pendingUsers.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
              <p className="text-lg font-medium">Aucun utilisateur en attente</p>
              <p className="text-sm text-muted-foreground">Tous les utilisateurs ont été traités</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingUsers.map((user) => {
            const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
            const isProcessing = processing === user.uid

            return (
              <Card key={user.uid}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-lg bg-blue-600 text-white">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <CardTitle className="text-xl">
                          {user.firstName} {user.lastName}
                        </CardTitle>
                        <Badge variant="secondary">{user.role}</Badge>
                        <Badge variant="outline">
                          <Clock className="mr-1 h-3 w-3" />
                          En attente
                        </Badge>
                      </div>
                      {user.creator && (
                        <CardDescription className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          Créé par: {user.creator.firstName} {user.creator.lastName}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </p>
                      <p className="font-medium break-all">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Téléphone
                      </p>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <UserIcon className="h-4 w-4" />
                        Campus ID
                      </p>
                      <p className="font-medium">{user.campusId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date de création
                      </p>
                      <p className="font-medium">{user.createdAt.toLocaleDateString("fr-FR")}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                    <Button
                      onClick={() => handleApprove(user.uid)}
                      disabled={isProcessing}
                      className="flex-1 sm:flex-initial"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {isProcessing ? "Traitement..." : "Approuver"}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(user.uid)}
                      disabled={isProcessing}
                      className="flex-1 sm:flex-initial"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Rejeter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
