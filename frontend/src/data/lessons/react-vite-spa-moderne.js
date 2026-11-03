export default [
  {
    intro: "Vite est un outil de build ultra-rapide : il démarre un serveur de développement en quelques secondes et recharge la page à chaque modification.",
    sections: [
      {
        title: "Créer le projet",
        text: "Une seule commande génère un projet React prêt à l'emploi.",
        code: `npm create vite@latest mon-app -- --template react
cd mon-app
npm install
npm run dev   # http://localhost:5173`,
      },
      {
        title: "Les fichiers importants",
        text: "index.html est le point d'entrée, src/main.jsx monte l'application dans la page, et src/App.jsx est votre premier composant.",
        code: `mon-app/
├── index.html
├── vite.config.js
└── src/
    ├── main.jsx   # ReactDOM.createRoot(...).render(<App />)
    └── App.jsx`,
      },
    ],
    practice: "Créez le projet, modifiez le texte de App.jsx et vérifiez que la page se met à jour sans rechargement manuel.",
    exercise: {
      prompt: "Quelle commande lance le serveur de développement Vite ?",
      options: ["npm start", "npm run dev", "npm run build", "npm run preview"],
      answer: 1,
      explanation: "`npm run dev` lance le serveur local. `build` produit la version de production et `preview` la prévisualise.",
    },
  },
  {
    intro: "Un composant est une fonction qui retourne du JSX. Les props sont les paramètres que le parent lui transmet.",
    sections: [
      {
        title: "Un composant avec des props",
        text: "Les props se déstructurent dans les paramètres. Elles sont en lecture seule.",
        code: `function Card({ title, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

<Card title="Bonjour">
  <p>Contenu de la carte</p>
</Card>`,
      },
      {
        title: "Afficher une liste",
        text: "On utilise map() et une clé unique par élément.",
        code: `{users.map((u) => (
  <li key={u.id}>{u.name}</li>
))}`,
      },
    ],
    practice: "Créez un composant Badge qui reçoit un texte et une couleur en props, puis affichez-en trois avec des valeurs différentes.",
    exercise: {
      prompt: "Comment le composant Card récupère-t-il la valeur de <Card title=\"Bonjour\" /> ?",
      options: ["function Card(title)", "function Card({ title })", "function Card() { this.title }", "function Card(props.title)"],
      answer: 1,
      explanation: "Les props arrivent dans un objet unique : on le déstructure avec `{ title }`.",
    },
  },
  {
    intro: "Les hooks donnent de la mémoire et des effets de bord aux composants fonctionnels. Les deux essentiels : useState et useEffect.",
    sections: [
      {
        title: "useState : garder une valeur",
        text: "Appeler le setter déclenche un nouveau rendu avec la nouvelle valeur.",
        code: `const [count, setCount] = useState(0);
<button onClick={() => setCount(count + 1)}>{count}</button>`,
      },
      {
        title: "useEffect : réagir à un changement",
        text: "Le tableau de dépendances contrôle quand l'effet s'exécute. Avec un tableau vide, il ne s'exécute qu'une fois, après le premier rendu.",
        code: `useEffect(() => {
  fetch("/api/courses")
    .then((r) => r.json())
    .then(setCourses);
}, []);`,
      },
    ],
    practice: "Construisez un compteur avec trois boutons (+1, -1, reset), puis chargez une liste depuis une API publique au montage du composant.",
    exercise: {
      prompt: "Quand useEffect(() => {...}, []) s'exécute-t-il ?",
      options: ["À chaque rendu", "Une seule fois, après le premier rendu", "Jamais", "À chaque clic"],
      answer: 1,
      explanation: "Un tableau de dépendances vide signifie « aucune dépendance » : l'effet ne tourne qu'au montage.",
    },
  },
  {
    intro: "React Router permet d'avoir plusieurs pages dans une application sans jamais recharger le navigateur.",
    sections: [
      {
        title: "Déclarer les routes",
        text: "BrowserRouter entoure l'application, Routes liste les chemins.",
        code: `// npm i react-router-dom
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/cours/:slug" element={<CourseDetail />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>`,
      },
      {
        title: "Naviguer et lire les paramètres",
        text: "Link remplace la balise a, et useParams lit les segments dynamiques de l'URL.",
        code: `<Link to="/cours/react">Voir le cours</Link>

const { slug } = useParams();`,
      },
    ],
    practice: "Ajoutez trois pages (Accueil, À propos, 404) avec une barre de navigation en Link.",
    exercise: {
      prompt: "Quel composant permet de naviguer sans recharger la page ?",
      options: ["<a href>", "<Link to>", "<Route>", "<Routes>"],
      answer: 1,
      explanation: "Une balise `a` recharge la page entière. `Link` change l'URL et laisse React Router afficher la bonne route.",
    },
  },
  {
    intro: "Dernière étape : produire une version optimisée et la mettre en ligne.",
    sections: [
      {
        title: "Construire pour la production",
        text: "La commande build génère des fichiers statiques minifiés dans le dossier dist.",
        code: `npm run build     # crée dist/
npm run preview   # teste le build en local`,
      },
      {
        title: "Variables d'environnement et routes",
        text: "Vite n'expose au navigateur que les variables préfixées par VITE_. Comme une SPA n'a qu'un seul index.html, l'hébergeur doit rediriger toutes les URL vers lui, sinon un rechargement sur /cours/react donne une 404.",
        code: `# .env
VITE_API_URL=https://api.monsite.com

// dans le code
import.meta.env.VITE_API_URL`,
      },
    ],
    practice: "Lancez un build, testez-le avec preview, puis déployez le dossier dist sur l'hébergeur statique de votre choix.",
    exercise: {
      prompt: "Quel dossier contient les fichiers à déployer après npm run build ?",
      options: ["src", "public", "dist", "build-output"],
      answer: 2,
      explanation: "Vite écrit le résultat du build dans `dist` par défaut.",
    },
  },
];
