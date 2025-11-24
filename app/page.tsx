import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UtensilsCrossed, Truck, ShoppingBag, ChefHat, Sparkles, Clock, Shield, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Modern Header with gradient */}
      <header className="sticky top-0 z-50 glass-morphism border-b border-border/50">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                CampusEats
              </span>
            </Link>
            <nav className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="font-medium">
                  Connexion
                </Button>
              </Link>
              <Link href="/register">
                <Button className="font-medium shadow-lg shadow-primary/20">
                  Inscription
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section with modern gradient */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-5" />
        <div className="container mx-auto px-4 lg:px-8 py-24 lg:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent-foreground border border-accent/20 mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Plateforme de livraison universitaire</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-balance leading-tight">
              Savourez le meilleur de votre{" "}
              <span className="bg-gradient-to-r from-accent via-accent to-primary bg-clip-text text-transparent">
                campus
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty leading-relaxed">
              Commandez vos repas préférés auprès des meilleures cantines universitaires. Livraison rapide, suivie en
              temps réel.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-lg px-8 py-6 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all"
                >
                  Commencer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/menu" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-lg px-8 py-6 border-2 bg-transparent"
                >
                  Explorer le menu
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Livraison sous 20 min</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Paiement sécurisé</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span>100% qualité</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid with modern cards */}
      <section className="container mx-auto px-4 lg:px-8 py-20 lg:py-28">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Pourquoi choisir CampusEats ?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Une expérience de livraison pensée pour les étudiants, par des étudiants
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-accent mb-6 shadow-lg shadow-accent/20">
                <ShoppingBag className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Commander simplement</h3>
              <p className="text-muted-foreground leading-relaxed">
                Interface intuitive pour parcourir les menus et passer commande en quelques clics
              </p>
            </div>
          </div>

          <div className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-6 shadow-lg shadow-primary/20">
                <Truck className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Livraison express</h3>
              <p className="text-muted-foreground leading-relaxed">
                Suivi en temps réel de votre commande jusqu'à votre porte
              </p>
            </div>
          </div>

          <div className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-accent mb-6 shadow-lg shadow-accent/20">
                <ChefHat className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Qualité garantie</h3>
              <p className="text-muted-foreground leading-relaxed">
                Sélection rigoureuse des meilleurs vendeurs du campus
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with gradient background */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-95" />
        <div className="container mx-auto px-4 lg:px-8 py-20 lg:py-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-primary-foreground text-balance">
              Prêt à commander votre premier repas ?
            </h2>
            <p className="text-lg lg:text-xl text-primary-foreground/80 mb-8 text-pretty">
              Rejoignez des centaines d'étudiants qui gagnent du temps avec CampusEats
            </p>
            <Link href="/register">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-10 py-6 shadow-xl hover:scale-105 transition-transform"
              >
                Créer un compte gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">CampusEats</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <Link href="/about" className="hover:text-foreground transition-colors">
                À propos
              </Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
              <Link href="/faq" className="hover:text-foreground transition-colors">
                FAQ
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Conditions
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">© 2025 CampusEats. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
