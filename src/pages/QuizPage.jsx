// src/pages/QuizPage.jsx
import React, { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  loadQuiz,
  startQuiz,
  tick,
  answerQuestion,
  nextQuestion,
  setTime,
  setScore,
} from "../store/quizSlice";

import LoadingScreen from "./quiz/LoadingScreen";
import StartQuizCard from "./quiz/StartQuizCard";
import QuizScreen from "../components/screens/QuizScreen";

export default function QuizPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { level } = useParams();

  const currentLevel = Number(level);
  const query = new URLSearchParams(location.search);
  const tutorialId = Number(query.get("tutorial") || 1);
  const user = Number(query.get("user") || 1);

  const {
    isLoading,
    quizData,
    tutorial,
    meta,
    userAnswers,
    quizStarted,
    timeLeft,
    currentQuestion,
    error,
  } = useSelector((state) => state.quiz);

  /* ---------------------- SET TIMER BASED ON LEVEL ---------------------- */
  useEffect(() => {
    const levelTime = { 1: 60, 2: 90, 3: 120 };
    dispatch(setTime(levelTime[currentLevel] || 30));
  }, [currentLevel, dispatch]);

  /* ------------------------------ LOAD QUIZ ------------------------------ */
  useEffect(() => {
    dispatch(loadQuiz({ tutorialId }));
  }, [tutorialId, dispatch]);

  /* ------------------------------ TIMER TICK ----------------------------- */
  useEffect(() => {
    if (!quizStarted) return;

    if (timeLeft <= 0) {
      handleFinishQuiz();
      return;
    }

    const timer = setInterval(() => dispatch(tick()), 1000);
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft, dispatch]);

  /* ----------------------------- FINISH QUIZ ----------------------------- */
  const handleFinishQuiz = () => {
    if (!quizData.length) return;

    let score = 0;

    quizData.forEach((q, i) => {
      const user = userAnswers[i] || [];
      const correct = q.correctAnswers || [];

      if (["multiple_choice", "true_false"].includes(q.type)) {
        if (user[0] === correct[0]) score++;
      } else if (q.type === "multiple_answer") {
        if (correct.length > 0) {
          score +=
            user.filter((a) => correct.includes(a)).length / correct.length;
        }
      }
    });

    dispatch(
      setScore({
        score: Math.round(score),
        totalQuestions: quizData.length,
      })
    );

    navigate(
      `/completion/${currentLevel}?tutorial=${tutorialId}&user=${user}`,
      { replace: true }
    );
  };

  /* ------------------------------ LOADING UI ----------------------------- */
  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !quizData.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-900/20 p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-700 dark:text-red-300">
            Soal tidak tersedia
          </h2>
          <p className="text-red-600 dark:text-red-400">
            Silakan coba lagi nanti.
          </p>
        </div>
      </div>
    );
  }

  /* ------------------------------ MAIN UI ------------------------------- */
  return (
    <div
      className="
        min-h-screen w-full flex justify-center 
        items-start p-4 sm:p-6 md:p-8
        bg-gray-100 dark:bg-[#0B0F19]
        transition-colors
      ">
      <div className="w-full max-w-4xl">
        {!quizStarted ? (
          <StartQuizCard
            meta={meta}
            data={{
              quizData,
              tutorial,
              userAnswers,
              timeLeft,
              currentQuestion,
            }}
            level={currentLevel}
            onStart={() => dispatch(startQuiz())}
          />
        ) : (
          <QuizScreen
            data={{
              quizData,
              tutorial,
              userAnswers,
              timeLeft,
              currentQuestion,
            }}
            onGoHome={() => navigate("/")}
            onAnswer={(ans) => dispatch(answerQuestion(ans))}
            onNext={() => dispatch(nextQuestion())}
            onFinish={handleFinishQuiz}
          />
        )}
      </div>
    </div>
  );
}
