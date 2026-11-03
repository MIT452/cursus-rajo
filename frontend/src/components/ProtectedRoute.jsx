import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loading from "./Loading";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loading label="Verification de votre session" />;
  if (!user) return <Navigate to="/connexion" replace />;

  return children;
};

export default ProtectedRoute;
