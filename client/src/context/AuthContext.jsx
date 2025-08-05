import React, { createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(localStorage.getItem("user") || null);
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  const login = (newToken, username) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", username);
    setToken(newToken);
    setUser(username);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  // Auto-redirect to login if no token on protected routes
  useEffect(() => {
    // Only redirect if there's no token AND the current path is NOT /login or /register
    if (
      !token &&
      location.pathname !== "/login" &&
      location.pathname !== "/register"
    ) {
      navigate("/login");
    }
  }, [token, navigate, location.pathname]); // Add location.pathname to dependencies

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
