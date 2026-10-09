// Contenu pédagogique des mini-leçons, indexé par slug de cours.
// L'ordre du tableau correspond à l'ordre des leçons en base (order 1..n).
// Un cours présent ici est "suivi par leçons" : sa progression dépend des
// leçons validées (et non plus du bouton manuel du dashboard).

export const lessonContent = {
  "nodejs-express-api-rest": [
    {
      intro:
        "Un projet Express qui grossit sans structure devient vite impossible à maintenir. Dans cette leçon, vous allez poser une architecture claire en couches.",
      sections: [
        {
          title: "Une arborescence par responsabilité",
          text: "Chaque dossier a un rôle unique : les routes déclarent les URL, les controllers contiennent la logique, les middlewares interceptent les requêtes, config centralise les connexions.",
          code: `src/
├── config/        # prisma.js, variables d'environnement
├── controllers/   # logique métier de chaque ressource
├── middlewares/   # auth, validation, erreurs
├── routes/        # déclaration des endpoints
├── utils/         # helpers (asyncHandler, tokens)
└── server.js      # point d'entrée`,
        },
        {
          title: "Le point d'entrée : server.js",
          text: "Il ne fait que brancher les middlewares globaux, monter les routes, puis les gestionnaires d'erreurs en dernier.",
          code: `const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const app = express();
app.use(cors());
app.use(express.json());   // lit le JSON du body

app.use("/api", routes);   // toutes les routes sous /api

app.use(notFound);         // 404
app.use(errorHandler);     // erreurs, toujours en dernier

app.listen(5000);`,
        },
      ],
      practice:
        "Dans votre terminal : créez un dossier, lancez `npm init -y`, installez express et cors, puis créez l'arborescence ci-dessus avec un endpoint GET /api/health qui renvoie { success: true }.",
      exercise: {
        prompt: "Où faut-il placer app.use(errorHandler) dans server.js ?",
        options: [
          "Tout en haut, avant express.json()",
          "Après le montage de toutes les routes",
          "Dans chaque controller",
          "Peu importe l'ordre",
        ],
        answer: 1,
        explanation:
          "Express exécute les middlewares dans l'ordre de déclaration. Le gestionnaire d'erreurs doit venir après les routes pour attraper leurs erreurs.",
      },
    },
    {
      intro:
        "Prisma est un ORM : il traduit votre schéma en tables MySQL et vous donne un client typé pour les requêtes, sans écrire de SQL à la main.",
      sections: [
        {
          title: "Connexion et schéma",
          text: "L'URL de connexion se met dans le fichier .env, et le schéma décrit vos modèles.",
          code: `# .env
DATABASE_URL="mysql://root:@localhost:3306/ma_base"

// prisma/schema.prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
}`,
        },
        {
          title: "Migrer et utiliser le client",
          text: "La migration crée les tables et génère le client. Ensuite, une seule instance de PrismaClient suffit pour toute l'application.",
          code: `npx prisma migrate dev --name init

// src/config/prisma.js
const { PrismaClient } = require("@prisma/client");
module.exports = new PrismaClient();

// dans un controller
const users = await prisma.user.findMany({ where: { email: { contains: "@" } } });`,
        },
      ],
      practice:
        "Ajoutez un modèle Post (id, title, authorId) lié à User, lancez une migration, puis créez un endpoint GET /api/posts qui renvoie la liste avec l'auteur (include).",
      exercise: {
        prompt:
          "Quelle commande applique vos changements de schéma en développement et crée un fichier de migration ?",
        options: [
          "npx prisma generate",
          "npx prisma migrate dev",
          "npx prisma studio",
          "npx prisma migrate deploy",
        ],
        answer: 1,
        explanation:
          "`migrate dev` crée et applique la migration en local. `migrate deploy` sert en production, et `generate` ne régénère que le client.",
      },
    },
    {
      intro:
        "Une API doit savoir qui lui parle. Avec JWT, le serveur délivre un jeton signé à la connexion, et le client le renvoie à chaque requête.",
      sections: [
        {
          title: "Inscription et connexion",
          text: "Le mot de passe est toujours haché avec bcrypt avant stockage. À la connexion, on compare puis on signe un jeton.",
          code: `const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// inscription
const hash = await bcrypt.hash(password, 10);
await prisma.user.create({ data: { email, name, password: hash } });

// connexion
const ok = await bcrypt.compare(password, user.password);
if (!ok) { res.status(401); throw new Error("Identifiants invalides"); }

const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });`,
        },
        {
          title: "Protéger une route",
          text: "Le middleware lit l'en-tête Authorization, vérifie le jeton, et attache l'utilisateur à la requête.",
          code: `const authMiddleware = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) { res.status(401); throw new Error("Non autorisé"); }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await prisma.user.findUnique({ where: { id: decoded.id } });
  next();
};

router.get("/me", authMiddleware, getMe);`,
        },
      ],
      practice:
        "Créez POST /api/auth/register et POST /api/auth/login, puis protégez GET /api/auth/me. Testez avec un client HTTP en envoyant l'en-tête Authorization: Bearer <token>.",
      exercise: {
        prompt: "Comment doit-on stocker le mot de passe d'un utilisateur ?",
        options: [
          "En clair, c'est plus simple à comparer",
          "Chiffré avec JWT",
          "Haché avec bcrypt",
          "Dans le jeton JWT",
        ],
        answer: 2,
        explanation:
          "Un hash bcrypt est à sens unique et salé : même avec la base en main, on ne retrouve pas le mot de passe. Un JWT n'est pas fait pour cela.",
      },
    },
    {
      intro:
        "Un middleware est une fonction qui s'exécute entre la requête et la réponse. C'est l'outil idéal pour valider les données avant qu'elles n'atteignent votre logique.",
      sections: [
        {
          title: "Anatomie d'un middleware",
          text: "Il reçoit req, res et next. Soit il répond, soit il appelle next() pour passer au suivant.",
          code: `const logger = (req, res, next) => {
  console.log(req.method, req.url);
  next(); // sans cet appel, la requête reste bloquée
};

app.use(logger);`,
        },
        {
          title: "Valider le body",
          text: "On écrit un middleware réutilisable qui refuse les données invalides avec un code 400. Des bibliothèques comme Zod ou Joi font la même chose avec plus de confort.",
          code: `const validate = (fields) => (req, res, next) => {
  const missing = fields.filter((f) => !req.body[f]);
  if (missing.length) {
    return res.status(400).json({
      success: false,
      message: "Champs manquants : " + missing.join(", "),
    });
  }
  next();
};

router.post("/register", validate(["name", "email", "password"]), register);`,
        },
        {
          title: "Le middleware d'erreurs",
          text: "Il se reconnaît à ses quatre paramètres : Express l'identifie ainsi comme gestionnaire d'erreurs.",
          code: `const errorHandler = (err, req, res, next) => {
  const status = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(status).json({ success: false, message: err.message });
};`,
        },
      ],
      practice:
        "Ajoutez validate(['title']) sur votre route POST /api/posts, puis envoyez une requête sans title et vérifiez que vous obtenez bien un 400.",
      exercise: {
        prompt: "Que se passe-t-il si un middleware oublie d'appeler next() et ne répond pas ?",
        options: [
          "Express passe automatiquement au suivant",
          "La requête reste en attente, sans réponse",
          "Une erreur 404 est renvoyée",
          "Le serveur redémarre",
        ],
        answer: 1,
        explanation:
          "Sans réponse ni next(), la requête reste suspendue jusqu'au timeout du client.",
      },
    },
    {
      intro:
        "Une API qui n'est pas testée casse en silence. Dans cette dernière leçon, vous testez vos endpoints puis vous préparez la mise en production.",
      sections: [
        {
          title: "Tester un endpoint avec Supertest",
          text: "Pour tester sans démarrer de port, exportez l'app depuis un fichier séparé de app.listen.",
          code: `// npm i -D jest supertest
const request = require("supertest");
const app = require("../src/app");

test("GET /api/health répond 200", async () => {
  const res = await request(app).get("/api/health");
  expect(res.statusCode).toBe(200);
  expect(res.body.success).toBe(true);
});`,
        },
        {
          title: "Préparer le déploiement",
          text: "En production : variables d'environnement définies sur l'hébergeur (jamais le .env dans Git), migrations appliquées avec migrate deploy, et un gestionnaire de processus comme PM2.",
          code: `NODE_ENV=production
npx prisma migrate deploy   # applique les migrations existantes
npm start                   # ou : pm2 start src/server.js`,
        },
      ],
      practice:
        "Écrivez un test qui vérifie que GET /api/auth/me sans jeton renvoie 401, puis lancez-le avec `npx jest`.",
      exercise: {
        prompt: "Quelle commande applique les migrations sur le serveur de production ?",
        options: [
          "npx prisma migrate dev",
          "npx prisma migrate reset",
          "npx prisma migrate deploy",
          "npx prisma db seed",
        ],
        answer: 2,
        explanation:
          "`migrate deploy` applique uniquement les migrations déjà créées, sans rien générer ni réinitialiser la base.",
      },
    },
  ],
};

export const hasLessonContent = (slug) => Boolean(lessonContent[slug]);
export const getLessonContent = (slug, index) => lessonContent[slug]?.[index] ?? null;
