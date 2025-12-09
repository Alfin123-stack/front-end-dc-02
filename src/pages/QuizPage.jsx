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
  saveHistory,
  submitQuestion,
  loadProgressFromBackend,
  saveProgressToBackend,
  clearBackendQuiz,
} from "../store/quizSlice";

import QuizScreen from "../components/screens/QuizScreen";
import LoadingScreen from "./quiz/LoadingScreen";

export default function QuizPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { level } = useParams();
  const currentLevel = Number(level);

  const tutorialId = Number(
    new URLSearchParams(location.search).get("tutorial") || 1
  );
  const userId = Number(new URLSearchParams(location.search).get("user") || 1);

  const {
    isLoading,
    quizData,
    tutorial,
    userAnswers,
    quizStarted,
    timeLeft,
    currentQuestion,
    submittedState,
    error,
  } = useSelector((state) => state.quiz);

  const hasFinished = useRef(false);

  /* ----------------- SET TIME PER LEVEL ----------------- */
  useEffect(() => {
    const levelTime = { 1: 60, 2: 90, 3: 120 };
    dispatch(setTime(levelTime[currentLevel] || 30));
  }, [currentLevel, dispatch]);

  /* ==========================================================
     LOAD QUIZ + LOAD PROGRESS (LOCAL + BACKEND)
  ========================================================== */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const localProgressKey = `quiz_progress_${tutorialId}_${userId}`;
        const hasLocalProgress = Boolean(
          localStorage.getItem(localProgressKey)
        );

        // 1. LOAD QUIZ
        const res = await dispatch(
          loadQuiz({ tutorialId, userId, force: false })
        );

        if (!mounted) return;

        if (res.meta.requestStatus !== "fulfilled") {
          console.warn("loadQuiz failed:", res.payload || res.error);
          return;
        }

        // 2. LOAD PROGRESS LOCAL (JIKA ADA)
        if (hasLocalProgress) {
          dispatch(loadProgress({ tutorialId, userId }));
        } else {
          // 3. LOAD PROGRESS BACKEND (HANYA JIKA LOCAL TIDAK ADA)
          const backendProgress = await dispatch(
            loadProgressFromBackend({ tutorialId, userId })
          );

          if (backendProgress.meta.requestStatus === "fulfilled") {
            // Jika dapat progress backend, apply ke local agar konsisten
            dispatch(loadProgress({ tutorialId, userId }));
          }
        }

        // 4. Mulai quiz
        dispatch(startQuiz());
      } catch (err) {
        console.error("Error while loading quiz:", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [tutorialId, userId, dispatch]);

  /* ==========================================================
     TIMER
  ========================================================== */
  useEffect(() => {
    if (!quizStarted) return;

    if (timeLeft <= 0) {
      handleFinishQuiz();
      return;
    }

    const interval = setInterval(() => dispatch(tick()), 1000);
    return () => clearInterval(interval);
  }, [quizStarted, timeLeft, dispatch]);

  /* ==========================================================
     FINISH QUIZ
  ========================================================== */
  const handleFinishQuiz = () => {
    if (hasFinished.current) return;
    hasFinished.current = true;

    let rawScore = 0;

    (quizData || []).forEach((q, i) => {
      const userAns = userAnswers[i] || [];
      const correct = q.correctAnswers || [];

      if (["multiple_choice", "true_false"].includes(q.type)) {
        if (userAns[0] === correct[0]) rawScore += 1;
      } else if (q.type === "multiple_answer") {
        const benar = userAns.filter((v) => correct.includes(v)).length;
        const totalBenar = correct.length || 1;
        rawScore += benar / totalBenar;
      }
    });

    const finalScore = Math.round((rawScore / (quizData.length || 1)) * 100);

    dispatch(setScore({ score: finalScore, totalQuestions: quizData.length }));

    dispatch(
      saveHistory({
        tutorialId,
        quizData,
        userAnswers,
        score: finalScore,
        level: currentLevel,
        totalQuestions: quizData.length,
      })
    );

    dispatch(clearBackendQuiz({ tutorialId, userId }));

    // CLEAR LOCAL PROGRESS + QUIZ CACHE
    dispatch(clearProgress({ tutorialId, userId }));

    // NAVIGATE
    navigate(
      `/completion/${currentLevel}?tutorial=${tutorialId}&user=${userId}`,
      { replace: true }
    );
  };

  /* ==========================================================
     UI RENDER STATE
  ========================================================== */
  if (isLoading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Terjadi kesalahan: {String(error)}
      </div>
    );
  }

  if (!quizData || quizData.length === 0) {
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
        submittedState,
      }}
      onGoHome={() => navigate("/")}
      onAnswer={(ans) => {
        dispatch(answerQuestion(ans));
        dispatch(saveProgress({ tutorialId, userId }));
        dispatch(
          saveProgressToBackend({
            tutorialId,
            userId,
            progress: {
              currentQuestion,
              userAnswers,
              submittedState,
              timeLeft,
            },
          })
        );
      }}
      onSubmit={() => {
        dispatch(submitQuestion());
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
