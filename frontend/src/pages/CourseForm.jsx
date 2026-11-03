import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowDown, ArrowUp, Plus, Trash2, Lightbulb, Info } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import {
  getCategories,
  getCourseBySlug,
  createCourse,
  updateCourse,
} from "../services/courseService";
import { hasLessonContent } from "../data/lessonContent";
import Loading from "../components/Loading";
import Button from "../components/Button";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-ink-900/60 px-4 py-2.5 text-sm text-paper-50 placeholder:text-paper-400/60 outline-none transition-colors focus:border-violet-400";

const emptyLesson = () => ({
  id: null,
  title: "",
  durationMin: 15,
  intro: "",
  code: "",
  practice: "",
  question: "",
  options: ["", "", "", ""],
  answer: 0,
  explanation: "",
});

const lessonFromApi = (lesson) => {
  const c = lesson.content;
  const options = [...(c?.exercise?.options || []), "", "", "", ""].slice(0, 4);
  return {
    id: lesson.id,
    title: lesson.title,
    durationMin: lesson.durationMin,
    intro: c?.intro || "",
    code: c?.sections?.find((s) => s.code)?.code || "",
    practice: c?.practice || "",
    question: c?.exercise?.prompt || "",
    options,
    answer: c?.exercise?.answer ?? 0,
    explanation: c?.exercise?.explanation || "",
  };
};

// Transforme un bloc du formulaire en leçon attendue par l'API.
const lessonToPayload = (l, index) => {
  const label = `Leçon ${index + 1}`;
  const filled = l.options.map((text, i) => ({ text: text.trim(), i })).filter((o) => o.text);
  const answer = filled.findIndex((o) => o.i === l.answer);

  if (!l.title.trim()) throw new Error(`${label} : le titre est requis`);
  if (!(Number(l.durationMin) >= 1)) throw new Error(`${label} : indiquez une durée en minutes`);
  if (!l.intro.trim()) throw new Error(`${label} : l'explication est requise`);
  if (!l.question.trim()) throw new Error(`${label} : la question de l'exercice est requise`);
  if (filled.length < 2) throw new Error(`${label} : proposez au moins 2 réponses`);
  if (answer === -1) throw new Error(`${label} : cochez la bonne réponse parmi celles renseignées`);

  return {
    id: l.id,
    title: l.title.trim(),
    durationMin: Number(l.durationMin),
    content: {
      intro: l.intro.trim(),
      sections: l.code.trim() ? [{ title: "Exemple", text: "", code: l.code }] : [],
      practice: l.practice.trim(),
      exercise: {
        prompt: l.question.trim(),
        options: filled.map((o) => o.text),
        answer,
        explanation: l.explanation.trim(),
      },
    },
  };
};

const Field = ({ label, hint, children }) => (
  <label className="block">
    <span className="mb-1 block text-sm text-paper-50">{label}</span>
    {hint && <span className="mb-2 block text-xs text-paper-400">{hint}</span>}
    {children}
  </label>
);

const CourseForm = () => {
  const { user } = useAuth();
  const { slug } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(slug);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [courseId, setCourseId] = useState(null);
  const [lockedLessons, setLockedLessons] = useState(false); // cours d'origine : leçons gérées dans le code

  const [form, setForm] = useState({
    title: "",
    description: "",
    instructor: user?.name || "",
    categoryId: "",
    level: "DEBUTANT",
    price: 0,
    thumbnailColor: "#7C6FF0",
    published: true,
    durationHours: 1,
  });
  const [lessons, setLessons] = useState([emptyLesson(), emptyLesson(), emptyLesson()]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const setLesson = (i, patch) =>
    setLessons((ls) => ls.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const cats = await getCategories();
        if (cancelled) return;
        setCategories(cats);

        if (editing) {
          const c = await getCourseBySlug(slug);
          if (cancelled) return;
          setCourseId(c.id);
          setForm({
            title: c.title,
            description: c.description,
            instructor: c.instructor,
            categoryId: String(c.categoryId),
            level: c.level,
            price: c.price,
            thumbnailColor: c.thumbnailColor,
            published: c.published,
            durationHours: c.durationHours,
          });
          if (hasLessonContent(c.slug)) {
            setLockedLessons(true);
            setLessons(c.lessons.map(lessonFromApi));
          } else {
            setLessons(c.lessons.length ? c.lessons.map(lessonFromApi) : [emptyLesson()]);
          }
        } else if (cats.length) {
          setForm((f) => ({ ...f, categoryId: String(cats[0].id) }));
        }
      } catch {
        if (!cancelled) setError("Impossible de charger les données.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [slug, editing]);

  const totalMinutes = useMemo(
    () => lessons.reduce((n, l) => n + (Number(l.durationMin) || 0), 0),
    [lessons]
  );

  if (user && user.role !== "ADMIN") return <Navigate to="/dashboard" replace />;
  if (loading) return <div className="p-10"><Loading label="Chargement" /></div>;

  const move = (i, dir) =>
    setLessons((ls) => {
      const j = i + dir;
      if (j < 0 || j >= ls.length) return ls;
      const copy = [...ls];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (form.title.trim().length < 3) throw new Error("Le titre est requis (3 caractères minimum)");
      if (form.description.trim().length < 10) throw new Error("La description est trop courte (10 caractères minimum)");
      if (!form.instructor.trim()) throw new Error("Indiquez le nom de l'instructeur");
      if (!form.categoryId) throw new Error("Choisissez une catégorie");
      if (!(Number(form.price) >= 0) || form.price === "") throw new Error("Le prix doit être un nombre positif ou nul");

      const payload = {
        title: form.title,
        description: form.description,
        instructor: form.instructor,
        categoryId: Number(form.categoryId),
        level: form.level,
        price: Number(form.price),
        thumbnailColor: form.thumbnailColor,
        published: form.published,
      };

      if (lockedLessons) {
        payload.durationHours = Number(form.durationHours) || 1;
      } else {
        payload.lessons = lessons.map(lessonToPayload);
      }

      setSaving(true);
      if (editing) await updateCourse(courseId, payload);
      else await createCourse(payload);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Enregistrement impossible");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-3xl px-6 py-10 sm:px-10">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-paper-400 hover:text-paper-50">
        <ArrowLeft size={15} /> Retour au tableau de bord
      </Link>
      <h1 className="mt-4 font-display text-2xl text-paper-50 sm:text-3xl">
        {editing ? "Modifier le cours" : "Nouveau cours"}
      </h1>

      {/* ---- Informations générales ---- */}
      <section className="mt-8 space-y-5 rounded-xl2 border border-white/8 bg-ink-800/50 p-6">
        <h2 className="font-display text-lg text-paper-50">Informations générales</h2>

        <Field label="Titre du cours" hint="Court et concret : le sujet et ce qu'on y apprend.">
          <input
            className={inputClass}
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Ex. : Créer une API REST avec Node.js"
          />
        </Field>

        <Field
          label="Description"
          hint="2 à 3 phrases : à qui s'adresse le cours, ce qu'on saura faire à la fin."
        >
          <textarea
            rows={3}
            className={inputClass}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Ex. : Apprenez à construire et sécuriser une API de A à Z. Vous saurez déployer votre premier projet."
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Instructeur" hint="Nom affiché sur la page du cours.">
            <input
              className={inputClass}
              value={form.instructor}
              onChange={(e) => set("instructor", e.target.value)}
              placeholder="Ex. : Karim Belaid"
            />
          </Field>
          <Field label="Catégorie" hint="Sert au filtre du catalogue.">
            <select
              className={inputClass}
              value={form.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Niveau" hint="Le public visé.">
            <select className={inputClass} value={form.level} onChange={(e) => set("level", e.target.value)}>
              <option value="DEBUTANT">Débutant</option>
              <option value="INTERMEDIAIRE">Intermédiaire</option>
              <option value="AVANCE">Avancé</option>
            </select>
          </Field>
          <Field label="Prix (Ar)" hint="0 pour un cours gratuit.">
            <input
              type="number"
              min="0"
              step="any"
              className={inputClass}
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
            />
          </Field>
        </div>

        <div className="flex flex-wrap items-center gap-8">
          <Field label="Couleur de la vignette" hint="Utilisée sur la carte du cours.">
            <input
              type="color"
              value={form.thumbnailColor}
              onChange={(e) => set("thumbnailColor", e.target.value)}
              className="h-10 w-20 cursor-pointer rounded-lg border border-white/10 bg-transparent"
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-paper-100">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => set("published", e.target.checked)}
              className="h-4 w-4 accent-violet-500"
            />
            Visible dans le catalogue
          </label>
        </div>
      </section>

      {/* ---- Leçons ---- */}
      <section className="mt-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-lg text-paper-50">Leçons</h2>
            <p className="mt-1 text-xs text-paper-400">
              {lockedLessons
                ? "Ce cours d'origine a ses leçons rédigées dans le code de l'application : elles ne se modifient pas ici."
                : `${lessons.length} leçon${lessons.length > 1 ? "s" : ""}, ${totalMinutes} min au total (${Math.max(1, Math.ceil(totalMinutes / 60))} h affichée${Math.ceil(totalMinutes / 60) > 1 ? "s" : ""} sur le cours).`}
            </p>
          </div>
        </div>

        {lockedLessons ? (
          <ul className="mt-4 space-y-2">
            {lessons.map((l, i) => (
              <li key={l.id} className="flex justify-between rounded-lg border border-white/8 bg-ink-800/40 px-4 py-3 text-sm text-paper-100">
                <span>{i + 1}. {l.title}</span>
                <span className="text-xs text-paper-400">{l.durationMin} min</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4 space-y-5">
            {lessons.map((l, i) => (
              <div key={l.id ?? `new-${i}`} className="rounded-xl2 border border-white/8 bg-ink-800/50 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-base text-violet-400">Leçon {i + 1}</h3>
                  <div className="flex items-center gap-1 text-paper-400">
                    <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-1.5 hover:bg-white/5 disabled:opacity-30" aria-label="Monter">
                      <ArrowUp size={15} />
                    </button>
                    <button type="button" onClick={() => move(i, 1)} disabled={i === lessons.length - 1} className="rounded p-1.5 hover:bg-white/5 disabled:opacity-30" aria-label="Descendre">
                      <ArrowDown size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setLessons((ls) => ls.filter((_, idx) => idx !== i))}
                      disabled={lessons.length === 1}
                      className="rounded p-1.5 text-red-300 hover:bg-red-500/10 disabled:opacity-30"
                      aria-label="Supprimer la leçon"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
                    <Field label="Titre de la leçon" hint="Une idée par leçon.">
                      <input
                        className={inputClass}
                        value={l.title}
                        onChange={(e) => setLesson(i, { title: e.target.value })}
                        placeholder="Ex. : Les middlewares Express"
                      />
                    </Field>
                    <Field label="Durée (min)" hint="Lecture + exercice.">
                      <input
                        type="number"
                        min="1"
                        className={inputClass}
                        value={l.durationMin}
                        onChange={(e) => setLesson(i, { durationMin: e.target.value })}
                      />
                    </Field>
                  </div>

                  <Field label="Explication" hint="Le cœur de la leçon : définition, pourquoi c'est utile, comment ça marche.">
                    <textarea
                      rows={4}
                      className={inputClass}
                      value={l.intro}
                      onChange={(e) => setLesson(i, { intro: e.target.value })}
                      placeholder="Ex. : Un middleware est une fonction qui s'exécute entre la requête et la réponse..."
                    />
                  </Field>

                  <Field label="Exemple de code (facultatif)" hint="Un court extrait que l'étudiant peut recopier.">
                    <textarea
                      rows={4}
                      className={`${inputClass} font-mono text-xs`}
                      value={l.code}
                      onChange={(e) => setLesson(i, { code: e.target.value })}
                      placeholder={"app.use((req, res, next) => {\n  next();\n});"}
                    />
                  </Field>

                  <Field label="À essayer chez soi (facultatif)" hint="Une petite consigne pratique, sans correction automatique.">
                    <textarea
                      rows={2}
                      className={inputClass}
                      value={l.practice}
                      onChange={(e) => setLesson(i, { practice: e.target.value })}
                      placeholder="Ex. : Ajoutez un middleware qui affiche la méthode et l'URL de chaque requête."
                    />
                  </Field>

                  <div className="rounded-lg border border-violet-400/20 bg-violet-500/5 p-4">
                    <p className="mb-3 flex items-center gap-2 text-sm text-violet-400">
                      <Lightbulb size={15} /> Mini-exercice
                    </p>
                    <div className="space-y-4">
                      <Field label="Question" hint="Une seule bonne réponse. Elle doit se déduire de la leçon.">
                        <input
                          className={inputClass}
                          value={l.question}
                          onChange={(e) => setLesson(i, { question: e.target.value })}
                          placeholder="Ex. : Que faut-il appeler pour passer au middleware suivant ?"
                        />
                      </Field>

                      <div>
                        <span className="mb-1 block text-sm text-paper-50">Réponses</span>
                        <span className="mb-2 block text-xs text-paper-400">
                          Remplissez 2 à 4 réponses et cochez la bonne.
                        </span>
                        <div className="space-y-2">
                          {l.options.map((opt, oi) => (
                            <div key={oi} className="flex items-center gap-3">
                              <input
                                type="radio"
                                name={`answer-${i}`}
                                checked={l.answer === oi}
                                onChange={() => setLesson(i, { answer: oi })}
                                className="h-4 w-4 accent-teal-400"
                                aria-label={`Réponse ${oi + 1} correcte`}
                              />
                              <input
                                className={inputClass}
                                value={opt}
                                onChange={(e) =>
                                  setLesson(i, { options: l.options.map((o, k) => (k === oi ? e.target.value : o)) })
                                }
                                placeholder={`Réponse ${oi + 1}${oi >= 2 ? " (facultative)" : ""}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <Field label="Explication de la réponse (facultatif)" hint="Affichée après une bonne réponse.">
                        <input
                          className={inputClass}
                          value={l.explanation}
                          onChange={(e) => setLesson(i, { explanation: e.target.value })}
                          placeholder="Ex. : Sans next(), la requête reste en attente."
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {lessons.length < 12 && (
              <button
                type="button"
                onClick={() => setLessons((ls) => [...ls, emptyLesson()])}
                className="flex w-full items-center justify-center gap-2 rounded-xl2 border border-dashed border-white/15 py-4 text-sm text-paper-100 hover:border-violet-400/40 hover:text-paper-50"
              >
                <Plus size={16} /> Ajouter une leçon
              </button>
            )}
          </div>
        )}
      </section>

      {error && (
        <p className="mt-6 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>
      )}

      <div className="mt-8 flex gap-3">
        <Button type="submit" loading={saving}>
          {editing ? "Enregistrer les modifications" : "Créer le cours"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => navigate("/dashboard")}>
          Annuler
        </Button>
      </div>
    </form>
  );
};

export default CourseForm;
