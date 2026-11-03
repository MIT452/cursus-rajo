const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

const categories = [
  { name: "Developpement Web", slug: "developpement-web", icon: "Code2" },
  { name: "Data & IA", slug: "data-ia", icon: "BrainCircuit" },
  { name: "Design", slug: "design", icon: "PenTool" },
  { name: "Business", slug: "business", icon: "TrendingUp" },
];

const courses = [
  {
    title: "React & Vite : construire une SPA moderne",
    slug: "react-vite-spa-moderne",
    description:
      "Apprenez a construire des interfaces reactives et performantes avec React 18, Vite et une architecture de composants propre. Du premier composant au deploiement.",
    instructor: "Camille Fabre",
    level: "INTERMEDIAIRE",
    durationHours: 12,
    price: 49,
    rating: 4.8,
    thumbnailColor: "#7C6FF0",
    category: "developpement-web",
    lessons: ["Mise en place de Vite", "Composants et props", "Gestion d'etat avec hooks", "Routing avec React Router", "Deploiement"],
  },
  {
    title: "Node.js & Express : API REST de A a Z",
    slug: "nodejs-express-api-rest",
    description:
      "Concevez des API robustes avec Express, Prisma et MySQL. Authentification JWT, validation, gestion d'erreurs et bonnes pratiques d'architecture.",
    instructor: "Karim Belaid",
    level: "INTERMEDIAIRE",
    durationHours: 15,
    price: 59,
    rating: 4.7,
    thumbnailColor: "#F2B441",
    category: "developpement-web",
    lessons: ["Structurer un projet Express", "Prisma et MySQL", "Authentification JWT", "Middlewares et validation", "Tests et deploiement"],
  },
  {
    title: "Introduction au Machine Learning",
    slug: "introduction-machine-learning",
    description:
      "Les fondamentaux du machine learning expliques simplement : regression, classification, arbres de decision, et premiers modeles avec Python.",
    instructor: "Sofia Marchetti",
    level: "DEBUTANT",
    durationHours: 10,
    price: 39,
    rating: 4.6,
    thumbnailColor: "#2DD4BF",
    category: "data-ia",
    lessons: ["Qu'est ce que le ML", "Regression lineaire", "Classification", "Arbres de decision", "Evaluer un modele"],
  },
  {
    title: "Deep Learning avec PyTorch",
    slug: "deep-learning-pytorch",
    description:
      "Construisez et entrainez des reseaux de neurones avec PyTorch. Vision par ordinateur, NLP et bonnes pratiques d'entrainement.",
    instructor: "Sofia Marchetti",
    level: "AVANCE",
    durationHours: 18,
    price: 79,
    rating: 4.9,
    thumbnailColor: "#7C6FF0",
    category: "data-ia",
    lessons: ["Tenseurs et autograd", "Reseaux fully connected", "CNN pour la vision", "RNN et NLP", "Deploiement d'un modele"],
  },
  {
    title: "UI Design : principes et outils",
    slug: "ui-design-principes-outils",
    description:
      "Composition, couleur, typographie et hierarchie visuelle. Apprenez a concevoir des interfaces claires et a les prototyper avec Figma.",
    instructor: "Lea Dumont",
    level: "DEBUTANT",
    durationHours: 8,
    price: 35,
    rating: 4.7,
    thumbnailColor: "#F2B441",
    category: "design",
    lessons: ["Grille et composition", "Couleur et contraste", "Typographie", "Prototypage Figma", "Design system"],
  },
  {
    title: "UX Research pour produits digitaux",
    slug: "ux-research-produits-digitaux",
    description:
      "Methodes d'entretien utilisateur, tests d'usabilite et synthese d'insights pour guider vos decisions produit.",
    instructor: "Lea Dumont",
    level: "INTERMEDIAIRE",
    durationHours: 9,
    price: 45,
    rating: 4.5,
    thumbnailColor: "#2DD4BF",
    category: "design",
    lessons: ["Preparer un entretien", "Conduire des tests utilisateurs", "Analyser les donnees", "Cartes d'empathie", "Presenter les insights"],
  },
  {
    title: "Gestion de projet Agile & Scrum",
    slug: "gestion-projet-agile-scrum",
    description:
      "Maitrisez les fondamentaux de Scrum, la planification de sprints et l'animation d'equipes produit performantes.",
    instructor: "Antoine Rey",
    level: "DEBUTANT",
    durationHours: 7,
    price: 29,
    rating: 4.4,
    thumbnailColor: "#7C6FF0",
    category: "business",
    lessons: ["Les valeurs Agile", "Roles Scrum", "Planifier un sprint", "Animer un daily", "Retrospectives efficaces"],
  },
  {
    title: "Strategie de croissance pour startups",
    slug: "strategie-croissance-startups",
    description:
      "Acquisition, retention et metriques cles pour faire grandir un produit digital, illustre par des cas reels.",
    instructor: "Antoine Rey",
    level: "AVANCE",
    durationHours: 11,
    price: 69,
    rating: 4.6,
    thumbnailColor: "#F2B441",
    category: "business",
    lessons: ["Trouver son product-market fit", "Canaux d'acquisition", "Retention et churn", "Pricing", "Lever des fonds"],
  },
];

async function main() {
  console.log("Nettoyage de la base...");
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log("Creation des categories...");
  const categoryMap = {};
  for (const c of categories) {
    const created = await prisma.category.create({ data: c });
    categoryMap[c.slug] = created.id;
  }

  console.log("Creation des cours et lecons...");
  for (const c of courses) {
    const { lessons, category, ...courseData } = c;
    await prisma.course.create({
      data: {
        ...courseData,
        categoryId: categoryMap[category],
        lessons: {
          create: lessons.map((title, i) => ({
            title,
            order: i + 1,
            durationMin: 15 + i * 5,
          })),
        },
      },
    });
  }

  console.log("Creation des utilisateurs de demonstration...");
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const userPassword = await bcrypt.hash("User123!", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin Cursus",
      email: "admin@cursus.dev",
      password: adminPassword,
      role: "ADMIN",
      avatarColor: "#F2B441",
    },
  });

  const student = await prisma.user.create({
    data: {
      name: "Jade Petit",
      email: "etudiant@cursus.dev",
      password: userPassword,
      role: "USER",
      avatarColor: "#2DD4BF",
    },
  });

  console.log("Inscription de l'etudiant demo a quelques cours...");
  const allCourses = await prisma.course.findMany();
  const enrolledCourses = allCourses.slice(0, 4);
  for (let i = 0; i < enrolledCourses.length; i++) {
    await prisma.enrollment.create({
      data: {
        userId: student.id,
        courseId: enrolledCourses[i].id,
        progress: [100, 65, 30, 0][i] ?? 0,
        completedAt: i === 0 ? new Date() : null,
      },
    });
  }

  console.log("Seed termine.");
  console.log("Identifiants de demonstration :");
  console.log("  Admin      -> admin@cursus.dev / Admin123!");
  console.log("  Etudiant   -> etudiant@cursus.dev / User123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
