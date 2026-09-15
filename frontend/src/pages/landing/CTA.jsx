import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import FadeIn from "../../animations/FadeIn";
import FloatingElement from "../../animations/FloatingElement";

const CTA = () => (
  <section className="relative mx-auto max-w-6xl overflow-hidden px-6 py-24">
    <div className="relative overflow-hidden rounded-xl2 border border-white/10 bg-gradient-to-br from-ink-800 to-ink-900 px-8 py-16 text-center sm:px-16">
      <FloatingElement className="left-[10%] top-[-10%] h-56 w-56 bg-violet-500/30" />
      <FloatingElement className="right-[8%] bottom-[-15%] h-64 w-64 bg-gold-400/20" delay="2s" duration="8s" />

      <FadeIn className="relative">
        <h2 className="font-display text-3xl leading-tight text-paper-50 sm:text-4xl">
          Votre prochain parcours commence par une seule inscription
        </h2>
        <p className="mx-auto mt-4 max-w-md text-paper-400">
          Explorez le catalogue gratuitement, sans engagement, et reprenez a votre rythme.
        </p>
        <Link
          to="/inscription"
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-gold-400 to-gold-500 px-7 py-3.5 text-sm font-medium text-ink-950 shadow-goldglow transition-transform hover:-translate-y-0.5"
        >
          Creer mon compte gratuit
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </FadeIn>
    </div>
  </section>
);

export default CTA;
