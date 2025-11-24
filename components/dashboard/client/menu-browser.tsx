"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { MenuItem } from "@/lib/types/order"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Plus, Store } from "lucide-react"
import Image from "next/image"
import { formatCFA } from "@/lib/utils/currency"

interface MenuBrowserProps {
  searchQuery: string
  onAddToCart: (item: MenuItem) => void
}

export function MenuBrowser({ searchQuery, onAddToCart }: MenuBrowserProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState("all")

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        console.log("[v0] MenuBrowser: Fetching menu items")
        const supabase = createClient()

        const { data, error } = await supabase
          .from("menu_items")
          .select(`
            *,
            vendor:users!menu_items_vendor_id_fkey(
              id,
              vendor_profile:vendor_profiles(images_approved, business_name)
            )
          `)
          .eq("is_available", true)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("[v0] Error fetching menu items:", error)
          throw error
        }

        console.log("[v0] MenuBrowser: Raw data:", data)

        const approvedItems = data?.filter((item: any) => item.vendor?.vendor_profile?.images_approved === true) || []

        console.log("[v0] MenuBrowser: Approved items count:", approvedItems.length)

        const items = approvedItems.map((item: any) => ({
          id: item.id,
          vendorId: item.vendor_id,
          name: item.name,
          description: item.description || "",
          price: Number(item.price),
          image: item.image,
          category: item.category,
          isAvailable: item.is_available,
          createdAt: new Date(item.created_at),
        })) as MenuItem[]

        setMenuItems(items)
      } catch (error) {
        console.error("[v0] Error fetching menu items:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMenuItems()
  }, [])

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = category === "all" || item.category === category
    return matchesSearch && matchesCategory
  })

  const categories = ["all", ...Array.from(new Set(menuItems.map((item) => item.category)))]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (menuItems.length === 0) {
    return (
      <div className="text-center py-12">
        <Store className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Aucun menu disponible</h3>
        <p className="text-muted-foreground">Les vendeurs n'ont pas encore ajouté de plats. Revenez plus tard !</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={category} onValueChange={setCategory}>
        <TabsList>
          {categories.map((cat) => (
            <TabsTrigger key={cat} value={cat} className="capitalize">
              {cat === "all" ? "Tous" : cat}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Aucun résultat trouvé pour "{searchQuery}"</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-muted">
                <Image
                  src={item.image || "/placeholder.svg?height=200&width=400"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <CardDescription className="text-sm">{item.description}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {item.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary">{formatCFA(item.price)}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => onAddToCart(item)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter au panier
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
