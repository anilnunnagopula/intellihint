import React, { useState, useContext } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { PromptContext } from "../context/PromptContext";
import toast from "react-hot-toast";

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

    // Simulate API call to your Node.js backend
    try {
      // In a real app, this would be an API call to a specific endpoint
      // const response = await api.post('/ai/analyze-problem', { problem: userInput });

      // We will now use a mock response that is returned all at once,
      // but displayed step-by-step by the frontend.
      const mockResponse = {
        problemBreakdown:
          "The problem asks you to find two numbers in an array that add up to a specific target value, and return their indices.",
        pattern: "Hash Map (or Two Pointers)",
        difficulty: "Easy",
        hints: [
          "Hint 1: A brute-force approach would involve nested loops. What is the time complexity of that solution?",
          "Hint 2: Can you optimize the search for the second number? Think about using a data structure that provides fast lookups.",
          'Hint 3: For each number, calculate its "complement" (target - current number) and check if you have seen this complement before. A hash map is perfect for this.',
        ],
        solutions: {
          bruteForce: `// Brute Force Solution - O(n^2)
function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
}
`,
          optimal: `// Optimal Solution - O(n)
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
}
`,
        },
      };

      // Store the full response in context to be rendered progressively
      setResponseSteps([
        {
          type: "breakdown",
          content: `Hey! Let’s break this down together 😊\n\n**Problem Understanding:** ${mockResponse.problemBreakdown}`,
        },
        {
          type: "pattern",
          content: `**Pattern Recognition:** This looks like a classic **${mockResponse.pattern}** problem.\n**Difficulty Analysis:** I'd rate this as **${mockResponse.difficulty}**.`,
        },
        {
          type: "hint",
          content: `**Step-by-Step Hints:**\n\n${mockResponse.hints[0]}`,
        },
        { type: "hint", content: mockResponse.hints[1] },
        { type: "hint", content: mockResponse.hints[2] },
        {
          type: "solution",
          content: mockResponse.solutions.bruteForce,
          title: "Brute Force Solution",
        },
        {
          type: "solution",
          content: mockResponse.solutions.optimal,
          title: "Optimal Solution",
        },
      ]);
      setStepIndex(0); // Reset to the first step
    } catch (err) {
      toast.error("Failed to analyze problem. Please try again.");
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
          <h3 className="text-lg font-bold text-gray-100 mb-2">{step.title}</h3>
          <CodeMirror
            value={step.content}
            height="auto"
            theme="dark"
            extensions={[javascript({ jsx: true })]}
            readOnly
          />
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
      <div key={index} className="bg-gray-800 rounded-xl shadow-lg p-4 mb-4">
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
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col p-4">
      <div className="flex-1 w-full max-w-3xl mx-auto overflow-y-auto pb-20">
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
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
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
            className="absolute right-3 bottom-3 p-2 bg-blue-600 text-white rounded-lg transition-colors hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
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
