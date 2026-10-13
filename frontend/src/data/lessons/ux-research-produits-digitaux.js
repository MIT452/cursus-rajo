export default [
  {
    intro: "Un bon entretien utilisateur se prépare : sans objectif clair et sans bonnes questions, on récolte surtout des opinions polies.",
    sections: [
      {
        title: "Définir l'objectif et recruter",
        text: "Formulez ce que vous voulez apprendre (« comprendre comment les gens choisissent un cours en ligne »), puis recrutez des participants qui ressemblent à vos vrais utilisateurs. Cinq à huit entretiens suffisent souvent pour voir émerger des tendances.",
      },
      {
        title: "Poser de bonnes questions",
        text: "Préférez les questions ouvertes qui portent sur le passé et les faits, plutôt que sur des intentions hypothétiques. Évitez les questions qui suggèrent la réponse.",
        code: `À éviter : « Vous trouvez notre site facile à utiliser, non ? »
À préférer : « Racontez-moi la dernière fois que vous avez cherché un cours en ligne. »
Relances : « Pourquoi ? », « Pouvez-vous m'en dire plus ? »`,
      },
    ],
    practice: "Rédigez un guide d'entretien de cinq questions ouvertes sur un sujet de votre choix, puis testez-le sur un proche.",
    exercise: {
      prompt: "Laquelle de ces questions est la mieux formulée pour un entretien ?",
      options: [
        "Vous aimez notre application, n'est-ce pas ?",
        "Seriez-vous prêt à payer 10 € par mois ?",
        "Racontez-moi la dernière fois que vous avez commandé en ligne.",
        "Trouvez-vous le bouton orange assez visible ?",
      ],
      answer: 2,
      explanation: "Elle est ouverte, porte sur un comportement réel et ne suggère aucune réponse.",
    },
  },
  {
    intro: "Le test utilisateur consiste à observer des personnes réaliser des tâches réelles avec votre produit, pour repérer où elles bloquent.",
    sections: [
      {
        title: "Préparer des scénarios",
        text: "Donnez des tâches concrètes sans révéler la solution : « Vous voulez vous inscrire à un cours gratuit. Montrez-moi comment vous feriez. » Évitez de nommer les boutons ou les menus.",
      },
      {
        title: "Animer la séance",
        text: "Demandez au participant de penser à voix haute (think aloud). Votre rôle est d'observer et de noter, pas d'aider : une hésitation est justement l'information recherchée. Selon les travaux de Nielsen, cinq utilisateurs révèlent la majorité des problèmes d'utilisabilité majeurs d'une interface.",
      },
    ],
    practice: "Choisissez une application, écrivez deux scénarios de tâche et observez une personne les réaliser sans l'aider.",
    exercise: {
      prompt: "Que signifie la technique du « think aloud » ?",
      options: [
        "L'animateur explique l'interface à voix haute",
        "Le participant verbalise ses pensées pendant qu'il utilise le produit",
        "Le participant remplit un questionnaire à la fin",
        "L'équipe commente la séance en direct",
      ],
      answer: 1,
      explanation: "En parlant à voix haute, le participant laisse voir ses attentes et ses confusions.",
    },
  },
  {
    intro: "Après la collecte, il faut transformer des notes brutes en enseignements fiables. C'est l'étape de l'analyse.",
    sections: [
      {
        title: "Le diagramme d'affinités",
        text: "Écrivez chaque observation sur une note, puis regroupez celles qui se ressemblent pour faire apparaître des thèmes. Les motifs qui reviennent chez plusieurs participants comptent plus qu'une remarque isolée.",
      },
      {
        title: "Hiérarchiser",
        text: "Pour chaque problème, évaluez sa fréquence (combien de participants), sa gravité (empêche-t-il d'atteindre l'objectif ?) et l'effort de correction. Cela donne une liste d'actions priorisées.",
      },
    ],
    practice: "Notez vingt observations sur des post-its (réels ou virtuels) et regroupez-les en trois ou quatre thèmes.",
    exercise: {
      prompt: "À quoi sert un diagramme d'affinités ?",
      options: [
        "À dessiner l'architecture technique",
        "À regrouper des observations en thèmes",
        "À calculer le chiffre d'affaires",
        "À planifier un sprint",
      ],
      answer: 1,
      explanation: "Il sert à organiser des données qualitatives par ressemblance pour en dégager des tendances.",
    },
  },
  {
    intro: "La carte d'empathie est un outil visuel pour résumer ce que l'on sait d'un utilisateur et aider l'équipe à se mettre à sa place.",
    sections: [
      {
        title: "Les quadrants",
        text: "On la découpe en quatre zones : Dit (ce qu'il affirme), Pense (ce qu'il garde pour lui), Fait (ses actions observables) et Ressent (ses émotions). On y ajoute souvent ses frustrations et ses attentes.",
      },
      {
        title: "La remplir avec des faits",
        text: "Appuyez chaque case sur des citations et des observations réelles issues de vos entretiens, pas sur des suppositions. Les écarts entre ce qu'il dit et ce qu'il fait sont souvent les plus instructifs.",
      },
    ],
    practice: "Choisissez un participant d'un entretien et remplissez ses quatre quadrants avec des éléments précis.",
    exercise: {
      prompt: "Dans une carte d'empathie, que contient le quadrant « Fait » ?",
      options: [
        "Ses émotions",
        "Ses actions et comportements observables",
        "Ses pensées secrètes",
        "Ses données démographiques",
      ],
      answer: 1,
      explanation: "« Fait » regroupe ce que l'on peut observer directement : les gestes, les parcours, les contournements.",
    },
  },
  {
    intro: "Une recherche utile est une recherche qui change des décisions. Savoir présenter ses résultats est donc aussi important que les produire.",
    sections: [
      {
        title: "Formuler un insight",
        text: "Un insight relie une observation, sa cause probable et son implication : « 4 participants sur 5 abandonnent l'inscription au champ téléphone, car ils ne comprennent pas pourquoi il est demandé : expliquer son usage ou le rendre optionnel. »",
      },
      {
        title: "Raconter et recommander",
        text: "Commencez par l'essentiel, appuyez-vous sur des extraits et des verbatims, puis terminez par des recommandations classées par priorité. Une courte vidéo d'un utilisateur en difficulté convainc souvent plus qu'un long rapport.",
      },
    ],
    practice: "Rédigez trois insights sur le modèle observation, cause, recommandation à partir de votre diagramme d'affinités.",
    exercise: {
      prompt: "Qu'est-ce qui fait un bon insight ?",
      options: [
        "Une opinion personnelle de l'équipe",
        "Une observation appuyée sur des preuves et qui débouche sur une action",
        "Une statistique sans contexte",
        "Une liste de toutes les remarques recueillies",
      ],
      answer: 1,
      explanation: "Un insight s'appuie sur des preuves et se termine par une conséquence ou une recommandation concrète.",
    },
  },
];
