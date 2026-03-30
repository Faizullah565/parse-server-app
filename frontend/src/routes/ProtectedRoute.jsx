import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // adjust path if needed

const ProtectedRoute = ({ isAdmin = false }) => {
  const { sessionToken, user } = useAuth();

  //  Not logged in
  if (!sessionToken) {
    return <Navigate to="/login" replace />;
  }

  //  Admin route but user is not admin
  if (isAdmin && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Allowed
  return <Outlet />;
};

export default ProtectedRoute;