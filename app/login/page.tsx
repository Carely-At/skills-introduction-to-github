import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
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
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Logo */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-4">
              <span className="text-primary font-bold text-2xl">CE</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Bon retour parmi nous</h1>
            <p className="text-muted-foreground">Commandez vos repas préférés sur le campus</p>
          </div>

          {/* Form */}
          <LoginForm />

          {/* Footer links */}
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Vous n'avez pas de compte ?{" "}
              <Link href="/register" className="text-primary hover:underline font-semibold">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
