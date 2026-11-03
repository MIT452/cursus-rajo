import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, AlertCircle } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Connexion impossible");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        <Link to="/" className="mb-8 flex items-center justify-center gap-2 text-paper-50">
          <GraduationCap size={22} className="text-gold-400" />
          <span className="font-display text-lg">Cursus</span>
        </Link>

        <div className="rounded-xl2 border border-white/8 bg-ink-800/60 p-8 backdrop-blur-sm">
          <h1 className="font-display text-2xl text-paper-50">Content de vous revoir</h1>
          <p className="mt-1 text-sm text-paper-400">Connectez-vous pour continuer votre parcours.</p>

          {error && (
            <div className="mt-5 flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-400">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="vous@exemple.com"
            />
            <Input
              label="Mot de passe"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
            <Button type="submit" className="w-full" loading={loading}>
              Se connecter
            </Button>
          </form>

          <p className="mt-6 rounded-lg bg-ink-900/60 p-3 text-xs text-paper-400">
            Demo : etudiant@cursus.dev / User123! — ou admin@cursus.dev / Admin123!
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-paper-400">
          Pas encore de compte ?{" "}
          <Link to="/inscription" className="text-violet-400 hover:text-violet-300">
            Inscrivez-vous
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
