import { Suspense } from "react"
import AdminOverview from "@/components/dashboard/admin/admin-overview"

export default function AdminOverviewPage() {
  return (
    <div className="container mx-auto px-4 py-6 lg:px-8">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        }
      >
        <AdminOverview />
      </Suspense>
    </div>
  )
}
