# 🔧 Guide de Dépannage CampusEats

Ce guide vous aide à résoudre les problèmes courants rencontrés avec CampusEats.

## 🔴 Erreurs d'Authentification Firebase

### Erreur : `auth/configuration-not-found`

**Message complet** : `Firebase: Error (auth/configuration-not-found).`

**Cause** : L'authentification Email/Password n'est pas activée dans la console Firebase.

**Solution étape par étape** :

1. Ouvrez [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet CampusEats
3. Dans le menu latéral gauche, cliquez sur **Build** → **Authentication**
4. Cliquez sur l'onglet **Sign-in method** (Méthode de connexion)
5. Dans la liste des fournisseurs d'authentification, trouvez **Email/Password**
6. Cliquez sur la ligne **Email/Password**
7. Dans la fenêtre qui s'ouvre, activez le commutateur **Enable** (Activer)
8. Cliquez sur **Save** (Enregistrer)
9. Retournez à votre application et actualisez la page

**Vérification** : Dans l'onglet "Sign-in method", vous devriez maintenant voir :
- Email/Password : **Enabled** ✅

---

### Erreur : `auth/invalid-api-key`

**Cause** : La clé API Firebase est incorrecte ou manquante.

**Solution** :

1. Vérifiez votre fichier `.env.local`
2. Assurez-vous que `NEXT_PUBLIC_FIREBASE_API_KEY` est correctement définie
3. Comparez avec la clé dans Firebase Console → Project Settings → General
4. Redémarrez le serveur : Ctrl+C puis `npm run dev`

---

### Erreur : `auth/user-not-found`

**Cause** : L'utilisateur n'existe pas dans Firebase Authentication.

**Solution pour l'admin** :

```bash
npm run seed:admin
```

**Solution pour les autres utilisateurs** :
- Les clients doivent s'inscrire via `/register`
- Les vendeurs/livreurs doivent être créés par l'admin via `/dashboard/admin`

---

### Erreur : `auth/wrong-password`

**Cause** : Le mot de passe est incorrect.

**Solution** :
- Vérifiez que vous utilisez le bon mot de passe
- Pour l'admin, le mot de passe par défaut est `@Carely_21`
- Utilisez la fonction "Mot de passe oublié" (à implémenter si nécessaire)

---

## 🌐 Erreurs de Configuration

### Erreur : "Missing Firebase configuration"

**Message dans la console** : `[v0] Missing Firebase config keys: [...]`

**Cause** : Une ou plusieurs variables d'environnement Firebase sont manquantes.

**Solution** :

1. Vérifiez que `.env.local` existe à la racine du projet
2. Vérifiez que toutes ces variables sont présentes :
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```
3. Assurez-vous qu'il n'y a pas d'espaces autour des `=`
4. Redémarrez complètement le serveur Next.js

---

### Erreur : Variables d'environnement non chargées

**Symptômes** : Les variables sont définies mais l'application ne les voit pas.

**Solution** :

1. **Vérifiez le nom du fichier** : Doit être `.env.local` (pas `.env` seul)
2. **Redémarrez le serveur** : Next.js ne recharge pas automatiquement les variables d'environnement
   ```bash
   # Arrêtez le serveur (Ctrl+C)
   npm run dev
   ```
3. **Variables côté client** : Doivent commencer par `NEXT_PUBLIC_`
4. **Vérifiez les guillemets** : N'utilisez PAS de guillemets autour des valeurs
   ```env
   # ✅ CORRECT
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB...

   # ❌ INCORRECT
   NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyB..."
   ```

---

## 📧 Problèmes d'Envoi d'Emails

### Les emails ne sont pas envoyés

**Cause possible 1** : Clé API SendGrid invalide

**Solution** :
1. Vérifiez `SENDGRID_API_KEY` dans `.env.local`
2. Créez une nouvelle clé API si nécessaire : [SendGrid API Keys](https://app.sendgrid.com/settings/api_keys)
3. La clé doit avoir les permissions "Mail Send"

**Cause possible 2** : Email expéditeur non vérifié

**Solution** :
1. Allez dans [SendGrid Sender Authentication](https://app.sendgrid.com/settings/sender_auth)
2. Vérifiez votre domaine ou votre email
3. Mettez à jour `SENDGRID_FROM_EMAIL` avec un email vérifié

**Cause possible 3** : Quota dépassé

**Solution** :
- Plan gratuit : 100 emails/jour
- Vérifiez votre utilisation dans le dashboard SendGrid
- Passez à un plan payant si nécessaire

---

## 🖼️ Problèmes d'Upload d'Images

### Les images ne s'uploadent pas

**Symptômes** : Erreur lors de l'upload ou upload infini

**Cause possible 1** : Règles Storage trop restrictives

**Solution** :
1. Allez dans Firebase Console → Storage → Rules
2. Vérifiez que les règles correspondent à `storage.rules`
3. Assurez-vous que les utilisateurs authentifiés peuvent écrire

**Cause possible 2** : Fichier trop volumineux

**Solution** :
- Limite par défaut : 5 MB
- Compressez vos images avant upload
- Utilisez des formats optimisés (WebP, JPEG optimisé)

**Cause possible 3** : Quota Storage dépassé

**Solution** :
- Plan gratuit Firebase : 5 GB
- Vérifiez votre utilisation dans Firebase Console → Storage
- Passez au plan Blaze si nécessaire

---

## 🚀 Problèmes de Déploiement Vercel

### Build échoue sur Vercel

**Erreur** : "Module not found" ou "Cannot find module"

**Solution** :
```bash
# Localement, supprimez les dossiers et réinstallez
rm -rf node_modules .next
npm install
npm run build

# Si ça fonctionne localement, pushez à nouveau
git add .
git commit -m "Fix dependencies"
git push
```

---

### Variables d'environnement manquantes sur Vercel

**Symptômes** : L'application fonctionne localement mais pas sur Vercel

**Solution** :

1. Allez dans Vercel Dashboard → Votre Projet → Settings → Environment Variables
2. Ajoutez **toutes** les variables de `.env.local`
3. Pour les variables `NEXT_PUBLIC_*`, cochez les 3 environnements :
   - ✅ Production
   - ✅ Preview
   - ✅ Development
4. **Important** : Après avoir ajouté des variables, redéployez :
   - Allez dans Deployments
   - Cliquez sur les trois points sur le dernier déploiement
   - Cliquez sur "Redeploy"

---

### Erreur : "This domain is not configured for this Firebase project"

**Cause** : Le domaine Vercel n'est pas autorisé dans Firebase

**Solution** :

1. Copiez votre URL Vercel (ex: `campuseats.vercel.app`)
2. Allez dans Firebase Console → Authentication → Settings → Authorized domains
3. Cliquez sur "Add domain"
4. Ajoutez votre domaine Vercel
5. Cliquez sur "Add"

---

## 🔐 Problèmes de Connexion

### Impossible de se connecter avec le CampusID

**Cause** : Le mapping CampusID → Email n'existe pas

**Solution** :

1. Vérifiez que l'utilisateur a bien été créé avec un CampusID
2. Pour les clients : Le CampusID est créé automatiquement lors de l'inscription
3. Pour les vendeurs/livreurs : Vérifiez que l'admin a bien créé le compte
4. Vérifiez dans Firestore → `campusIdMapping` que le document existe

---

### "Compte désactivé. Contactez l'administrateur"

**Cause** : Le champ `isActive` de l'utilisateur est `false`

**Solution (Admin)** :

1. Allez dans Firebase Console → Firestore
2. Ouvrez la collection `users`
3. Trouvez le document de l'utilisateur
4. Modifiez le champ `isActive` à `true`

---

## 🔍 Débogage Général

### Comment voir les logs de l'application ?

**En local** :
- Ouvrez la console du navigateur (F12)
- Regardez les logs préfixés par `[v0]`

**Sur Vercel** :
1. Allez dans Vercel Dashboard → Votre Projet → Deployments
2. Cliquez sur le déploiement actuel
3. Allez dans l'onglet "Functions"
4. Cliquez sur une fonction pour voir ses logs

---

### Comment vérifier si Firebase est bien configuré ?

**Test rapide** :

1. Ouvrez la console du navigateur
2. Tapez :
   ```javascript
   console.log(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
   ```
3. Si vous voyez votre Project ID, la configuration est OK
4. Si vous voyez `undefined`, les variables ne sont pas chargées

---

## 📞 Besoin d'aide supplémentaire ?

Si votre problème n'est pas résolu :

1. Vérifiez les logs de la console navigateur
2. Vérifiez les logs Vercel (si déployé)
3. Vérifiez les logs Firebase (Console → Analytics)
4. Créez une issue GitHub avec :
   - Description détaillée du problème
   - Messages d'erreur complets
   - Étapes pour reproduire
   - Captures d'écran si pertinent

**Contact** : kellyatemenou@gmail.com

---

## ✅ Checklist de Vérification

Avant de demander de l'aide, vérifiez cette checklist :

### Configuration Firebase
- [ ] Projet Firebase créé
- [ ] Authentication Email/Password **activée**
- [ ] Firestore Database créé
- [ ] Storage activé
- [ ] Règles Firestore déployées
- [ ] Règles Storage déployées
- [ ] Domaine autorisé dans Authentication

### Variables d'environnement
- [ ] Fichier `.env.local` existe
- [ ] Toutes les variables Firebase présentes
- [ ] Variables SendGrid présentes
- [ ] Variables admin présentes
- [ ] Pas de guillemets autour des valeurs
- [ ] Pas d'espaces autour des `=`

### Déploiement Vercel
- [ ] Code pushé sur GitHub
- [ ] Projet Vercel créé et lié
- [ ] Toutes les variables ajoutées sur Vercel
- [ ] Variables `NEXT_PUBLIC_*` pour les 3 environnements
- [ ] Application redéployée après ajout des variables
- [ ] Domaine Vercel ajouté à Firebase

### Compte Admin
- [ ] Variables `ADMIN_EMAIL` et `ADMIN_PASSWORD` correctes
- [ ] Script `seed:admin` exécuté
- [ ] Compte créé dans Firebase Authentication
- [ ] Document créé dans Firestore collection `users`

---

**Dernière mise à jour** : [Date]
