import { authRoutes, publicRoutes } from "@/constants";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

export const ProtectedRoute = ({ isAuthenticated, children }: ProtectedRouteProps) => {
  if (!isAuthenticated) {
    return <Navigate to={'/auth' + authRoutes.LOGIN} replace />;
  }
  return children;
};

export const AuthRoute = ({ isAuthenticated, children }: ProtectedRouteProps) => {
  if (isAuthenticated) {
    return <Navigate to={publicRoutes.HOME} replace />;
  }
  return children;
};
