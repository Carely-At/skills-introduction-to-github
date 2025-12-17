import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UtensilsCrossed, Search, MapPin, CreditCard, Package, ChefHat, ArrowRight, Star } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-[#EF4444] flex items-center justify-center">
                <UtensilsCrossed className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CampusEats</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
                Comment ça marche
              </Link>
              <Link href="#campus" className="text-gray-600 hover:text-gray-900 transition-colors">
                Campus
              </Link>
              <Link href="#become-partner" className="text-gray-600 hover:text-gray-900 transition-colors">
                Devenir Partenaire
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900">
                  Connexion
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-[#4F46E5] hover:bg-[#4338CA] text-white">
                  S'inscrire
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#EFF6FF] to-white py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  Boostez vos études. <span className="text-[#4F46E5]">Évitez la file.</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                  L'application officielle de commande de repas pour les étudiants et le personnel. Commandez à l'avance
                  chez vos vendeurs préférés du campus et récupérez entre les cours.
                </p>
              </div>

              {/* Campus Search */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2">
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center gap-3 px-4">
                    <Search className="h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Trouvez votre campus..."
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                    />
                  </div>
                  <Button className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 h-12 text-base">
                    Trouver à manger
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>+2 nouvelles</span>
                </div>
                <span>•</span>
                <span>+4 autres</span>
                <span>•</span>
                <span>+15%</span>
                <span>•</span>
                <span>+6,1</span>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/hero-students.jpg"
                  alt="Étudiants profitant de leurs repas sur le campus"
                  width={600}
                  height={500}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Comment fonctionne CampusEats</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Des étapes simples pour obtenir votre repas entre les cours sans manquer un cours magistral.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#EFF6FF] mb-4">
                <MapPin className="h-10 w-10 text-[#4F46E5]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Choisir le campus</h3>
              <p className="text-gray-600 leading-relaxed">
                Trouvez votre université et parcourez les vendeurs locaux disponibles avec votre forfait repas.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#FEF3C7] mb-4">
                <CreditCard className="h-10 w-10 text-[#F59E0B]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Commander à l'avance</h3>
              <p className="text-gray-600 leading-relaxed">
                Personnalisez votre repas, planifiez l'heure de retrait et payez en toute sécurité avec votre carte
                étudiante.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#DCFCE7] mb-4">
                <Package className="h-10 w-10 text-[#10B981]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Récupérer</h3>
              <p className="text-gray-600 leading-relaxed">
                Évitez la queue et récupérez votre nourriture au comptoir dédié CampusEats. Aucune attente !
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Vendors */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Vendeurs populaires sur le campus</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                <ArrowRight className="h-4 w-4 rotate-180" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { name: "Le Café Quotidien", category: "Café & Pâtisseries", image: "/cozy-cafe-with-latte-art.jpg" },
              { name: "Campus Burger", category: "Burgers & Frites", image: "/gourmet-burger-stack.jpg" },
              { name: "Feuille Verte", category: "Salades & Bols", image: "/fresh-green-salad-bowl-avocado.jpg" },
              { name: "Poulet Croustillant", category: "Poulet Frit", image: "/crispy-fried-chicken-basket.jpg" },
              { name: "Pizza U", category: "Pizzas & Ailes", image: "/hot-cheese-pizza-slice-pull.jpg" },
            ].map((vendor, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative rounded-2xl overflow-hidden mb-3 aspect-square">
                  <Image
                    src={vendor.image || "/placeholder.svg"}
                    alt={vendor.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 text-sm font-medium flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>4.8</span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
                <p className="text-sm text-gray-500">{vendor.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Students / For Vendors */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* For Students */}
            <div className="bg-gradient-to-br from-[#EFF6FF] to-white rounded-3xl p-8 md:p-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#4F46E5] mb-6">
                <UtensilsCrossed className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Pour les Étudiants</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Profitez d'offres exclusives, évitez les files d'attente et gérez votre budget repas au même endroit.
              </p>
              <Link href="/register">
                <Button className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-6">Rejoindre votre campus</Button>
              </Link>
            </div>

            {/* For Vendors */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <Image
                  src="/busy-restaurant-kitchen.jpg"
                  alt="Restaurant kitchen"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white mb-6">
                  <ChefHat className="h-8 w-8 text-gray-900" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Pour les Vendeurs</h2>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  Connectez-vous avec des milliers d'étudiants affamés. Optimisez vos commandes et augmentez vos
                  revenus.
                </p>
                <Link href="/register">
                  <Button variant="secondary" className="px-6">
                    Devenir partenaire
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-[#EF4444] flex items-center justify-center">
                  <UtensilsCrossed className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-lg">CampusEats</span>
              </div>
              <p className="text-sm text-gray-600">Nourrir l'avenir, un repas campus à la fois.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">ENTREPRISE</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/about" className="hover:text-gray-900">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-gray-900">
                    Carrières
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-gray-900">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">SUPPORT</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/help" className="hover:text-gray-900">
                    Centre d'aide
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-gray-900">
                    Sécurité
                  </Link>
                </li>
                <li>
                  <Link href="/conditions" className="hover:text-gray-900">
                    Conditions d'utilisation
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">INSTALLER L'APP</h3>
              <div className="space-y-3">
                <Link href="#" className="block">
                  <div className="bg-gray-900 text-white rounded-lg px-4 py-2 text-sm flex items-center gap-2">
                    <span className="font-semibold">App Store</span>
                  </div>
                </Link>
                <Link href="#" className="block">
                  <div className="bg-gray-900 text-white rounded-lg px-4 py-2 text-sm flex items-center gap-2">
                    <span className="font-semibold">Google Play</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            © 2025 CampusEats Inc. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  )
}
