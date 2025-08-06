import React, { useState, useContext, useEffect, useRef } from "react"; // Import useRef
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Ref for the Google Sign-In button container
  const googleSignInButtonRef = useRef(null);

  // Function to handle Google credential response
  const handleCredentialResponse = async (response) => {
    setLoading(true);
    try {
      // Send the ID token to your backend
      const res = await api.post("/auth/google", {
        idToken: response.credential,
      });
      login(res.data.token, res.data.username);
      toast.success("Google login successful! Redirecting...");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Google login failed.");
      console.error("Google login error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Initialize Google Identity Services
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // Use Vite's way to access env vars
          callback: handleCredentialResponse,
          // auto_select: true, // Optional: automatically select a Google account if only one is available
        });

        // Render the Google Sign-In button
        if (googleSignInButtonRef.current) {
          window.google.accounts.id.renderButton(
            googleSignInButtonRef.current,
            { theme: "outline", size: "large", text: "signup_with" } // Removed width: '100%'
          );
        }

        // Optional: Show the One Tap prompt
        // window.google.accounts.id.prompt();
      }
    };
    document.body.appendChild(script);

    return () => {
      // Clean up the script when component unmounts
      document.body.removeChild(script);
    };
  }, []); // Empty dependency array means this runs once on mount

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token, res.data.username);
      toast.success("Login successful! Redirecting...");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="mt-2 text-sm text-gray-400">Sign in to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 font-bold rounded-md transition-colors ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Login
          </button>
        </form>

        <div className="relative flex items-center justify-center my-4">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="flex-shrink mx-4 text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        {/* Google Sign-In button container */}
        {/* The Google button will be rendered here by their JS SDK */}
        <div
          ref={googleSignInButtonRef}
          className="w-full flex justify-center"
        ></div>

        <div className="text-center text-sm text-gray-400 mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
