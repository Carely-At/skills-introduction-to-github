export type UserRole = "admin" | "sub-admin" | "vendor" | "delivery" | "client"
export type UserStatus = "pending" | "approved" | "rejected"

export interface User {
  uid: string
  email: string
  campusId: string
  role: UserRole
  firstName: string
  lastName: string
  phone: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  createdBy?: string
  approvedBy?: string
  status: UserStatus
  profilePhoto?: string
}

export interface VendorProfile extends User {
  role: "vendor"
  businessName: string
  locationImages: string[]
  canteenImage: string
  menuImages: string[]
  imagesApproved: boolean
  description?: string
}

export interface DeliveryProfile extends User {
  role: "delivery"
  vehicleType?: string
  isAvailable: boolean
  currentOrders: string[]
}

export interface ClientProfile extends User {
  role: "client"
  address?: string
  favoriteVendors: string[]
}

export interface AdminAction {
  id: string
  adminId: string
  adminName: string
  actionType: "create_user" | "approve_user" | "reject_user" | "delete_user" | "update_user" | "approve_images"
  targetUserId?: string
  targetUserName?: string
  details?: Record<string, any>
  createdAt: Date
}
