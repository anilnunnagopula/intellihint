import React, { createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(localStorage.getItem("user") || null);
  const navigate = useNavigate();
  const location = useLocation();

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

  // Auto-redirect logic
  useEffect(() => {
    // Define paths that do NOT require authentication
    const publicPaths = ["/login", "/register", "/"];

    // If there's no token AND the current path is NOT one of the public paths,
    // then redirect to login.
    if (!token && !publicPaths.includes(location.pathname)) {
      navigate("/login");
    }
  }, [token, navigate, location.pathname]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
