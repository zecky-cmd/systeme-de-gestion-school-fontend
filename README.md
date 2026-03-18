# 🎓 Elite School Management - Frontend

Bienvenue dans l'interface web de la solution **Elite School Management**. Cette application est conçue pour offrir une expérience utilisateur fluide, moderne et performante aux administrateurs, enseignants et parents d'élèves.

## 🚀 Vision du Projet
L'objectif est de transformer la gestion scolaire complexe en une interface intuitive utilisant le **Glassmorphism** et des animations fluides pour un rendu "Premium".

## 🛠️ Stack Technologique (Elite Stack)
- **Framework** : [Next.js 16](https://nextjs.org/) (App Router)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **UI & Composants** : [shadcn/ui](https://ui.shadcn.com/) (Radix UI + Tailwind CSS 4)
- **Gestion d'état serveur** : [TanStack Query v5](https://tanstack.com/query/latest)
- **Animations** : [Framer Motion](https://www.framer.com/motion/)
- **Mobile** : Support **PWA** (Installable sur mobile)

## 📦 Installation & Démarrage

### 1. Prérequis
- Node.js 20.9.0+
- L'API backend opérationnelle (dossier `api_school`)

### 2. Installation
```bash
npm install
```

### 3. Configuration
Crée un fichier `.env.local` à la racine :
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. Lancement
```bash
npm run dev
```
L'application sera accessible sur [http://localhost:3001](http://localhost:3001) (pour éviter le conflit avec l'API).

## 🏗️ Structure du Projet
- `/src/app` : Routes et pages (App Router)
- `/src/components` : Composants réutilisables (shadcn + custom)
- `/src/lib` : Utilitaires et configurations (Query Client, API Fetcher)
- `/src/hooks` : Hooks personnalisés pour la logique métier

---
🚀 *Développé avec passion pour l'Excellence Scolaire.*
