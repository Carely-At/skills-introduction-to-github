import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail } from 'lucide-react'

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-md">
        <Card className="border-border shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">
              Merci pour votre inscription !
            </CardTitle>
            <CardDescription className="text-base">
              Veuillez vérifier votre boîte mail
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              Nous vous avons envoyé un email de confirmation avec votre <span className="font-semibold">CampusID</span>.
              Veuillez cliquer sur le lien dans l'email pour activer votre compte avant de vous connecter.
            </p>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                Vous n'avez pas reçu l'email ? Vérifiez votre dossier spam ou contactez le support.
              </p>
            </div>
            <Button asChild className="w-full">
              <Link href="/login">
                Retour à la connexion
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
