import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const PrivateRoute = () => {
  const { user } = useAuth();

  // Auth already resolved, render Outlet if user exists
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
