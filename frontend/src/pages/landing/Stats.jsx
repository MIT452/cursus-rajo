import StatCounter from "../../components/StatCounter";
import FadeIn from "../../animations/FadeIn";

const stats = [
  { value: 12400, suffix: "+", label: "Apprenants actifs" },
  { value: 42, label: "Parcours disponibles" },
  { value: 96, suffix: "%", label: "Terminent leur premier module" },
  { value: 18, label: "Instructeurs en activite" },
];

const Stats = () => (
  <section className="border-y border-white/8 bg-ink-900/40">
    <div className="mx-auto max-w-6xl px-6 py-16">
      <FadeIn>
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s) => (
            <StatCounter key={s.label} {...s} />
          ))}
        </div>
      </FadeIn>
    </div>
  </section>
);

export default Stats;
