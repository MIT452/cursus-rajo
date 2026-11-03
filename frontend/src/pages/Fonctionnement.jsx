import { useState } from "react";
import { Link } from "react-router-dom";

// Étapes pour un étudiant
const etapesEtudiant = [
  { titre: "Créez votre compte", texte: "Deux minutes suffisent. Vous pouvez explorer le catalogue sans compte." },
  { titre: "Inscrivez-vous à un cours", texte: "Choisissez un cours dans le catalogue, puis cliquez sur « S'inscrire »." },
  { titre: "Suivez les leçons", texte: "Cliquez sur une leçon : lisez l'explication, puis faites le mini-exercice." },
  { titre: "Confirmez la leçon", texte: "Quand l'exercice est réussi, confirmez la fin de la leçon. Votre progression monte toute seule." },
];

// Étapes pour l'administrateur
const etapesAdmin = [
  { titre: "Créez un cours", texte: "Remplissez le formulaire : titre, description, niveau, prix, puis les leçons." },
  { titre: "Fixez le prix", texte: "Modifiez le prix de chaque cours directement dans le tableau de bord." },
  { titre: "Suivez les chiffres", texte: "Le tableau de bord affiche le nombre de comptes, d'inscrits par cours et le revenu simulé." },
];

// Questions fréquentes
const questions = [
  { q: "Faut-il payer pour essayer ?", r: "Non. Vous pouvez parcourir le catalogue et lire le programme de chaque cours gratuitement." },
  { q: "Comment la progression est-elle calculée ?", r: "Chaque leçon terminée fait avancer le cours de la même part. Utilisez le simulateur ci-dessus pour voir le détail." },
  { q: "Puis-je refaire un exercice ?", r: "Oui, autant de fois que vous voulez, jusqu'à obtenir la bonne réponse." },
];

const Fonctionnement = () => {
  // Nombre de leçons choisi dans le simulateur
  const [nbLecons, setNbLecons] = useState(5);

  // On crée la liste des pourcentages : 1 leçon terminée, 2 leçons terminées, etc.
  const paliers = [];
  for (let i = 1; i <= nbLecons; i++) {
    paliers.push(Math.round((i / nbLecons) * 100));
  }

  // Affiche une liste d'étapes numérotées
  const afficherEtapes = (etapes) =>
    etapes.map((etape, index) => (
      <div key={etape.titre} className="flex gap-4 rounded-xl2 border border-white/8 bg-ink-800/50 p-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-sm text-violet-400">
          {index + 1}
        </span>
        <div>
          <h3 className="font-display text-base text-paper-50">{etape.titre}</h3>
          <p className="mt-1 text-sm leading-relaxed text-paper-400">{etape.texte}</p>
        </div>
      </div>
    ));

  return (
    <div className="min-h-screen bg-ink-950 px-6 pb-24 pt-36">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium text-violet-400">Fonctionnement</p>
        <h1 className="mt-2 font-display text-3xl text-paper-50 sm:text-4xl">Comment fonctionne Cursus ?</h1>
        <p className="mt-4 leading-relaxed text-paper-400">
          Cursus propose des cours découpés en petites leçons. Chaque leçon a un exercice, et votre
          progression est calculée automatiquement.
        </p>

        <h2 className="mt-14 font-display text-xl text-paper-50">Pour les étudiants</h2>
        <div className="mt-5 space-y-3">{afficherEtapes(etapesEtudiant)}</div>

        <h2 className="mt-14 font-display text-xl text-paper-50">Pour l'administrateur</h2>
        <div className="mt-5 space-y-3">{afficherEtapes(etapesAdmin)}</div>

        {/* Simulateur de progression */}
        <h2 className="mt-14 font-display text-xl text-paper-50">Simulateur de progression</h2>
        <p className="mt-2 text-sm text-paper-400">
          Choisissez le nombre de leçons d'un cours : vous verrez où en est votre progression après chaque leçon.
        </p>

        <div className="mt-5 rounded-xl2 border border-white/8 bg-ink-800/50 p-6">
          <label className="flex items-center gap-4 text-sm text-paper-100">
            Nombre de leçons : <span className="w-6 text-paper-50">{nbLecons}</span>
            <input
              type="range"
              min="1"
              max="10"
              value={nbLecons}
              onChange={(e) => setNbLecons(Number(e.target.value))}
              className="flex-1 accent-violet-500"
            />
          </label>

          <div className="mt-5 flex flex-wrap gap-2">
            {paliers.map((pourcent, index) => (
              <span key={index} className="rounded-full bg-teal-500/15 px-3 py-1 text-xs text-teal-400">
                Leçon {index + 1} : {pourcent} %
              </span>
            ))}
          </div>
        </div>

        {/* Questions fréquentes : <details> s'ouvre et se ferme sans code JavaScript */}
        <h2 className="mt-14 font-display text-xl text-paper-50">Questions fréquentes</h2>
        <div className="mt-5 space-y-3">
          {questions.map((item) => (
            <details key={item.q} className="rounded-xl2 border border-white/8 bg-ink-800/50 p-5">
              <summary className="cursor-pointer text-sm text-paper-50">{item.q}</summary>
              <p className="mt-3 text-sm leading-relaxed text-paper-400">{item.r}</p>
            </details>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            to="/cours"
            className="inline-block rounded-full bg-gold-400 px-7 py-3 text-sm font-medium text-ink-950 hover:brightness-110"
          >
            Voir les cours
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Fonctionnement;
