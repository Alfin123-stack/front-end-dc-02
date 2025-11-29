import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UnlockContext } from "../contexts/UnlockProvider";
import StartScreen from "../components/screens/StartScreen";

export default function StartPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Ambil tutorial ID dari query
  const params = new URLSearchParams(location.search);
  const tutorial = Number(params.get("tutorial") || 1);
  const user = Number(params.get("user") || 1);

  const { unlockedLevels } = useContext(UnlockContext);

  // Tentukan current level (level terakhir yang terbuka)
  const currentLevel =
    unlockedLevels.length > 0 ? unlockedLevels[unlockedLevels.length - 1] : 1;

  // HANDLE START LANGSUNG
  const handleStart = (level) => {
    // Tidak boleh buka level terkunci
    if (!unlockedLevels.includes(level)) return;

    // Langsung navigate tanpa toast
    navigate(`/quiz/${level}?tutorial=${tutorial}&user=${user}`);
  };

  return (
    <StartScreen
      onStartQuiz={handleStart}
      unlockedLevels={unlockedLevels}
      currentLevel={currentLevel}
    />
  );
}
