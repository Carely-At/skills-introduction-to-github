# ✅ Checklist de Déploiement CampusEats

Utilisez cette checklist pour vous assurer que votre déploiement sur Vercel se passe sans problème.

## 📋 Avant le déploiement

### Firebase Configuration

- [ ] Projet Firebase créé
- [ ] **Authentication Email/Password activée** (étape critique !)
  - Allez dans Authentication → Sign-in method
  - Activez Email/Password
  - Vérifiez que le statut est "Enabled"
- [ ] Firestore Database activé
- [ ] Firebase Storage activé
- [ ] Règles Firestore copiées depuis `firestore.rules`
- [ ] Règles Storage copiées depuis `storage.rules`
- [ ] Configuration Web App créée et clés récupérées

### Firebase Admin SDK

- [ ] Service Account Key téléchargé
  - Firebase Console → Project Settings → Service Accounts
  - "Generate New Private Key"
- [ ] `client_email` copié
- [ ] `private_key` copié (avec les `\n` préservés)

### SendGrid Configuration

- [ ] Compte SendGrid créé
- [ ] Clé API créée avec permissions d'envoi
- [ ] Email d'envoi vérifié (ou domaine vérifié)

### Code

- [ ] Code poussé sur GitHub
- [ ] `.env.local` configuré localement et testé
- [ ] Application testée en local (`npm run dev`)
- [ ] Admin créé en local (`npm run seed:admin`) et testé

## 🚀 Déploiement sur Vercel

### Configuration initiale

- [ ] Repository GitHub importé dans Vercel
- [ ] Framework détecté : Next.js
- [ ] Build Command : `npm run build` (ou par défaut)

### Variables d'environnement

Vérifiez que **TOUTES** ces variables sont ajoutées dans Vercel :

#### Firebase Client (NEXT_PUBLIC_*)
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`

**Important** : Ces variables doivent être ajoutées pour **Production**, **Preview** ET **Development**

#### Firebase Admin
- [ ] `FIREBASE_CLIENT_EMAIL`
- [ ] `FIREBASE_PRIVATE_KEY` (avec les `\n` complets)

#### Authentification Admin
- [ ] `ADMIN_EMAIL`
- [ ] `ADMIN_PASSWORD`

#### SendGrid
- [ ] `SENDGRID_API_KEY`
- [ ] `SENDGRID_FROM_EMAIL`

#### Application
- [ ] `NEXT_PUBLIC_APP_URL` (votre URL Vercel, ex: `https://campuseats.vercel.app`)

### Premier déploiement

- [ ] Cliquez sur "Deploy"
- [ ] Attendez la fin du build (environ 2-3 minutes)
- [ ] Vérifiez qu'il n'y a pas d'erreurs dans les logs

## ✅ Post-déploiement

### Firebase

- [ ] Domaine Vercel ajouté aux "Authorized domains"
  - Firebase Console → Authentication → Settings → Authorized domains
  - Ajoutez `votre-app.vercel.app`

### Test de l'application

- [ ] Page d'accueil accessible
- [ ] Page `/login` accessible
- [ ] Page `/register` accessible

### Création de l'admin

Choisissez une option :

**Option A : Via l'interface**
- [ ] Allez sur `/login`
- [ ] Entrez `kellyatemenou@gmail.com` / `@Carely_21`
- [ ] Cliquez sur "Initialiser le compte administrateur" si proposé
- [ ] Vérifiez que la connexion fonctionne

**Option B : Via API**
- [ ] Faites un POST à `https://votre-app.vercel.app/api/init-admin`
- [ ] Vérifiez la réponse (devrait être `{ success: true }`)

### Test complet

- [ ] Connexion admin réussie
- [ ] Dashboard admin accessible (`/dashboard/admin`)
- [ ] Création d'un vendeur test
- [ ] Email reçu avec CampusID et identifiants
- [ ] Connexion vendeur avec CampusID
- [ ] Upload d'image par le vendeur
- [ ] Approbation d'image par l'admin
- [ ] Inscription d'un client via `/register`
- [ ] Connexion client et navigation du menu

## 🐛 En cas de problème

### Le build échoue

- [ ] Vérifiez les logs de build dans Vercel
- [ ] Assurez-vous que toutes les variables d'environnement sont définies
- [ ] Vérifiez que `FIREBASE_PRIVATE_KEY` est complet avec les `\n`
- [ ] Redéployez après avoir corrigé les variables

### L'admin ne peut pas se connecter

- [ ] Vérifiez que Email/Password est activé dans Firebase
- [ ] Vérifiez les variables `ADMIN_EMAIL` et `ADMIN_PASSWORD`
- [ ] Essayez l'initialisation via `/api/init-admin`
- [ ] Vérifiez les logs Vercel pour les erreurs

### Les emails ne partent pas

- [ ] Vérifiez `SENDGRID_API_KEY` dans Vercel
- [ ] Vérifiez que `SENDGRID_FROM_EMAIL` est vérifié dans SendGrid
- [ ] Consultez les logs SendGrid Dashboard
- [ ] Vérifiez les quotas SendGrid

### Les images ne s'uploadent pas

- [ ] Vérifiez les règles Storage dans Firebase
- [ ] Vérifiez que l'utilisateur est authentifié
- [ ] Consultez la console du navigateur pour les erreurs
- [ ] Vérifiez les quotas Firebase Storage

## 📱 Domaine personnalisé (optionnel)

Si vous voulez utiliser votre propre domaine :

- [ ] Domaine acheté et DNS configuré
- [ ] Domaine ajouté dans Vercel Settings → Domains
- [ ] Domaine ajouté aux Authorized domains Firebase
- [ ] `NEXT_PUBLIC_APP_URL` mis à jour avec le nouveau domaine
- [ ] Application redéployée

## 🎉 Déploiement réussi !

Si tous les points sont cochés, votre application CampusEats est maintenant en production et prête à être utilisée !

**Prochaines étapes** :
1. Créez vos premiers vendeurs et livreurs
2. Demandez-leur d'uploader leurs images
3. Approuvez les images
4. Invitez les clients à s'inscrire
5. Commencez à recevoir des commandes !

---

**Besoin d'aide ?** Consultez le `README.md` ou contactez kellyatemenou@gmail.com
