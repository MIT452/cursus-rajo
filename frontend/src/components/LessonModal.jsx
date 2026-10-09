import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2, Lightbulb, Terminal, XCircle, Clock } from "lucide-react";
import Button from "./Button";

const LessonModal = ({
  open,
  onClose,
  lesson,
  index,
  total,
  content,
  completed,
  completedCount,
  enrolled,
  onEnroll,
  onComplete,
}) => {
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // remet l'exercice à zéro à chaque nouvelle leçon ouverte
  useEffect(() => {
    setSelected(null);
    setChecked(false);
    setConfirming(false);
    setSaving(false);
    setError("");
  }, [lesson?.id, open]);

  if (!lesson || !content) return null;

  const { exercise } = content;
  const isCorrect = checked && selected === exercise.answer;
  const nextProgress = Math.min(100, Math.round(((completedCount + 1) / total) * 100));

  const handleConfirm = async () => {
    setSaving(true);
    setError("");
    try {
      await onComplete(lesson);
      setConfirming(false);
    } catch {
      setError("Impossible d'enregistrer la leçon. Réessayez.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-ink-950/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl2 border border-white/10 bg-ink-800 shadow-2xl"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-start justify-between gap-4 border-b border-white/8 px-6 py-5">
                <div>
                  <p className="text-xs uppercase tracking-wide text-violet-400">
                    Leçon {index + 1} sur {total}
                  </p>
                  <h3 className="mt-1 font-display text-xl text-paper-50">{lesson.title}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-paper-400">
                    <Clock size={12} /> {lesson.durationMin} min
                    {completed && (
                      <span className="ml-2 flex items-center gap-1 text-teal-400">
                        <CheckCircle2 size={12} /> Terminée
                      </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-1.5 text-paper-400 hover:bg-white/5 hover:text-paper-50"
                  aria-label="Fermer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-8 overflow-y-auto px-6 py-6">
                <p className="leading-relaxed text-paper-100">{content.intro}</p>

                {content.sections.map((s) => (
                  <section key={s.title}>
                    <h4 className="font-display text-base text-paper-50">{s.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-paper-400">{s.text}</p>
                    {s.code && (
                      <pre className="mt-3 overflow-x-auto rounded-lg border border-white/8 bg-ink-950 p-4 text-xs leading-relaxed text-paper-100">
                        <code>{s.code}</code>
                      </pre>
                    )}
                  </section>
                ))}

                <section className="rounded-xl2 border border-gold-400/20 bg-gold-400/5 p-5">
                  <h4 className="flex items-center gap-2 font-display text-base text-gold-400">
                    <Terminal size={16} /> À essayer chez vous
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-paper-100">{content.practice}</p>
                </section>

                <section className="rounded-xl2 border border-violet-400/20 bg-violet-500/5 p-5">
                  <h4 className="flex items-center gap-2 font-display text-base text-violet-400">
                    <Lightbulb size={16} /> Mini-exercice
                  </h4>
                  <p className="mt-2 text-sm text-paper-50">{exercise.prompt}</p>

                  <div className="mt-4 space-y-2">
                    {exercise.options.map((opt, i) => {
                      const isSelected = selected === i;
                      const showRight = checked && i === exercise.answer;
                      const showWrong = checked && isSelected && i !== exercise.answer;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setSelected(i);
                            setChecked(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                            showRight
                              ? "border-teal-400/50 bg-teal-500/10 text-teal-400"
                              : showWrong
                              ? "border-red-400/50 bg-red-500/10 text-red-300"
                              : isSelected
                              ? "border-violet-400/60 bg-violet-500/10 text-paper-50"
                              : "border-white/10 text-paper-100 hover:bg-white/5"
                          }`}
                        >
                          <span>{opt}</span>
                          {showRight && <CheckCircle2 size={16} />}
                          {showWrong && <XCircle size={16} />}
                        </button>
                      );
                    })}
                  </div>

                  {!isCorrect && (
                    <Button
                      variant="secondary"
                      className="mt-4"
                      disabled={selected === null}
                      onClick={() => setChecked(true)}
                    >
                      Vérifier ma réponse
                    </Button>
                  )}

                  {checked && (
                    <p
                      className={`mt-4 text-sm leading-relaxed ${
                        isCorrect ? "text-teal-400" : "text-red-300"
                      }`}
                    >
                      {isCorrect
                        ? `Bonne réponse. ${exercise.explanation}`
                        : "Ce n'est pas la bonne réponse, essayez encore."}
                    </p>
                  )}
                </section>

                <section className="border-t border-white/8 pt-6">
                  {completed ? (
                    <div className="flex items-center gap-2 rounded-full bg-teal-500/15 px-5 py-3 text-sm text-teal-400">
                      <CheckCircle2 size={16} /> Leçon validée, votre progression est à jour.
                    </div>
                  ) : !enrolled ? (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm text-paper-400">
                        Inscrivez-vous au cours pour enregistrer votre progression.
                      </p>
                      <Button onClick={onEnroll}>S'inscrire au cours</Button>
                    </div>
                  ) : confirming ? (
                    <div className="rounded-xl2 border border-white/10 bg-ink-900/50 p-5">
                      <p className="text-sm text-paper-50">
                        Confirmez-vous avoir terminé cette leçon ?
                      </p>
                      <p className="mt-1 text-xs text-paper-400">
                        Votre progression passera à {nextProgress}%.
                      </p>
                      {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
                      <div className="mt-4 flex gap-3">
                        <Button loading={saving} onClick={handleConfirm}>
                          <CheckCircle2 size={16} /> Oui, leçon terminée
                        </Button>
                        <Button variant="ghost" disabled={saving} onClick={() => setConfirming(false)}>
                          Pas encore
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm text-paper-400">
                        {isCorrect
                          ? "Exercice réussi, vous pouvez valider la leçon."
                          : "Réussissez le mini-exercice pour pouvoir valider la leçon."}
                      </p>
                      <Button disabled={!isCorrect} onClick={() => setConfirming(true)}>
                        <CheckCircle2 size={16} /> Terminer la leçon
                      </Button>
                    </div>
                  )}
                </section>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LessonModal;
