import { Suspense } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { UserSettings } from "@/components/dashboard/settings/user-settings"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, UtensilsCrossed } from "lucide-react"
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

  const { data: userData, error } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (error || !userData) {
    redirect("/login")
  }

  const getDashboardRoute = (role: string) => {
    switch (role) {
      case "admin":
      case "sub-admin":
        return "/dashboard/admin"
      case "vendor":
        return "/dashboard/vendor"
      case "delivery":
        return "/dashboard/delivery"
      case "client":
      default:
        return "/dashboard"
    }
  }

  const dashboardRoute = getDashboardRoute(userData.role)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f0f0f]/95 backdrop-blur-xl border-b border-[#1f1f1f]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={dashboardRoute}>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <UtensilsCrossed className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-white">CampusEats</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link
              href={dashboardRoute}
              className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-4 text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour au tableau de bord
            </Link>
            <h1 className="text-3xl font-bold text-white">Réglages</h1>
            <p className="text-gray-500 mt-2">Gérez votre profil, vos préférences et la sécurité de votre compte</p>
          </div>

          <Suspense fallback={<SettingsLoadingSkeleton />}>
            <UserSettings user={userData} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}

function SettingsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-64 w-full bg-[#1a1a1a]" />
      <Skeleton className="h-96 w-full bg-[#1a1a1a]" />
    </div>
  )
}
