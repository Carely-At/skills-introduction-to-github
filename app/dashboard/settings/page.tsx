import { Suspense } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { UserSettings } from "@/components/dashboard/settings/user-settings"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch user profile
  const { data: userData, error } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (error || !userData) {
    redirect("/login")
  }

  return (
    <div className="container-responsive py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-block mb-4">
            <Button variant="ghost" size="sm" className="-ml-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au tableau de bord
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres du compte</h1>
          <p className="text-gray-500 mt-2">Gérez vos informations personnelles et vos préférences</p>
        </div>

        <Suspense fallback={<SettingsLoadingSkeleton />}>
          <UserSettings user={userData} />
        </Suspense>
      </div>
    </div>
  )
}

function SettingsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}
