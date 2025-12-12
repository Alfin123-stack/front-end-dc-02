// src/layout/Layout.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectSettings, toggleTheme } from "../store/settings/settingsSlice";
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
        transition-colors duration-300

        /* LIGHT MODE */
        bg-white text-gray-900
        
        /* DARK MODE */
        dark:bg-[#1e2939] 
        dark:text-[#d1d5dc]

        screen-${settings.layoutWidth}
        font-${settings.fontFamily}
        font-${settings.fontSize}
      `}>
      {/* HEADER */}
      <header
        className="
          w-full relative z-20 
          backdrop-blur-md

          /* Light */
          bg-white/70 border-b border-gray-200

          /* Dark */
          dark:bg-[#101828]/70 
          dark:border-[#155dfc] 
          px-4 sm:px-6 py-3 
          flex items-center justify-between
        ">
        {/* Toggle Theme */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="
            p-2 rounded-full shadow
            border

            /* Light Button */
            bg-white/80 border-gray-200

            /* Dark Button */
            dark:bg-[#101828]/80 
            dark:border-[#155dfc]
            hover:scale-110 transition-all
          ">
          {settings.theme === "dark" ? (
            <FaMoon className="text-[#155dfc]" size={18} />
          ) : (
            <FaSun className="text-yellow-500" size={18} />
          )}
        </button>

        {/* Title */}
        <h1 className="font-bold text-base sm:text-lg">
          {isSettingsPage ? "Pengaturan" : "Web Tutorial"}
        </h1>

        {/* Right Button */}
        {isSettingsPage ? (
          <button
            onClick={handleBack}
            className="
              p-2 rounded-full shadow border
              bg-white/80 border-gray-200
              dark:bg-[#101828]/80 dark:border-[#155dfc]
              hover:scale-110 transition-all
            ">
            <FaArrowLeft size={18} className="text-red-600 dark:text-red-300" />
          </button>
        ) : (
          <button
            onClick={() =>
              navigate(`/settings?tutorial=${tutorial}&user=${user}`)
            }
            className="
              p-2 rounded-full shadow border
              bg-white/80 border-gray-200
              dark:bg-[#101828]/80 dark:border-[#155dfc]
              hover:scale-110 transition-all
            ">
            <FaCogs
              size={18}
              className={
                settings.theme === "dark" ? "text-[#155dfc]" : "text-purple-600"
              }
            />
          </button>
        )}
      </header>

      {/* CONTENT */}
      <main className="relative z-10 p-4 sm:p-6">{children}</main>
    </div>
  );
}
