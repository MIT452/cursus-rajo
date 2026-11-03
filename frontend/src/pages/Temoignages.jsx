import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { getTestimonials } from "../services/testimonialService";

// Affiche 5 étoiles, remplies selon la note
const Etoiles = ({ note, taille = 14 }) => (
  <div className="flex gap-0.5 text-gold-400">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star key={n} size={taille} fill={n <= note ? "currentColor" : "none"} />
    ))}
  </div>
);

const Temoignages = () => {
  const { user } = useAuth();
  const [temoignages, setTemoignages] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(false);
  const [filtre, setFiltre] = useState(0); // 0 = toutes les notes

  // On charge les témoignages une seule fois, au début
  useEffect(() => {
    getTestimonials(100)
      .then((data) => setTemoignages(data))
      .catch(() => setErreur(true))
      .finally(() => setChargement(false));
  }, []);

  // Note moyenne = somme des notes / nombre de témoignages
  let somme = 0;
  for (const t of temoignages) {
    somme = somme + t.rating;
  }
  const moyenne = temoignages.length > 0 ? (somme / temoignages.length).toFixed(1) : 0;

  // Si un filtre est choisi, on garde seulement les témoignages avec cette note
  const affiches = filtre === 0 ? temoignages : temoignages.filter((t) => t.rating === filtre);

  return (
    <div className="min-h-screen bg-ink-950 px-6 pb-24 pt-36">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-medium text-violet-400">Témoignages</p>
        <h1 className="mt-2 font-display text-3xl text-paper-50 sm:text-4xl">Ce que disent nos étudiants</h1>

        {/* Résumé : note moyenne */}
        {temoignages.length > 0 && (
          <div className="mt-6 flex items-center gap-4">
            <span className="font-display text-4xl text-paper-50">{moyenne}</span>
            <div>
              <Etoiles note={Math.round(moyenne)} taille={18} />
              <p className="mt-1 text-xs text-paper-400">
                {temoignages.length} témoignage{temoignages.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        )}

        {/* Boutons de filtre par note */}
        {temoignages.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {[0, 5, 4, 3, 2, 1].map((note) => (
              <button
                key={note}
                onClick={() => setFiltre(note)}
                className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${
                  filtre === note
                    ? "border-violet-400 bg-violet-500/15 text-violet-400"
                    : "border-white/10 text-paper-100 hover:bg-white/5"
                }`}
              >
                {note === 0 ? "Toutes" : `${note} ★`}
              </button>
            ))}
          </div>
        )}

        {/* Les 3 états possibles : chargement, erreur, liste */}
        {chargement && <p className="mt-10 text-sm text-paper-400">Chargement...</p>}

        {erreur && (
          <p className="mt-10 text-sm text-red-300">
            Impossible de charger les témoignages. Vérifiez que le serveur est démarré.
          </p>
        )}

        {!chargement && !erreur && temoignages.length === 0 && (
          <p className="mt-10 text-sm text-paper-400">
            Aucun témoignage pour le moment. Soyez la première personne à partager votre expérience.
          </p>
        )}

        {!chargement && temoignages.length > 0 && affiches.length === 0 && (
          <p className="mt-10 text-sm text-paper-400">Aucun témoignage avec cette note.</p>
        )}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {affiches.map((t) => (
            <div key={t.id} className="rounded-xl2 border border-white/8 bg-ink-800/60 p-6">
              <Etoiles note={t.rating} />
              <p className="mt-4 text-sm leading-relaxed text-paper-100">"{t.content}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-ink-950"
                  style={{ backgroundColor: t.user.avatarColor }}
                >
                  {t.user.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-paper-50">{t.user.name}</p>
                  <p className="text-xs text-paper-400">{t.role || "Étudiant Cursus"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton pour écrire : dépend de qui est connecté */}
        <div className="mt-12 text-center">
          {!user && (
            <Link to="/connexion" className="text-sm text-violet-400 hover:text-violet-300">
              Connectez-vous pour écrire votre témoignage
            </Link>
          )}
          {user && user.role !== "ADMIN" && (
            <Link
              to="/dashboard/temoignage"
              className="inline-block rounded-full bg-gold-400 px-7 py-3 text-sm font-medium text-ink-950 hover:brightness-110"
            >
              Écrire mon témoignage
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Temoignages;
