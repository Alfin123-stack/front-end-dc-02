"use client";

import React from "react";
import { useSelector } from "react-redux";
import { selectSettings } from "../../store/settingsSlice";
import { selectScore } from "../../store/quizSlice";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import CompletionActions from "./completion/CompletionActions";
import CompletionMessage from "./completion/CompletionMessage";
import ScoreCard from "./completion/ScoreCard";

export default function CompletionScreen() {
  const navigate = useNavigate();
  const { level } = useParams();
  const location = useLocation();

  const query = new URLSearchParams(location.search);

  const levelNum = Number(level || 1);
  const tutorialId = Number(query.get("tutorial") || 1);
  const user = query.get("user") || ""; // ← tambahan

  const settings = useSelector(selectSettings);
  const { score, totalQuestions } = useSelector((state) =>
    selectScore(state, tutorialId)
  );

  const percentage = Math.round((score / totalQuestions) * 100);
  const kkm = 60;
  const isPassed = percentage >= kkm;
  const canGoNextLevel = isPassed && levelNum < 3;

  return (
    <div
      className={`
        min-h-screen flex items-center justify-center p-4 md:p-6 lg:p-10 
        transition-colors duration-500
        ${
          settings.theme === "dark"
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
            : "bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100 text-gray-900"
        }
      `}>
      <div className="w-full max-w-xl md:max-w-2xl relative z-20">
        <div
          className="
            relative rounded-3xl p-6 md:p-8 lg:p-10 
            border shadow-2xl overflow-hidden
            bg-white/80 dark:bg-gray-900/70 backdrop-blur-xl
            border-white/40 dark:border-gray-800
            transition-all duration-500
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
            onNextLevel={() =>
              navigate(
                `/quiz/${levelNum + 1}?tutorial=${tutorialId}&user=${user}`
              )
            }
            onShowReview={() =>
              navigate(
                `/review/${levelNum}?tutorial=${tutorialId}&user=${user}`
              )
            }
            onRestart={() =>
              navigate(`/quiz/${levelNum}?tutorial=${tutorialId}&user=${user}`)
            }
            onGoHome={navigate(`/?tutorial=${tutorialId}&user=${user}`)}
          />
        </div>
      </div>
    </div>
  );
}
