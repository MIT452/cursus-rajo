import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, PlayCircle } from "lucide-react";
import HeroOrb from "../../components/HeroOrb";
import FloatingElement from "../../animations/FloatingElement";
import Badge from "../../components/Badge";

const Hero = () => (
  <section className="relative overflow-hidden pt-40 pb-24">
    <div className="absolute inset-0 bg-grid-lines bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
    <FloatingElement className="left-[8%] top-[18%] h-72 w-72 bg-violet-500/30" duration="9s" />
    <FloatingElement className="right-[6%] top-[10%] h-64 w-64 bg-gold-400/20" delay="1.5s" duration="11s" />

    <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-6 lg:grid-cols-[1.1fr_0.9fr]">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <Badge tone="violet">Nouveaux parcours chaque mois</Badge>

        <h1 className="mt-6 font-display text-4xl leading-[1.1] text-paper-50 text-balance sm:text-5xl lg:text-6xl">
          Apprenez des competences qui{" "}
          <span className="italic text-gold-400">tiennent leurs promesses</span>
        </h1>

        <p className="mt-6 max-w-lg text-lg leading-relaxed text-paper-400">
          Cursus reunit des parcours construits par des praticiens en activite. Pas de remplissage,
          pas de mode passif : vous codez, vous concevez, vous decidez, des le premier module.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link
            to="/inscription"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-gold-400 to-gold-500 px-7 py-3.5 text-sm font-medium text-ink-950 shadow-goldglow transition-transform hover:-translate-y-0.5"
          >
            Commencer gratuitement
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#fonctionnement"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-7 py-3.5 text-sm font-medium text-paper-50 transition-colors hover:bg-white/5"
          >
            <PlayCircle size={16} />
            Voir comment ca marche
          </a>
        </div>

        <div className="mt-12 flex flex-wrap gap-8 border-t border-white/8 pt-8">
          <div>
            <p className="font-display text-2xl text-paper-50">40+</p>
            <p className="text-sm text-paper-400">Parcours actifs</p>
          </div>
          <div>
            <p className="font-display text-2xl text-paper-50">4.7/5</p>
            <p className="text-sm text-paper-400">Note moyenne</p>
          </div>
          <div>
            <p className="font-display text-2xl text-paper-50">12k</p>
            <p className="text-sm text-paper-400">Apprenants</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="relative h-[380px] sm:h-[460px] lg:h-[520px]"
      >
        <HeroOrb />
      </motion.div>
    </div>
  </section>
);

export default Hero;
