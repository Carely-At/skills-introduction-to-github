import type { ReactNode } from "react"
import Link from "next/link"
import { UtensilsCrossed } from "lucide-react"
import Image from "next/image"

interface SplitScreenLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
  quote?: string
  isLogin?: boolean
}

export function SplitScreenLayout({ children, title, subtitle, quote, isLogin = false }: SplitScreenLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Branding and image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#1E3A8A] via-[#1E40AF] to-[#3B82F6] overflow-hidden">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Content */}
        <div className="relative z-10 flex flex-col p-12 text-white w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group mb-12">
            <div className="h-10 w-10 rounded-lg bg-[#EF4444] flex items-center justify-center">
              <UtensilsCrossed className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">CampusEats</span>
          </Link>

          {/* Quote section - centered */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            {isLogin ? (
              <div className="space-y-6 mb-12">
                <h2 className="text-4xl font-bold leading-tight">{quote || "Bon retour parmi nous"}</h2>
                <p className="text-xl text-white/90 leading-relaxed max-w-md">
                  {subtitle || "Commandez vos repas préférés sur le campus instantanément."}
                </p>
              </div>
            ) : (
              <div className="space-y-6 mb-12">
                <h2 className="text-4xl font-bold leading-tight">Créer votre compte client</h2>
                <p className="text-xl text-white/90 leading-relaxed max-w-md">
                  Commandez vos repas préférés sur le campus en quelques secondes.
                </p>
              </div>
            )}

            {/* Food image */}
            <div className="relative w-full max-w-lg">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={isLogin ? "/images/pizza-basil.jpg" : "/images/fresh-salad-bowl.jpg"}
                  alt="Delicious food"
                  width={500}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          {/* Bottom quote */}
          <div className="mt-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <p className="text-lg italic text-white/95 leading-relaxed">
                "
                {isLogin
                  ? "Le moyen le plus simple de faire le plein d'énergie pour vos sessions d'étude. Des plats frais de vos endroits préférés du campus, livrés en quelques minutes."
                  : "CampusEats a complètement changé ma façon de gérer mes repas. Fini les files d'attente entre les cours !"}
                "
              </p>
              <p className="text-sm text-white/80 mt-3">- Sarah Jenkins</p>
              <p className="text-xs text-white/70">Étudiante en 2ème année, Arts & Design</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#EF4444] flex items-center justify-center">
                <UtensilsCrossed className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CampusEats</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-gray-600 text-base">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
