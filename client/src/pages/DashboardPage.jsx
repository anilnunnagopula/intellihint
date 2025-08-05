import React from "react";
import { Link } from "react-router-dom";

function DashboardPage() {
  // Hardcoded problem for initial scaffolding
  const problems = [
    {
      _id: "1",
      title: "Two Sum",
      difficulty: "Easy",
    },
  ];

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid gap-4">
        {problems.map((problem) => (
          <div
            key={problem._id}
            className="bg-gray-800 p-6 rounded-lg shadow-md hover:bg-gray-700 transition-colors"
          >
            <Link to={`/problem/${problem._id}`}>
              <h2 className="text-xl font-semibold">{problem.title}</h2>
              <span className="text-sm text-green-400">
                {problem.difficulty}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
