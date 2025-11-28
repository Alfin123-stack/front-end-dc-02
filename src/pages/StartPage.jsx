import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useSettings from "../hooks/useSettings";
import { UnlockContext } from "../contexts/UnlockProvider";
import StartScreen from "../components/screens/StartScreen";

export default function StartPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Ambil tutorial ID dari query
  const params = new URLSearchParams(location.search);
  const tutorial = Number(params.get("tutorial") || 1);

  const { unlockedLevels } = useContext(UnlockContext);
  const { settings, toggleTheme } = useSettings();

  // Tentukan current level (level terakhir yang terbuka)
  const currentLevel =
    unlockedLevels.length > 0 ? unlockedLevels[unlockedLevels.length - 1] : 1;

  // HANDLE START LANGSUNG
  const handleStart = (level) => {
    // Tidak boleh buka level terkunci
    if (!unlockedLevels.includes(level)) return;

    // Langsung navigate tanpa toast
    navigate(`/quiz/${level}?tutorial=${tutorial}`);
  };

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        settings.theme === "dark"
          ? "bg-gray-900"
          : "bg-gradient-to-b from-blue-50 to-blue-100"
      }`}>
      <StartScreen
        isDarkMode={settings.theme === "dark"}
        onToggleTheme={toggleTheme}
        onStartQuiz={handleStart}
        onShowSettings={() => navigate(`/settings?tutorial=${tutorial}`)}
        unlockedLevels={unlockedLevels}
        currentLevel={currentLevel}
      />
    </div>
  );
}
