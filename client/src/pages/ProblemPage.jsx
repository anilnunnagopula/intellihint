import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import toast from "react-hot-toast";
// import api from "../utils/api";

const hardcodedProblem = {
  _id: "1",
  title: "Two Sum",
  description:
    "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
  difficulty: "Easy",
  starterCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Write your code here
}`,
};

function ProblemPage() {
  const { id } = useParams();
  const [code, setCode] = useState(hardcodedProblem.starterCode);
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);

  // Function to fetch AI-powered problem analysis
  const fetchProblemAnalysis = async () => {
    setLoading(true);
    try {
      // This would call your AI service via the Node.js backend
      // For this scaffold, we'll use a mock response
      const response = await api.post("/ai/analyze", {
        problem: hardcodedProblem,
      });
      setAiResponse(response.data);
    } catch (err) {
      toast.error("Failed to get problem analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblemAnalysis();
  }, [id]);

  // Handle "Next Hint" button click
  const getNextHint = () => {
    if (currentHintIndex < aiResponse.hints.length - 1) {
      setCurrentHintIndex((prevIndex) => prevIndex + 1);
    } else {
      toast("You have unlocked all available hints!", { icon: "👏" });
    }
  };

  const getCodeSolution = async (solutionType) => {
    setLoading(true);
    try {
      // This would call your AI service to generate code
      // For this scaffold, we'll use a mock response
      const response = await api.post("/ai/solution", {
        problemId: id,
        solutionType,
      });
      setAiResponse((prev) => ({
        ...prev,
        solutions: { ...prev.solutions, [solutionType]: response.data.code },
      }));
    } catch (err) {
      toast.error("Failed to generate code solution.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-8 flex flex-col md:flex-row gap-8">
      {/* Problem Description Panel */}
      <div className="w-full md:w-1/2 p-6 bg-gray-800 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold mb-4">{hardcodedProblem.title}</h1>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            hardcodedProblem.difficulty === "Easy"
              ? "bg-green-600 text-green-100"
              : hardcodedProblem.difficulty === "Medium"
              ? "bg-yellow-600 text-yellow-100"
              : "bg-red-600 text-red-100"
          }`}
        >
          {hardcodedProblem.difficulty}
        </span>
        <p className="mt-6 text-gray-400 leading-relaxed">
          {hardcodedProblem.description}
        </p>

        {aiResponse && (
          <div className="mt-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-100">
                Pattern Recognition
              </h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {aiResponse.patterns.map((pattern) => (
                  <span
                    key={pattern}
                    className="bg-purple-600 text-purple-100 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {pattern}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-100">Hints</h2>
              <div className="mt-2 space-y-4">
                <div className="p-4 bg-gray-700 rounded-lg shadow-inner">
                  <p className="text-gray-300">
                    {aiResponse.hints[currentHintIndex]}
                  </p>
                </div>
                <button
                  onClick={getNextHint}
                  disabled={
                    loading || currentHintIndex >= aiResponse.hints.length - 1
                  }
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  {currentHintIndex < aiResponse.hints.length - 1
                    ? "Next Hint"
                    : "All Hints Unlocked"}
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-100">
                Code Solutions
              </h2>
              <div className="mt-4 flex flex-col space-y-4">
                <button
                  onClick={() => getCodeSolution("bruteForce")}
                  disabled={loading || aiResponse.solutions.bruteForce}
                  className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  Show Brute Force Solution
                </button>
                {aiResponse.solutions.bruteForce && (
                  <CodeMirror
                    value={aiResponse.solutions.bruteForce}
                    height="auto"
                    theme="dark"
                    extensions={[javascript({ jsx: true })]}
                    readOnly
                  />
                )}
                {/* Placeholder for "Better" and "Optimal" solutions */}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Code Editor Panel */}
      <div className="w-full md:w-1/2 p-6 bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-100">Code Editor</h2>
        <CodeMirror
          value={code}
          height="500px"
          theme="dark"
          extensions={[javascript({ jsx: true })]}
          onChange={(value) => setCode(value)}
        />
        <div className="mt-6 flex gap-4">
          <button className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-md transition-colors">
            Dry Run
          </button>
          <button className="flex-1 py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-md transition-colors">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProblemPage;
