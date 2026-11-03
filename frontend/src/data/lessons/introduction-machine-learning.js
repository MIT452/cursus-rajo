export default [
  {
    intro: "Le machine learning consiste à laisser un programme apprendre des règles à partir d'exemples, plutôt que de les coder à la main.",
    sections: [
      {
        title: "Les grandes familles",
        text: "En apprentissage supervisé, chaque exemple vient avec sa réponse (le label) : on prédit un nombre (régression) ou une catégorie (classification). En apprentissage non supervisé, il n'y a pas de label : on cherche des structures, par exemple des groupes (clustering).",
      },
      {
        title: "Vocabulaire de base",
        text: "Les features sont les variables d'entrée (surface, nombre de pièces), le label est ce qu'on veut prédire (le prix). Un modèle s'entraîne sur des exemples, puis prédit sur de nouvelles données.",
      },
    ],
    practice: "Citez trois problèmes de votre quotidien et classez-les : régression, classification ou clustering.",
    exercise: {
      prompt: "Prédire le prix d'une maison à partir de sa surface est un problème de :",
      options: ["Classification", "Régression supervisée", "Clustering", "Apprentissage par renforcement"],
      answer: 1,
      explanation: "On prédit une valeur numérique à partir d'exemples étiquetés : c'est de la régression supervisée.",
    },
  },
  {
    intro: "La régression linéaire cherche la droite qui s'ajuste le mieux à vos données : y = a·x + b.",
    sections: [
      {
        title: "Entraîner un modèle avec scikit-learn",
        text: "Le schéma est toujours le même : créer le modèle, fit pour apprendre, predict pour prédire.",
        code: `from sklearn.linear_model import LinearRegression

X = [[30], [50], [80], [100]]      # surface en m²
y = [90, 140, 220, 270]            # prix en milliers

model = LinearRegression()
model.fit(X, y)
print(model.predict([[65]]))`,
      },
      {
        title: "Mesurer l'erreur",
        text: "L'erreur quadratique moyenne (MSE) calcule la moyenne des carrés des écarts entre prédictions et valeurs réelles. Plus elle est faible, mieux le modèle s'ajuste.",
      },
    ],
    practice: "Reprenez l'exemple, ajoutez deux maisons de plus et observez comment la prédiction pour 65 m² évolue.",
    exercise: {
      prompt: "Quelle méthode de scikit-learn entraîne le modèle sur les données ?",
      options: ["predict()", "fit()", "score_all()", "train_test()"],
      answer: 1,
      explanation: "`fit(X, y)` apprend les paramètres, puis `predict(X)` les utilise.",
    },
  },
  {
    intro: "La classification prédit une catégorie : spam ou non, malade ou sain, chat ou chien.",
    sections: [
      {
        title: "La régression logistique",
        text: "Malgré son nom, c'est un classifieur. Elle estime une probabilité d'appartenir à une classe, puis choisit la classe la plus probable.",
        code: `from sklearn.linear_model import LogisticRegression

clf = LogisticRegression()
clf.fit(X_train, y_train)

clf.predict(X_test)        # classes prédites
clf.predict_proba(X_test)  # probabilités par classe`,
      },
      {
        title: "Binaire ou multiclasse",
        text: "Avec deux classes, c'est un problème binaire (spam / non spam). Avec plus de deux, il est multiclasse (chiffres de 0 à 9).",
      },
    ],
    practice: "Entraînez un classifieur sur le jeu de données Iris fourni par sklearn.datasets et affichez la classe prédite pour trois fleurs.",
    exercise: {
      prompt: "Détecter si un email est un spam est un problème de :",
      options: ["Régression", "Classification", "Clustering", "Réduction de dimension"],
      answer: 1,
      explanation: "La réponse est une catégorie (spam ou non), donc de la classification binaire.",
    },
  },
  {
    intro: "Un arbre de décision pose une suite de questions simples (« surface > 60 ? ») pour arriver à une prédiction. Il est facile à lire et à expliquer.",
    sections: [
      {
        title: "Entraîner un arbre",
        text: "Livré sans limite, un arbre peut apprendre les données par cœur : c'est le surapprentissage. On le freine avec max_depth.",
        code: `from sklearn.tree import DecisionTreeClassifier

tree = DecisionTreeClassifier(max_depth=3, random_state=0)
tree.fit(X_train, y_train)`,
      },
      {
        title: "Atouts et limites",
        text: "Lisibles et sans besoin de normaliser les données, les arbres sont en revanche sensibles aux petites variations des données. Les forêts aléatoires combinent de nombreux arbres pour corriger cela.",
      },
    ],
    practice: "Entraînez trois arbres avec max_depth = 1, 3 et 10 et comparez leur score sur les données d'entraînement et de test.",
    exercise: {
      prompt: "Quel paramètre limite la complexité d'un arbre de décision ?",
      options: ["max_depth", "n_clusters", "learning_rate", "batch_size"],
      answer: 0,
      explanation: "`max_depth` limite le nombre de niveaux de questions, ce qui réduit le risque de surapprentissage.",
    },
  },
  {
    intro: "Un modèle n'est bon que s'il fonctionne sur des données qu'il n'a jamais vues. D'où l'importance d'une bonne évaluation.",
    sections: [
      {
        title: "Séparer entraînement et test",
        text: "On garde une partie des données de côté pour simuler des données nouvelles.",
        code: `from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
model.fit(X_train, y_train)
accuracy_score(y_test, model.predict(X_test))`,
      },
      {
        title: "Au-delà de l'accuracy",
        text: "Si 95 % des emails sont légitimes, un modèle qui répond toujours « non spam » a 95 % d'accuracy mais ne sert à rien. La précision (parmi mes alertes, combien sont justes) et le rappel (parmi les vrais cas, combien j'en détecte) donnent une vision plus juste.",
      },
    ],
    practice: "Calculez accuracy, précision et rappel de votre classifieur Iris ou d'un jeu binaire, et comparez-les.",
    exercise: {
      prompt: "Pourquoi sépare-t-on les données en un jeu d'entraînement et un jeu de test ?",
      options: [
        "Pour que l'entraînement soit plus rapide",
        "Pour évaluer le modèle sur des données qu'il n'a pas vues",
        "Pour supprimer les valeurs aberrantes",
        "Pour augmenter la taille du jeu de données",
      ],
      answer: 1,
      explanation: "Évaluer sur les données d'entraînement masque le surapprentissage. Le jeu de test donne une estimation honnête.",
    },
  },
];
