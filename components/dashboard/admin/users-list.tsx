"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import type { User } from "@/lib/types/user"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Mail, Phone, Award as IdCard, Trash2, Eye } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

interface UsersListProps {
  onUserDeleted?: () => void
}

export function UsersList({ onUserDeleted }: UsersListProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const supabase = createClient()

        const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching users:", error)
          return
        }

        const usersData = data.map((user) => ({
          uid: user.id,
          email: user.email,
          campusId: user.campus_id,
          role: user.role,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          createdAt: new Date(user.created_at),
          updatedAt: new Date(user.updated_at),
          isActive: user.is_active,
        })) as User[]

        setUsers(usersData)
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleDeleteUser = async (user: User) => {
    try {
      setDeletingUserId(user.uid)
      console.log("[v0] Deleting user:", user.uid)

      const response = await fetch("/api/admin/delete-user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.uid }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Échec de la suppression")
      }

      console.log("[v0] User deleted successfully")

      // Remove user from local state
      setUsers((prev) => prev.filter((u) => u.uid !== user.uid))

      // Call the callback function if provided
      if (onUserDeleted) {
        onUserDeleted()
      }

      toast({
        title: "Utilisateur supprimé",
        description: `${user.firstName} ${user.lastName} a été supprimé avec succès.`,
      })
    } catch (error) {
      console.error("[v0] Delete user error:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Échec de la suppression de l'utilisateur",
        variant: "destructive",
      })
    } finally {
      setDeletingUserId(null)
      setUserToDelete(null)
    }
  }

  const getRoleBadge = (role: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      admin: "destructive",
      vendor: "default",
      delivery: "secondary",
      client: "outline",
    }

    const labels: Record<string, string> = {
      admin: "Admin",
      vendor: "Vendeur",
      delivery: "Livreur",
      client: "Client",
    }

    return <Badge variant={variants[role] || "default"}>{labels[role] || role}</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (users.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">Aucun utilisateur trouvé</div>
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {users.map((user) => (
          <Card key={user.uid}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base truncate">
                    {user.firstName} {user.lastName}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <IdCard className="h-3 w-3 flex-shrink-0" />
                    <code className="text-xs truncate">{user.campusId}</code>
                  </CardDescription>
                </div>
                {getRoleBadge(user.role)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>{user.phone}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <Badge variant={user.isActive ? "default" : "secondary"}>{user.isActive ? "Actif" : "Inactif"}</Badge>
                <div className="flex gap-2">
                  <Link href={`/dashboard/admin/users/${user.uid}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUserToDelete(user)}
                    disabled={deletingUserId === user.uid}
                  >
                    {deletingUserId === user.uid ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-destructive" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="hidden lg:block overflow-x-auto">
        <div className="rounded-md border min-w-[800px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>CampusID</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell className="font-medium">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <IdCard className="h-3 w-3 text-muted-foreground" />
                      <code className="text-xs">{user.campusId}</code>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    <div className="space-y-1 text-xs max-w-[200px]">
                      <div className="flex items-center gap-1 text-muted-foreground truncate">
                        <Mail className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Phone className="h-3 w-3 flex-shrink-0" />
                        {user.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "Actif" : "Inactif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/admin/users/${user.uid}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUserToDelete(user)}
                        disabled={deletingUserId === user.uid}
                      >
                        {deletingUserId === user.uid ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </>
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'utilisateur{" "}
              <strong>
                {userToDelete?.firstName} {userToDelete?.lastName}
              </strong>{" "}
              ({userToDelete?.email}) ?
              <br />
              <br />
              Cette action est irréversible et supprimera toutes les données associées à cet utilisateur.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToDelete && handleDeleteUser(userToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
