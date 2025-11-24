"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/hooks/useAuth"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Navigation, AlertCircle, CheckCircle } from "lucide-react"

export function LocationTracker() {
  const { userData } = useAuth()
  const [isTracking, setIsTracking] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [error, setError] = useState<string>("")
  const [watchId, setWatchId] = useState<number | null>(null)

  useEffect(() => {
    checkTrackingStatus()

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [watchId])

  const checkTrackingStatus = async () => {
    if (!userData?.uid) return

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("delivery_profiles")
        .select("current_latitude, current_longitude")
        .eq("user_id", userData.uid)
        .single()

      if (error) throw error

      if (data.current_latitude && data.current_longitude) {
        setIsTracking(true)
        setLocation({ lat: data.current_latitude, lng: data.current_longitude })
      }
    } catch (error) {
      console.error("[v0] Error checking tracking status:", error)
    }
  }

  const startTracking = async () => {
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas supportée par votre navigateur")
      return
    }

    setError("")

    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setLocation({ lat: latitude, lng: longitude })

        try {
          const supabase = createClient()
          const { error } = await supabase
            .from("delivery_profiles")
            .update({
              current_latitude: latitude,
              current_longitude: longitude,
            })
            .eq("user_id", userData?.uid)

          if (error) throw error

          setIsTracking(true)
          console.log("[v0] Location updated:", latitude, longitude)
        } catch (error) {
          console.error("[v0] Error updating location:", error)
          setError("Erreur lors de la mise à jour de la position")
        }
      },
      (error) => {
        console.error("[v0] Geolocation error:", error)
        setError("Impossible d'obtenir votre position. Vérifiez les autorisations.")
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    )

    setWatchId(id)
  }

  const stopTracking = async () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("delivery_profiles")
        .update({
          current_latitude: null,
          current_longitude: null,
        })
        .eq("user_id", userData?.uid)

      if (error) throw error

      setIsTracking(false)
      setLocation(null)
      console.log("[v0] Location tracking stopped")
    } catch (error) {
      console.error("[v0] Error stopping tracking:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Partage de localisation
            </CardTitle>
            <CardDescription>Partagez votre position en temps réel avec l'administrateur</CardDescription>
          </div>
          {isTracking && (
            <Badge variant="default" className="bg-green-500">
              <CheckCircle className="h-3 w-3 mr-1" />
              Actif
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {location && (
          <Alert>
            <MapPin className="h-4 w-4" />
            <AlertDescription>
              Position actuelle: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          {!isTracking ? (
            <Button onClick={startTracking} className="w-full" size="lg">
              <Navigation className="h-4 w-4 mr-2" />
              Activer le partage de localisation
            </Button>
          ) : (
            <Button onClick={stopTracking} variant="destructive" className="w-full" size="lg">
              Arrêter le partage
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Votre position sera visible uniquement par l'administrateur lorsque vous êtes disponible pour les livraisons.
        </p>
      </CardContent>
    </Card>
  )
}
