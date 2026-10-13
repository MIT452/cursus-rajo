export default [
  {
    intro: "Une bonne interface paraît ordonnée avant même qu'on la lise. Cette impression vient de la grille, de l'alignement et de l'espace.",
    sections: [
      {
        title: "La grille",
        text: "Une grille de 12 colonnes est un standard : elle se divise facilement en 2, 3, 4 ou 6 parts. Les éléments s'alignent sur ses colonnes et ses marges.",
      },
      {
        title: "Un système d'espacement",
        text: "Choisissez une unité de base et n'utilisez que ses multiples : 8, 16, 24, 32, 48. Cette cohérence donne un rythme visuel, et l'espace vide (le blanc) sépare les groupes sans bordures.",
      },
    ],
    practice: "Prenez une capture d'une application que vous aimez et dessinez dessus la grille et les alignements que vous retrouvez.",
    exercise: {
      prompt: "Dans un système d'espacement basé sur 8 px, quelle valeur est cohérente ?",
      options: ["13 px", "24 px", "30 px", "45 px"],
      answer: 1,
      explanation: "24 = 3 × 8. Les autres valeurs ne sont pas des multiples de la base choisie.",
    },
  },
  {
    intro: "La couleur guide l'attention et porte du sens, mais surtout elle doit rester lisible pour tout le monde.",
    sections: [
      {
        title: "Construire une palette",
        text: "Une règle simple : 60 % de couleur dominante (fonds neutres), 30 % de couleur secondaire, 10 % d'accent pour les actions importantes.",
      },
      {
        title: "Le contraste",
        text: "Les règles d'accessibilité WCAG demandent un rapport de contraste d'au moins 4,5:1 entre le texte normal et son fond (niveau AA), et 3:1 pour le grand texte. Ne transmettez jamais une information par la seule couleur : ajoutez une icône ou un texte.",
      },
    ],
    practice: "Testez trois de vos paires texte/fond avec un vérificateur de contraste en ligne et corrigez celles qui échouent.",
    exercise: {
      prompt: "Quel rapport de contraste minimum WCAG AA demande-t-on pour du texte normal ?",
      options: ["2:1", "3:1", "4,5:1", "10:1"],
      answer: 2,
      explanation: "Le niveau AA exige 4,5:1 pour le texte courant, et 3:1 seulement pour le grand texte.",
    },
  },
  {
    intro: "Dans la plupart des interfaces, l'essentiel de l'information passe par du texte. Soigner la typographie, c'est soigner la lisibilité.",
    sections: [
      {
        title: "Hiérarchie",
        text: "Distinguez titres, sous-titres et corps par la taille, la graisse et la couleur. Limitez-vous à deux familles de polices, souvent une pour les titres et une pour le texte.",
      },
      {
        title: "Confort de lecture",
        text: "Un interligne de 1,4 à 1,6 fois la taille du texte et une longueur de ligne de 45 à 75 caractères rendent la lecture agréable. Un corps de texte descend rarement en dessous de 16 px sur le web.",
      },
    ],
    practice: "Reprenez une page très dense et améliorez-la uniquement avec la typographie : tailles, interlignes et largeur de colonne.",
    exercise: {
      prompt: "Quelle longueur de ligne est la plus confortable pour un paragraphe ?",
      options: ["10 à 20 caractères", "45 à 75 caractères", "120 à 150 caractères", "Toute la largeur de l'écran"],
      answer: 1,
      explanation: "Trop courte, la ligne hache la lecture ; trop longue, l'œil se perd au retour de ligne. 45 à 75 caractères est la zone recommandée.",
    },
  },
  {
    intro: "Figma permet de dessiner des interfaces, de les rendre réutilisables et de simuler la navigation avant d'écrire une ligne de code.",
    sections: [
      {
        title: "Les bases",
        text: "Les frames représentent les écrans. L'auto layout fait que les éléments s'adaptent à leur contenu (espacement, alignement, taille) comme du flexbox. Les composants sont des éléments réutilisables, et les variants regroupent leurs états (normal, survol, désactivé).",
      },
      {
        title: "Prototyper",
        text: "En mode prototype, on relie les frames par des interactions (au clic, au survol) et on choisit une animation de transition. On obtient une maquette cliquable à tester avec de vrais utilisateurs.",
      },
    ],
    practice: "Dessinez un bouton avec auto layout, transformez-le en composant avec trois variants, puis reliez deux écrans dans un prototype.",
    exercise: {
      prompt: "À quoi sert l'auto layout dans Figma ?",
      options: [
        "À exporter automatiquement le code",
        "À adapter l'espacement et la taille d'un cadre à son contenu",
        "À choisir les couleurs",
        "À publier le prototype",
      ],
      answer: 1,
      explanation: "L'auto layout fonctionne comme flexbox : le cadre s'ajuste quand le contenu change.",
    },
  },
  {
    intro: "Un design system est la source de vérité partagée entre designers et développeurs : mêmes briques, mêmes règles, partout.",
    sections: [
      {
        title: "Les ingrédients",
        text: "Les tokens sont des valeurs nommées (couleur primaire, espacement moyen, rayon des coins). Les composants (bouton, champ, carte) les utilisent. La documentation explique quand et comment s'en servir.",
      },
      {
        title: "Pourquoi s'y mettre",
        text: "Moins de décisions répétées, des interfaces cohérentes et des évolutions rapides : changer un token met à jour tous les composants qui l'utilisent.",
      },
    ],
    practice: "Listez les couleurs, tailles de texte et espacements d'un de vos projets, nommez-les comme des tokens et regroupez les doublons.",
    exercise: {
      prompt: "Qu'est-ce qu'un design token ?",
      options: [
        "Un fichier d'export d'image",
        "Une valeur nommée et réutilisable (couleur, espacement, etc.)",
        "Un plugin Figma payant",
        "Un test utilisateur",
      ],
      answer: 1,
      explanation: "Un token donne un nom à une décision de design, ce qui permet de la modifier en un seul endroit.",
    },
  },
];
