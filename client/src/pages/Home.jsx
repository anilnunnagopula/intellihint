import React, { useState, useContext } from "react";
import CodeMirror from "@uiw/react-codemirror";
// Import Java language extension for CodeMirror
import { java } from "@codemirror/lang-java";
import { PromptContext } from "../context/PromptContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

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

    // Simulate API call to your Node.js backend
    try {
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
          bruteForce: {
            title: "Brute Force Solution",
            approach:
              "Iterate through the array with two nested loops. The outer loop selects the first number, and the inner loop checks the rest of the numbers to find a pair that sums to the target.",
            intuition:
              "The simplest way to find a pair is to check every possible combination of numbers. We can do this by picking one number and then, for each one, checking all the subsequent numbers to see if they form the desired sum.",
            complexityAnalysis: {
              time: "O(n²)",
              space: "O(1)",
              graph:
                "The time complexity is quadratic because for each element, we are iterating through the rest of the array. As the input size (n) increases, the time required grows exponentially.",
            },
            code: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) {
                    return new int[]{i, j};
                }
            }
        }
        // No solution found (though problem usually guarantees one)
        return new int[]{}; 
    }
}
`,
          },
          better: {
            // New "Better" approach
            title: "Better Approach: Two-Pass Hash Map",
            approach:
              "In the first pass, store each number and its index in a hash map. In the second pass, for each number, calculate its complement and check if the complement exists in the hash map. Ensure the complement is not the number itself if it's the same index.",
            intuition:
              "We can reduce the search time for the complement by storing all numbers in a hash map first. This allows us to look up complements in nearly constant time. The two passes separate the population and lookup phases.",
            complexityAnalysis: {
              time: "O(n)",
              space: "O(n)",
              graph:
                "The time complexity is linear because we iterate through the array twice. The space complexity is also linear, as we store up to n elements in the hash map.",
            },
            code: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> numMap = new HashMap<>();
        // First pass: Populate the hash map
        for (int i = 0; i < nums.length; i++) {
            numMap.put(nums[i], i);
        }

        // Second pass: Find the complement
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (numMap.containsKey(complement) && numMap.get(complement) != i) {
                return new int[]{i, numMap.get(complement)};
            }
        }
        // No solution found
        return new int[]{};
    }
}
`,
          },
          optimal: {
            title: "Optimal Solution: Single-Pass Hash Map",
            approach:
              'Iterate through the array once. For each number, calculate its "complement" (target - current number). Check if this complement already exists in the hash map. If it does, return the indices. Otherwise, add the current number and its index to the hash map.',
            intuition:
              "By combining the population and lookup into a single pass, we can find the solution more efficiently. If we encounter a number whose complement we've already seen, we have our pair. If not, we store the current number for future lookups.",
            complexityAnalysis: {
              time: "O(n)",
              space: "O(n)",
              graph:
                "The time complexity is linear because we only make a single pass through the array. The space complexity is also linear, as we store up to n elements in the hash map in the worst case.",
            },
            code: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> numMap = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (numMap.containsKey(complement)) {
                return new int[]{numMap.get(complement), i};
            }
            numMap.put(nums[i], i);
        }
        // No solution found
        return new int[]{};
    }
}
`,
          },
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
        { type: "solution", content: mockResponse.solutions.bruteForce },
        { type: "solution", content: mockResponse.solutions.better }, // Added better approach
        { type: "solution", content: mockResponse.solutions.optimal },
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
            extensions={[java()]} // Changed to Java language
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
