import { Code2, Users2, Trophy, Infinity as InfinityIcon } from "lucide-react";
import SectionTitle from "../../components/SectionTitle";
import Card from "../../components/Card";
import StaggerContainer, { itemVariants } from "../../animations/StaggerContainer";
import { motion } from "framer-motion";

const features = [
  {
    icon: Code2,
    title: "Projets reels, pas des quiz",
    description: "Chaque module se termine par une production concrete que vous pouvez montrer : une API, une interface, une analyse.",
    color: "#7C6FF0",
  },
  {
    icon: Users2,
    title: "Anime par des praticiens",
    description: "Les instructeurs exercent le metier qu'ils enseignent aujourd'hui, pas il y a dix ans.",
    color: "#F2B441",
  },
  {
    icon: Trophy,
    title: "Progression mesuree",
    description: "Un tableau de bord suit votre avancement reel, module par module, sans fausses promesses de badges.",
    color: "#2DD4BF",
  },
  {
    icon: InfinityIcon,
    title: "Acces a vie au contenu",
    description: "Une fois inscrit a un parcours, vous gardez l'acces aux mises a jour et aux nouvelles lecons.",
    color: "#EF6B6B",
  },
];

const Features = () => (
  <section className="mx-auto max-w-6xl px-6 py-24">
    <SectionTitle
      eyebrow="Pourquoi Cursus"
      title="Concu pour la pratique, pas pour la consommation passive"
      description="La plupart des plateformes optimisent le temps passe. Nous optimisons ce que vous savez faire a la fin."
    />

    <StaggerContainer className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((f) => (
        <motion.div key={f.title} variants={itemVariants}>
          <Card className="h-full">
            <div
              className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${f.color}1F`, color: f.color }}
            >
              <f.icon size={20} />
            </div>
            <h3 className="font-display text-lg text-paper-50">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-paper-400">{f.description}</p>
          </Card>
        </motion.div>
      ))}
    </StaggerContainer>
  </section>
);

export default Features;
