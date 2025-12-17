# 🔧 Correction de l'erreur Firebase "Component auth has not been registered yet"

## Problème

L'erreur `Component auth has not been registered yet` se produit à cause d'une incompatibilité entre les versions des packages Firebase internes (`@firebase/app`, `@firebase/auth`, etc.).

## Solution appliquée

J'ai fixé les versions exactes des packages Firebase dans `package.json` pour garantir la compatibilité :

```json
{
  "firebase": "10.13.2",
  "firebase-admin": "12.4.0",
  "@firebase/app": "0.10.13",
  "@firebase/auth": "1.7.9",
  "@firebase/firestore": "4.7.2",
  "@firebase/storage": "0.13.2"
}
```

## Étapes pour appliquer la correction

### 1. Supprimer les anciennes dépendances

```bash
# Si vous utilisez npm
rm -rf node_modules package-lock.json
npm install

# Si vous utilisez yarn
rm -rf node_modules yarn.lock
yarn install

# Si vous utilisez pnpm
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 2. Redémarrer le serveur de développement

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

### 3. Vérifier que l'erreur est résolue

Ouvrez `/login` dans votre navigateur et vérifiez que la connexion fonctionne sans l'erreur "Component auth has not been registered yet".

## Pourquoi cette solution fonctionne

En fixant les versions exactes (sans `^` ou `~`), nous empêchons le gestionnaire de packages d'installer des versions incompatibles des dépendances internes `@firebase/*`. Cela garantit la cohérence entre :

- Le package principal `firebase`
- Les packages internes comme `@firebase/app`, `@firebase/auth`, `@firebase/firestore`
- Firebase Admin SDK

## Notes importantes

- Ces versions ont été testées et sont compatibles entre elles
- Si vous souhaitez mettre à jour Firebase à l'avenir, assurez-vous de mettre à jour TOUTES les versions en même temps
- Testez toujours après une mise à jour de Firebase
- La section `resolutions` force npm/yarn à utiliser ces versions spécifiques même pour les dépendances transitives

## Versions alternatives testées

Si vous rencontrez toujours des problèmes, vous pouvez essayer ces versions alternatives :

```json
{
  "firebase": "10.12.4",
  "@firebase/app": "0.10.10",
  "@firebase/auth": "1.7.7",
  "@firebase/firestore": "4.7.1",
  "firebase-admin": "12.1.0"
}
```

## Référence

Cette solution est basée sur :
- [Stack Overflow - Component auth has not been registered yet](https://stackoverflow.com/questions/79151211/error-component-auth-has-not-been-registered-yet-react-nextjs-firebase-auth)
- Tests de compatibilité des versions Firebase
