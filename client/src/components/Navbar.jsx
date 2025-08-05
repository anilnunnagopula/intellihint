import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    setIsDropdownOpen(false); // Close dropdown
    navigate("/login"); // Redirect to login page
  };

  const handleSettingsClick = () => {
    toast.info("Settings page coming soon!"); // Placeholder for future
    setIsDropdownOpen(false);
  };

  const handleProfileClick = () => {
    toast.info("Profile page coming soon!"); // Placeholder for future
    setIsDropdownOpen(false);
  };

  // Simple placeholder for a profile picture (e.g., first letter of username)
  const getProfileInitials = () => {
    return user ? user.charAt(0).toUpperCase() : "?";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-black border-b border-gray-700 py-2 px-6 z-40 flex justify-between items-center">
      {/* App Title/Logo */}
      <div className="text-2xl font-bold text-white">IntelliHint 💡</div>

      {/* Profile Icon and Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          aria-label="User profile menu"
        >
          {getProfileInitials()}
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-700"
            >
              <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                Signed in as{" "}
                <span className="font-semibold">{user || "Guest"}</span>
              </div>
              <button
                onClick={handleProfileClick}
                className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
              >
                Profile
              </button>
              <button
                onClick={handleSettingsClick}
                className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
              >
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors border-t border-gray-700 mt-1 pt-2"
              >
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

export default Navbar;
