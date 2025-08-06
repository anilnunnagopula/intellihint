import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext); // Get token and user from AuthContext

  const handleRedirect = () => {
    // If logged in, go to the main app home page.
    // If not logged in, go to the landing page (which is also the root '/').
    // The App.jsx will handle rendering Home or PlanetScene based on the token.
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-center px-4">
      <h1 className="text-5xl font-bold text-red-500 animate-bounce">
        404 - Oops! Page Not Found{" "}
        <span role="img" aria-label="confused face">
          😵‍💫
        </span>
      </h1>

      <p className="mt-4 text-gray-300 text-lg max-w-md">
        Either the page doesn’t exist, or it’s still under construction.
      </p>

      {/* Dynamic message for logged-in users */}
      {token && user && (
        <p className="mt-2 font-semibold text-blue-400 max-w-md">
          It looks like you're lost, {user}. Let's get you back to where you
          belong.
        </p>
      )}

      <button
        onClick={handleRedirect}
        className="mt-8 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
      >
        {token ? "Go to IntelliHint" : "Go Back Home"}
      </button>

      <div className="mt-12 text-sm text-gray-500">
        <p>If you believe this is an error, feel free to contact support.</p>
      </div>
    </div>
  );
};

export default NotFoundPage;
