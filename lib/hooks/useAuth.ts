"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@/lib/types/user"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function useAuth() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const mounted = useRef(true)

  useEffect(() => {
    console.log("[v0] useAuth: Initializing")
    mounted.current = true
    const supabase = createClient()

    async function fetchUserData(userId: string) {
      try {
        console.log("[v0] useAuth: Fetching user data for ID:", userId)
        
        // Add a timeout to prevent hanging indefinitely
        const fetchPromise = supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .maybeSingle()
          
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Request timed out")), 15000)
        )

        const result = await Promise.race([fetchPromise, timeoutPromise]) as any
        const { data, error } = result

        if (!mounted.current) return

        if (error) {
          console.error("[v0] useAuth: Error fetching user data:", error)
          setUserData(null)
        } else if (data) {
          console.log("[v0] useAuth: User data fetched successfully, role:", data.role)
          // Convert snake_case to camelCase
          const formattedUserData: User = {
            uid: data.id,
            email: data.email,
            campusId: data.campus_id,
            role: data.role,
            firstName: data.first_name,
            lastName: data.last_name,
            phone: data.phone,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
            isActive: data.is_active,
          }
          setUserData(formattedUserData)
        } else {
          console.log("[v0] useAuth: No user data found in database")
          setUserData(null)
        }
      } catch (error) {
        console.error("[v0] useAuth: Exception fetching user data:", error)
        if (mounted.current) setUserData(null)
      } finally {
        if (mounted.current) setLoading(false)
      }
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted.current) return
      
      console.log("[v0] useAuth: Initial session check, user:", !!session?.user)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        console.log("[v0] useAuth: User found, fetching user data")
        fetchUserData(session.user.id)
      } else {
        console.log("[v0] useAuth: No user found")
        setUserData(null)
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted.current) return
        
        console.log("[v0] useAuth: Auth state changed, event:", event, "user:", !!session?.user)
        setUser(session?.user ?? null)

        if (session?.user) {
          console.log("[v0] useAuth: Auth change - fetching user data")
          await fetchUserData(session.user.id)
        } else {
          console.log("[v0] useAuth: Auth change - no user")
          setUserData(null)
          setLoading(false)
        }
      }
    )

    return () => {
      console.log("[v0] useAuth: Cleaning up subscription")
      mounted.current = false
      subscription.unsubscribe()
    }
  }, [])

  console.log("[v0] useAuth: Current state - loading:", loading, "user:", !!user, "userData:", userData?.role)

  return {
    user,
    userData,
    loading,
    isAuthenticated: !!user,
    isAdmin: userData?.role === "admin",
    isVendor: userData?.role === "vendor",
    isDelivery: userData?.role === "delivery",
    isClient: userData?.role === "client",
  }
}
