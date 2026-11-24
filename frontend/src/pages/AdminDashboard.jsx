import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, GraduationCap, Wallet, Check, Plus, Pencil, Trash2, Ban, RotateCcw } from "lucide-react";
import { getAdminStats } from "../services/dashboardService";
import { updateCoursePrice, deleteCourse } from "../services/courseService";
import { getUsers, setUserSuspension } from "../services/userService";
import { useAuth } from "../hooks/useAuth";
import Card from "../components/Card";
import Modal from "../components/Modal";
import Button from "../components/Button";
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
  const [toDelete, setToDelete] = useState(null); // cours en attente de confirmation
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const confirmDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteCourse(toDelete.id);
      setToDelete(null);
      await load();
    } catch {
      setDeleteError("Suppression impossible. Réessayez.");
    } finally {
      setDeleting(false);
    }
  };

  const [students, setStudents] = useState([]);
  const [toSuspend, setToSuspend] = useState(null); // étudiant en attente de confirmation
  const [suspending, setSuspending] = useState(false);
  const [suspendError, setSuspendError] = useState("");

  const confirmSuspension = async () => {
    setSuspending(true);
    setSuspendError("");
    try {
      await setUserSuspension(toSuspend.id, !toSuspend.suspended);
      setToSuspend(null);
      await load();
    } catch (err) {
      setSuspendError(err.response?.data?.message || "Action impossible. Réessayez.");
    } finally {
      setSuspending(false);
    }
  };

  const load = async () => {
    try {
      const [s, users] = await Promise.all([getAdminStats(), getUsers()]);
      setStats(s);
      setStudents(users.filter((u) => u.role === "USER"));
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
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-lg text-paper-50">Gestion des cours</h2>
            <p className="mt-1 text-xs text-paper-400">
              Créez, modifiez ou supprimez vos cours, et fixez leur prix.
            </p>
          </div>
          <Button as={Link} to="/dashboard/cours/nouveau">
            <Plus size={16} /> Nouveau cours
          </Button>
        </div>

        <div className="overflow-x-auto rounded-xl2 border border-white/8">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-ink-800/60 text-paper-400">
              <tr>
                <th className="px-5 py-3 font-medium">Cours</th>
                <th className="px-5 py-3 font-medium">Inscrits</th>
                <th className="px-5 py-3 font-medium">Revenu simulé</th>
                <th className="px-5 py-3 font-medium">Prix</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8">
              {stats.courses.map((c) => (
                <tr key={c.id} className="bg-ink-900/30">
                  <td className="px-5 py-4">
                    <p className="text-paper-50">{c.title}</p>
                    <p className="text-xs text-paper-400">
                      {c.category}
                      {!c.published && <span className="ml-2 text-gold-400">· Masqué</span>}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-paper-100">{c.enrollments}</td>
                  <td className="px-5 py-4 text-paper-100">{money(c.revenue)}</td>
                  <td className="px-5 py-4">
                    <PriceEditor course={c} onSaved={load} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <Link
                        to={`/dashboard/cours/${c.slug}/modifier`}
                        className="rounded-lg p-2 text-paper-100 hover:bg-white/5"
                        aria-label={`Modifier ${c.title}`}
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => {
                          setDeleteError("");
                          setToDelete(c);
                        }}
                        className="rounded-lg p-2 text-red-300 hover:bg-red-500/10"
                        aria-label={`Supprimer ${c.title}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FadeIn>

      <FadeIn delay={0.2} className="mt-10">
        <div className="mb-4">
          <h2 className="font-display text-lg text-paper-50">Comptes étudiants</h2>
          <p className="mt-1 text-xs text-paper-400">
            Un compte suspendu ne peut plus se connecter ni utiliser la plateforme. Ses données sont conservées et le
            compte peut être réactivé.
          </p>
        </div>
        <div className="overflow-x-auto rounded-xl2 border border-white/8">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-ink-800/60 text-paper-400">
              <tr>
                <th className="px-5 py-3 font-medium">Étudiant</th>
                <th className="px-5 py-3 font-medium">Inscriptions</th>
                <th className="px-5 py-3 font-medium">Statut</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8">
              {students.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-paper-400">
                    Aucun compte étudiant.
                  </td>
                </tr>
              )}
              {students.map((u) => (
                <tr key={u.id} className="bg-ink-900/30">
                  <td className="px-5 py-4">
                    <p className="text-paper-50">{u.name}</p>
                    <p className="text-xs text-paper-400">{u.email}</p>
                  </td>
                  <td className="px-5 py-4 text-paper-100">{u._count?.enrollments ?? 0}</td>
                  <td className="px-5 py-4">
                    {u.suspended ? (
                      <span className="text-red-300">Suspendu</span>
                    ) : (
                      <span className="text-teal-400">Actif</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          setSuspendError("");
                          setToSuspend(u);
                        }}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors ${
                          u.suspended
                            ? "bg-teal-500/15 text-teal-400 hover:bg-teal-500/25"
                            : "bg-red-500/10 text-red-300 hover:bg-red-500/20"
                        }`}
                      >
                        {u.suspended ? <RotateCcw size={13} /> : <Ban size={13} />}
                        {u.suspended ? "Réactiver" : "Suspendre"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FadeIn>

      <Modal
        open={Boolean(toSuspend)}
        onClose={() => !suspending && setToSuspend(null)}
        title={toSuspend?.suspended ? "Réactiver ce compte ?" : "Suspendre ce compte ?"}
      >
        <p className="text-sm leading-relaxed text-paper-100">
          {toSuspend?.suspended
            ? `${toSuspend?.name} pourra de nouveau se connecter et reprendre ses cours.`
            : `${toSuspend?.name} ne pourra plus se connecter tant que le compte reste suspendu. Ses inscriptions et sa progression sont conservées.`}
        </p>
        {suspendError && <p className="mt-3 text-sm text-red-300">{suspendError}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" disabled={suspending} onClick={() => setToSuspend(null)}>
            Annuler
          </Button>
          <Button loading={suspending} onClick={confirmSuspension}>
            {toSuspend?.suspended ? "Réactiver" : "Suspendre"}
          </Button>
        </div>
      </Modal>

      <Modal open={Boolean(toDelete)} onClose={() => !deleting && setToDelete(null)} title="Supprimer ce cours ?">
        <p className="text-sm leading-relaxed text-paper-100">
          « {toDelete?.title} » sera supprimé définitivement, avec ses leçons et les {toDelete?.enrollments ?? 0} inscription
          {toDelete?.enrollments > 1 ? "s" : ""} et progressions associées.
        </p>
        {deleteError && <p className="mt-3 text-sm text-red-300">{deleteError}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" disabled={deleting} onClick={() => setToDelete(null)}>
            Annuler
          </Button>
          <Button loading={deleting} onClick={confirmDelete}>
            Supprimer
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
