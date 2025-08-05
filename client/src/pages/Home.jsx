import React, { useState, useContext } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { java } from "@codemirror/lang-java";
import { PromptContext } from "../context/PromptContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar"; // Import the Navbar component

// Component to render the complexity graph inline
const ComplexityVisualization = ({ complexity, title }) => {
  const scale = 100;

  // This function returns the SVG path data for each complexity curve
  const getPathData = (comp) => {
    switch (comp) {
      case "O(1)":
        return `M 0 ${scale} L ${scale} ${scale}`; // Horizontal line
      case "O(log n)":
        // Logarithmic curve: starts flat, then slowly rises
        return `M 0 ${scale} C ${scale * 0.2} ${scale}, ${scale * 0.8} ${
          scale * 0.3
        }, ${scale} 0`;
      case "O(n)":
        return `M 0 ${scale} L ${scale} 0`; // Linear line
      case "O(n log n)":
        // n log n curve: slightly steeper than linear
        return `M 0 ${scale} C ${scale * 0.2} ${scale * 0.8}, ${scale * 0.8} ${
          scale * 0.2
        }, ${scale} 0`;
      case ("O(n²)", "O(n^2)"):
        // Quadratic curve: starts flat, then rises sharply
        return `M 0 ${scale} C ${scale * 0.1} ${scale * 0.95}, ${scale * 0.4} ${
          scale * 0.7
        }, ${scale} 0`;
      case ("O(2^n)", "O(n!)"):
        // Exponential/Factorial: extremely sharp rise
        return `M 0 ${scale} C ${scale * 0.05} ${scale * 0.99}, ${
          scale * 0.1
        } ${scale * 0.9}, ${scale} 0`;
      default:
        return `M 0 ${scale} L ${scale} ${scale}`; // Default to O(1) if unrecognized
    }
  };

  return (
    <div className="mt-4 p-3 bg-gray-700 rounded-lg shadow-inner">
      <h4 className="font-semibold text-white mb-2 text-center">{title}</h4>
      <div className="relative w-full h-48">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Background grid lines */}
          {[0, 25, 50, 75, 100].map((pos) => (
            <line
              key={`x-${pos}`}
              x1="0"
              y1={pos}
              x2="100"
              y2={pos}
              stroke="#374151"
              strokeWidth="0.5"
            />
          ))}
          {[0, 25, 50, 75, 100].map((pos) => (
            <line
              key={`y-${pos}`}
              x1={pos}
              y1="0"
              x2={pos}
              y2="100"
              stroke="#374151"
              strokeWidth="0.5"
            />
          ))}
          {/* Reference linear growth line */}
          <path
            d="M 0 100 L 100 0"
            fill="none"
            stroke="#6b7280"
            strokeWidth="1"
            strokeDasharray="2,2"
          />

          {/* The primary complexity curve */}
          <path
            d={getPathData(complexity)}
            fill="none"
            stroke="#d946ef"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <p className="text-center text-gray-300 font-bold mt-2">{complexity}</p>
    </div>
  );
};

// This is the new Home page that serves as the core UI
function Home() {
  const {
    problem,
    setProblem,
    stepIndex,
    setStepIndex,
    responseSteps,
    setResponseSteps,
    loading,
    setLoading,
  } = useContext(PromptContext);
  const [userInput, setUserInput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || loading) {
      return;
    }

    setLoading(true);
    setProblem(userInput); // Save the problem to context
    setUserInput(""); // Clear the input box

    try {
      // Construct the prompt for the AI model
      const aiPrompt = `
        Analyze the following coding problem and provide a structured response in JSON format.
        The response should include:
        1.  **problemBreakdown**: A brief paraphrase of the question in simple terms.
        2.  **pattern**: What kind of problem this is (e.g., Binary Search, DP, Sliding Window, Hash Map, Two Pointers, etc.).
        3.  **difficulty**: The estimated difficulty level (Easy, Medium, Hard).
        4.  **hints**: An array of 3 progressive hints.
        5.  **solutions**: An object containing 'bruteForce', 'better', and 'optimal' solutions. Each solution object should have:
            * **title**: Title of the approach (e.g., "Brute Force Solution")
            * **approach**: A brief explanation of the approach.
            * **intuition**: The core idea or thought process behind the approach.
            * **complexityAnalysis**: An object with 'time', 'space' (e.g., "O(n)", "O(n²)"), and 'graph' (a brief description for the graph visualization).
            * **code**: The complete code snippet in Java.

        Problem: "${userInput}"

        Ensure the JSON is perfectly parsable.
        Example JSON Structure:
        {
          "problemBreakdown": "...",
          "pattern": "...",
          "difficulty": "...",
          "hints": ["...", "...", "..."],
          "solutions": {
            "bruteForce": {
              "title": "...",
              "approach": "...",
              "intuition": "...",
              "complexityAnalysis": {
                "time": "...",
                "space": "...",
                "graph": "..."
              },
              "code": "..."
            },
            "better": {
              "title": "...",
              "approach": "...",
              "intuition": "...",
              "complexityAnalysis": {
                "time": "...",
                "space": "...",
                "graph": "..."
              },
              "code": "..."
            },
            "optimal": {
              "title": "...",
              "approach": "...",
              "intuition": "...",
              "complexityAnalysis": {
                "time": "...",
                "space": "...",
                "graph": "..."
              },
              "code": "..."
            }
          }
        }
      `;

      // Call your Node.js backend API to analyze the problem
      // The backend will then call the Gemini API
      const response = await fetch(
        "http://localhost:5000/api/ai/analyze-problem",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add Authorization header if your API requires it (e.g., JWT token)
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ prompt: aiPrompt, problem: userInput }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Assuming the backend returns the structured data directly
      const aiParsedResponse = data; // Your backend will return this structure

      // Store the full response in context to be rendered progressively
      setResponseSteps([
        {
          type: "breakdown",
          content: `Hey! Let’s break this down together 😊\n\n**Problem Understanding:** ${aiParsedResponse.problemBreakdown}`,
        },
        {
          type: "pattern",
          content: `**Pattern Recognition:** This looks like a classic **${aiParsedResponse.pattern}** problem.\n**Difficulty Analysis:** I'd rate this as **${aiParsedResponse.difficulty}**.`,
        },
        {
          type: "hint",
          content: `**Step-by-Step Hints:**\n\n${aiParsedResponse.hints[0]}`,
        },
        { type: "hint", content: aiParsedResponse.hints[1] },
        { type: "hint", content: aiParsedResponse.hints[2] },
        { type: "solution", content: aiParsedResponse.solutions.bruteForce },
        { type: "solution", content: aiParsedResponse.solutions.better },
        { type: "solution", content: aiParsedResponse.solutions.optimal },
      ]);
      setStepIndex(0); // Reset to the first step
    } catch (err) {
      console.error("Error fetching AI response:", err);
      toast.error(
        "Failed to analyze problem. Please ensure your backend and AI service are running and you are logged in."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    setStepIndex((prev) => Math.min(prev + 1, responseSteps.length - 1));
  };

  // This function renders the content of a single step
  const renderStepContent = (step, index) => {
    let content;
    if (step.type === "solution") {
      content = (
        <div>
          <h3 className="text-lg font-bold text-gray-100 mb-2">
            {step.content.title}
          </h3>
          <p className="text-gray-300 leading-relaxed mt-2">
            <strong>Approach:</strong> {step.content.approach}
          </p>
          <p className="text-gray-300 leading-relaxed mt-2">
            <strong>Intuition:</strong> {step.content.intuition}
          </p>
          <div className="mt-4 p-3 bg-gray-700 rounded-lg shadow-inner">
            <h4 className="font-semibold text-white mb-1">
              Complexity Analysis
            </h4>
            <ul className="text-gray-400 list-disc list-inside">
              <li>
                <strong>Time Complexity:</strong>{" "}
                {step.content.complexityAnalysis.time}
              </li>
              <li>
                <strong>Space Complexity:</strong>{" "}
                {step.content.complexityAnalysis.space}
              </li>
            </ul>
            <p className="mt-2 text-sm italic text-gray-400">
              {step.content.complexityAnalysis.graph}
            </p>
          </div>
          <CodeMirror
            value={step.content.code}
            height="auto"
            theme="dark"
            extensions={[java()]}
            // readOnly is removed to allow copying
          />
          {/* New: Graphical representation below the code */}
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <ComplexityVisualization
              complexity={step.content.complexityAnalysis.time}
              title="Time Complexity Graph"
            />
            <ComplexityVisualization
              complexity={step.content.complexityAnalysis.space}
              title="Space Complexity Graph"
            />
          </div>
        </div>
      );
    } else {
      content = (
        <p
          dangerouslySetInnerHTML={{
            __html: step.content
              .replace(/\n/g, "<br />")
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
          }}
          className="text-gray-200 leading-relaxed"
        ></p>
      );
    }

    const isLastStep = index === stepIndex;
    const isNextStepAvailable = index < responseSteps.length - 1;

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }} // Staggered animation
        className="bg-gray-800 rounded-xl shadow-lg p-4 mb-4"
      >
        {content}
        {isLastStep && isNextStepAvailable && (
          <div className="flex justify-end mt-4">
            <button
              onClick={handleNextStep}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white font-bold rounded-md transition-colors hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              Next Step
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
      <Navbar /> {/* Add the Navbar component here */}
      <div className="flex-1 w-full max-w-3xl mx-auto overflow-y-auto pb-20 pt-16">
        {" "}
        {/* Add pt-16 for navbar spacing */}
        {problem ? (
          <div>
            <div className="p-4 mb-4 bg-gray-700 rounded-xl shadow-lg">
              <p className="text-gray-200 leading-relaxed">{problem}</p>
            </div>
            {responseSteps
              .slice(0, stepIndex + 1)
              .map((step, index) => renderStepContent(step, index))}
            {loading && (
              <div className="text-center text-gray-400 p-4">
                Analyzing problem...
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 mt-16">
            {" "}
            {/* Adjust mt-16 for navbar spacing */}
            <h1 className="text-4xl font-bold text-gray-200 mb-4">
              IntelliHint
            </h1>
            <p className="text-gray-400 max-w-lg">
              👋 Yo, drop your DSA problem below — I’ll break it down
              step-by-step 💡.
            </p>
          </div>
        )}
      </div>
      <div className="w-full max-w-3xl mx-auto fixed bottom-0 left-0 right-0 p-4 bg-gray-900 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <textarea
            className="flex-1 w-full p-3 pr-12 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Paste your DSA problem here..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            rows={1}
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-3 bottom-2 p-2 bg-blue-600 text-white rounded-lg transition-colors hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;
