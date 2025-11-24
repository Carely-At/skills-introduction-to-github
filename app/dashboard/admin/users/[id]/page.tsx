import { Suspense } from "react"
import UserProfileDetail from "@/components/dashboard/admin/user-profile-detail"

export default function UserProfilePage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-6 lg:px-8">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        }
      >
        <UserProfileDetail userId={params.id} />
      </Suspense>
    </div>
  )
}
