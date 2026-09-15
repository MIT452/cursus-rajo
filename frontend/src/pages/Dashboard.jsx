import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Flame, GraduationCap, Clock3, BookX } from "lucide-react";
import { getDashboardStats } from "../services/dashboardService";
import { getMyEnrollments, updateEnrollmentProgress } from "../services/courseService";
import { useAuth } from "../hooks/useAuth";
import Card from "../components/Card";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";
import BarChart from "../components/BarChart";
import FadeIn from "../animations/FadeIn";
import StaggerContainer, { itemVariants } from "../animations/StaggerContainer";
import { motion } from "framer-motion";

const kpiConfig = [
  { key: "enrolledCount", label: "Cours suivis", icon: BookOpen, color: "#7C6FF0" },
  { key: "coursesInProgress", label: "En cours", icon: Flame, color: "#F2B441" },
  { key: "coursesCompleted", label: "Termines", icon: GraduationCap, color: "#2DD4BF" },
  { key: "hoursLearned", label: "Heures d'apprentissage", icon: Clock3, color: "#EF6B6B" },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    Promise.all([getDashboardStats(), getMyEnrollments()])
      .then(([s, e]) => {
        setStats(s);
        setEnrollments(e);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const markProgress = async (id, progress) => {
    await updateEnrollmentProgress(id, progress);
    load();
  };

  if (loading) return <div className="p-10"><Loading label="Chargement de votre tableau de bord" /></div>;

  return (
    <div className="px-6 py-10 sm:px-10">
      <FadeIn>
        <p className="text-sm text-paper-400">Bon retour,</p>
        <h1 className="font-display text-2xl text-paper-50 sm:text-3xl">{user?.name}</h1>
      </FadeIn>

      <StaggerContainer className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {kpiConfig.map((k) => (
          <motion.div key={k.key} variants={itemVariants}>
            <Card hover={false}>
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${k.color}1F`, color: k.color }}
              >
                <k.icon size={18} />
              </div>
              <p className="font-display text-2xl text-paper-50">{stats[k.key]}</p>
              <p className="mt-1 text-sm text-paper-400">{k.label}</p>
            </Card>
          </motion.div>
        ))}
      </StaggerContainer>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <FadeIn delay={0.1}>
          <Card hover={false}>
            <h2 className="font-display text-lg text-paper-50">Inscriptions par mois</h2>
            <div className="mt-6">
              <BarChart data={stats.monthly} />
            </div>
          </Card>
        </FadeIn>

        <FadeIn delay={0.15}>
          <Card hover={false} className="h-full">
            <h2 className="font-display text-lg text-paper-50">Activite recente</h2>
            <div className="mt-5 space-y-4">
              {stats.recentEnrollments.length === 0 && (
                <p className="text-sm text-paper-400">Aucune activite pour le moment.</p>
              )}
              {stats.recentEnrollments.map((e) => (
                <div key={e.id} className="flex items-center justify-between text-sm">
                  <span className="truncate text-paper-100">{e.course.title}</span>
                  <span className="shrink-0 text-xs text-paper-400">{e.progress}%</span>
                </div>
              ))}
            </div>
          </Card>
        </FadeIn>
      </div>

      <FadeIn delay={0.2} className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg text-paper-50">Mes cours</h2>
          <Link to="/cours" className="text-sm text-violet-400 hover:text-violet-300">
            Explorer le catalogue
          </Link>
        </div>

        {enrollments.length === 0 ? (
          <EmptyState
            icon={BookX}
            title="Vous n'etes inscrit a aucun cours"
            description="Parcourez le catalogue pour demarrer votre premier parcours."
            action={<Button as={Link} to="/cours" className="mt-2">Voir les cours</Button>}
          />
        ) : (
          <div className="overflow-hidden rounded-xl2 border border-white/8">
            <table className="w-full text-left text-sm">
              <thead className="bg-ink-800/60 text-paper-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Cours</th>
                  <th className="px-5 py-3 font-medium">Progression</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/8">
                {enrollments.map((e) => (
                  <tr key={e.id} className="bg-ink-900/30">
                    <td className="px-5 py-4">
                      <Link to={`/cours/${e.course.slug}`} className="text-paper-50 hover:text-violet-400">
                        {e.course.title}
                      </Link>
                      <p className="text-xs text-paper-400">{e.course.category?.name}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-teal-400"
                            style={{ width: `${e.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-paper-400">{e.progress}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {e.progress < 100 ? (
                        <button
                          onClick={() => markProgress(e.id, Math.min(100, e.progress + 25))}
                          className="text-xs text-violet-400 hover:text-violet-300"
                        >
                          + 25% avance
                        </button>
                      ) : (
                        <span className="text-xs text-teal-400">Termine</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </FadeIn>
    </div>
  );
};

export default Dashboard;
