import { UserPlus, Compass, Code, Award } from "lucide-react";
import SectionTitle from "../../components/SectionTitle";
import FadeIn from "../../animations/FadeIn";

const steps = [
  { icon: UserPlus, title: "Creez votre compte", description: "Deux minutes suffisent. Aucune carte bancaire requise pour explorer le catalogue." },
  { icon: Compass, title: "Choisissez un parcours", description: "Filtrez par domaine, niveau ou duree pour trouver le parcours qui correspond a votre objectif." },
  { icon: Code, title: "Pratiquez a chaque module", description: "Chaque lecon s'accompagne d'un exercice concret directement lie a votre progression." },
  { icon: Award, title: "Suivez votre avancement", description: "Votre tableau de bord se met a jour en temps reel a mesure que vous terminez chaque module." },
];

const Workflow = () => (
  <section id="fonctionnement" className="mx-auto max-w-6xl px-6 py-24">
    <SectionTitle
      eyebrow="Fonctionnement"
      title="Quatre etapes entre vous et une nouvelle competence"
      align="center"
    />

    <div className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
      <div className="absolute left-0 right-0 top-6 hidden h-px bg-white/8 lg:block" />
      {steps.map((s, i) => (
        <FadeIn key={s.title} delay={i * 0.1}>
          <div className="relative">
            <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-ink-900 text-paper-50">
              <s.icon size={20} className="text-violet-400" />
            </div>
            <p className="mt-5 text-xs font-medium text-paper-400">Etape {i + 1}</p>
            <h3 className="mt-1 font-display text-lg text-paper-50">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-paper-400">{s.description}</p>
          </div>
        </FadeIn>
      ))}
    </div>
  </section>
);

export default Workflow;
