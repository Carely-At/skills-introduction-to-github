# Scripts de Migration Supabase

Ce dossier contient tous les scripts SQL nécessaires pour configurer la base de données Supabase de CampusEats.

## Ordre d'Exécution

Les scripts doivent être exécutés dans cet ordre :

### 1. `01-create-users-table.sql`
Crée la table principale des utilisateurs et configure :
- Trigger automatique pour créer une entrée lors de l'inscription
- Index sur campus_id pour les recherches rapides
- Politiques RLS pour la sécurité

### 2. `02-create-profiles-tables.sql`
Crée les tables de profils supplémentaires :
- `vendor_profiles` : Informations spécifiques aux vendeurs
- `delivery_profiles` : Informations spécifiques aux livreurs
- Politiques RLS appropriées pour chaque type

### 3. `03-create-menu-tables.sql`
Crée la table `menu_items` pour les plats des vendeurs :
- Liens avec la table users via vendor_id
- Index pour les recherches par vendeur et disponibilité
- RLS pour permettre aux vendeurs de gérer leurs menus

### 4. `04-create-orders-tables.sql`
Crée les tables de commandes :
- `orders` : Commandes principales
- `order_items` : Détails des articles commandés
- Relations avec users, vendor_profiles, delivery_profiles
- Politiques RLS pour que chaque rôle voit ses commandes

### 5. `05-create-storage-bucket.sql`
Configure le stockage Supabase :
- Crée le bucket `vendor-images` public
- Configure les politiques de storage
- Permet aux vendeurs d'uploader leurs images

## Comment Exécuter

### Via l'Interface Supabase

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Cliquez sur "SQL Editor"
4. Copiez-collez chaque script dans l'ordre
5. Cliquez sur "Run" pour exécuter

### Via le CLI Supabase

\`\`\`bash
# Installer le CLI si nécessaire
npm install -g supabase

# Se connecter
supabase login

# Lier le projet
supabase link --project-ref YOUR_PROJECT_REF

# Exécuter les migrations
supabase db push
\`\`\`

## Vérification

Après avoir exécuté tous les scripts, vérifiez que :

1. ✅ Toutes les tables sont créées
2. ✅ Les triggers fonctionnent (testez en créant un user)
3. ✅ Les politiques RLS sont actives
4. ✅ Le bucket storage est créé
5. ✅ Les index sont en place

## Rollback

Si vous devez annuler les changements :

\`\`\`sql
-- Supprimer dans l'ordre inverse
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS delivery_profiles CASCADE;
DROP TABLE IF EXISTS vendor_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Supprimer le bucket
DELETE FROM storage.buckets WHERE id = 'vendor-images';
\`\`\`

## Notes Importantes

- Les scripts sont idempotents (peuvent être exécutés plusieurs fois)
- Les politiques RLS sont essentielles pour la sécurité
- Ne modifiez pas l'ordre d'exécution
- Testez dans un environnement de développement d'abord
