export interface MenuItem {
  id: string
  vendorId: string
  name: string
  description: string
  price: number
  image: string
  category: string
  isAvailable: boolean
  createdAt: Date
}

export interface OrderItem {
  menuItemId: string
  name: string
  price: number
  quantity: number
  image: string
}

export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "delivering" | "delivered" | "cancelled"

export interface Order {
  id: string
  clientId: string
  clientName: string
  clientPhone: string
  vendorId: string
  vendorName: string
  deliveryId?: string
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  deliveryAddress: string
  createdAt: Date
  updatedAt: Date
  notes?: string
}
