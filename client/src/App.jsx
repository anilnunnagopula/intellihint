import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import BrowserRouter here
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PlanetScene from "./components/PlanetScene";
import Stars from "./components/Stars";
import { PromptProvider } from "./context/PromptContext";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import PageNotFound from "./pages/PageNotFound";
// New component to conditionally render Home or PlanetScene
const RootContent = () => {
  const { token } = useContext(AuthContext);
  return token ? (
    <Home />
  ) : (
    <>
      <PlanetScene /> 
      <Stars />
    </>
  );
};

function App() {
  return (
    <Router>
      {" "}
      {/* Router is now here, wrapping the providers */}
      <AuthProvider>
        <PromptProvider>
          <Toaster />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<RootContent />} />
            <Route path="*" element={<PageNotFound />} />

          </Routes>
        </PromptProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
