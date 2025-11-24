"use client"

import type { UserRole } from "@/lib/types/user"

export const PERMISSIONS = {
  // User management
  VIEW_ALL_USERS: ["admin"],
  VIEW_USER_PROFILE: ["admin", "sub-admin"],
  VIEW_NON_ADMIN_USERS: ["admin", "sub-admin"],
  CREATE_ADMIN: ["admin"],
  CREATE_SUB_ADMIN: ["admin"],
  CREATE_VENDOR: ["admin", "sub-admin"],
  CREATE_DELIVERY: ["admin", "sub-admin"],
  CREATE_CLIENT: ["admin", "sub-admin"],
  DELETE_USER: ["admin"],
  APPROVE_USER: ["admin"],
  REJECT_USER: ["admin"],
  EDIT_USER_PROFILE: ["admin"],

  // Order management
  VIEW_ALL_ORDERS: ["admin", "sub-admin"],

  // Vendor management
  APPROVE_VENDOR_IMAGES: ["admin", "sub-admin"],
  VIEW_VENDOR_REVIEWS: ["admin", "sub-admin"],

  // Statistics
  VIEW_STATISTICS: ["admin", "sub-admin"],
} as const

export function hasPermission(userRole: UserRole | undefined, permission: keyof typeof PERMISSIONS): boolean {
  if (!userRole) return false
  return PERMISSIONS[permission].includes(userRole)
}

export function canCreateUser(adminRole: UserRole | undefined, targetRole: UserRole): boolean {
  if (!adminRole) return false

  if (adminRole === "admin") return true
  if (adminRole === "sub-admin" && ["vendor", "delivery", "client"].includes(targetRole)) return true

  return false
}

export function canViewUser(adminRole: UserRole | undefined, targetRole: UserRole): boolean {
  if (!adminRole) return false

  if (adminRole === "admin") return true
  if (adminRole === "sub-admin" && !["admin", "sub-admin"].includes(targetRole)) return true

  return false
}

export function canEditUser(adminRole: UserRole | undefined): boolean {
  return adminRole === "admin"
}

export function canDeleteUser(adminRole: UserRole | undefined, targetRole: UserRole): boolean {
  if (adminRole !== "admin") return false
  return true
}

export function getMaskedEmail(email: string, userRole: UserRole | undefined): string {
  if (userRole === "admin") return email

  const [local, domain] = email.split("@")
  if (!local || !domain) return email

  const maskedLocal = local.length > 2 ? `${local[0]}***${local[local.length - 1]}` : `${local[0]}***`

  return `${maskedLocal}@${domain}`
}
