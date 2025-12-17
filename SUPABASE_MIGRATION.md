# Migration de Firebase vers Supabase - Guide Complet

Ce document décrit la migration complète de CampusEats de Firebase vers Supabase.

## Résumé de la Migration

La migration a été effectuée en plusieurs étapes :
1. Configuration de Supabase et création du schéma de base de données
2. Migration du système d'authentification
3. Conversion des opérations Firestore vers PostgreSQL
4. Migration du storage Firebase vers Supabase Storage
5. Mise à jour de tous les composants et tests d'intégration

## Architecture Supabase

### Base de Données

#### Tables Principales

**users**
- Stocke tous les utilisateurs (admin, vendor, delivery, client)
- Colonnes : id, email, campus_id, role, first_name, last_name, phone, is_active, created_at, updated_at
- Le trigger `handle_new_user` crée automatiquement une entrée lors de l'inscription

**vendor_profiles**
- Profils supplémentaires pour les vendeurs
- Colonnes : user_id, business_name, description, canteen_image, location_images, menu_images, images_approved

**delivery_profiles**
- Profils supplémentaires pour les livreurs
- Colonnes : user_id, vehicle_type, is_available

**menu_items**
- Articles du menu des vendeurs
- Colonnes : id, vendor_id, name, description, price, category, image, is_available, created_at

**orders**
- Commandes des clients
- Colonnes : id, client_id, vendor_id, delivery_id, total_amount, status, delivery_address, notes, created_at, updated_at

**order_items**
- Détails des articles de chaque commande
- Colonnes : id, order_id, menu_item_id, name, price, quantity, image

### Row Level Security (RLS)

Toutes les tables ont des politiques RLS activées pour sécuriser les données :

- **users** : Les utilisateurs peuvent lire leur propre profil
- **vendor_profiles** : Les vendeurs gèrent leur profil, tout le monde peut voir les profils approuvés
- **menu_items** : Les vendeurs gèrent leurs menus, tout le monde peut voir les items disponibles
- **orders** : Clients, vendeurs et livreurs voient leurs propres commandes
- **order_items** : Accessible via les permissions des commandes

### Authentification

- **Supabase Auth** remplace Firebase Authentication
- Support de l'authentification par email/password
- Les métadonnées utilisateur (CampusID, role, etc.) sont stockées dans `auth.users.raw_user_meta_data`
- Un trigger automatique crée l'entrée dans `public.users` lors de l'inscription

### Storage

- **Bucket** : `vendor-images`
- **Structure** : `vendors/{user_id}/{type}/{timestamp}_{filename}`
  - Types : canteen, location, menu
- **Politiques** :
  - Les vendeurs peuvent uploader/modifier/supprimer leurs images
  - Lecture publique pour toutes les images

## Changements dans le Code

### Configuration

**Avant (Firebase)**
```typescript
import { getFirebaseAuth, getFirebaseDB } from './lib/firebase/config'
const auth = getFirebaseAuth()
const db = getFirebaseDB()
```

**Après (Supabase)**
```typescript
import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'

// Client-side
const supabase = createClient()

// Server-side
const supabase = await createServerClient()
```

### Authentification

**Avant (Firebase)**
```typescript
import { signInWithEmailAndPassword } from 'firebase/auth'
await signInWithEmailAndPassword(auth, email, password)
```

**Après (Supabase)**
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
})
```

### Base de Données

**Avant (Firestore)**
```typescript
import { collection, getDocs, query, where } from 'firebase/firestore'

const q = query(collection(db, 'menuItems'), where('vendorId', '==', userId))
const snapshot = await getDocs(q)
const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
```

**Après (Supabase)**
```typescript
const { data, error } = await supabase
  .from('menu_items')
  .select('*')
  .eq('vendor_id', userId)
```

### Storage

**Avant (Firebase)**
```typescript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const storageRef = ref(storage, `path/to/file`)
await uploadBytes(storageRef, file)
const url = await getDownloadURL(storageRef)
```

**Après (Supabase)**
```typescript
const { error } = await supabase.storage
  .from('vendor-images')
  .upload(path, file)

const { data: { publicUrl } } = supabase.storage
  .from('vendor-images')
  .getPublicUrl(path)
```

## Scripts de Migration

### 1. Configuration Initiale
```bash
# Exécuter dans l'ordre :
scripts/01-create-users-table.sql
scripts/02-create-profiles-tables.sql
scripts/03-create-menu-tables.sql
scripts/04-create-orders-tables.sql
scripts/05-create-storage-bucket.sql
```

### 2. Données Existantes (si nécessaire)

Si vous avez des données Firebase existantes à migrer :

1. Exportez les données Firebase
2. Transformez-les au format PostgreSQL
3. Importez-les dans Supabase

## Variables d'Environnement

Remplacez les variables Firebase par celles de Supabase :

**Supprimer**
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
```

**Utiliser**
```
SUPABASE_URL (déjà configuré)
NEXT_PUBLIC_SUPABASE_URL (déjà configuré)
SUPABASE_ANON_KEY (déjà configuré)
NEXT_PUBLIC_SUPABASE_ANON_KEY (déjà configuré)
SUPABASE_SERVICE_ROLE_KEY (déjà configuré)
```

## Avantages de la Migration

1. **Performance** : PostgreSQL est plus performant pour les requêtes complexes
2. **Relations** : Support natif des jointures et relations
3. **Sécurité** : RLS intégré pour la sécurité au niveau des lignes
4. **TypeScript** : Meilleur support TypeScript avec génération automatique des types
5. **Coûts** : Plan gratuit plus généreux que Firebase
6. **SQL Standard** : Utilisation de SQL standard au lieu d'API propriétaire

## Points d'Attention

1. **Conventions de nommage** : Supabase utilise snake_case, convertir depuis/vers camelCase
2. **Timestamps** : Les timestamps Supabase sont des strings ISO, les convertir en Date
3. **Arrays** : PostgreSQL gère nativement les arrays (ex: location_images)
4. **Triggers** : Utiliser des triggers PostgreSQL pour la logique automatique

## Prochaines Étapes

1. Tester toutes les fonctionnalités principales
2. Vérifier les politiques RLS
3. Optimiser les requêtes si nécessaire
4. Configurer les backups automatiques
5. Monitorer les performances

## Support

Pour toute question sur la migration :
- Documentation Supabase : https://supabase.com/docs
- Migration guide : https://supabase.com/docs/guides/migrations
