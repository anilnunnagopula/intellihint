import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage"; 
import RegisterPage from "./pages/RegisterPage";
import { PromptProvider } from "./context/PromptContext";
import { AuthProvider } from "./context/AuthContext"; 
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <AuthProvider>
        {" "}
        {/* Wrap with AuthProvider to provide auth context to all children */}
        <PromptProvider>
          {" "}
          {/* Wrap with PromptProvider for chat flow context */}
          <Toaster /> {/* Global toast notifications */}
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Default route for the main application interface */}
            <Route path="/" element={<Home />} />
          </Routes>
        </PromptProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
