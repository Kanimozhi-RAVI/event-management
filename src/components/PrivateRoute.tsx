import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { JSX } from "react";
import PageLoader from "./PageLoader";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />; // wait for Firebase auth

  if (!user) return <Navigate to="/login" replace />; // redirect only if user null

  return children; // render dashboard
};

export default PrivateRoute;
