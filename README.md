# 🍽️ CampusEats - Plateforme Universitaire de Livraison de Repas

CampusEats est une plateforme complète de livraison de repas conçue pour les campus universitaires, permettant aux étudiants de commander facilement leurs repas auprès des vendeurs locaux avec un système de livraison intégré.

## 🎯 Fonctionnalités principales

- **Authentification multi-rôles** : Admin, Vendeurs, Livreurs, Clients
- **CampusID unique** : Chaque utilisateur reçoit un identifiant unique
- **Connexion flexible** : Connexion via email ou CampusID
- **Gestion des vendeurs** : Upload et validation d'images par l'admin
- **Système de commande** : Les clients peuvent parcourir les menus et commander
- **Suivi en temps réel** : Suivi des commandes de la préparation à la livraison
- **Notifications email** : Envoi automatique des identifiants et confirmations

## 🏗️ Technologies utilisées

- **Framework** : Next.js 14 (App Router) avec TypeScript
- **Style** : TailwindCSS v4 avec shadcn/ui
- **Base de données** : Supabase (PostgreSQL)
- **Authentification** : Supabase Auth
- **Stockage** : Supabase Storage
- **Emails** : SendGrid
- **Hébergement** : Vercel

## Migration Firebase → Supabase ✅

CampusEats a été migré avec succès de Firebase vers Supabase !

### Pourquoi Supabase ?

- **PostgreSQL** : Base de données relationnelle robuste
- **Row Level Security (RLS)** : Sécurité intégrée au niveau des données
- **Temps réel** : Subscriptions en temps réel natives
- **Performance** : Requêtes SQL optimisées
- **Coûts** : Plan gratuit plus généreux

### Guide de Migration

Consultez [SUPABASE_MIGRATION.md](./SUPABASE_MIGRATION.md) pour le guide complet de migration.

### Scripts de Configuration

Les scripts SQL se trouvent dans `scripts/` et doivent être exécutés dans l'ordre :
1. `01-create-users-table.sql`
2. `02-create-profiles-tables.sql`
3. `03-create-menu-tables.sql`
4. `04-create-orders-tables.sql`
5. `05-create-storage-bucket.sql`

Voir [scripts/README.md](./scripts/README.md) pour plus de détails.

## 📋 Prérequis

- Node.js 18+ et npm/yarn/pnpm
- Un compte Supabase (gratuit)
- Un compte SendGrid pour l'envoi d'emails
- Un compte Vercel pour le déploiement

## 🚀 Installation locale

### 1. Cloner le projet

\`\`\`bash
git clone https://github.com/votre-username/campuseats.git
cd campuseats
\`\`\`

### 2. Installer les dépendances

\`\`\`bash
npm install
# ou
yarn install
# ou
pnpm install
\`\`\`

**⚠️ IMPORTANT - Compatibilité des versions Firebase** :

Si vous rencontrez l'erreur `Component auth has not been registered yet`, c'est dû à une incompatibilité entre les versions des packages Firebase. Les versions exactes ont été fixées dans `package.json` pour éviter ce problème.

Si l'erreur persiste après l'installation :
\`\`\`bash
# Nettoyez et réinstallez les dépendances
rm -rf node_modules package-lock.json
npm install
\`\`\`

Pour plus de détails, consultez [FIREBASE_VERSION_FIX.md](./FIREBASE_VERSION_FIX.md).

### 3. Configuration Supabase

#### a) Créer un projet Supabase

1. Allez sur [Supabase](https://supabase.com/)
2. Cliquez sur "New Project"
3. Créez une organisation si nécessaire
4. Configurez votre projet :
   - Nom du projet
   - Mot de passe de la base de données (gardez-le en sécurité)
   - Région (choisissez la plus proche de vos utilisateurs)

#### b) Exécuter les scripts SQL

1. Dans le dashboard Supabase, allez dans **SQL Editor**
2. Exécutez les scripts dans l'ordre (voir `scripts/README.md`) :
   - `01-create-users-table.sql`
   - `02-create-profiles-tables.sql`
   - `03-create-menu-tables.sql`
   - `04-create-orders-tables.sql`
   - `05-create-storage-bucket.sql`

#### c) Récupérer les clés de configuration

1. Dans les paramètres du projet → API
2. Copiez :
   - **Project URL** → `SUPABASE_URL`
   - **anon/public key** → `SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (gardez-la secrète!)

### 4. Configuration SendGrid

1. Créez un compte sur [SendGrid](https://sendgrid.com/)
2. Créez une clé API avec les permissions d'envoi d'emails
3. Vérifiez votre domaine d'envoi (ou utilisez un email vérifié)

### 5. Variables d'environnement

Copiez le fichier `.env.example` vers `.env.local` :

\`\`\`bash
cp .env.example .env.local
\`\`\`

Remplissez toutes les variables :

\`\`\`env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin Principal
ADMIN_EMAIL=kellyatemenou@gmail.com
ADMIN_PASSWORD=@Carely_21

# SendGrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@votredomaine.com

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 6. Créer l'administrateur principal

Pour créer le compte administrateur initial :

\`\`\`bash
npm run seed:admin
\`\`\`

Cela créera automatiquement le compte admin avec les identifiants définis dans `.env.local`.

### 7. Lancer l'application en local

\`\`\`bash
npm run dev
\`\`\`

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🌐 Déploiement sur Vercel

### Option 1 : Déploiement via GitHub (Recommandé)

#### 1. Pusher le code sur GitHub

\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/votre-username/campuseats.git
git push -u origin main
\`\`\`

#### 2. Obtenir les credentials Supabase Admin SDK

Pour créer l'administrateur automatiquement, vous avez besoin des credentials Supabase Admin :

1. Dans Supabase Dashboard, allez dans **Settings** → **API Keys**
2. Copiez :
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Important** : Ne partagez JAMAIS la `SUPABASE_SERVICE_ROLE_KEY` publiquement.

#### 3. Déployer sur Vercel

1. Allez sur [Vercel](https://vercel.com/)
2. Cliquez sur "New Project"
3. Importez votre repository GitHub
4. Configurez le projet :
   - **Framework Preset** : Next.js
   - **Root Directory** : ./
   - **Build Command** : `npm run build`
   - **Output Directory** : `.next`

#### 4. Ajouter les variables d'environnement

Dans les paramètres du projet Vercel → Environment Variables, ajoutez **TOUTES** les variables suivantes :

**Variables Supabase** :
\`\`\`
SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
\`\`\`

**Variables Admin** :
\`\`\`
ADMIN_EMAIL=kellyatemenou@gmail.com
ADMIN_PASSWORD=@Carely_21
\`\`\`

**Variables SendGrid** :
\`\`\`
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@votredomaine.com
\`\`\`

**URL de l'application** :
\`\`\`
NEXT_PUBLIC_APP_URL=https://votre-app.vercel.app
\`\`\`

⚠️ **Notes importantes** :
- Assurez-vous que toutes les variables `NEXT_PUBLIC_*` sont ajoutées pour les environnements **Production**, **Preview** et **Development**
- Ne partagez JAMAIS la `SUPABASE_SERVICE_ROLE_KEY` publiquement

#### 5. Redéployer

Après avoir ajouté les variables d'environnement, cliquez sur "Redeploy" pour appliquer les changements.

### Option 2 : Déploiement via CLI Vercel

\`\`\`bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Ajouter les variables d'environnement
vercel env add SUPABASE_URL
# ... (répéter pour chaque variable)

# Redéployer avec les variables
vercel --prod
\`\`\`

## 🔐 Configuration post-déploiement

### 1. Mettre à jour les URLs autorisées dans Supabase

1. Supabase Dashboard → Authentication → URL Configuration
2. Ajoutez votre domaine Vercel dans **Site URL** et **Redirect URLs**
   - Site URL : `https://votre-app.vercel.app`
   - Redirect URLs : `https://votre-app.vercel.app/**`

### 2. Créer l'admin en production

L'administrateur est maintenant créé automatiquement ! Deux options :

**Option A : Initialisation automatique via l'interface**
1. Allez sur votre site en production (`https://votre-app.vercel.app`)
2. Allez sur `/login`
3. Entrez les identifiants admin (`kellyatemenou@gmail.com` / `@Carely_21`)
4. Si le compte n'existe pas, cliquez sur le bouton "Initialiser le compte administrateur"
5. Le compte sera créé automatiquement

**Option B : Via API**
1. Faites une requête POST à `https://votre-app.vercel.app/api/init-admin`
2. Le compte admin sera créé si les variables d'environnement sont correctes
3. Vous recevrez une confirmation avec le CampusID

### 3. Tester l'application

1. Accédez à votre URL de production
2. Connectez-vous avec les identifiants admin :
   - Email : `kellyatemenou@gmail.com`
   - Mot de passe : `@Carely_21`
3. Créez votre premier vendeur/livreur depuis le dashboard admin

## 👥 Types d'utilisateurs et accès

### Administrateur Principal
- **Email** : kellyatemenou@gmail.com
- **Accès** : `/dashboard/admin`
- **Permissions** :
  - Créer des vendeurs et livreurs
  - Approuver les images des vendeurs
  - Gérer tous les utilisateurs
  - Voir toutes les commandes

### Vendeurs
- **Création** : Uniquement par l'admin
- **Accès** : `/dashboard/vendor`
- **Permissions** :
  - Uploader des images (cantine, emplacement, repas)
  - Gérer le menu
  - Voir et gérer les commandes reçues

### Livreurs
- **Création** : Uniquement par l'admin
- **Accès** : `/dashboard/delivery`
- **Permissions** :
  - Voir les commandes à livrer
  - Accepter/Refuser des livraisons
  - Mettre à jour le statut des livraisons

### Clients
- **Inscription** : Libre via `/register`
- **Accès** : `/dashboard/client`
- **Permissions** :
  - Parcourir les menus
  - Passer des commandes
  - Suivre l'état des commandes

## 📱 Utilisation du CampusID

Chaque utilisateur reçoit un **CampusID unique** au format :
- Clients : `CLI-XXXXXXXXX`
- Vendeurs : `VEN-XXXXXXXXX`
- Livreurs : `DEL-XXXXXXXXX`
- Admin : `ADM-XXXXXXXXX`

Le CampusID est envoyé par email et peut être utilisé pour se connecter à la place de l'email.

## 🔄 Workflow des images (Vendeurs)

1. Le vendeur upload ses images depuis son dashboard
2. Les images sont stockées dans Supabase Storage
3. L'admin reçoit une notification
4. L'admin approuve ou refuse les images depuis `/dashboard/admin`
5. Une fois approuvées, les images sont visibles publiquement

## 🛠️ Scripts disponibles

\`\`\`bash
# Développement
npm run dev

# Build de production
npm run build

# Démarrer en production
npm start

# Linter
npm run lint

# Créer l'admin
npm run seed:admin
\`\`\`

## 📝 Structure du projet

\`\`\`
campuseats/
├── app/
│   ├── api/                    # API Routes
│   │   ├── admin/
│   │   │   └── create-user/    # Création d'utilisateurs par l'admin
│   │   └── send-campus-id/     # Envoi du CampusID par email
│   ├── dashboard/              # Dashboards par rôle
│   │   ├── admin/
│   │   ├── vendor/
│   │   ├── delivery/
│   │   └── client/
│   ├── login/                  # Page de connexion
│   ├── register/               # Page d'inscription
│   └── page.tsx                # Page d'accueil
├── components/
│   ├── auth/                   # Composants d'authentification
│   ├── dashboard/              # Composants des dashboards
│   └── ui/                     # Composants UI (shadcn)
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Client Supabase (navigateur)
│   │   ├── server.ts           # Client Supabase (serveur)
│   │   └── auth.ts             # Fonctions d'authentification
│   ├── types/                  # Types TypeScript
│   ├── utils/                  # Utilitaires
│   └── hooks/                  # Hooks React
├── scripts/
│   ├── 01-create-users-table.sql
│   ├── 02-create-profiles-tables.sql
│   ├── 03-create-menu-tables.sql
│   ├── 04-create-orders-tables.sql
│   └── 05-create-storage-bucket.sql
├── middleware.ts               # Middleware pour refresh token
└── .env.example                # Exemple de variables d'environnement
\`\`\`

## 🔒 Sécurité

- Toutes les routes API sont protégées par authentification Supabase
- Les politiques RLS (Row Level Security) empêchent l'accès non autorisé aux données
- Les images ne sont uploadées que par les utilisateurs autorisés via RLS
- L'approbation des images est requise avant publication
- Les mots de passe sont gérés par Supabase Auth (hashés et sécurisés)
- Séparation stricte entre anon key (public) et service role key (privée)

## 🐛 Résolution de problèmes

### L'admin ne peut pas se connecter

1. Vérifiez que les variables `ADMIN_EMAIL` et `ADMIN_PASSWORD` sont correctes
2. Vérifiez que les scripts SQL ont été exécutés correctement
3. Consultez les logs Supabase pour les erreurs d'authentification
4. Utilisez le bouton "Initialiser le compte administrateur" sur la page de login

### Les emails ne sont pas envoyés

1. Vérifiez votre clé API SendGrid
2. Assurez-vous que `SENDGRID_FROM_EMAIL` est vérifié dans SendGrid
3. Vérifiez les quotas SendGrid (100 emails/jour en gratuit)
4. Consultez les logs dans SendGrid Dashboard pour voir si les emails ont été envoyés

### Les images ne s'uploadent pas

1. Vérifiez que le bucket `vendor-images` est créé (script `05-create-storage-bucket.sql`)
2. Vérifiez les politiques Storage dans Supabase Dashboard → Storage → Policies
3. Assurez-vous que l'utilisateur est authentifié
4. Vérifiez les quotas Supabase Storage (1GB gratuit)

### Erreur : "Failed to fetch" ou problèmes de connexion

**Cause** : Les URLs Supabase ou les clés ne sont pas correctement configurées

**Solution** :
1. Vérifiez que `SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_URL` sont identiques
2. Vérifiez que `SUPABASE_ANON_KEY` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont identiques
3. Assurez-vous que ces variables sont disponibles dans tous les environnements (dev, preview, prod)
4. Redéployez après avoir ajouté/modifié les variables

### Erreur : "Row Level Security policy violation"

**Cause** : Les politiques RLS bloquent l'accès aux données

**Solution** :
1. Vérifiez que tous les scripts SQL ont été exécutés
2. Dans Supabase Dashboard → Authentication → Policies, vérifiez que les politiques sont actives
3. Assurez-vous que l'utilisateur est bien authentifié avant d'accéder aux données

## 📞 Support

Pour toute question ou problème :
- Email : kellyatemenou@gmail.com
- Créez une issue sur GitHub

## 📄 Licence

Ce projet est sous licence MIT.

## 🙏 Remerciements

- Next.js et Vercel pour l'infrastructure
- Supabase pour les services backend
- shadcn/ui pour les composants UI
- SendGrid pour l'envoi d'emails

---

**Développé avec ❤️ pour les campus universitaires**
