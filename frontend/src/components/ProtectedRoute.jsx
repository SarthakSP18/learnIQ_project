import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);

  // If not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If role is specified and doesn’t match → redirect to home
  if (role && user.role !== role) {
    alert("Access Denied: You don’t have permission to view this page.");
    return <Navigate to="/" />;
  }

  // Otherwise → render the component
  return children;
};

export default ProtectedRoute;
