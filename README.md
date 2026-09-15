# Cursus — Plateforme e-learning

Cursus est une plateforme de cours en ligne : landing page premium avec animations, catalogue filtrable, fiche cours, authentification JWT, et tableau de bord de progression pour l'apprenant.

**Stack** : React + Vite + Tailwind + Framer Motion + React Three Fiber (frontend) · Node.js + Express + Prisma (backend) · MySQL (base de données).

## 1. Arborescence du projet

```
cursus/
├── frontend/
│   ├── src/
│   │   ├── components/      Button, Card, Modal, Input, Badge, Navbar, Footer, SectionTitle, Loading, EmptyState, CourseCard, HeroOrb...
│   │   ├── pages/            Landing (+ sections), Courses, CourseDetail, Login, Register, Dashboard, Profile
│   │   ├── layouts/          MainLayout, DashboardLayout
│   │   ├── hooks/             useAuth, useScrollPosition
│   │   ├── services/          api, authService, courseService, dashboardService
│   │   ├── animations/        FadeIn, Reveal, StaggerContainer, Parallax, FloatingElement
│   │   ├── App.jsx, main.jsx, index.css
│   ├── index.html, vite.config.js, tailwind.config.js, postcss.config.js
│   └── .env.example
│
├── backend/
│   ├── src/
│   │   ├── controllers/       auth, user, course, category, enrollment, dashboard
│   │   ├── routes/             une route par ressource + index.js
│   │   ├── middlewares/        authMiddleware, errorMiddleware, validate
│   │   ├── config/prisma.js, utils/
│   │   └── server.js
│   ├── prisma/schema.prisma, prisma/seed.js
│   └── .env.example
│
└── README.md
```

## 2. Modèle de données (Prisma)

- **User** — id, name, email, password (hashé), role (`ADMIN` / `USER`), avatarColor
- **Category** — id, name, slug, icon
- **Course** — titre, slug, description, instructeur, niveau, durée, prix, note, catégorie
- **Lesson** — leçons rattachées à un cours (titre, durée, ordre)
- **Enrollment** — inscription d'un utilisateur à un cours, avec progression (0–100 %)

## 3. Installation locale avec XAMPP + MySQL

1. Installer [XAMPP](https://www.apachefriends.org/) et démarrer le module **MySQL** depuis le panneau de contrôle.
2. Ouvrir **phpMyAdmin** (`http://localhost/phpmyadmin`).
3. Créer une base nommée `cursus_db` (aucune table à créer manuellement, Prisma s'en charge).
4. Copier le fichier d'environnement backend :
   ```bash
   cd backend
   cp .env.example .env
   ```
   Par défaut `.env` contient déjà :
   ```
   DATABASE_URL="mysql://root:@localhost:3306/cursus_db"
   PORT=5000
   JWT_SECRET="change_this_secret"
   JWT_EXPIRES_IN="7d"
   CLIENT_URL="http://localhost:5173"
   ```
   Adapter `root:` si votre installation XAMPP utilise un mot de passe MySQL.

5. Installer les dépendances backend, générer le client Prisma, migrer, puis peupler la base :
   ```bash
   npm install
   npx prisma generate
   npx prisma migrate dev --name init
   npm run seed
   ```

6. Démarrer le backend :
   ```bash
   npm run dev
   ```
   L'API est disponible sur `http://localhost:5000/api`.

7. Dans un second terminal, installer et démarrer le frontend :
   ```bash
   cd frontend
   cp .env.example .env
   npm install
   npm run dev
   ```
   L'application est disponible sur `http://localhost:5173`.

## 4. Identifiants de démonstration (créés par le seed)

| Rôle       | Email                | Mot de passe |
|------------|-----------------------|--------------|
| Admin      | admin@cursus.dev      | Admin123!    |
| Étudiant   | etudiant@cursus.dev    | User123!     |

Le compte étudiant est pré-inscrit à 4 cours avec des progressions variées pour que le tableau de bord soit immédiatement parlant.

## 5. API — routes principales

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/courses            ?search=&category=&level=&sort=
GET    /api/courses/:slug
POST   /api/courses            (admin)
PUT    /api/courses/:id        (admin)
DELETE /api/courses/:id        (admin)

GET    /api/categories

GET    /api/enrollments/me
POST   /api/enrollments
PUT    /api/enrollments/:id
DELETE /api/enrollments/:id

GET    /api/dashboard/stats

GET    /api/users              (admin)
GET    /api/users/:id
PUT    /api/users/:id
```

Toutes les routes protégées attendent un header `Authorization: Bearer <token>`.

## 6. Préparation au déploiement

Le frontend n'appelle jamais `http://localhost:5000` en dur : il utilise `VITE_API_URL`. Le backend lit toute sa configuration depuis `.env`. Aucun secret n'est commité (voir `.gitignore`).

### Frontend → Vercel
1. Importer le dossier `frontend/` comme projet Vercel (framework détecté : Vite).
2. Définir la variable d'environnement `VITE_API_URL` avec l'URL publique du backend Render (ex. `https://cursus-api.onrender.com/api`).
3. Build command : `npm run build` — Output directory : `dist`.

### Backend → Render
1. Créer un **Web Service** Render pointant sur `backend/`.
2. Build command : `npm install && npx prisma generate`.
3. Start command : `npm start`.
4. Définir les variables d'environnement : `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL` (URL Vercel du frontend), `PORT`.

### Base de données MySQL hébergée
Utiliser un fournisseur MySQL compatible Prisma (PlanetScale, Railway, Aiven, etc.), récupérer la chaîne de connexion et la placer dans `DATABASE_URL` sur Render. Exécuter ensuite :
```bash
npx prisma migrate deploy
npm run seed   # optionnel, pour des données de démonstration
```

Le projet doit d'abord tourner et être validé en local avec XAMPP + MySQL avant toute configuration de production.
