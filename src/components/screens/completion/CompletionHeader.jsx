import React from "react";
import { FaHome, FaCog, FaSun, FaMoon } from "react-icons/fa";

export default function CompletionHeader({
  isDarkMode,
  onGoHome,
  onToggleTheme,
  onShowSettings,
}) {
  const btnClass =
    "p-3 rounded-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-xl hover:scale-110 transition-all flex items-center justify-center";

  return (
    <>
      {/* Floating Bubbles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-72 h-72 bg-pink-400/10 rounded-full -top-16 -left-16 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-green-400/10 rounded-full -bottom-20 -right-20 animate-pulse delay-500"></div>
        <div className="absolute w-64 h-64 bg-yellow-400/10 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse delay-700"></div>
      </div>

      {/* Settings Button */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={onShowSettings}
          className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm 
               border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl 
               transition-all duration-300 hover:scale-110 flex items-center justify-center">
          <FaCog
            size={22}
            className={`${isDarkMode ? "text-blue-300" : "text-purple-600"}`}
          />
        </button>
      </div>

      {/* Theme Toggle */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={onToggleTheme}
          className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm 
                 border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl 
                 transition-all duration-300 hover:scale-110 flex items-center justify-center">
          {isDarkMode ? (
            <FaMoon className="text-purple-400" size={22} />
          ) : (
            <FaSun className="text-yellow-500" size={22} />
          )}
        </button>
      </div>
    </>
  );
}
