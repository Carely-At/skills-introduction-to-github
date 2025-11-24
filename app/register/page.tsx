import { RegisterForm } from "@/components/auth/register-form"
import { UtensilsCrossed, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4 py-12">
      <div className="absolute inset-0 gradient-primary opacity-5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,oklch(0.68_0.18_35/0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,oklch(0.45_0.12_264/0.1),transparent_50%)]" />

      <div className="w-full max-w-md relative z-10">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-6 -ml-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>

          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                <UtensilsCrossed className="h-7 w-7 text-primary-foreground" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                CampusEats
              </span>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Rejoignez CampusEats</h1>
            <p className="text-muted-foreground">Créez votre compte et commencez à commander</p>
          </div>
        </div>

        <RegisterForm />

        <p className="text-center text-sm text-muted-foreground mt-6">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  )
}
