import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, PlayCircle } from "lucide-react";
import Badge from "../../components/Badge";

// Les trois chiffres affichés au milieu, sous le texte
const stats = [
  { valeur: "40+", label: "Parcours actifs" },
  { valeur: "4.7/5", label: "Note moyenne" },
  { valeur: "12k", label: "Apprenants" },
];

const Hero = () => (
  <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950">
    {/* 1. Fond de secours (visible si la photo n'est pas encore ajoutée) */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,111,240,0.35),transparent_60%)]" />

   
    <img
      src="/hero.webp"
      alt=""
      className="absolute inset-0 h-full w-full object-cover"
      onError={(e) => (e.currentTarget.style.display = "none")}
    />

    {/* 3. Voile sombre pour que le texte reste lisible, et fondu vers la page en bas */}
    <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 via-ink-950/60 to-ink-950" />

    {/* 4. Le contenu, centré */}
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto flex max-w-4xl flex-col items-center px-6 pb-16 pt-32 text-center"
    >
      <Badge tone="violet">Nouveaux parcours chaque mois</Badge>

      <h1 className="mt-6 font-display text-4xl leading-[1.1] text-paper-50 text-balance sm:text-5xl lg:text-7xl">
        Apprenez des compétences qui{" "}
        <span className="italic text-gold-400">tiennent leurs promesses</span>
      </h1>

      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper-100">
        Cursus réunit des parcours construits par des praticiens en activité. Pas de remplissage, pas de
        mode passif : vous codez, vous concevez, vous décidez, dès le premier module.
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/inscription"
          className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-gold-400 to-gold-500 px-7 py-3.5 text-sm font-medium text-ink-950 shadow-goldglow transition-transform hover:-translate-y-0.5"
        >
          Commencer gratuitement
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
        <Link
          to="/fonctionnement"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-medium text-paper-50 backdrop-blur-sm transition-colors hover:bg-white/10"
        >
          <PlayCircle size={16} />
          Voir comment ça marche
        </Link>
      </div>

      {/* Les chiffres : trois cartes en verre dépoli, au milieu */}
      <div className="mt-14 grid w-full max-w-2xl grid-cols-3 gap-3 sm:gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl2 border border-white/15 bg-white/5 px-3 py-4 backdrop-blur-md sm:px-6 sm:py-5"
          >
            <p className="font-display text-2xl text-paper-50 sm:text-3xl">{s.valeur}</p>
            <p className="mt-1 text-xs text-paper-100 sm:text-sm">{s.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  </section>
);

export default Hero;
