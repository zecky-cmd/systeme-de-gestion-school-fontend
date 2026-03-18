#  EduManager CI - Frontend (Web School)

Bienvenue dans l'interface web de la solution **EduManager CI**. Cette application est conçue pour offrir une expérience utilisateur fluide, moderne et performante aux administrateurs, enseignants et parents d'élèves.

##  Vision du Projet
L'objectif est de transformer la gestion scolaire complexe en une interface de tableau de bord intuitive, ultra-rapide (PWA) et ergonomique en utilisant les meilleurs standards du web moderne.

##  Elite Stack Technologique
- **Framework Core** : [Next.js 16](https://nextjs.org/) (App Router, React 19)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **Style & UI** : [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (basé sur `@base-ui/react`)
- **Gestion de Thème** : Dark Mode natif via `next-themes`
- **Gestion d'état global (Client)** : [Zustand](https://github.com/pmndrs/zustand)
- **Gestion d'état asynchrone (Serveur/API)** : [TanStack Query v5](https://tanstack.com/query/latest) (Avec Devtools)
- **Icônes** : [Lucide React](https://lucide.dev/)

##  Installation & Démarrage

### 1. Prérequis
- Node.js 20.9.0+
- L'API backend opérationnelle (dossier `api_school`) pour la production

### 2. Installation
```bash
npm install
```

### 3. Lancement en développement
```bash
npm run dev
```
L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

##  Architecture Scalable du Projet

L'application est découpée selon les principes du _Clean Code_ et de l'architecture par _Fonctionnalités (Features)_ :

- `src/app/` : Routes Next.js (Pages, Layouts, CSS global). C'est le point d'entrée.
- `src/components/ui/` : Composants de base "stupides" apportés par Shadcn UI (Boutons, Inputs, Dropdowns, etc.).
- `src/components/shared/` : Composants métier globaux et réutilisables créés pour l'application :
  - **`PageHeader`** : En-tête de page standardisé (Titre, sous-titre, bouton d'export).
  - **`ActionToolbar`** : Barre de recherche et filtres pour les tableaux.
  - **`StatusBadge`** : Badges dynamiques pour afficher les statuts métiers (Inscrit, En retard, Transfert, etc.).
  - **`TableSkeleton`** : Squelettes de chargement génériques pour fluidifier l'UX lors des appels API.
- `src/components/app-sidebar.tsx` : La navigation latérale (Sidebar) principale de l'application.
- `src/constants/` : Dictionnaires de l'application (Configurations de thèmes, routes, couleurs associées aux statuts).
- `src/providers/` : Conteneurs de contexte globaux (`AppProviders`, `ThemeProvider`, `QueryProvider`).
- `src/store/` : Stores Zustand pour la gestion de l'état global du client (ex: année scolaire sélectionnée).

##  Dark Mode & Theming

Le projet intègre un support complet du mode sombre et clair.
- Les couleurs sont définies via des variables CSS sémantiques dans `globals.css` (ex: `--background`, `--foreground`, `--primary`, `--border`). 
- **Bonne pratique respectée** : Aucune couleur n'est codée en dur dans les composants (`bg-white` ou `text-black` sont proscrits) afin de garantir une parfaite réactivité et lisibilité au changement de thème.

##  Appels API & Cache (TanStack Query)

Toutes les requêtes adressées à l'API backend utiliseront `useQuery` et `useMutation` de TanStack Query pour bénéficier :
- De la mise en cache automatique
- Du rechargement en arrière-plan
- D'une gestion unifiée des états de chargement (`isLoading`, intimement couplé avec le composant `TableSkeleton`) et d'erreur.

---
 *Développé pour l'Excellence.*
