import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getTestimonials } from "../../services/testimonialService";
import SectionTitle from "../../components/SectionTitle";
import StaggerContainer, { itemVariants } from "../../animations/StaggerContainer";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Marion L.",
    role: "Developpeuse frontend en reconversion",
    quote: "J'ai enfin arrete de collectionner des cours sans les finir. Les projets du parcours React m'ont servi directement en entretien.",
    color: "#7C6FF0",
  },
  {
    name: "Yanis B.",
    role: "Chef de produit junior",
    quote: "Le parcours Agile est concret et court. Pas de blabla theorique, juste ce qu'il faut pour animer mes premiers sprints.",
    color: "#F2B441",
  },
  {
    name: "Ines T.",
    role: "Etudiante en data science",
    quote: "Le suivi de progression m'aide a rester reguliere. Voir mes heures s'accumuler est plus motivant qu'un simple pourcentage.",
    color: "#2DD4BF",
  },
];

const Testimonials = () => {
  const { user } = useAuth();
  const [real, setReal] = useState([]);

  useEffect(() => {
    getTestimonials()
      .then(setReal)
      .catch(() => {});
  }, []);

  // Témoignages des étudiants quand il y en a, sinon ceux d'exemple.
  const list = real.length
    ? real.map((t) => ({
        id: t.id,
        name: t.user.name,
        role: t.role || "Étudiant Cursus",
        quote: t.content,
        color: t.user.avatarColor,
        rating: t.rating,
      }))
    : testimonials.map((t) => ({ ...t, id: t.name, rating: 5 }));

  return (
  <section id="temoignages" className="border-y border-white/8 bg-ink-900/40">
    <div className="mx-auto max-w-6xl px-6 py-24">
      <SectionTitle eyebrow="Temoignages" title="Ce que racontent celles et ceux qui ont termine un parcours" />

      <StaggerContainer className="mt-14 grid gap-6 lg:grid-cols-3">
        {list.map((t) => (
          <motion.div key={t.id} variants={itemVariants}>
            <div className="h-full rounded-xl2 border border-white/8 bg-ink-800/60 p-6">
              <div className="flex gap-0.5 text-gold-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill={i < t.rating ? "currentColor" : "none"} />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-paper-100">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-ink-950"
                  style={{ backgroundColor: t.color }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-paper-50">{t.name}</p>
                  <p className="text-xs text-paper-400">{t.role}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </StaggerContainer>

      {user?.role !== "ADMIN" && (
        <p className="mt-10 text-center text-sm text-paper-400">
          Vous suivez un cours ?{" "}
          <Link to="/dashboard/temoignage" className="text-violet-400 hover:text-violet-300">
            Partagez votre expérience
          </Link>
        </p>
      )}
    </div>
  </section>
  );
};

export default Testimonials;
