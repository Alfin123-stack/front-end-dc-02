// src/pages/QuizPage.jsx
import React, { useEffect, useRef } from "react";
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
  saveProgress,
  loadProgress,
  clearProgress,
  resetQuiz,
  saveHistory,
} from "../store/quizSlice";

import QuizScreen from "../components/screens/QuizScreen";
import LoadingScreen from "./quiz/LoadingScreen";

export default function QuizPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { level } = useParams();

  const currentLevel = Number(level);
  const query = new URLSearchParams(location.search);
  const tutorialId = Number(query.get("tutorial") || 1);
  const userId = Number(query.get("user") || 1);

  const {
    isLoading,
    quizData,
    tutorial,
    userAnswers,
    quizStarted,
    timeLeft,
    currentQuestion,
  } = useSelector((state) => state.quiz);

  // Anti double-finish
  const hasFinished = useRef(false);

  /* ----------------- RESET STATE SAAT MASUK ----------------- */
  useEffect(() => {
    dispatch(resetQuiz());
    hasFinished.current = false;
  }, [dispatch]);

  /* ----------------- SET TIME PER LEVEL ----------------- */
  useEffect(() => {
    const levelTime = { 1: 60, 2: 90, 3: 120 };
    dispatch(setTime(levelTime[currentLevel] || 30));
  }, [currentLevel, dispatch]);

  /* ----------------- LOAD DATA QUIZ ----------------- */
  useEffect(() => {
    dispatch(loadQuiz({ tutorialId }));
  }, [tutorialId, dispatch]);

  /* ----------------- LOAD PROGRESS JIKA QUIZ READY ----------------- */
  useEffect(() => {
    if (quizData.length > 0) {
      dispatch(loadProgress({ tutorialId, userId }));
    }
  }, [quizData.length, tutorialId, userId, dispatch]);

  /* ----------------- AUTO START ----------------- */
  useEffect(() => {
    if (!quizStarted && quizData.length > 0) {
      dispatch(startQuiz());
    }
  }, [quizStarted, quizData.length, dispatch]);

  /* ----------------- TIMER ----------------- */
  useEffect(() => {
    if (!quizStarted) return;

    if (timeLeft <= 0) {
      handleFinishQuiz();
      return;
    }

    const timer = setInterval(() => dispatch(tick()), 1000);
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft, dispatch]);

  /* ----------------- FINISH QUIZ ----------------- */
  const handleFinishQuiz = () => {
    if (hasFinished.current) return;
    hasFinished.current = true;

    let score = 0;
    quizData.forEach((q, i) => {
      const userAns = userAnswers[i] || [];
      const correct = q.correctAnswers || [];

      if (["multiple_choice", "true_false"].includes(q.type)) {
        if (userAns[0] === correct[0]) score++;
      } else if (q.type === "multiple_answer") {
        const benar = userAns.filter((v) => correct.includes(v)).length;
        const totalBenar = correct.length;
        score += benar / totalBenar;
      }
    });

    const finalScore = Math.round(score);

    dispatch(setScore({ score: finalScore, totalQuestions: quizData.length }));

    dispatch(
      saveHistory({
        tutorialId,
        quizData,
        userAnswers,
        score: finalScore,
        totalQuestions: quizData.length,
      })
    );

    dispatch(clearProgress({ tutorialId, userId }));

    navigate(
      `/completion/${currentLevel}?tutorial=${tutorialId}&user=${userId}`,
      {
        replace: true,
      }
    );
  };

  /* ----------------- LOADING ----------------- */
  if (isLoading) return <LoadingScreen />;

  if (!quizData.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Soal tidak tersedia
      </div>
    );
  }

  return (
    <QuizScreen
      data={{
        quizData,
        tutorial,
        userAnswers,
        timeLeft,
        currentQuestion,
      }}
      onGoHome={() => navigate("/")}
      onAnswer={(ans) => {
        dispatch(answerQuestion(ans));
        dispatch(saveProgress({ tutorialId, userId }));
      }}
      onNext={() => {
        dispatch(nextQuestion());
        dispatch(saveProgress({ tutorialId, userId }));
      }}
      onFinish={handleFinishQuiz}
    />
  );
}
