# Guide de Configuration Firebase pour CampusEats

Ce guide vous aidera à configurer correctement Firebase pour que CampusEats fonctionne sans erreurs.

## Erreur Courante : "auth/operation-not-allowed"

Si vous voyez cette erreur lors de la connexion, c'est que l'authentification Email/Password n'est pas activée dans Firebase.

## Solution Étape par Étape (avec captures d'écran)

### Étape 1 : Accéder à la Console Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Connectez-vous avec votre compte Google
3. Sélectionnez votre projet CampusEats

### Étape 2 : Naviguer vers Authentication

1. Dans le menu latéral gauche, cliquez sur **"Build"** ou **"Créer"**
2. Cliquez sur **"Authentication"**
3. Si c'est la première fois, cliquez sur **"Get Started"** ou **"Commencer"**

### Étape 3 : Activer Email/Password

1. Cliquez sur l'onglet **"Sign-in method"** ou **"Méthode de connexion"** en haut
2. Dans la liste des fournisseurs, trouvez **"Email/Password"**
3. Cliquez sur la ligne **"Email/Password"** pour ouvrir les paramètres
4. Vous verrez deux options :
   - **Email/Password** (activez celui-ci)
   - Email link (passwordless sign-in) (laissez désactivé)
5. Activez le commutateur pour **"Enable"** ou **"Activer"**
6. Cliquez sur **"Save"** ou **"Enregistrer"**

### Étape 4 : Vérifier l'Activation

Après l'enregistrement, vous devriez voir :
- **Email/Password** avec un statut **"Enabled"** ou **"Activé"** (en vert)
- Une coche ou indicateur montrant que c'est actif

### Étape 5 : Tester la Connexion

1. Retournez sur votre application CampusEats
2. Rechargez la page de connexion
3. Essayez de vous connecter avec :
   - Email : `kellyatemenou@gmail.com`
   - Password : `@Carely_21`

## Autres Configurations Firebase Requises

### Configuration Firestore

1. Dans Firebase Console, allez dans **Firestore Database**
2. Cliquez sur **"Create database"** si ce n'est pas déjà fait
3. Choisissez le mode **"Production"** ou **"Test"** (recommandé pour développement)
4. Sélectionnez une région proche de vos utilisateurs
5. Allez dans l'onglet **"Rules"** ou **"Règles"**
6. Copiez-collez le contenu de votre fichier `firestore.rules`
7. Cliquez sur **"Publish"** ou **"Publier"**

### Configuration Storage

1. Dans Firebase Console, allez dans **Storage**
2. Cliquez sur **"Get Started"** si ce n'est pas déjà fait
3. Choisissez les règles de sécurité (mode test ou production)
4. Sélectionnez une région
5. Allez dans l'onglet **"Rules"** ou **"Règles"**
6. Copiez-collez le contenu de votre fichier `storage.rules`
7. Cliquez sur **"Publish"** ou **"Publier"**

## Vérification Complète de la Configuration

Utilisez cette checklist pour vous assurer que tout est configuré :

- [ ] Projet Firebase créé
- [ ] Authentication activée
- [ ] Email/Password activé dans Sign-in method
- [ ] Firestore Database créé
- [ ] Règles Firestore configurées (copiées depuis firestore.rules)
- [ ] Storage activé
- [ ] Règles Storage configurées (copiées depuis storage.rules)
- [ ] Variables d'environnement définies dans .env.local
- [ ] Toutes les clés Firebase copiées correctement
- [ ] Application Next.js redémarrée après configuration

## Variables d'Environnement Requises

Assurez-vous que votre fichier `.env.local` contient toutes ces variables :

\`\`\`env
# Firebase Configuration (trouvez ces valeurs dans Firebase Console → Project Settings → General)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre-projet.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre-projet-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre-projet.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Admin Principal
ADMIN_EMAIL=kellyatemenou@gmail.com
ADMIN_PASSWORD=@Carely_21

# SendGrid (pour l'envoi d'emails)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@votredomaine.com

# URL de l'application
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

## Où Trouver les Clés Firebase ?

1. Dans Firebase Console, cliquez sur l'icône engrenage ⚙️ à côté de "Project Overview"
2. Cliquez sur **"Project settings"** ou **"Paramètres du projet"**
3. Descendez jusqu'à **"Your apps"** ou **"Vos applications"**
4. Si vous n'avez pas encore d'app Web, cliquez sur l'icône `</>`
5. Suivez les étapes pour enregistrer votre app
6. Copiez les valeurs de configuration Firebase qui s'affichent
7. Collez-les dans votre fichier `.env.local`

## Problèmes Persistants ?

Si après avoir suivi toutes ces étapes vous avez encore des problèmes :

1. **Vérifiez les logs de la console** : Ouvrez les DevTools (F12) et regardez l'onglet Console
2. **Vérifiez Network** : Dans DevTools, onglet Network, cherchez des requêtes échouées vers Firebase
3. **Redémarrez complètement** : 
   - Arrêtez le serveur Next.js (Ctrl+C)
   - Supprimez le dossier `.next` : `rm -rf .next`
   - Redémarrez : `npm run dev`
4. **Vérifiez les quotas Firebase** : Assurez-vous que vous n'avez pas dépassé les limites gratuites
5. **Consultez le README.md** : Section "Résolution de problèmes"

## Support

Pour une aide supplémentaire :
- Consultez la [Documentation Firebase officielle](https://firebase.google.com/docs/auth)
- Ouvrez une issue sur le repository GitHub
- Contactez : kellyatemenou@gmail.com

---

**Note** : Firebase offre un plan gratuit généreux (Spark Plan) suffisant pour le développement et les petits projets. Pour la production avec beaucoup d'utilisateurs, vous devrez passer au plan Blaze (pay-as-you-go).
