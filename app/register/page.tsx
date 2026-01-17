import { RegisterForm } from "@/components/auth/register-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-dark flex flex-col">
      {/* Top bar */}
      <header className="p-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Retour</span>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4 pb-8">
        <div className="w-full max-w-md space-y-6 animate-fade-in">
          {/* Logo */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-4">
              <span className="text-primary font-bold text-2xl">CE</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Créer votre compte</h1>
            <p className="text-muted-foreground">Rejoignez CampusEats en quelques secondes</p>
          </div>

          {/* Form */}
          <RegisterForm />

          {/* Footer links */}
          <p className="text-center text-sm text-muted-foreground">
            Vous avez déjà un compte ?{" "}
            <Link href="/login" className="text-primary hover:underline font-semibold">
              Se connecter
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
