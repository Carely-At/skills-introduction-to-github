export type UserRole = "admin" | "vendor" | "delivery" | "client"

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
