export default [
  {
    intro: "Le product-market fit signifie que votre produit répond à un besoin fort d'un marché précis. Tant qu'il n'est pas atteint, accélérer la croissance revient à remplir un seau percé.",
    sections: [
      {
        title: "Comment le repérer",
        text: "Le test de Sean Ellis demande aux utilisateurs : « Comment réagiriez-vous si vous ne pouviez plus utiliser ce produit ? ». Si au moins 40 % répondent « très déçu », c'est un bon signal de fit.",
      },
      {
        title: "Les signaux dans les chiffres",
        text: "Les utilisateurs reviennent d'eux-mêmes, recommandent le produit et acceptent de payer. À l'inverse, si les gens essaient puis disparaissent, retravaillez le produit avant d'investir dans l'acquisition.",
      },
    ],
    practice: "Envoyez le test de Sean Ellis à dix utilisateurs de votre produit (ou d'un produit que vous connaissez) et calculez le pourcentage.",
    exercise: {
      prompt: "Selon le test de Sean Ellis, à partir de quel pourcentage de « très déçus » parle-t-on de product-market fit ?",
      options: ["10 %", "25 %", "40 %", "90 %"],
      answer: 2,
      explanation: "Le seuil habituel est de 40 % d'utilisateurs qui seraient très déçus de perdre le produit.",
    },
  },
  {
    intro: "Un canal d'acquisition est un moyen d'atteindre vos clients : référencement, réseaux sociaux, partenariats, publicité, bouche-à-oreille, emailing.",
    sections: [
      {
        title: "Tester petit, mesurer, doubler la mise",
        text: "Plutôt que de multiplier les canaux, testez-en quelques-uns à petite échelle, mesurez leurs résultats, puis concentrez vos efforts sur celui qui marche.",
      },
      {
        title: "Le coût d'acquisition",
        text: "Le CAC (coût d'acquisition client) est le total dépensé en acquisition divisé par le nombre de nouveaux clients. Il doit rester nettement inférieur à la valeur qu'un client rapporte sur la durée.",
        code: `CAC = dépenses marketing et ventes / nouveaux clients
Ex. : 2 000 € dépensés pour 40 clients => CAC = 50 €`,
      },
    ],
    practice: "Choisissez trois canaux, fixez un petit budget à chacun pour deux semaines et comparez leur CAC.",
    exercise: {
      prompt: "Que mesure le CAC ?",
      options: [
        "Le chiffre d'affaires annuel",
        "Le coût moyen pour acquérir un nouveau client",
        "Le taux de clics d'une publicité",
        "Le nombre de clients perdus",
      ],
      answer: 1,
      explanation: "Le CAC est le coût d'acquisition client : dépenses d'acquisition divisées par le nombre de clients obtenus.",
    },
  },
  {
    intro: "Acquérir un client coûte cher, le garder est bien plus rentable. La rétention est le moteur d'une croissance durable.",
    sections: [
      {
        title: "Calculer le churn",
        text: "Le taux de churn est la part de clients perdus sur une période.",
        code: `churn = clients perdus / clients au début de la période
Ex. : 100 clients au départ, 5 partis => 5 %`,
      },
      {
        title: "Comprendre pourquoi ils partent",
        text: "Analysez par cohortes (les clients arrivés le même mois) pour voir à quel moment ils décrochent. Souvent, le problème se situe dans les premiers jours : améliorer l'onboarding a un effet direct sur la rétention.",
      },
    ],
    practice: "Calculez le churn mensuel d'un service que vous utilisez ou dont vous avez des chiffres, puis imaginez deux actions pour le réduire.",
    exercise: {
      prompt: "Vous avez 100 clients en début de mois et 5 d'entre eux partent. Quel est le taux de churn ?",
      options: ["0,5 %", "5 %", "10 %", "95 %"],
      answer: 1,
      explanation: "5 clients perdus sur 100 au départ donnent 5 % de churn.",
    },
  },
  {
    intro: "Le prix communique la valeur de votre produit autant qu'il rémunère votre travail. Il se teste et s'ajuste.",
    sections: [
      {
        title: "Trois approches",
        text: "Le prix basé sur les coûts ajoute une marge au coût de revient. Le prix aligné sur la concurrence suit le marché. Le prix basé sur la valeur part de ce que le client gagne ou économise grâce au produit : c'est souvent la plus rentable.",
      },
      {
        title: "Proposer des offres",
        text: "Une grille à trois niveaux (de base, standard, premium) permet de servir différents clients et guide le choix vers l'offre du milieu. Interrogez vos clients sur le prix qu'ils jugent trop cher ou trop bas pour trouver la bonne zone.",
      },
    ],
    practice: "Estimez en euros ou en ariary ce que votre produit fait gagner ou économiser à un client, puis fixez un prix correspondant à une fraction de cette valeur.",
    exercise: {
      prompt: "Qu'est-ce que le prix basé sur la valeur ?",
      options: [
        "Un prix égal au coût de production plus 10 %",
        "Un prix copié sur le concurrent le moins cher",
        "Un prix fixé selon la valeur perçue par le client",
        "Un prix toujours gratuit au départ",
      ],
      answer: 2,
      explanation: "Il se fonde sur le bénéfice que le client retire du produit, pas sur vos coûts.",
    },
  },
  {
    intro: "Lever des fonds consiste à vendre une part de votre entreprise à des investisseurs en échange de moyens pour croître plus vite. C'est un outil, pas un objectif.",
    sections: [
      {
        title: "Les étapes",
        text: "Le pré-amorçage et l'amorçage (pre-seed, seed) financent les premiers tests et le premier produit. La série A intervient quand le modèle commence à fonctionner et qu'il s'agit de passer à l'échelle.",
      },
      {
        title: "Pitch et dilution",
        text: "Un pitch deck clair présente le problème, la solution, le marché, la traction, l'équipe et le montant demandé. À chaque levée, vous cédez une part du capital : c'est la dilution. Vendre 20 % signifie que l'ensemble des fondateurs conservent 80 % de ce qu'ils détenaient.",
      },
    ],
    practice: "Résumez votre projet en dix slides au maximum : problème, solution, marché, traction, équipe et besoin de financement.",
    exercise: {
      prompt: "Si vous vendez 20 % du capital à un investisseur, quelle part détenez-vous ensuite avec vos cofondateurs (en partant de 100 %) ?",
      options: ["20 %", "80 %", "100 %", "120 %"],
      answer: 1,
      explanation: "100 % moins les 20 % cédés : les fondateurs conservent 80 % du capital.",
    },
  },
];
