import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Star, Trash2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import {
  getMyTestimonial,
  saveMyTestimonial,
  deleteMyTestimonial,
} from "../services/testimonialService";
import Loading from "../components/Loading";
import Button from "../components/Button";
import FadeIn from "../animations/FadeIn";

const MAX = 500;
const MIN = 20;

const Testimonial = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exists, setExists] = useState(false);
  const [rating, setRating] = useState(5);
  const [role, setRole] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState(null); // { type: "ok" | "error", text }

  useEffect(() => {
    getMyTestimonial()
      .then((t) => {
        if (t) {
          setExists(true);
          setRating(t.rating);
          setRole(t.role || "");
          setContent(t.content);
        }
      })
      .catch(() => setMessage({ type: "error", text: "Impossible de charger votre témoignage." }))
      .finally(() => setLoading(false));
  }, []);

  if (user?.role === "ADMIN") return <Navigate to="/dashboard" replace />;
  if (loading) return <div className="p-10"><Loading label="Chargement" /></div>;

  const length = content.trim().length;
  const valid = length >= MIN && length <= MAX;

  const submit = async (e) => {
    e.preventDefault();
    if (!valid) return;
    setSaving(true);
    setMessage(null);
    try {
      await saveMyTestimonial({ content, rating, role });
      setExists(true);
      setMessage({ type: "ok", text: "Merci ! Votre témoignage est publié sur la page d'accueil." });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Enregistrement impossible." });
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    setSaving(true);
    try {
      await deleteMyTestimonial();
      setExists(false);
      setRating(5);
      setRole("");
      setContent("");
      setMessage({ type: "ok", text: "Votre témoignage a été supprimé." });
    } catch {
      setMessage({ type: "error", text: "Suppression impossible." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-10 sm:px-10">
      <FadeIn>
        <p className="text-sm text-paper-400">Votre avis compte</p>
        <h1 className="font-display text-2xl text-paper-50 sm:text-3xl">
          {exists ? "Votre témoignage" : "Écrire un témoignage"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-paper-400">
          Racontez ce que les cours vous ont apporté. Il sera affiché sur la page d'accueil, avec votre nom.
          Vous pouvez le modifier ou le supprimer à tout moment.
        </p>
      </FadeIn>

      <form onSubmit={submit} className="mt-8 space-y-6 rounded-xl2 border border-white/8 bg-ink-800/50 p-6">
        <div>
          <span className="mb-2 block text-sm text-paper-50">Votre note</span>
          <div className="flex gap-1" role="radiogroup" aria-label="Note sur 5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} sur 5`}
                onClick={() => setRating(n)}
                className="p-0.5 text-gold-400 transition-transform hover:scale-110"
              >
                <Star size={26} fill={n <= rating ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm text-paper-50">Votre profil (facultatif)</span>
          <span className="mb-2 block text-xs text-paper-400">Votre métier ou situation, affiché sous votre nom.</span>
          <input
            value={role}
            maxLength={80}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Ex. : Étudiant en informatique"
            className="w-full rounded-lg border border-white/10 bg-ink-900/60 px-4 py-2.5 text-sm text-paper-50 placeholder:text-paper-400/60 outline-none focus:border-violet-400"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-paper-50">Votre témoignage</span>
          <span className="mb-2 block text-xs text-paper-400">
            Quel cours avez-vous suivi ? Qu'est-ce qui a changé pour vous ? Qu'avez-vous préféré ?
          </span>
          <textarea
            rows={6}
            value={content}
            maxLength={MAX}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Ex. : Grâce au cours Node.js, j'ai pu construire ma première API et la présenter en entretien..."
            className="w-full rounded-lg border border-white/10 bg-ink-900/60 px-4 py-2.5 text-sm leading-relaxed text-paper-50 placeholder:text-paper-400/60 outline-none focus:border-violet-400"
          />
          <span className={`mt-1 block text-right text-xs ${length > 0 && length < MIN ? "text-red-300" : "text-paper-400"}`}>
            {length} / {MAX} {length < MIN && `(minimum ${MIN})`}
          </span>
        </label>

        {message && (
          <p className={`text-sm ${message.type === "ok" ? "text-teal-400" : "text-red-300"}`}>{message.text}</p>
        )}

        <div className="flex items-center justify-between gap-3">
          <Button type="submit" loading={saving} disabled={!valid}>
            {exists ? "Mettre à jour" : "Publier mon témoignage"}
          </Button>
          {exists && (
            <button
              type="button"
              onClick={remove}
              disabled={saving}
              className="flex items-center gap-1.5 text-sm text-red-300 hover:text-red-200 disabled:opacity-50"
            >
              <Trash2 size={15} /> Supprimer
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Testimonial;
