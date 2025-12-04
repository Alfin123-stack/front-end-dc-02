<<<<<<< HEAD
import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UnlockContext } from "../contexts/UnlockProvider";
=======
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
>>>>>>> 66c974b (adding history screen)
import StartScreen from "../components/screens/StartScreen";

export default function StartPage() {
  const navigate = useNavigate();
  const location = useLocation();

<<<<<<< HEAD
  // Ambil tutorial ID dari query
=======
>>>>>>> 66c974b (adding history screen)
  const params = new URLSearchParams(location.search);
  const tutorial = Number(params.get("tutorial") || 1);
  const user = Number(params.get("user") || 1);

<<<<<<< HEAD
  const { unlockedLevels } = useContext(UnlockContext);

  // Tentukan current level (level terakhir yang terbuka)
  const currentLevel =
    unlockedLevels.length > 0 ? unlockedLevels[unlockedLevels.length - 1] : 1;

  // HANDLE START LANGSUNG
  const handleStart = (level) => {
    // Tidak boleh buka level terkunci
    if (!unlockedLevels.includes(level)) return;

    // Langsung navigate tanpa toast
=======
  // -------------------------
  // FORCE : Semua level selalu terbuka
  // -------------------------
  const forcedUnlocked = [1, 2, 3];

  // Current level = level tertinggi
  const currentLevel = forcedUnlocked[forcedUnlocked.length - 1];

  // Start langsung tanpa cek lock
  const handleStart = (level) => {
>>>>>>> 66c974b (adding history screen)
    navigate(`/quiz/${level}?tutorial=${tutorial}&user=${user}`);
  };

  return (
    <StartScreen
      onStartQuiz={handleStart}
<<<<<<< HEAD
      unlockedLevels={unlockedLevels}
=======
      unlockedLevels={forcedUnlocked} // kirim list level terbuka
>>>>>>> 66c974b (adding history screen)
      currentLevel={currentLevel}
    />
  );
}
