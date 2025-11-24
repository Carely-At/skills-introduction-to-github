import { ProtectedRoute } from "@/components/auth/protected-route"
import { DeliveryDashboard } from "@/components/dashboard/delivery/delivery-dashboard"

export default function DeliveryPage() {
  return (
    <ProtectedRoute allowedRoles={["delivery"]}>
      <DeliveryDashboard />
    </ProtectedRoute>
  )
}
