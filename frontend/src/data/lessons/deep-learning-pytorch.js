export default [
  {
    intro: "Le tenseur est la structure de base de PyTorch : un tableau multidimensionnel qui peut vivre sur CPU ou GPU. Autograd calcule automatiquement les gradients dont l'entraînement a besoin.",
    sections: [
      {
        title: "Créer et manipuler des tenseurs",
        text: "Les opérations ressemblent à celles de NumPy.",
        code: `import torch

a = torch.tensor([[1., 2.], [3., 4.]])
b = torch.ones(2, 2)
print(a + b, a @ b, a.shape)`,
      },
      {
        title: "Autograd",
        text: "Avec requires_grad=True, PyTorch enregistre les opérations. Appeler backward() calcule les dérivées et les range dans l'attribut .grad.",
        code: `x = torch.tensor(3.0, requires_grad=True)
y = x ** 2 + 2 * x
y.backward()
print(x.grad)   # dy/dx = 2x + 2 = 8`,
      },
    ],
    practice: "Calculez à la main puis avec autograd la dérivée de y = 5x³ en x = 2, et comparez les résultats.",
    exercise: {
      prompt: "Après loss.backward(), où sont stockés les gradients d'un paramètre ?",
      options: ["Dans param.loss", "Dans param.grad", "Dans param.data", "Dans torch.gradients"],
      answer: 1,
      explanation: "Chaque tenseur avec requires_grad=True reçoit ses gradients dans l'attribut `.grad`.",
    },
  },
  {
    intro: "Un réseau fully connected enchaîne des couches linéaires séparées par des fonctions d'activation. Toute l'entraînement suit la même boucle.",
    sections: [
      {
        title: "Définir le réseau",
        text: "On hérite de nn.Module : les couches dans __init__, le calcul dans forward.",
        code: `import torch.nn as nn

class Net(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(784, 128)
        self.fc2 = nn.Linear(128, 10)

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        return self.fc2(x)`,
      },
      {
        title: "La boucle d'entraînement",
        text: "Quatre gestes se répètent à chaque lot de données.",
        code: `for X, y in loader:
    optimizer.zero_grad()      # remet les gradients à zéro
    loss = loss_fn(model(X), y)
    loss.backward()            # calcule les gradients
    optimizer.step()           # met à jour les poids`,
      },
    ],
    practice: "Entraînez ce réseau sur MNIST pendant 3 époques et affichez la perte à chaque époque.",
    exercise: {
      prompt: "À quoi sert optimizer.zero_grad() dans la boucle d'entraînement ?",
      options: [
        "À réinitialiser les poids du modèle",
        "À effacer les gradients accumulés du lot précédent",
        "À arrêter l'entraînement",
        "À vider le GPU",
      ],
      answer: 1,
      explanation: "PyTorch additionne les gradients à chaque backward(). Sans remise à zéro, ceux des lots précédents s'accumulent.",
    },
  },
  {
    intro: "Pour les images, les réseaux convolutifs (CNN) exploitent la structure spatiale : un même petit filtre balaie toute l'image pour repérer des motifs.",
    sections: [
      {
        title: "Convolution et pooling",
        text: "Une couche Conv2d apprend des filtres (bords, textures), le pooling réduit la taille de l'image en gardant l'essentiel.",
        code: `class CNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(1, 16, kernel_size=3, padding=1)
        self.pool = nn.MaxPool2d(2)
        self.fc = nn.Linear(16 * 14 * 14, 10)

    def forward(self, x):          # x : (batch, 1, 28, 28)
        x = self.pool(torch.relu(self.conv1(x)))
        return self.fc(x.flatten(1))`,
      },
      {
        title: "Pourquoi c'est efficace",
        text: "Le même filtre est partagé sur toute l'image : bien moins de paramètres qu'un réseau fully connected, et un motif est reconnu où qu'il soit.",
      },
    ],
    practice: "Remplacez le réseau de la leçon précédente par ce CNN sur MNIST et comparez la précision obtenue.",
    exercise: {
      prompt: "Quel est le rôle principal d'une couche Conv2d ?",
      options: [
        "Réduire le nombre de classes",
        "Extraire des motifs locaux grâce à des filtres appris",
        "Normaliser les labels",
        "Sauvegarder le modèle",
      ],
      answer: 1,
      explanation: "Les filtres de convolution détectent des motifs locaux (bords, formes) réutilisables dans toute l'image.",
    },
  },
  {
    intro: "Les textes sont des séquences : l'ordre des mots compte. Les réseaux récurrents lisent la séquence pas à pas en gardant une mémoire.",
    sections: [
      {
        title: "Embedding et LSTM",
        text: "Chaque mot est d'abord converti en indice, puis en vecteur par une couche Embedding. Le LSTM lit ensuite la séquence.",
        code: `class TextModel(nn.Module):
    def __init__(self, vocab_size):
        super().__init__()
        self.emb = nn.Embedding(vocab_size, 64)
        self.lstm = nn.LSTM(64, 128, batch_first=True)
        self.fc = nn.Linear(128, 2)

    def forward(self, x):                 # x : (batch, seq_len)
        _, (h, _) = self.lstm(self.emb(x))
        return self.fc(h[-1])`,
      },
      {
        title: "Pourquoi un LSTM plutôt qu'un RNN simple",
        text: "Un RNN simple oublie vite le début des longues séquences, car ses gradients s'évanouissent. Le LSTM utilise des portes pour décider quoi garder ou oublier.",
      },
    ],
    practice: "Tokenisez quelques phrases à la main, passez-les dans ce modèle et vérifiez la forme de la sortie.",
    exercise: {
      prompt: "Pourquoi préfère-t-on souvent un LSTM à un RNN simple ?",
      options: [
        "Il est plus rapide à calculer",
        "Il gère mieux les dépendances à long terme",
        "Il n'a pas besoin d'embedding",
        "Il fonctionne uniquement sur GPU",
      ],
      answer: 1,
      explanation: "Les portes du LSTM limitent le problème de disparition du gradient, donc il garde mieux l'information sur de longues séquences.",
    },
  },
  {
    intro: "Un modèle entraîné doit être sauvegardé, rechargé et servi proprement pour faire des prédictions en production.",
    sections: [
      {
        title: "Sauvegarder et recharger",
        text: "On sauvegarde le state_dict (les poids), pas l'objet complet.",
        code: `torch.save(model.state_dict(), "model.pt")

model = Net()
model.load_state_dict(torch.load("model.pt"))
model.eval()`,
      },
      {
        title: "Prédire en mode inférence",
        text: "eval() désactive les comportements propres à l'entraînement (dropout, par exemple) et no_grad() évite de calculer les gradients inutilement.",
        code: `with torch.no_grad():
    probs = torch.softmax(model(x), dim=1)`,
      },
    ],
    practice: "Sauvegardez votre modèle, rechargez-le dans un script séparé et faites une prédiction sur une image.",
    exercise: {
      prompt: "Quelle méthode faut-il appeler avant de faire des prédictions avec un modèle chargé ?",
      options: ["model.train()", "model.eval()", "model.reset()", "model.freeze()"],
      answer: 1,
      explanation: "`model.eval()` passe le modèle en mode inférence, ce qui rend les prédictions déterministes.",
    },
  },
];
