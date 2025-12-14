import React from "react";

import QuizScreen from "../components/screens/QuizScreen";
import LoadingScreen from "../components/LoadingScreen";
import { useQuizEngine } from "../hooks/useQuizEngine";

export default function QuizPage() {
  const {
    quizData,
    tutorial,
    userAnswers,
    timeLeft,
    currentQuestion,
    submittedState,
    handleAnswer,
    handleSubmit,
    handleNext,
    handleFinish,
    isLoading,
    error,
    navigate,
  } = useQuizEngine();

  /* ==========================================================
     RENDER
  ========================================================== */
  if (isLoading) return <LoadingScreen />;

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Terjadi kesalahan: {String(error)}
      </div>
    );

  if (!quizData || quizData.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Soal tidak tersedia
      </div>
    );

  console.log("Rendering QuizScreen with data:", timeLeft);

  return (
    <QuizScreen
      data={{
        quizData,
        tutorial,
        userAnswers,
        timeLeft,
        currentQuestion,
        submittedState,
      }}
      onAnswer={handleAnswer}
      onSubmit={handleSubmit}
      onNext={handleNext}
      onFinish={handleFinish}
      onGoHome={() => navigate("/")}
    />
  );
}
