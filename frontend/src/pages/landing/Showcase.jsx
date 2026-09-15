import { motion } from "framer-motion";
import { BarChart3, CheckCircle2 } from "lucide-react";
import Parallax from "../../animations/Parallax";
import FadeIn from "../../animations/FadeIn";
import BarChart from "../../components/BarChart";

const sampleData = [
  { label: "Avr", value: 3 },
  { label: "Mai", value: 5 },
  { label: "Juin", value: 4 },
  { label: "Juil", value: 7 },
  { label: "Aout", value: 6 },
  { label: "Sept", value: 9 },
];

const points = [
  "Un tableau de bord qui montre votre progression reelle module par module",
  "Des rappels doux, jamais culpabilisants, pour reprendre ou vous vous etes arrete",
  "Un historique clair de ce que vous avez termine et ce qu'il reste a faire",
];

const Showcase = () => (
  <section className="mx-auto max-w-6xl px-6 py-24">
    <div className="grid items-center gap-16 lg:grid-cols-2">
      <FadeIn direction="right">
        <p className="mb-3 text-sm font-medium text-violet-400">Votre tableau de bord</p>
        <h2 className="font-display text-3xl leading-tight text-paper-50 sm:text-4xl">
          Voyez exactement ou vous en etes, sans avoir a le deviner
        </h2>
        <p className="mt-4 text-paper-400 leading-relaxed">
          Pas de gamification artificielle. Juste une vue honnete de vos cours en cours, termines,
          et du temps que vous avez reellement investi.
        </p>

        <ul className="mt-8 space-y-4">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-3">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-teal-400" />
              <span className="text-sm text-paper-100">{p}</span>
            </li>
          ))}
        </ul>
      </FadeIn>

      <Parallax speed={0.08}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-xl2 border border-white/10 bg-ink-800/70 p-6 shadow-2xl shadow-black/40 backdrop-blur-sm"
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-paper-50">
              <BarChart3 size={18} className="text-gold-400" />
              <span className="font-medium">Inscriptions par mois</span>
            </div>
            <span className="text-xs text-paper-400">6 derniers mois</span>
          </div>
          <BarChart data={sampleData} />
        </motion.div>
      </Parallax>
    </div>
  </section>
);

export default Showcase;
