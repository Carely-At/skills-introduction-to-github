import { ProtectedRoute } from "@/components/auth/protected-route"
import { VendorDashboard } from "@/components/dashboard/vendor/vendor-dashboard"

export default function VendorPage() {
  return (
    <ProtectedRoute allowedRoles={["vendor"]}>
      <VendorDashboard />
    </ProtectedRoute>
  )
}
