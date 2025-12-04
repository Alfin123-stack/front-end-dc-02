import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import StartScreen from "../components/screens/StartScreen";

export default function StartPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const tutorial = Number(params.get("tutorial") || 1);
  const user = Number(params.get("user") || 1);

  // -------------------------
  // FORCE : Semua level selalu terbuka
  // -------------------------
  const forcedUnlocked = [1, 2, 3];

  // Current level = level tertinggi
  const currentLevel = forcedUnlocked[forcedUnlocked.length - 1];

  // Start langsung tanpa cek lock
  const handleStart = (level) => {
    navigate(`/quiz/${level}?tutorial=${tutorial}&user=${user}`);
  };

  return (
    <StartScreen
      onStartQuiz={handleStart}
      unlockedLevels={forcedUnlocked} // kirim list level terbuka
      currentLevel={currentLevel}
    />
  );
}
