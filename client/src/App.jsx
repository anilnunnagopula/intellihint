import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { PromptProvider } from "./context/PromptContext";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <PromptProvider>
        <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </PromptProvider>
    </Router>
  );
}

export default App;
