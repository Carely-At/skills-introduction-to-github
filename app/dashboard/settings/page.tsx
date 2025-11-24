import { Suspense } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { UserSettings } from "@/components/dashboard/settings/user-settings"
import { Skeleton } from "@/components/ui/skeleton"

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
