// src/pages/QuizPage.jsx
<<<<<<< HEAD
import React, { useEffect } from "react";
=======
import React, { useEffect, useRef } from "react";
>>>>>>> 66c974b (adding history screen)
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
<<<<<<< HEAD
=======
  resetQuiz,
  saveHistory,
>>>>>>> 66c974b (adding history screen)
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

<<<<<<< HEAD
  /* ------------------ SET WAKTU BERDASARKAN LEVEL ------------------ */
  useEffect(() => {
    // Timer di-set hanya pertama kali sebelum loadProgress jalan
    const levelTime = {
      1: 60,
      2: 90,
      3: 120,
    };

    dispatch(setTime(levelTime[currentLevel] || 30));
  }, [currentLevel, dispatch]);

  /* ---------------------- LOAD QUIZ (LOCALCACHE / SESSION / API) ------------------------ */
=======
  // FLAG FINISH QUIZ
  const hasFinished = useRef(false);

  /* -------------------------------------------------------
     0. RESET QUIZ KETIKA MASUK HALAMAN
     → Biar state lama tidak nempel waktu klik ulangi quiz
  -------------------------------------------------------- */
  useEffect(() => {
    dispatch(resetQuiz());
    hasFinished.current = false; // reset flag juga
  }, [dispatch]);

  /* -------------------------------------------------------
     1. SET TIME BY LEVEL
  -------------------------------------------------------- */
  useEffect(() => {
    const levelTime = { 1: 60, 2: 90, 3: 120 };
    dispatch(setTime(levelTime[currentLevel] || 30));
  }, [currentLevel, dispatch]);

  /* -------------------------------------------------------
     2. LOAD QUIZ
  -------------------------------------------------------- */
>>>>>>> 66c974b (adding history screen)
  useEffect(() => {
    dispatch(loadQuiz({ tutorialId }));
  }, [tutorialId, dispatch]);

<<<<<<< HEAD
  /* ---------------------- LOAD PROGRESS USER ------------------------ */
  useEffect(() => {
    // progress hanya bisa diload setelah quizData ready
    if (quizData.length > 0) {
      dispatch(loadProgress({ tutorialId, userId }));
    }
  }, [quizData, tutorialId, userId, dispatch]);

  /* ------------------ AUTO START QUIZ ------------------ */
=======
  /* -------------------------------------------------------
     3. LOAD PROGRESS (HANYA SETELAH QUIZ READY)
  -------------------------------------------------------- */
  useEffect(() => {
    if (quizData.length > 0) {
      dispatch(loadProgress({ tutorialId, userId }));
    }
  }, [quizData.length, tutorialId, userId, dispatch]);

  /* -------------------------------------------------------
     4. AUTO START QUIZ
  -------------------------------------------------------- */
>>>>>>> 66c974b (adding history screen)
  useEffect(() => {
    if (!quizStarted && quizData.length > 0) {
      dispatch(startQuiz());
    }
<<<<<<< HEAD
  }, [quizStarted, quizData, dispatch]);

  /* ---------------------- TIMER ------------------------ */
  useEffect(() => {
    if (!quizStarted) return;

=======
  }, [quizStarted, quizData.length, dispatch]);

  /* -------------------------------------------------------
     5. TIMER
  -------------------------------------------------------- */
  useEffect(() => {
    if (!quizStarted) return;

    // waktu habis → panggil finish
>>>>>>> 66c974b (adding history screen)
    if (timeLeft <= 0) {
      handleFinishQuiz();
      return;
    }

    const timer = setInterval(() => dispatch(tick()), 1000);
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft, dispatch]);

<<<<<<< HEAD
  /* ---------------------- FINISH QUIZ ---------------------- */
  const handleFinishQuiz = () => {
=======
  /* -------------------------------------------------------
     6. FINISH QUIZ – AMAN TANPA DOUBLE TRIGGER
  -------------------------------------------------------- */
  const handleFinishQuiz = () => {
    if (hasFinished.current) return;
    hasFinished.current = true;

>>>>>>> 66c974b (adding history screen)
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

<<<<<<< HEAD
    dispatch(
      setScore({
        score: Math.round(score),
=======
    const finalScore = Math.round(score);

    dispatch(
      setScore({
        score: finalScore,
>>>>>>> 66c974b (adding history screen)
        totalQuestions: quizData.length,
      })
    );

<<<<<<< HEAD
    // Hapus progress + hapus quiz cache localStorage
=======
    // 🟩🟩🟩 SIMPAN HISTORY DI SINI 🟩🟩🟩
    dispatch(
      saveHistory({
        tutorialId,
        quizData,
        userAnswers,
        score: finalScore,
        totalQuestions: quizData.length,
      })
    );

    // hapus progress
>>>>>>> 66c974b (adding history screen)
    dispatch(clearProgress({ tutorialId, userId }));

    navigate(
      `/completion/${currentLevel}?tutorial=${tutorialId}&user=${userId}`,
      { replace: true }
    );
  };

<<<<<<< HEAD
  /* ---------------------- LOADING ------------------------- */
=======
  /* LOADING */
>>>>>>> 66c974b (adding history screen)
  if (isLoading) return <LoadingScreen />;

  if (!quizData.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Soal tidak tersedia
      </div>
    );
  }

<<<<<<< HEAD
  /* ---------------------- QUIZ SCREEN --------------------- */
=======
>>>>>>> 66c974b (adding history screen)
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
