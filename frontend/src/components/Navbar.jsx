import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { useScrollPosition } from "../hooks/useScrollPosition";
import { useAuth } from "../hooks/useAuth";
import Button from "./Button";

const links = [
  { to: "/cours", label: "Cours" },
  { to: "/#fonctionnement", label: "Fonctionnement" },
  { to: "/#temoignages", label: "Temoignages" },
];

const Navbar = () => {
  const scrolled = useScrollPosition(10);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? "border-b border-white/8 bg-ink-950/70 backdrop-blur-lg shadow-lg shadow-black/20" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-paper-50">
          <GraduationCap size={22} className="text-gold-400" />
          <span className="font-display text-lg tracking-tight">Cursus</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className="text-sm text-paper-100 transition-colors hover:text-paper-50"
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Button variant="ghost" size="md" onClick={() => navigate("/dashboard")}>
                <LayoutDashboard size={16} /> Tableau de bord
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                <LogOut size={16} /> Deconnexion
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="md" onClick={() => navigate("/connexion")}>
                Connexion
              </Button>
              <Button variant="primary" size="md" onClick={() => navigate("/inscription")}>
                Commencer
              </Button>
            </>
          )}
        </div>

        <button
          className="text-paper-50 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/8 bg-ink-950/95 backdrop-blur-lg md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-paper-100">
                  {l.label}
                </NavLink>
              ))}
              <div className="mt-2 flex flex-col gap-3">
                {user ? (
                  <>
                    <Button variant="secondary" onClick={() => { navigate("/dashboard"); setOpen(false); }}>
                      Tableau de bord
                    </Button>
                    <Button variant="ghost" onClick={() => { logout(); navigate("/"); setOpen(false); }}>
                      Deconnexion
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="secondary" onClick={() => { navigate("/connexion"); setOpen(false); }}>
                      Connexion
                    </Button>
                    <Button variant="primary" onClick={() => { navigate("/inscription"); setOpen(false); }}>
                      Commencer
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
