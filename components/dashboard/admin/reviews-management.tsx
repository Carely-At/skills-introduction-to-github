"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Star, Search, Flag, CheckCircle, MessageSquare, AlertTriangle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Review {
  id: string
  order_id: string
  user_id: string
  vendor_id: string
  overall_rating: number
  food_rating: number | null
  delivery_rating: number | null
  comment: string
  vendor_response: string | null
  is_flagged: boolean
  flagged_reason: string | null
  is_approved: boolean
  created_at: string
  user_name: string
  vendor_name: string
}

export function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [moderationAction, setModerationAction] = useState<"approve" | "flag" | "respond" | null>(null)
  const [actionText, setActionText] = useState("")
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    flaggedReviews: 0,
    needsAction: 0,
  })

  useEffect(() => {
    fetchReviews()
    fetchStats()
  }, [filterType])

  const fetchReviews = async () => {
    try {
      const supabase = createClient()
      let query = supabase.from("reviews").select(
        `
        *,
        user:users!reviews_user_id_fkey(first_name, last_name),
        vendor:users!reviews_vendor_id_fkey(first_name, last_name, business_name)
      `,
      )

      if (filterType === "flagged") {
        query = query.eq("is_flagged", true)
      } else if (filterType === "pending") {
        query = query.eq("is_approved", false)
      } else if (filterType === "low-rating") {
        query = query.lte("overall_rating", 2)
      }

      const { data, error } = await query.order("created_at", { ascending: false }).limit(50)

      if (error) throw error

      const formattedReviews = data?.map((review: any) => ({
        ...review,
        user_name: `${review.user?.first_name} ${review.user?.last_name}`,
        vendor_name: review.vendor?.business_name || `${review.vendor?.first_name} ${review.vendor?.last_name}`,
      }))

      setReviews(formattedReviews || [])
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("reviews").select("overall_rating, is_flagged, is_approved")

      if (error) throw error

      if (data) {
        const total = data.length
        const avgRating = data.reduce((sum, r) => sum + r.overall_rating, 0) / total || 0
        const flagged = data.filter((r) => r.is_flagged).length
        const needsAction = data.filter((r) => !r.is_approved || r.is_flagged).length

        setStats({
          averageRating: avgRating,
          totalReviews: total,
          flaggedReviews: flagged,
          needsAction: needsAction,
        })
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const handleModeration = async () => {
    if (!selectedReview || !moderationAction) return

    try {
      const supabase = createClient()
      const updates: any = {
        moderated_at: new Date().toISOString(),
      }

      if (moderationAction === "approve") {
        updates.is_approved = true
        updates.is_flagged = false
      } else if (moderationAction === "flag") {
        updates.is_flagged = true
        updates.flagged_reason = actionText
      } else if (moderationAction === "respond") {
        updates.vendor_response = actionText
        updates.responded_at = new Date().toISOString()
      }

      const { error } = await supabase.from("reviews").update(updates).eq("id", selectedReview.id)

      if (error) throw error

      setSelectedReview(null)
      setModerationAction(null)
      setActionText("")
      fetchReviews()
      fetchStats()
    } catch (error) {
      console.error("Error moderating review:", error)
      alert("Erreur lors de la modération")
    }
  }

  const filteredReviews = reviews.filter(
    (review) =>
      review.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.vendor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Avis et Evaluations</h1>
          <p className="text-gray-600 mt-1">
            Gestion centralisée des retours clients pour les vendeurs et livreurs. Surveillez la qualité du service en
            temps réel.
          </p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 text-white">Exporter le rapport</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-50">
              <Star className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">NOTE MOYENNE</span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
            <span className="text-sm text-green-600 font-medium">+0.3%</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-50">
              <MessageSquare className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">TOTAL AVIS</span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900">{stats.totalReviews.toLocaleString()}</p>
            <span className="text-sm text-green-600 font-medium">+5%</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-orange-50">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">A MODERER</span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900">{stats.needsAction}</p>
            <Badge variant="destructive" className="text-xs">
              Action requise
            </Badge>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-red-50">
              <Flag className="h-5 w-5 text-red-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">SIGNALES</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.flaggedReviews}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="flagged">Tous les notes</SelectItem>
              <SelectItem value="pending">Tous les vendeurs</SelectItem>
              <SelectItem value="low-rating">Tous les livreurs</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Voir Toutes</Button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Aperçu des Evaluations</h2>

        {loading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Aucun avis trouvé</div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                    {review.user_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{review.user_name}</h3>
                    <p className="text-sm text-gray-500">
                      Il y a {Math.floor((Date.now() - new Date(review.created_at).getTime()) / (1000 * 60))} min •
                      Commande #{review.order_id.slice(0, 8)}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= review.overall_rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                      <span className="ml-2 text-sm font-medium text-gray-900">{review.overall_rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {review.is_flagged && (
                    <Badge variant="destructive" className="text-xs">
                      Signalé
                    </Badge>
                  )}
                  {!review.is_approved && (
                    <Badge variant="outline" className="text-xs bg-yellow-50 border-yellow-200 text-yellow-800">
                      En attente
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-gray-700 mb-4">{review.comment}</p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600">
                    <strong>{review.vendor_name}</strong>
                  </span>
                  {review.food_rating && <span className="text-gray-500">Nourriture: {review.food_rating}/5</span>}
                  {review.delivery_rating && (
                    <span className="text-gray-500">Livraison: {review.delivery_rating}/5</span>
                  )}
                </div>

                <div className="flex gap-2">
                  {!review.is_approved && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedReview(review)
                        setModerationAction("approve")
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approuver
                    </Button>
                  )}
                  {!review.is_flagged && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedReview(review)
                        setModerationAction("flag")
                      }}
                    >
                      <Flag className="h-4 w-4 mr-1" />
                      Signaler
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedReview(review)
                      setModerationAction("respond")
                      setActionText(review.vendor_response || "")
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Répondre
                  </Button>
                </div>
              </div>

              {review.vendor_response && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-1">Réponse du vendeur:</p>
                  <p className="text-sm text-gray-600">{review.vendor_response}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Moderation Dialog */}
      <Dialog open={moderationAction !== null} onOpenChange={() => setModerationAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {moderationAction === "approve" && "Approuver l'avis"}
              {moderationAction === "flag" && "Signaler l'avis"}
              {moderationAction === "respond" && "Répondre à l'avis"}
            </DialogTitle>
            <DialogDescription>
              {moderationAction === "approve" && "Êtes-vous sûr de vouloir approuver cet avis ?"}
              {moderationAction === "flag" && "Veuillez indiquer la raison du signalement"}
              {moderationAction === "respond" && "Rédigez une réponse au nom du vendeur"}
            </DialogDescription>
          </DialogHeader>

          {(moderationAction === "flag" || moderationAction === "respond") && (
            <Textarea
              placeholder={moderationAction === "flag" ? "Raison du signalement..." : "Votre réponse..."}
              value={actionText}
              onChange={(e) => setActionText(e.target.value)}
              rows={4}
            />
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setModerationAction(null)}>
              Annuler
            </Button>
            <Button onClick={handleModeration}>
              {moderationAction === "approve" && "Approuver"}
              {moderationAction === "flag" && "Signaler"}
              {moderationAction === "respond" && "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
