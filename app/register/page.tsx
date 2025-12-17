import { RegisterForm } from "@/components/auth/register-form"
import { SplitScreenLayout } from "@/components/auth/split-screen-layout"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <SplitScreenLayout
      title="Créer votre compte client"
      subtitle="Commandez vos repas préférés sur le campus en quelques secondes."
      quote="Créer votre compte client"
      isLogin={false}
    >
      <RegisterForm />

      <p className="text-center text-sm text-gray-600 mt-6">
        Vous avez déjà un compte ?{" "}
        <Link href="/login" className="text-[#4F46E5] hover:underline font-semibold">
          Se connecter
        </Link>
      </p>
    </SplitScreenLayout>
  )
}
