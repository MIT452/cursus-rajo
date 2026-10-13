export default [
  {
    intro: "L'agilité est née en 2001 avec le Manifeste Agile, écrit par des développeurs lassés des projets figés qui arrivaient trop tard et à côté du besoin.",
    sections: [
      {
        title: "Les quatre valeurs",
        text: "Le manifeste valorise : les individus et leurs interactions plus que les processus et les outils ; un logiciel opérationnel plus qu'une documentation exhaustive ; la collaboration avec le client plus que la négociation contractuelle ; l'adaptation au changement plus que le suivi d'un plan.",
      },
      {
        title: "Ce que cela change",
        text: "Au lieu de tout planifier puis livrer à la fin, on livre par petits morceaux, on recueille des retours et on ajuste. Les éléments à droite de chaque valeur gardent leur utilité, mais ceux de gauche comptent davantage.",
      },
    ],
    practice: "Pensez à un projet qui a dérapé et identifiez quelle valeur du manifeste aurait pu l'aider.",
    exercise: {
      prompt: "Selon le Manifeste Agile, on valorise davantage :",
      options: [
        "Suivre un plan plutôt que s'adapter au changement",
        "Répondre au changement plutôt que suivre un plan",
        "La documentation plutôt que le logiciel fonctionnel",
        "Les contrats plutôt que la collaboration",
      ],
      answer: 1,
      explanation: "La quatrième valeur du manifeste est « répondre au changement plus que suivre un plan ».",
    },
  },
  {
    intro: "Scrum définit trois responsabilités. Elles forment une seule équipe, sans hiérarchie interne.",
    sections: [
      {
        title: "Les trois rôles",
        text: "Le Product Owner maximise la valeur du produit et ordonne le Product Backlog. Le Scrum Master aide l'équipe à appliquer Scrum et lève les obstacles. Les Developers construisent l'incrément à chaque sprint.",
      },
      {
        title: "Ce qu'ils ne sont pas",
        text: "Le Scrum Master n'est pas un chef de projet : il sert l'équipe plutôt que de lui donner des ordres. Le Product Owner est une seule personne, pour que les priorités restent claires.",
      },
    ],
    practice: "Dans une équipe que vous connaissez, indiquez qui joue chacun des trois rôles, même si les titres sont différents.",
    exercise: {
      prompt: "Qui est responsable d'ordonner le Product Backlog ?",
      options: ["Le Scrum Master", "Le Product Owner", "Les Developers", "Le client final"],
      answer: 1,
      explanation: "Le Product Owner ordonne le backlog pour maximiser la valeur livrée.",
    },
  },
  {
    intro: "Un sprint est une période courte (un mois maximum, souvent deux semaines) qui se termine par un incrément utilisable. Il commence par une planification.",
    sections: [
      {
        title: "La réunion de planification",
        text: "L'équipe répond à trois questions : pourquoi ce sprint a de la valeur (le Sprint Goal), quoi (les éléments du backlog sélectionnés) et comment (le plan pour les réaliser). Le résultat est le Sprint Backlog.",
      },
      {
        title: "Choisir la bonne quantité",
        text: "L'équipe s'engage sur ce qu'elle peut raisonnablement terminer, en s'appuyant sur ses sprints précédents plutôt que sur l'optimisme. Mieux vaut finir moins de choses, mais complètement.",
      },
    ],
    practice: "Choisissez un objectif pour une semaine de travail personnelle, écrivez son Sprint Goal en une phrase puis les tâches nécessaires.",
    exercise: {
      prompt: "Qu'est-ce que le Sprint Goal ?",
      options: [
        "La liste de toutes les tâches du sprint",
        "L'objectif unique qui donne un sens au sprint",
        "Le budget du sprint",
        "Le nombre d'heures travaillées",
      ],
      answer: 1,
      explanation: "Le Sprint Goal est l'objectif commun du sprint : il oriente les choix de l'équipe quand les imprévus arrivent.",
    },
  },
  {
    intro: "Le Daily Scrum est un point quotidien court pour que l'équipe se synchronise et adapte son plan du jour.",
    sections: [
      {
        title: "Le format",
        text: "Il dure au maximum 15 minutes, à la même heure et au même endroit, et il est destiné aux Developers. Une trame courante : qu'ai-je fait hier, que vais-je faire aujourd'hui, qu'est-ce qui me bloque.",
      },
      {
        title: "Les erreurs classiques",
        text: "Le daily n'est pas un compte rendu au manager, ni le lieu pour résoudre un problème technique en détail. Ces discussions se prolongent juste après, avec les personnes concernées.",
      },
    ],
    practice: "Lors de votre prochain point d'équipe, chronométrez-le et notez ce qui a dépassé le cadre des 15 minutes.",
    exercise: {
      prompt: "Quelle est la durée maximale d'un Daily Scrum ?",
      options: ["5 minutes", "15 minutes", "1 heure", "Il n'y a pas de limite"],
      answer: 1,
      explanation: "Le Daily Scrum est limité à 15 minutes, quelle que soit la taille de l'équipe.",
    },
  },
  {
    intro: "La rétrospective clôt le sprint : l'équipe regarde comment elle a travaillé afin de s'améliorer, pas seulement ce qu'elle a produit.",
    sections: [
      {
        title: "Un format simple",
        text: "Start / Stop / Continue : que devrions-nous commencer à faire, arrêter de faire, et continuer ? Chacun écrit ses idées, on les regroupe et on vote pour les sujets à traiter.",
      },
      {
        title: "Aboutir à des actions",
        text: "Une rétro utile se termine par une ou deux actions concrètes, avec un responsable, intégrées au prochain sprint. Et surtout, on parle des processus et des situations, pas des personnes.",
      },
    ],
    practice: "Faites une mini-rétro sur votre dernière semaine : une chose à commencer, une à arrêter, une à continuer.",
    exercise: {
      prompt: "Quel est l'objectif d'une rétrospective ?",
      options: [
        "Présenter la démo au client",
        "Améliorer la façon de travailler de l'équipe",
        "Évaluer individuellement chaque membre",
        "Planifier le sprint suivant",
      ],
      answer: 1,
      explanation: "La rétrospective porte sur le fonctionnement de l'équipe, ses outils et ses interactions, pour s'améliorer d'un sprint à l'autre.",
    },
  },
];
