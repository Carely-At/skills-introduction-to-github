import { ProtectedRoute } from "@/components/auth/protected-route"
import { ClientDashboard } from "@/components/dashboard/client/client-dashboard"

export default function ClientPage() {
  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <ClientDashboard />
    </ProtectedRoute>
  )
}
