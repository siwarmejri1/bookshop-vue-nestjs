# 

Interface moderne et professionnelle pour l'API NestJS BookShop.
##  Équipe

| Membre | Rôle | Branche |
|--------|------|---------|
| **Mejri Siwar** | Espace utilisateur (Landing, Auth, Catalogue, Favoris, Ajouter un livre) | `feature/user-space` |
| **Derouiche Fatma** | Espace admin (Dashboard, CRUD Livres, CRUD Auteurs) | `feature/admin-space` |

##  Présentation du projet

**BookShop** est une application full-stack de gestion de bibliothèque en ligne.
Elle permet aux utilisateurs de parcourir un catalogue de livres, de gérer leurs favoris personnels, et aux administrateurs de gérer l'ensemble du contenu.

##  Fonctionnalités

###  Espace public (sans connexion)
- Page d'accueil avec carousel automatique
- Catalogue de livres visible en lecture seule
- Recherche par titre et filtre par année
- Pages Login et Signup

###  Espace utilisateur (après connexion)
- Dashboard personnalisé avec statistiques
- Catalogue interactif avec ajout aux favoris
- Gestion des favoris personnels (persistés en base de données)
- Favoris liés au compte (chaque user a ses propres favoris)

###  Espace administrateur
- Dashboard avec statistiques globales
  - Total livres, total favoris, total auteurs
  - Classement des livres les plus aimés (🥇🥈🥉)
  - Barres de progression de popularité
- CRUD complet des livres (Ajouter, Modifier, Supprimer)
- CRUD complet des auteurs (Ajouter, Modifier, Supprimer)

## Stack technique

### Frontend
| Technologie | Version | Usage |
|-------------|---------|-------|
| Vue 3 | 3.4 | Framework principal (Composition API) |
| Vue Router | 4.2 | Navigation + guards de routes |
| Pinia | 2.1 | Gestion d'état (auth + favoris) |
| Axios | 1.6 | Appels HTTP vers l'API |
| Bootstrap | 5.3 | Grille et composants UI |
| Bootstrap Icons | 1.11 | Icônes |
| Vite | 5.0 | Bundler |

### Backend (fourni)
| Technologie | Usage |
|-------------|-------|
| NestJS | Framework API REST |
| TypeORM | ORM base de données |
| MySQL | Base de données |
| JWT + Passport | Authentification |
| Bcrypt | Hashage des mots de passe |

## Installation et démarrage
### Prérequis
- Node.js ≥ 18
- WAMP / XAMPP (MySQL)
- Backend NestJS démarré sur `http://localhost:3000`

### 1. Cloner le projet
```bash
git clone https://github.com/USERNAME/bookshop-frontend.git
cd bookshop-frontend
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer l'environnement
Créez un fichier `.env` à la racine :
```env
VITE_API_URL=http://localhost:3000
```

### 4. Lancer l'application
```bash
npm run dev
```

L'application est accessible sur **http://localhost:5173**

> L'API NestJS doit tourner sur `http://localhost:3000`

## Architecture

```
frontend/
├── src/
│   ├── assets/
│   │   └── main.css              # Système de design complet
│   ├── components/
│   │   ├── AppLayout.vue         # Shell : sidebar + topbar
│   │   ├── SideBar.vue           # Navigation adaptative (admin/user)
│   │   └── BookForm.vue          # Formulaire réutilisable
│   ├── router/
│   │   └── index.js              # Routes + guards
│   ├── services/
│   │   └── api.js                # Axios + tous les endpoints
│   ├── store/
│   │   ├── auth.js               # JWT, user, isAdmin
│   │   └── favourites.js         # Favoris via API
│   └── views/
│       ├── LandingView.vue       # Page publique
│       ├── AuthView.vue          # Login
│       ├── SignupView.vue        # Inscription
│       ├── UserHomeView.vue      # Dashboard user
│       ├── AllBooksView.vue      # Catalogue + favoris
│       ├── FavouritesView.vue    # Mes favoris
│       ├── HomeView.vue          # Dashboard admin
│       ├── AdminBooksView.vue    # CRUD livres
│       ├── AuthorsView.vue       # CRUD auteurs
│       └── AddBookView.vue       # Ajouter un livre
```

## Fonctionnalités

### Utilisateur
- Connexion / Inscription (split-screen avec panel illustré)
- Tableau de bord avec stats (total livres, favoris, auteurs)
- Catalogue en grille 3 colonnes avec filtre par plage d'années
- Bouton cœur pour ajouter/retirer des favoris (animation)
- Page favoris dédiée
- Formulaire d'ajout de livre avec preview d'image

### Administrateur
- Table des livres avec thumbnail, badges, actions
- Modal d'ajout / modification / suppression (avec confirmation)
- Gestion des auteurs (liste + ajout)

## Design

- Palette **Navy (#0d1b2a) + Or (#c9a84c)** + fond crème
- Typographie **Playfair Display** (titres) + **Nunito** (corps)
- Sidebar fixe dark, topbar sticky blanche
- Modals animées (slide-up + backdrop blur)
- Cartes avec hover lift + zoom image
- Spinner custom, états vides illustrés

*Projet réalisé avec ❤️ — ISIDS 2025/2026*