import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({ user }:any) => {
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};
