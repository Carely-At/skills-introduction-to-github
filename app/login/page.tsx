import { LoginForm } from "@/components/auth/login-form"
import { SplitScreenLayout } from "@/components/auth/split-screen-layout"
import Link from "next/link"

export default function LoginPage() {
  return (
    <SplitScreenLayout
      title="Bon retour parmi nous"
      subtitle="Commandez vos repas préférés sur le campus instantanément."
      quote="Bon retour parmi nous"
      isLogin={true}
    >
      <LoginForm />

      <p className="text-center text-sm text-gray-600 mt-6">
        Vous n'avez pas de compte ?{" "}
        <Link href="/register" className="text-[#4F46E5] hover:underline font-semibold">
          S'inscrire
        </Link>
      </p>

      <div className="text-center mt-4">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
          Ou
        </Link>
      </div>
    </SplitScreenLayout>
  )
}
