import { useEffect, useState } from "react";
import { Users, GraduationCap, Wallet, Check } from "lucide-react";
import { getAdminStats } from "../services/dashboardService";
import { updateCoursePrice } from "../services/courseService";
import { useAuth } from "../hooks/useAuth";
import Card from "../components/Card";
import Loading from "../components/Loading";
import BarChart from "../components/BarChart";
import FadeIn from "../animations/FadeIn";
import StaggerContainer, { itemVariants } from "../animations/StaggerContainer";
import { motion } from "framer-motion";

const money = (n) => `${Math.round(n).toLocaleString("fr-FR")} Ar`;

const PriceEditor = ({ course, onSaved }) => {
  const [value, setValue] = useState(String(course.price));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(""); // "", "ok", "error"

  // resynchronise le champ quand le prix serveur change
  useEffect(() => {
    setValue(String(course.price));
  }, [course.price]);

  const parsed = Number(value);
  const valid = value.trim() !== "" && Number.isFinite(parsed) && parsed >= 0;
  const dirty = valid && parsed !== course.price;

  const save = async () => {
    setSaving(true);
    setStatus("");
    try {
      await updateCoursePrice(course.id, parsed);
      await onSaved();
      setStatus("ok");
      setTimeout(() => setStatus(""), 2000);
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min="0"
        step="any"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setStatus("");
        }}
        onKeyDown={(e) => e.key === "Enter" && dirty && !saving && save()}
        className={`w-28 rounded-lg border bg-ink-900/60 px-3 py-1.5 text-sm text-paper-50 outline-none ${
          value !== "" && !valid ? "border-red-400/60" : "border-white/10 focus:border-violet-400/60"
        }`}
        aria-label={`Prix de ${course.title}`}
      />
      <span className="text-xs text-paper-400">Ar</span>
      <button
        onClick={save}
        disabled={!dirty || saving}
        className="rounded-lg bg-violet-500/15 px-3 py-1.5 text-xs text-violet-400 transition-colors hover:bg-violet-500/25 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {saving ? "..." : "Enregistrer"}
      </button>
      {status === "ok" && <Check size={15} className="text-teal-400" />}
      {status === "error" && <span className="text-xs text-red-300">Échec</span>}
    </div>
  );
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    try {
      setStats(await getAdminStats());
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div className="p-10"><Loading label="Chargement du tableau de bord" /></div>;
  if (error || !stats)
    return <div className="p-10 text-sm text-red-300">Impossible de charger les statistiques.</div>;

  const kpis = [
    { label: "Comptes étudiants", value: stats.accounts.toLocaleString("fr-FR"), icon: Users, color: "#7C6FF0" },
    { label: "Inscriptions au total", value: stats.totalEnrollments.toLocaleString("fr-FR"), icon: GraduationCap, color: "#2DD4BF" },
    { label: "Revenu simulé", value: money(stats.totalRevenue), icon: Wallet, color: "#F2B441" },
  ];

  return (
    <div className="px-6 py-10 sm:px-10">
      <FadeIn>
        <p className="text-sm text-paper-400">Espace administrateur</p>
        <h1 className="font-display text-2xl text-paper-50 sm:text-3xl">{user?.name}</h1>
      </FadeIn>

      <StaggerContainer className="mt-8 grid gap-5 sm:grid-cols-3">
        {kpis.map((k) => (
          <motion.div key={k.label} variants={itemVariants}>
            <Card hover={false}>
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${k.color}1F`, color: k.color }}
              >
                <k.icon size={18} />
              </div>
              <p className="font-display text-2xl text-paper-50">{k.value}</p>
              <p className="mt-1 text-sm text-paper-400">{k.label}</p>
            </Card>
          </motion.div>
        ))}
      </StaggerContainer>

      <FadeIn delay={0.1} className="mt-8">
        <Card hover={false}>
          <h2 className="font-display text-lg text-paper-50">Revenu simulé par mois</h2>
          <p className="mt-1 text-xs text-paper-400">
            Prix actuel de chaque cours multiplié par ses inscriptions du mois. Simulation, aucun paiement réel.
          </p>
          <div className="mt-6">
            <BarChart data={stats.monthlyRevenue} />
          </div>
        </Card>
      </FadeIn>

      <FadeIn delay={0.15} className="mt-8">
        <div className="mb-4">
          <h2 className="font-display text-lg text-paper-50">Tarifs des cours</h2>
          <p className="mt-1 text-xs text-paper-400">
            Vous fixez le prix de chaque cours. Les contenus et les leçons ne sont pas modifiables ici.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl2 border border-white/8">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-ink-800/60 text-paper-400">
              <tr>
                <th className="px-5 py-3 font-medium">Cours</th>
                <th className="px-5 py-3 font-medium">Inscrits</th>
                <th className="px-5 py-3 font-medium">Revenu simulé</th>
                <th className="px-5 py-3 font-medium">Prix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8">
              {stats.courses.map((c) => (
                <tr key={c.id} className="bg-ink-900/30">
                  <td className="px-5 py-4">
                    <p className="text-paper-50">{c.title}</p>
                    <p className="text-xs text-paper-400">{c.category}</p>
                  </td>
                  <td className="px-5 py-4 text-paper-100">{c.enrollments}</td>
                  <td className="px-5 py-4 text-paper-100">{money(c.revenue)}</td>
                  <td className="px-5 py-4">
                    <PriceEditor course={c} onSaved={load} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FadeIn>
    </div>
  );
};

export default AdminDashboard;
