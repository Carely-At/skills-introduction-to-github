# Guide du Système d'Administration CampusEats

Ce document décrit le système d'administration complet développé pour CampusEats avec Supabase.

## Vue d'ensemble

Le système d'administration CampusEats supporte maintenant deux niveaux d'administration :
- **Administrateur Principal** : Accès complet à toutes les fonctionnalités
- **Administrateur Secondaire (Sub-Admin)** : Accès limité selon les permissions définies

## Architecture des Rôles

### Rôles Utilisateurs
\`\`\`
- admin         : Administrateur principal (accès total)
- sub-admin     : Administrateur secondaire (accès limité)
- vendor        : Vendeur/Restaurant
- delivery      : Personnel de livraison
- client        : Client
\`\`\`

### Hiérarchie des Permissions

| Fonctionnalité | Admin | Sub-Admin | Notes |
|----------------|-------|-----------|-------|
| Voir tous les utilisateurs | ✅ | ✅ | Sub-admin ne voit pas les autres admins |
| Créer des clients | ✅ | ✅ | Status "pending" pour sub-admin |
| Créer des vendeurs | ✅ | ✅ | Status "pending" pour sub-admin |
| Créer des livreurs | ✅ | ✅ | Status "pending" pour sub-admin |
| Créer des sous-admins | ✅ | ❌ | Réservé à l'admin principal |
| Supprimer des utilisateurs | ✅ | ❌ | Réservé à l'admin principal |
| Approuver des utilisateurs | ✅ | ❌ | Réservé à l'admin principal |
| Voir les statistiques | ✅ | ✅ | Accès au dashboard overview |
| Approuver images vendeurs | ✅ | ✅ | Validation des photos |

## Nouvelles Tables de Base de Données

### Table `admin_actions`
Traçabilité de toutes les actions administratives :
\`\`\`sql
- id (UUID)
- admin_id (UUID) - Référence vers users
- action_type (TEXT) - Type d'action effectuée
- target_user_id (UUID) - Utilisateur cible
- details (JSONB) - Détails supplémentaires
- created_at (TIMESTAMPTZ)
\`\`\`

### Colonnes ajoutées à `users`
\`\`\`sql
- created_by (UUID) - Qui a créé cet utilisateur
- approved_by (UUID) - Qui a approuvé cet utilisateur
- status (TEXT) - 'pending', 'approved', 'rejected'
\`\`\`

## Pages et Routes

### Pages Administrateur Principal

#### `/dashboard/admin/overview`
Dashboard principal avec :
- Compteurs d'utilisateurs par rôle
- Statistiques des commandes (aujourd'hui, cette semaine)
- Revenu total
- Activité récente
- Liens rapides vers les sections importantes

#### `/dashboard/admin/users`
Liste complète de tous les utilisateurs avec :
- Vue responsive (cards sur mobile, tableau sur desktop)
- Filtres par rôle
- Actions : Voir profil, Supprimer

#### `/dashboard/admin/users/[id]`
Page de profil détaillé d'un utilisateur avec :
- Informations personnelles
- Statistiques selon le rôle :
  - **Client** : Historique des commandes, montant dépensé
  - **Vendeur** : Commandes reçues, revenu total
  - **Livreur** : Livraisons effectuées, taux de réussite
- Historique complet des transactions

#### `/dashboard/admin/sub-admins`
Gestion des sous-administrateurs :
- Liste de tous les sub-admins
- Formulaire de création avec génération automatique de mot de passe
- Vue des actions effectuées par chaque sub-admin

#### `/dashboard/admin/pending-users`
Validation des utilisateurs créés par les sub-admins :
- Liste des utilisateurs en attente d'approbation
- Informations sur qui a créé l'utilisateur
- Actions : Approuver ou Rejeter

#### `/dashboard/admin/vendor-approval`
Approbation des images des vendeurs :
- Liste des vendeurs avec images en attente
- Aperçu des images uploadées
- Actions : Approuver ou Refuser

### APIs Créées

#### POST `/api/admin/create-sub-admin`
Crée un nouveau sous-administrateur
\`\`\`json
{
  "email": "subadmin@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "password": "optional" // Généré automatiquement si omis
}
\`\`\`

#### GET `/api/admin/pending-users`
Récupère tous les utilisateurs en status "pending"

#### POST `/api/admin/approve-user`
Approuve un utilisateur en attente
\`\`\`json
{
  "userId": "uuid"
}
\`\`\`

#### POST `/api/admin/reject-user`
Rejette un utilisateur en attente
\`\`\`json
{
  "userId": "uuid"
}
\`\`\`

## Système de Permissions

### Fichier `lib/utils/permissions.ts`
Fonctions utilitaires pour gérer les permissions :

\`\`\`typescript
// Vérifier si un utilisateur a une permission
hasPermission(userRole, 'VIEW_ALL_USERS') // boolean

// Vérifier si un admin peut créer un rôle spécifique
canCreateUser(adminRole, targetRole) // boolean

// Vérifier si un admin peut voir un utilisateur
canViewUser(adminRole, targetRole) // boolean

// Masquer l'email pour les sub-admins
getMaskedEmail(email, userRole) // string
\`\`\`

### Politiques RLS (Row Level Security)

#### Users Table
- Users peuvent voir leur propre profil
- Admins voient tous les utilisateurs
- Sub-admins voient tous sauf les admins/sub-admins
- Sub-admins peuvent créer vendors/delivery/clients (status=pending)
- Seuls les admins peuvent approuver/rejeter

#### Admin Actions Table
- Admins et sub-admins peuvent voir toutes les actions
- Admins et sub-admins peuvent insérer leurs propres actions

## Flux de Travail

### Création d'un Utilisateur par un Sub-Admin

1. Sub-admin remplit le formulaire de création
2. L'utilisateur est créé avec `status = 'pending'` et `created_by = sub-admin.id`
3. L'admin principal voit l'utilisateur dans `/dashboard/admin/pending-users`
4. L'admin principal approuve ou rejette
5. Si approuvé : `status = 'approved'`, `approved_by = admin.id`
6. Si rejeté : `status = 'rejected'`, `is_active = false`

### Création d'un Sub-Admin

1. Admin principal va sur `/dashboard/admin/sub-admins`
2. Clique sur "Créer un sous-admin"
3. Remplit le formulaire (email, nom, prénom, téléphone)
4. Mot de passe généré automatiquement (affiché une seule fois)
5. Sub-admin est créé avec `status = 'approved'` automatiquement
6. Action enregistrée dans `admin_actions`

### Approbation d'Images Vendeur

1. Vendeur upload des images
2. Images passent en `images_approved = false`
3. Admin/Sub-admin va sur `/dashboard/admin/vendor-approval`
4. Voit la liste des vendeurs avec images en attente
5. Approuve ou refuse les images
6. Action enregistrée dans `admin_actions`

## Design Responsive

### Breakpoints Tailwind
\`\`\`css
- mobile : < 640px (sm)
- tablet : 640px - 1024px (md, lg)
- desktop : > 1024px (lg, xl, 2xl)
\`\`\`

### Stratégies Responsive Utilisées

1. **Grilles Flexibles**
   - Mobile : 1 colonne
   - Tablet : 2 colonnes
   - Desktop : 3-4 colonnes

2. **Tables vs Cards**
   - Mobile : Cards empilées
   - Desktop : Tables traditionnelles

3. **Texte et Boutons**
   - `truncate` pour éviter le débordement
   - `break-all` pour les emails longs
   - `flex-wrap` pour les groupes de boutons

4. **Navigation**
   - Tabs horizontaux sur mobile
   - Sidebar sur desktop

## Scripts SQL à Exécuter

Pour activer le système d'administration, exécutez dans l'ordre :

\`\`\`bash
# 1. Ajouter le rôle sub-admin et les colonnes de tracking
scripts/008_add_sub_admin_role.sql

# 2. Les autres scripts existants sont déjà en place
\`\`\`

## Variables d'Environnement Requises

Aucune nouvelle variable nécessaire. Le système utilise les variables Supabase existantes :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (pour les opérations admin)

## Tests Recommandés

### Test du Système de Permissions

1. **En tant qu'Admin Principal**
   - Créer un sub-admin
   - Voir tous les utilisateurs
   - Supprimer un utilisateur
   - Approuver un utilisateur pending

2. **En tant que Sub-Admin**
   - Créer un vendeur (vérifier status=pending)
   - Créer un livreur (vérifier status=pending)
   - Essayer de voir un autre admin (devrait échouer)
   - Essayer de supprimer un utilisateur (devrait échouer)

3. **Tests de Responsive**
   - Tester sur iPhone (375px)
   - Tester sur iPad (768px)
   - Tester sur Desktop (1920px)
   - Vérifier que tous les tableaux deviennent des cards
   - Vérifier que le texte ne déborde pas

### Cas Limites

- Email très long dans la liste des utilisateurs
- Campus ID très long
- Sub-admin essayant d'accéder à des routes admin
- Admin s'essayant de se supprimer lui-même
- Approbation/rejet simultané du même utilisateur

## Sécurité

### Protections Implémentées

1. **Row Level Security (RLS)**
   - Toutes les tables ont RLS activé
   - Les politiques vérifient le rôle via JWT claims

2. **API Routes Protection**
   - Vérification du rôle dans chaque route
   - Utilisation du Service Role Key seulement quand nécessaire

3. **Frontend Protection**
   - Hook `useAuth` vérifie les permissions
   - Routes protégées par `ProtectedRoute` component
   - Fonctions `hasPermission()` pour le rendu conditionnel

4. **Traçabilité**
   - Table `admin_actions` enregistre toutes les actions
   - Colonnes `created_by` et `approved_by` pour l'audit

## Migration depuis Firebase

L'application a été complètement migrée de Firebase vers Supabase. Voir `SUPABASE_MIGRATION.md` pour les détails.

## Support et Maintenance

### Ajout d'un Nouveau Rôle

1. Modifier `lib/types/user.ts` - Ajouter le rôle
2. Modifier `scripts/001_create_users_table.sql` - Ajouter dans CHECK constraint
3. Modifier `lib/utils/permissions.ts` - Définir les permissions
4. Créer les RLS policies appropriées

### Ajout d'une Nouvelle Permission

1. Ajouter dans `PERMISSIONS` object dans `permissions.ts`
2. Définir quels rôles ont accès
3. Utiliser `hasPermission()` dans les composants

### Logs de Debug

Tous les logs de debug commencent par `[v0]` pour faciliter le filtrage :
\`\`\`typescript
console.log('[v0] Action effectuée')
\`\`\`

## Fichiers Principaux

### Configuration
- `lib/supabase/client.ts` - Client Supabase côté navigateur
- `lib/supabase/server.ts` - Client Supabase côté serveur avec admin client
- `lib/utils/permissions.ts` - Système de permissions

### Components
- `components/dashboard/admin/admin-overview.tsx` - Dashboard principal
- `components/dashboard/admin/user-profile-detail.tsx` - Profil détaillé
- `components/dashboard/admin/sub-admin-management.tsx` - Gestion sub-admins
- `components/dashboard/admin/pending-users-management.tsx` - Validation users
- `components/dashboard/admin/users-list.tsx` - Liste des utilisateurs
- `components/dashboard/admin/vendor-approval-list.tsx` - Approbation images

### API Routes
- `app/api/admin/create-sub-admin/route.ts`
- `app/api/admin/pending-users/route.ts`
- `app/api/admin/approve-user/route.ts`
- `app/api/admin/reject-user/route.ts`
- `app/api/admin/delete-user/route.ts`
- `app/api/admin/create-user/route.ts`

### Pages
- `app/dashboard/admin/overview/page.tsx`
- `app/dashboard/admin/users/[id]/page.tsx`
- `app/dashboard/admin/sub-admins/page.tsx`
- `app/dashboard/admin/pending-users/page.tsx`

## Prochaines Étapes Recommandées

1. **Système de Notifications**
   - Notifier l'admin principal quand un sub-admin crée un utilisateur
   - Notifier les vendeurs quand leurs images sont approuvées

2. **Analytics Avancées**
   - Graphiques de croissance des utilisateurs
   - Revenus par période
   - Performance des livreurs

3. **Exports**
   - Export CSV des utilisateurs
   - Export des statistiques

4. **Reviews & Ratings**
   - Système de notes pour vendeurs
   - Système de notes pour livreurs
   - Affichage dans les profils détaillés

5. **Logs Avancés**
   - Dashboard des actions admin avec filtres
   - Historique complet des modifications

---

**Développé avec Next.js 15, Supabase, et TailwindCSS**
