import { useAuth } from "../hooks/useAuth";
import Dashboard from "./Dashboard";
import AdminDashboard from "./AdminDashboard";

// Chaque rôle a son propre tableau de bord.
const DashboardHome = () => {
  const { user } = useAuth();
  return user?.role === "ADMIN" ? <AdminDashboard /> : <Dashboard />;
};

export default DashboardHome;
