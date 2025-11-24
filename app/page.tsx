import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UtensilsCrossed, Truck, ShoppingBag, ChefHat, Sparkles, Clock, Shield, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      <header className="sticky top-0 z-50 glass-morphism border-b border-border/50 safe-area-top">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl gradient-primary flex items-center justify-center group-hover:scale-105 transition-smooth shadow-soft">
                <UtensilsCrossed className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                CampusEats
              </span>
            </Link>
            <nav className="flex items-center gap-2 sm:gap-3">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-medium touch-target hover:bg-primary/5 transition-smooth"
                >
                  Connexion
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="font-medium shadow-soft hover:shadow-soft-lg transition-smooth touch-target"
                >
                  <span className="hidden sm:inline">Inscription</span>
                  <span className="sm:hidden">S'inscrire</span>
                  <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-accent/10 to-primary/10 text-foreground border border-accent/20 mb-4 sm:mb-6 shadow-soft">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
              <span className="text-xs sm:text-sm font-medium">Plateforme de livraison universitaire</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 text-balance leading-tight px-2">
              Savourez le meilleur de votre{" "}
              <span className="bg-gradient-to-r from-accent via-primary to-primary bg-clip-text text-transparent">
                campus
              </span>
            </h1>

            <p className="text-base sm:text-xl lg:text-2xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto text-pretty leading-relaxed px-4">
              Commandez vos repas préférés auprès des meilleures cantines universitaires. Livraison rapide, suivie en
              temps réel.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 shadow-soft-lg hover:shadow-soft-lg hover:scale-105 transition-smooth touch-target"
                >
                  Commencer gratuitement
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Link href="/menu" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 border-2 bg-card hover:bg-secondary transition-smooth touch-target"
                >
                  Explorer le menu
                </Button>
              </Link>
            </div>

            <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground px-4">
              <div className="flex items-center gap-2 bg-card/50 px-3 py-2 rounded-full border border-border">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <span>Livraison sous 20 min</span>
              </div>
              <div className="flex items-center gap-2 bg-card/50 px-3 py-2 rounded-full border border-border">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <span>Paiement sécurisé</span>
              </div>
              <div className="flex items-center gap-2 bg-card/50 px-3 py-2 rounded-full border border-border">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <span>100% qualité</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-28">
        <div className="text-center mb-10 sm:mb-16 px-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Pourquoi choisir CampusEats ?</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Une expérience de livraison pensée pour les étudiants, par des étudiants
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="group relative p-6 sm:p-8 rounded-3xl bg-card border border-border hover:border-accent/30 hover:shadow-soft-lg transition-smooth">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl gradient-accent mb-4 sm:mb-6 shadow-soft group-hover:scale-110 transition-smooth">
                <ShoppingBag className="h-7 w-7 sm:h-8 sm:w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">Commander simplement</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Interface intuitive pour parcourir les menus et passer commande en quelques clics
              </p>
            </div>
          </div>

          <div className="group relative p-6 sm:p-8 rounded-3xl bg-card border border-border hover:border-primary/30 hover:shadow-soft-lg transition-smooth">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl gradient-primary mb-4 sm:mb-6 shadow-soft group-hover:scale-110 transition-smooth">
                <Truck className="h-7 w-7 sm:h-8 sm:w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">Livraison express</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Suivi en temps réel de votre commande jusqu'à votre porte
              </p>
            </div>
          </div>

          <div className="group relative p-6 sm:p-8 rounded-3xl bg-card border border-border hover:border-accent/30 hover:shadow-soft-lg transition-smooth sm:col-span-2 md:col-span-1">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl gradient-accent mb-4 sm:mb-6 shadow-soft group-hover:scale-110 transition-smooth">
                <ChefHat className="h-7 w-7 sm:h-8 sm:w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">Qualité garantie</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Sélection rigoureuse des meilleurs vendeurs du campus
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent opacity-95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 sm:mb-6 text-primary-foreground text-balance px-4">
              Prêt à commander votre premier repas ?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-primary-foreground/90 mb-6 sm:mb-8 text-pretty px-4">
              Rejoignez des centaines d'étudiants qui gagnent du temps avec CampusEats
            </p>
            <Link href="/register">
              <Button
                size="lg"
                variant="secondary"
                className="text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6 shadow-soft-lg hover:scale-105 transition-smooth touch-target"
              >
                Créer un compte gratuitement
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card safe-area-bottom">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-primary flex items-center justify-center">
                <UtensilsCrossed className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-base sm:text-lg">CampusEats</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
              <Link href="/about" className="hover:text-foreground transition-colors touch-target">
                À propos
              </Link>
              <Link href="/contact" className="hover:text-foreground transition-colors touch-target">
                Contact
              </Link>
              <Link href="/faq" className="hover:text-foreground transition-colors touch-target">
                FAQ
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors touch-target">
                Conditions
              </Link>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground">© 2025 CampusEats. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
