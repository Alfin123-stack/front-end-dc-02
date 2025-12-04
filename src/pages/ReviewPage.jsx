// src/pages/ReviewPage.jsx
import React from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { resetQuiz, startQuiz } from "../store/quizSlice";
import ReviewScreen from "../components/screens/ReviewScreen";

export default function ReviewPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { level } = useParams();

  const currentLevel = Number(level);
  const query = new URLSearchParams(location.search);

  const tutorialId = Number(query.get("tutorial") || 1);
  const userId = Number(query.get("user") || 1);

  /* ------------------ Ambil dari Redux ------------------ */
  const { quizData, userAnswers, score, totalQuestions } = useSelector(
    (state) => state.quiz
  );

  /* ------------------ Handler tombol ------------------ */
  const handleRestart = () => {
    dispatch(resetQuiz());
    dispatch(startQuiz());
    navigate(`/quiz/${currentLevel}?tutorial=${tutorialId}&user=${userId}`, {
      replace: true,
    });
  };

  const handleBackToResult = () => {
    navigate(
      `/completion/${currentLevel}?tutorial=${tutorialId}&user=${userId}`,
      { replace: true }
    );
  };

  const handleGoHome = () => {
    navigate("/");
  };

  if (!quizData.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Tidak ada data untuk direview
      </div>
    );
  }

  /* ------------------ Screen ------------------ */
  return (
    <ReviewScreen
      data={{
        quizData,
        userAnswers,
        score,
        totalQuestions,
      }}
      onRestart={handleRestart}
      onBackToResult={handleBackToResult}
      onGoHome={handleGoHome}
    />
  );
}
