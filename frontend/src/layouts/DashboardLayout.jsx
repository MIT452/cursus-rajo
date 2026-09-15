import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { GraduationCap, LayoutDashboard, BookOpen, User, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const items = [
  { to: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard, end: true },
  { to: "/dashboard/profil", label: "Profil", icon: User },
];

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-ink-950">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/8 bg-ink-900/50 p-6 md:flex">
        <Link to="/" className="flex items-center gap-2 text-paper-50">
          <GraduationCap size={20} className="text-gold-400" />
          <span className="font-display text-lg">Cursus</span>
        </Link>

        <div className="mt-8 flex items-center gap-3 rounded-xl2 border border-white/8 bg-ink-800/60 p-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-ink-950"
            style={{ backgroundColor: user?.avatarColor }}
          >
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-paper-50">{user?.name}</p>
            <p className="truncate text-xs text-paper-400">{user?.role === "ADMIN" ? "Administrateur" : "Etudiant"}</p>
          </div>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {items.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive ? "bg-violet-500/15 text-violet-400" : "text-paper-100 hover:bg-white/5"
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
          <Link to="/cours" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-paper-100 hover:bg-white/5">
            <BookOpen size={17} />
            Catalogue de cours
          </Link>
        </nav>

        <button
          onClick={() => { logout(); navigate("/"); }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-paper-400 hover:bg-white/5 hover:text-paper-50"
        >
          <LogOut size={17} />
          Deconnexion
        </button>
      </aside>

      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
