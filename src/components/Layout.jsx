// src/layout/Layout.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectSettings, toggleTheme } from "../store/settingsSlice";
import { FaCogs, FaMoon, FaSun, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

export default function Layout({ children }) {
  const settings = useSelector(selectSettings);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const tutorial = searchParams.get("tutorial");
  const user = searchParams.get("user");

  const isSettingsPage = location.pathname.startsWith("/settings");

  const handleBack = () => {
    if (window.history.length > 2) navigate(-1);
    else navigate("/");
  };

  return (
    <div
      className={`
        min-h-screen 
        bg-white dark:bg-gray-900
        text-gray-900 dark:text-gray-100
        transition-colors duration-300
        screen-${settings.layoutWidth}
        font-${settings.fontFamily}
        font-${settings.fontSize}
      `}>
      {/* Background Bubble */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-48 sm:w-72 h-48 sm:h-72 bg-pink-400/10 dark:bg-pink-300/5 rounded-full -top-16 -left-16 animate-pulse" />
        <div className="absolute w-64 sm:w-96 h-64 sm:h-96 bg-green-400/10 dark:bg-green-300/5 rounded-full -bottom-20 -right-20 animate-pulse delay-500" />
        <div className="absolute w-40 sm:w-64 h-40 sm:h-64 bg-yellow-400/10 dark:bg-yellow-300/5 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse delay-700" />
      </div>

      {/* ----- HEADER BAR ----- */}
      <header
        className="
          w-full relative z-20 
          backdrop-blur-md bg-white/70 dark:bg-gray-900/70 
          border-b border-gray-200 dark:border-gray-700
          px-4 sm:px-6 py-3 flex items-center justify-between
        ">
        {/* LEFT: Toggle Theme */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="
            p-2 rounded-full 
            bg-white/80 dark:bg-gray-800/80 
            hover:scale-110 transition-all shadow 
            border border-gray-200 dark:border-gray-700
          ">
          {settings.theme === "dark" ? (
            <FaMoon className="text-purple-300" size={18} />
          ) : (
            <FaSun className="text-yellow-500" size={18} />
          )}
        </button>

        {/* CENTER: Title */}
        <h1 className="font-bold text-base sm:text-lg">
          {isSettingsPage ? "Pengaturan" : "Web Tutorial"}
        </h1>

        {/* RIGHT: Settings / Back */}
        {isSettingsPage ? (
          <button
            onClick={handleBack}
            className="
              p-2 rounded-full 
              bg-white/80 dark:bg-gray-800/80 
              hover:scale-110 transition-all shadow 
              border border-gray-200 dark:border-gray-700
            ">
            <FaArrowLeft size={18} className="text-red-600 dark:text-red-300" />
          </button>
        ) : (
          <button
            onClick={() =>
              navigate(`/settings?tutorial=${tutorial}&user=${user}`)
            }
            className="
              p-2 rounded-full 
              bg-white/80 dark:bg-gray-800/80 
              hover:scale-110 transition-all shadow 
              border border-gray-200 dark:border-gray-700
            ">
            <FaCogs
              size={18}
              className={
                settings.theme === "dark" ? "text-blue-300" : "text-purple-600"
              }
            />
          </button>
        )}
      </header>

      {/* ----- PAGE CONTENT ----- */}
      <main className="relative z-10 pt-4 sm:pt-6">{children}</main>
    </div>
  );
}
