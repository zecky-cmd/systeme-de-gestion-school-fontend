# 🎓 EduManager CI - Système de Gestion Scolaire Intelligent

[![Production](https://img.shields.io/badge/Production-Live-emerald?style=for-the-badge&logo=vercel)](https://web-school-frontend.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

**EduManager CI** est une plateforme de gestion académique et financière de nouvelle génération. Conçue pour offrir une expérience "Premium", elle transforme la complexité administrative en une interface fluide, rapide et intuitive.

---

## 🚀 Liens de Production
- **Application Web (Frontend)** : [https://web-school-frontend.vercel.app/](https://web-school-frontend.vercel.app/)
- **Documentation API (Backend)** : [Accéder au Swagger](https://votre-api.railway.app/api#/Default/ClasseController_create)

---

## 🛠 Elite Stack Technologique & Justifications

Le choix de cette stack a été guidé par trois impératifs : **Performance**, **Scalabilité** et **Expérience Utilisateur (UX)**.

### 1. Core Framework & Langage
*   **Next.js 16 (App Router) & React 19** : 
    *   *Rôle* : Framework principal.
    *   *Justification* : L'utilisation des *Server Components* réduit drastiquement le JavaScript envoyé au client, garantissant des temps de chargement records. Le support natif du SEO et de l'optimisation des ressources (images, polices) est indispensable pour une PWA performante.
*   **TypeScript** : 
    *   *Rôle* : Typage statique rigoureux.
    *   *Justification* : Élimine les erreurs silencieuses à l'exécution et facilite la collaboration grâce à une documentation vivante. Crucial pour gérer des modèles de données complexes comme les inscriptions ou les flux financiers.

### 2. Gestion d'État (Le "Cerveau")
*   **TanStack Query v5 (React Query)** : 
    *   *Rôle* : Gestion de l'état asynchrone et cache serveur.
    *   *Justification* : C'est le pilier de l'application. Il gère la mise en cache intelligente, le rafraîchissement en arrière-plan et réduit les appels API superflus, offrant une réactivité "Instantanée" pour l'administrateur.
*   **Zustand** : 
    *   *Rôle* : État global client léger.
    *   *Justification* : Alternative moderne à Redux, beaucoup plus performante et simple à maintenir pour les états UI globaux (Authentification, configuration de l'année scolaire, état de la barre latérale).

### 3. Interface & Design System Premium
*   **Tailwind CSS v4 & shadcn/ui** : 
    *   *Rôle* : Moteur de style et primitives de composants.
    *   *Justification* : Permet un développement "utility-first" ultra-rapide. Les composants `shadcn/ui` (basés sur Radix UI) garantissent une accessibilité parfaite (WAI-ARIA) tout en permettant une personnalisation esthétique totale (Glassmorphism, Dark mode).
*   **Framer Motion** : 
    *   *Rôle* : Orchestration des animations.
    *   *Justification* : Indispensable pour l'aspect "Premium". Apporte du mouvement fluide (entrées de pages, barres de progression animées, transitions de vues) qui valorise l'image de l'établissement.

### 4. Formulaires & Sécurité des Données
*   **React Hook Form & Zod** : 
    *   *Rôle* : Gestion des formulaires et validation de schémas.
    *   *Justification* : Performance maximale sans re-rendus inutiles. La validation via Zod garantit que les données saisies correspondent exactement aux contrats de l'API (DTO), prévenant les erreurs de soumission.

### 5. Services & Outils Complémentaires
*   **Supabase SDK** : Utilisé pour le stockage sécurisé des médias (photos de profil, documents administratifs).
*   **Axios** : Client HTTP configuré avec des intercepteurs pour la gestion centralisée des tokens JWT et des erreurs globales.
*   **Sonner** : Système de notifications (Toasts) élégant et réactif.

---

## 🏗 Architecture des Modules

Le projet adopte une structure modulaire par **Fonctionnalités (Features)** pour une maintenance et une évolutivité optimales :

- `src/features/auth` : Gestion sécurisée des accès et des permissions (RBAC).
- `src/features/students` : Inscriptions, dossiers individuels et filtres multicritères.
- `src/features/classes` : Organisation pédagogique, suivi des effectifs et surcharge.
- `src/features/finances` : Gestion de la scolarité, rubriques de paiement et historique comptable.


---
⭐ *Conçu avec passion pour l'Excellence Académique.*
