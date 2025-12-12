import React from "react";
import { useStartScreen } from "../../hooks/useStartScreen";
import StartScreenHeader from "./start/StartScreenHeader";
import StartScreenLevelGrid from "./start/StartScreenLevelGrid";
import StartScreenHistoryButton from "./start/StartScreenHistoryButton";
import StartScreenRules from "./start/StartScreenRules";

export default function StartScreen() {
  const { heading, levelStatus, loadingStatus, handleStart, goToHistory } =
    useStartScreen();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0c1220] flex flex-col items-center py-12 px-4">
      <StartScreenHeader heading={heading} />

      <StartScreenLevelGrid
        levelStatus={levelStatus}
        loadingStatus={loadingStatus}
        handleStart={handleStart}
      />

      <StartScreenHistoryButton goToHistory={goToHistory} />

      <StartScreenRules />
    </div>
  );
}
