import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UtensilsCrossed } from "lucide-react"

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <UtensilsCrossed className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">CampusEats</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Connexion</Button>
            </Link>
            <Link href="/register">
              <Button>Inscription</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Menu</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Connectez-vous pour découvrir tous les délicieux plats disponibles sur votre campus
        </p>
        <Link href="/register">
          <Button size="lg">Créer un compte pour voir le menu</Button>
        </Link>
      </main>
    </div>
  )
}
