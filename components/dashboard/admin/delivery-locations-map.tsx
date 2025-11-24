"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, MapPin, Navigation, Clock } from "lucide-react"

interface DeliveryPerson {
  id: string
  firstName: string
  lastName: string
  phone: string
  isAvailable: boolean
  currentLatitude: number | null
  currentLongitude: number | null
  lastLocationUpdate: Date | null
}

export function DeliveryLocationsMap() {
  const [deliveryPeople, setDeliveryPeople] = useState<DeliveryPerson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDeliveryLocations()

    const supabase = createClient()
    const channel = supabase
      .channel("delivery-locations")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "delivery_profiles",
        },
        () => {
          fetchDeliveryLocations()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchDeliveryLocations = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("delivery_profiles")
        .select(`
          user_id,
          is_available,
          current_latitude,
          current_longitude,
          last_location_update,
          user:users!delivery_profiles_user_id_fkey(
            first_name,
            last_name,
            phone
          )
        `)
        .eq("is_available", true)

      if (error) throw error

      const people = data.map((item: any) => ({
        id: item.user_id,
        firstName: item.user.first_name,
        lastName: item.user.last_name,
        phone: item.user.phone,
        isAvailable: item.is_available,
        currentLatitude: item.current_latitude,
        currentLongitude: item.current_longitude,
        lastLocationUpdate: item.last_location_update ? new Date(item.last_location_update) : null,
      }))

      setDeliveryPeople(people)
    } catch (error) {
      console.error("[v0] Error fetching delivery locations:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTimeSinceUpdate = (date: Date | null) => {
    if (!date) return "Jamais"

    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "À l'instant"
    if (diffMins < 60) return `Il y a ${diffMins} min`

    const diffHours = Math.floor(diffMins / 60)
    return `Il y a ${diffHours}h`
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Localisation des livreurs
        </CardTitle>
        <CardDescription>Suivez en temps réel les livreurs disponibles et leur position</CardDescription>
      </CardHeader>
      <CardContent>
        {deliveryPeople.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Navigation className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Aucun livreur disponible pour le moment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {deliveryPeople.map((person) => (
              <Card key={person.id} className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold">
                        {person.firstName} {person.lastName}
                      </h4>
                      <p className="text-sm text-muted-foreground">{person.phone}</p>
                    </div>
                    <Badge variant="default" className="bg-green-500">
                      <Navigation className="h-3 w-3 mr-1" />
                      Disponible
                    </Badge>
                  </div>

                  {person.currentLatitude && person.currentLongitude ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Lat: {person.currentLatitude.toFixed(6)}, Long: {person.currentLongitude.toFixed(6)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Dernière mise à jour: {getTimeSinceUpdate(person.lastLocationUpdate)}</span>
                      </div>
                      <a
                        href={`https://www.google.com/maps?q=${person.currentLatitude},${person.currentLongitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline mt-2"
                      >
                        <MapPin className="h-4 w-4" />
                        Voir sur Google Maps
                      </a>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Position non disponible</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
