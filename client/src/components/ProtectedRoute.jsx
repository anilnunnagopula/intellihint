import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Adjust path if necessary

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);

  if (!token) {
    // User is not authenticated, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the children (the protected component)
  return children;
};

export default ProtectedRoute;
