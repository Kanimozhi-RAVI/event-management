import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import PageLoader from "./PageLoader";

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  // 🔥 Auth resolve ஆகும் வரை காத்திருக்கவும்
  if (loading) {
    return <PageLoader />;
  }

  // Auth முடிந்த பிறகு மட்டுமே redirect செய்யவும்
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;