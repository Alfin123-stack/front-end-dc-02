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

  // flag to prevent autosave / other effects from racing while we restore state
  const isRestoring = useRef(false);
  const hasFinished = useRef(false);

  /* ----------------- SET TIME PER LEVEL ----------------- */
  useEffect(() => {
    const levelTime = {
      1: 60,
      2: 75,
      3: 90,
    };

    dispatch(setTime(levelTime[currentLevel] || 30));
  }, [currentLevel, dispatch]);

  /* ================================================================
     LOAD QUIZ + RESTORE PROGRESS (LOCAL → BACKEND)
     - BLOCK autosave during restore using isRestoring ref
     - Ensure this effect only runs when tutorialId/userId/level change
  ================================================================ */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        isRestoring.current = true; // start restoring block

        const localKey = `quiz_progress:${userId}:${tutorialId}:${level}`;
        const hasLocal = !!localStorage.getItem(localKey);

        // 1. LOAD QUIZ (so normalizeQuiz etc. is ready)
        const quizRes = await dispatch(loadQuiz({ tutorialId, userId, level }));
        if (!mounted) return;

        if (quizRes.meta.requestStatus !== "fulfilled") {
          console.warn("loadQuiz failed:", quizRes.payload || quizRes.error);
          isRestoring.current = false;
          return;
        }

        // 2. IF LOCAL PROGRESS PRESENT -> LOAD IT
        if (hasLocal) {
          // loadProgress action is expected to read from localStorage (existing code)
          dispatch(loadProgress({ tutorialId, userId, level }));
          // give Redux a tick to apply loaded state
          await new Promise((r) => setTimeout(r, 0));
          if (!mounted) return;

          dispatch(startQuiz());
          isRestoring.current = false;
          return;
        }

        // 3. ELSE TRY BACKEND -> if exists, write to local and load
        const backend = await dispatch(
          loadProgressFromBackend({ tutorialId, userId, level })
        );

        if (!mounted) return;

        if (backend.meta.requestStatus === "fulfilled") {
          // backend handler probably saved progress to localStorage already
          dispatch(loadProgress({ tutorialId, userId, level }));
          // ensure state applied
          await new Promise((r) => setTimeout(r, 0));
        }

        // 4. START quiz (either fresh or restored)
        dispatch(startQuiz());
      } catch (err) {
        console.error("Error while loading quiz:", err);
      } finally {
        // small delay to ensure any immediate subscriber effects don't see restoring=true too long
        setTimeout(() => {
          isRestoring.current = false;
        }, 0);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [tutorialId, userId, level, dispatch]); // important dependencies

  /* ================================================================
     TIMER
  ================================================================ */
  useEffect(() => {
    if (!quizStarted) return;

    if (timeLeft <= 0) {
      dispatch(
        clearBackendQuiz({
          tutorialId,
          userId,
          level,
          cache: true,
          progress: true,
        })
      );

      handleFinishQuiz();
      return;
    }

    const interval = setInterval(() => dispatch(tick()), 1000);
    return () => clearInterval(interval);
  }, [quizStarted, timeLeft, dispatch, tutorialId, userId, level]);

  /* ================================================================
     AUTO-SAVE TO BACKEND (DEBOUNCE 300ms)
     - Guarded: do not auto-save while isRestoring
  ================================================================ */
  useEffect(() => {
    if (!quizStarted) return;
    if (isRestoring.current) return; // avoid racing when restoring

    const t = setTimeout(() => {
      // double-check guard in timeout in case isRestoring changed
      if (isRestoring.current) return;

      dispatch(
        saveProgressToBackend({
          tutorialId,
          userId,
          level,
          progress: {
            currentQuestion,
            userAnswers,
            submittedState,
            timeLeft,
          },
        })
      );
    }, 300);

    return () => clearTimeout(t);
    // include tutorialId/userId/level to ensure correct context
  }, [
    currentQuestion,
    userAnswers,
    submittedState,
    quizStarted,
    tutorialId,
    userId,
    level,
    timeLeft,
    dispatch,
  ]);

  /* ================================================================
     FINISH QUIZ
  ================================================================ */
  const handleFinishQuiz = () => {
    if (hasFinished.current) return;
    hasFinished.current = true;

    let raw = 0;

    (quizData || []).forEach((q, i) => {
      const user = userAnswers[i] || [];
      const correct = q.correctAnswers || [];

      if (["multiple_choice", "true_false"].includes(q.type)) {
        if (user[0] === correct[0]) raw += 1;
      } else if (q.type === "multiple_answer") {
        const benar = user.filter((v) => correct.includes(v)).length;
        const total = correct.length || 1;
        raw += benar / total;
      }
    });

    const final = Math.round((raw / (quizData.length || 1)) * 100);

    dispatch(setScore({ score: final, totalQuestions: quizData.length }));

    dispatch(
      saveHistory({
        tutorialId,
        quizData,
        userAnswers,
        score: final,
        level: currentLevel,
        totalQuestions: quizData.length,
      })
    );

    // Hapus semua progress
    dispatch(
      clearBackendQuiz({
        tutorialId,
        userId,
        level,
        cache: true,
        progress: true,
      })
    );
    dispatch(clearProgress({ tutorialId, userId, level }));

    navigate(
      `/completion/${currentLevel}?tutorial=${tutorialId}&user=${userId}`,
      { replace: true }
    );
  };

  /* ================================================================
     UI
  ================================================================ */
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
        // user interaction - safe to save immediately
        dispatch(answerQuestion(ans));
        // persist local (and let autosave push to backend)
        dispatch(saveProgress({ tutorialId, userId, level }));
      }}
      onSubmit={() => {
        dispatch(submitQuestion());
        dispatch(saveProgress({ tutorialId, userId, level }));
      }}
      onNext={() => {
        dispatch(nextQuestion());
        dispatch(saveProgress({ tutorialId, userId, level }));
      }}
      onFinish={handleFinishQuiz}
    />
  );
}
