"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectSettings, toggleTheme } from "../../store/settingsSlice";
import { selectScore } from "../../store/quizSlice";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import CompletionActions from "./completion/CompletionActions";
import CompletionMessage from "./completion/CompletionMessage";
import ScoreCard from "./completion/ScoreCard";
import CompletionHeader from "./completion/CompletionHeader";

export default function CompletionScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { level } = useParams();
  const location = useLocation();

  const levelNum = Number(level || 1);

  const search = new URLSearchParams(location.search);
  const tutorialId = Number(search.get("tutorial") || 1);

  // REDUX STATE
  const settings = useSelector(selectSettings);
  const { score, totalQuestions } = useSelector((state) =>
    selectScore(state, tutorialId)
  );

  const percentage = Math.round((score / totalQuestions) * 100);
  const kkm = 60;
  const isPassed = percentage >= kkm;
  const canGoNextLevel = isPassed && levelNum < 3;

  const handleGoHome = () => navigate("/");
  const handleRestart = () =>
    navigate(`/quiz/${levelNum}?tutorial=${tutorialId}`);
  const handleReview = () =>
    navigate(`/review/${levelNum}?tutorial=${tutorialId}`);
  const handleNext = () =>
    navigate(`/quiz/${levelNum + 1}?tutorial=${tutorialId}`);
  const handleSettings = () => navigate("/settings");

  return (
    <div
      className={`
        min-h-screen flex items-center justify-center p-6 relative transition-colors duration-500
        ${
          settings.theme === "dark"
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white"
            : "bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100 text-gray-900"
        }
      `}>
      <CompletionHeader
        isDarkMode={settings.theme === "dark"}
        onToggleTheme={() => dispatch(toggleTheme())}
        onGoHome={handleGoHome}
        onShowSettings={handleSettings}
      />

      <div className="w-full max-w-2xl relative z-20">
        <div
          className="
            relative rounded-3xl p-8 border shadow-2xl overflow-hidden
            bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl
            border-white/40 dark:border-gray-800
          ">
          {/* SCORE */}
          <ScoreCard
            isPassed={isPassed}
            percentage={percentage}
            score={score}
            totalQuestions={totalQuestions}
            currentLevel={levelNum}
            kkm={kkm}
          />

          <CompletionMessage
            percentage={percentage}
            isPassed={isPassed}
            kkm={kkm}
          />

          <CompletionActions
            canGoNextLevel={canGoNextLevel}
            currentLevel={levelNum}
            onNextLevel={handleNext}
            onShowReview={handleReview}
            onRestart={handleRestart}
          />
        </div>
      </div>
    </div>
  );
}
