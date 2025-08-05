import React, { createContext, useState } from "react";

export const PromptContext = createContext();

export const PromptProvider = ({ children }) => {
  const [problem, setProblem] = useState("");
  const [responseSteps, setResponseSteps] = useState([]); // Stores the full breakdown from the AI
  const [stepIndex, setStepIndex] = useState(0); // Tracks the current step being shown
  const [loading, setLoading] = useState(false);

  const value = {
    problem,
    setProblem,
    responseSteps,
    setResponseSteps,
    stepIndex,
    setStepIndex,
    loading,
    setLoading,
  };

  return (
    <PromptContext.Provider value={value}>{children}</PromptContext.Provider>
  );
};
