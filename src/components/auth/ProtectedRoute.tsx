import { Navigate, useLocation } from "react-router-dom";
import { UserAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSetup?: boolean;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session } = UserAuth();
  const location = useLocation();

  // If there is no active Supabase session, redirect to login
  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
}
