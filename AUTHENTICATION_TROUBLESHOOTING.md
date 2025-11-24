# CampusEats - Guide de Dépannage de l'Authentification

## Problèmes Courants et Solutions

### 1. Les pages Dashboard ne se chargent pas après connexion

**Symptômes:**
- Après une connexion réussie, la page dashboard reste blanche ou montre un spinner infini
- Aucune erreur visible dans l'interface utilisateur

**Causes possibles:**
1. Le profil utilisateur n'est pas créé dans la table `users`
2. Les politiques RLS bloquent l'accès aux données utilisateur
3. Race condition entre l'authentification et le chargement du profil

**Solutions:**

#### A. Vérifier que le profil utilisateur existe

Exécutez cette requête dans le SQL Editor de Supabase:
\`\`\`sql
SELECT * FROM users WHERE email = 'votre-email@example.com';
\`\`\`

Si aucun résultat, le trigger n'a pas créé le profil. Vérifiez:
\`\`\`sql
-- Vérifier que le trigger existe
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Recréer le trigger si nécessaire
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Puis réexécuter le script 001_create_users_table.sql
\`\`\`

#### B. Vérifier les politiques RLS

\`\`\`sql
-- Voir toutes les politiques sur la table users
SELECT * FROM pg_policies WHERE tablename = 'users';

-- Tester l'accès direct
SELECT auth.uid(); -- Devrait retourner votre user ID
SELECT * FROM users WHERE id = auth.uid(); -- Devrait retourner votre profil
\`\`\`

#### C. Vérifier les logs du navigateur

Ouvrez la console développeur (F12) et cherchez les logs `[v0]`:
- `[v0] useAuth: Initializing` - Le hook démarre
- `[v0] useAuth: User data fetched successfully, role: admin` - Profil chargé
- `[v0] ProtectedRoute: Access granted for role admin` - Accès autorisé

Si vous voyez `[v0] useAuth: No user data found in database`, le profil n'existe pas.

### 2. Erreur "Invalid login credentials"

**Causes:**
- Email/mot de passe incorrect
- Le compte n'existe pas dans Supabase Auth
- Email non confirmé (si la confirmation est activée)

**Solutions:**
1. Vérifier dans le dashboard Supabase > Authentication > Users
2. Pour l'admin, cliquer sur "Initialiser l'administrateur" sur la page de connexion
3. Désactiver la confirmation d'email en développement:
   - Supabase Dashboard > Authentication > Settings
   - Désactiver "Enable email confirmations"

### 3. Redirection infinie ou boucle de connexion

**Causes:**
- Le middleware redirige en boucle
- Session non persistée correctement
- Cookies bloqués par le navigateur

**Solutions:**
1. Vérifier que les cookies sont autorisés
2. Effacer les cookies et le localStorage:
\`\`\`javascript
// Dans la console du navigateur
localStorage.clear();
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
location.reload();
\`\`\`

3. Vérifier le middleware dans la console:
\`\`\`
[v0] Middleware: Checking auth for: /dashboard/admin
[v0] Middleware: User authenticated: true
\`\`\`

### 4. Page dashboard se charge mais les données ne s'affichent pas

**Causes:**
- Politiques RLS trop restrictives sur d'autres tables
- Erreurs de requête silencieuses

**Solutions:**
1. Vérifier les logs de la console pour les erreurs
2. Tester les requêtes manuellement:
\`\`\`javascript
// Dans la console
const { createClient } = await import('./lib/supabase/client');
const supabase = createClient();

// Tester l'accès aux données
const { data, error } = await supabase.from('menu_items').select('*');
console.log('Data:', data, 'Error:', error);
\`\`\`

3. Vérifier les politiques RLS pour chaque table:
\`\`\`sql
-- Exemple pour menu_items
SELECT * FROM pg_policies WHERE tablename = 'menu_items';
\`\`\`

## Debugging Avancé

### Activer les logs détaillés

Les logs `[v0]` sont déjà activés dans le code. Pour voir tous les logs:

1. Ouvrez la console développeur (F12)
2. Filtrez par `[v0]` pour ne voir que les logs de l'application
3. Suivez le flux d'authentification:

\`\`\`
[v0] Login form submitted
[v0] Sign in attempt with identifier: admin@example.com
[v0] Attempting Supabase sign in with email...
[v0] Auth successful, user ID: xxx-xxx-xxx
[v0] User profile found: ADM-123456789 admin
[v0] Sign in completed successfully for role: admin
[v0] Login successful, redirecting to dashboard: admin
[v0] useAuth: Auth state changed, event: SIGNED_IN user: true
[v0] useAuth: Auth change - fetching user data
[v0] useAuth: User data fetched successfully, role: admin
[v0] ProtectedRoute: Access granted for role admin
[v0] AdminDashboard rendering, userData: {...}
\`\`\`

### Tester l'authentification manuellement

\`\`\`javascript
// Dans la console du navigateur
const { createClient } = await import('./lib/supabase/client');
const supabase = createClient();

// Vérifier la session actuelle
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);

// Se connecter
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@example.com',
  password: 'votre-password'
});
console.log('Login result:', data, error);

// Vérifier le profil
const { data: profile, error: profileError } = await supabase
  .from('users')
  .select('*')
  .eq('id', data.user.id)
  .single();
console.log('Profile:', profile, profileError);
\`\`\`

## Checklist de Déploiement

Avant de déployer en production:

- [ ] Tous les scripts SQL ont été exécutés dans l'ordre
- [ ] Le trigger `handle_new_user()` fonctionne correctement
- [ ] Les politiques RLS sont configurées sur toutes les tables
- [ ] Les variables d'environnement sont configurées sur Vercel
- [ ] Le compte admin peut être initialisé
- [ ] La connexion fonctionne pour tous les rôles (admin, client, vendor, delivery)
- [ ] Les redirections post-connexion fonctionnent
- [ ] Les pages dashboard se chargent correctement
- [ ] La déconnexion fonctionne
- [ ] Les sessions persistent après rechargement de la page

## Support

Si les problèmes persistent après avoir suivi ce guide:

1. Vérifier les logs complets dans la console navigateur
2. Vérifier les logs Supabase dans le dashboard
3. Tester avec un compte fraîchement créé
4. Vérifier que toutes les dépendances sont à jour
