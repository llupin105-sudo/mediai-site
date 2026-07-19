# MediAI — Frontend (site + application)

Dépôt du frontend MediAI, déployé sur **Vercel**. Aucun build : fichiers statiques servis tels quels.

## Routage (production)

| URL | Fichier | Rôle |
|---|---|---|
| `/` | `index.html` | **Landing page** premium (seule page d'accueil officielle) |
| `/app` | `app.html` | **Écran de connexion médecin** (déconnecté) → **application** (connecté) |
| `/app?mode=signup` | `app.html` | Idem, onglet **Création de compte** (bouton « Demander une démo ») |
| `/patient` | `patient.html` | **Portail patient** |
| `/assets/*` | `assets/` | Logos & visuels officiels de la landing |

Les URLs propres (`/app` au lieu de `/app.html`) sont assurées par [`vercel.json`](vercel.json) (`cleanUrls: true`).

**Porte d'entrée du produit** : la landing (`/`) est la seule vitrine. L'ancien mini-site marketing intégré à `app.html` (« Racontez la consultation… ») a été retiré ; `/app` ouvre **directement l'écran de connexion** (ou l'application si un jeton valide est présent). Les boutons **« Se connecter »** (`/app?mode=login`) et **« Demander une démo »** (`/app?mode=signup`) de la landing pointent en **liens relatifs** — indépendants du domaine.

## Backend

L'application appelle l'API via la constante `API_BASE` (dans `app.html`), pointant vers le backend **Render** (`https://mediai-backend-156u.onrender.com`). Le frontend et le backend sont totalement découplés : changer le domaine du site n'affecte pas l'API.

Le retour de paiement Stripe (renvoyé vers la racine du site) est ré-acheminé vers `/app` par un court script en tête de `index.html` — aucune modification backend nécessaire.

## Changer de domaine (le jour où `mediai.fr` est acheté)

Architecture pensée pour un swap **sans toucher au code** :

### Option A — un seul domaine (recommandé pour démarrer)
1. Ajouter `mediai.fr` au projet Vercel (Settings → Domains).
2. C'est tout. `mediai.fr` → landing, `mediai.fr/app` → app, `mediai.fr/patient` → portail.
   Les liens relatifs `/app` fonctionnent tels quels. **Zéro changement de code.**
3. Restreindre le CORS backend : définir la variable d'env `ALLOWED_ORIGINS=https://mediai.fr` sur Render.

### Option B — application sur un sous-domaine `app.mediai.fr`
1. Faire pointer `app.mediai.fr` vers ce même projet (ou un projet dédié servant `app.html` à la racine).
2. Dans `index.html`, remplacer les liens `href="/app"` par `href="https://app.mediai.fr"` (find & replace, 1 valeur).
3. `ALLOWED_ORIGINS=https://mediai.fr,https://app.mediai.fr` sur Render.

> Le domaine `mediai-site.vercel.app` reste le domaine principal tant qu'aucun domaine personnalisé n'est configuré.

## Documentation produit

La source de vérité du projet est dans le dépôt backend : `mediai/docs/` (commencer par `00_START_HERE.md`).
