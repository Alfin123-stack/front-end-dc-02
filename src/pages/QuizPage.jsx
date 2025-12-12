import React, { useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import QuizScreen from "../components/screens/QuizScreen";
import LoadingScreen from "../components/LoadingScreen";

import {
  answerQuestion,
  clearProgress,
  loadProgress,
  nextQuestion,
  saveHistory,
  saveProgress,
  setScore,
  setTime,
  startQuiz,
  submitQuestion,
  tick,
} from "../store/quiz/quizSlice";

import {
  clearBackendQuiz,
  loadProgressFromBackend,
  loadQuiz,
  saveProgressToBackend,
} from "../store/quiz/quizThunks";

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

  // Redux state
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
  } = useSelector((s) => s.quiz);

  // Flags
  const restoring = useRef(true);
  const autosaveReady = useRef(false);
  const finishing = useRef(false);
  const mounted = useRef(true);

  const LS_KEY = `quiz_progress:${userId}:${tutorialId}:${currentLevel}`;

  // Autosave internals
  const pendingSave = useRef(null);
  const saveTimer = useRef(null);
  const saving = useRef(false);
  const lastState = useRef("");

  /* ==========================================================
     SET TIME AWAL
  ========================================================== */
  useEffect(() => {
    if (quizStarted) return;
    if (!restoring.current) return;

    const t = { 1: 60, 2: 75, 3: 90 };
    dispatch(setTime(t[currentLevel] || 30));
  }, [currentLevel, quizStarted]);

  /* ==========================================================
     FINISH QUIZ
  ========================================================== */
  const handleFinish = useCallback(async () => {
    if (finishing.current) return;
    finishing.current = true;

    // MATIKAN AUTOSAVE SEPENUHNYA
    autosaveReady.current = false;
    restoring.current = true;

    if (saveTimer.current) clearTimeout(saveTimer.current);

    // Flush autosave terakhir
    if (pendingSave.current && !saving.current) {
      saving.current = true;
      try {
        await dispatch(
          saveProgressToBackend({
            tutorialId,
            userId,
            level: currentLevel,
            progress: pendingSave.current,
          })
        ).unwrap();
      } catch (_) {}
      saving.current = false;
      pendingSave.current = null;
    }

    // Hitung score
    let raw = 0;
    quizData.forEach((q, i) => {
      const u = userAnswers[i] || [];
      const c = q.correctAnswers || [];

      if (q.type === "multiple_choice" || q.type === "true_false") {
        if (u[0] === c[0]) raw++;
      } else if (q.type === "multiple_answer") {
        const benar = u.filter((v) => c.includes(v)).length;
        const total = c.length || 1;
        raw += benar / total;
      }
    });

    const final = Math.round((raw / quizData.length) * 100);

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

    // CLEAR BACKEND CACHE & PROGRESS
    try {
      await dispatch(
        clearBackendQuiz({
          tutorialId,
          userId,
          level: currentLevel,
          cache: true,
          progress: true,
        })
      ).unwrap();
    } catch (err) {
      console.error("Failed clear backend:", err);
    }

    // CLEAR LOCAL PROGRESS
    dispatch(clearProgress({ tutorialId, userId, level: currentLevel }));
    localStorage.removeItem(LS_KEY);

    // 🔥 FIX PALING PENTING:
    // HAPUS SEMUA REDUX STATE AGAR AUTOSAVE TIDAK BANGKIT LAGI


    // NAVIGATE
    navigate(
      `/completion/${currentLevel}?tutorial=${tutorialId}&user=${userId}`,
      { replace: true }
    );
  }, [
    tutorialId,
    userId,
    currentLevel,
    quizData,
    userAnswers,
    dispatch,
    navigate,
  ]);

  /* ==========================================================
     RESTORE (LOCAL → BACKEND)
  ========================================================== */
  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);

  useEffect(() => {
    (async () => {
      restoring.current = true;
      autosaveReady.current = false;

      // Load Questions
      try {
        await dispatch(
          loadQuiz({ tutorialId, userId, level: currentLevel })
        ).unwrap();
      } catch (_) {}

      if (!mounted.current) return;

      // RESTORE LOCAL
      const local = localStorage.getItem(LS_KEY);
      if (local) {
        dispatch(loadProgress({ tutorialId, userId, level: currentLevel }));
        dispatch(startQuiz());

        restoring.current = false;
        autosaveReady.current = true;
        return;
      }

      // RESTORE BACKEND
      try {
        const res = await dispatch(
          loadProgressFromBackend({
            tutorialId,
            userId,
            level: currentLevel,
          })
        );

        if (res?.meta?.requestStatus === "fulfilled") {
          dispatch(loadProgress({ tutorialId, userId, level: currentLevel }));
        }
      } catch (_) {}

      dispatch(startQuiz());
      restoring.current = false;
      autosaveReady.current = true;
    })();
  }, [tutorialId, userId, currentLevel]);

  /* ==========================================================
     INITIAL SAVE (AWAL QUIZ MASUK)
  ========================================================== */
  useEffect(() => {
    if (!quizStarted) return;
    if (!autosaveReady.current) return;

    const snap = {
      currentQuestion,
      userAnswers,
      submittedState,
      timeLeft,
      updatedAt: new Date().toISOString(),
    };

    dispatch(saveProgress({ tutorialId, userId, level: currentLevel }));

    dispatch(
      saveProgressToBackend({
        tutorialId,
        userId,
        level: currentLevel,
        progress: snap,
      })
    );
  }, [
    quizStarted,
    autosaveReady.current,
    currentQuestion,
    userAnswers,
    submittedState,
    timeLeft,
  ]);

  /* ==========================================================
     TIMER
  ========================================================== */
  useEffect(() => {
    if (!quizStarted) return;
    if (restoring.current) return;
    if (timeLeft == null) return;

    if (timeLeft <= 0) {
      handleFinish();
      return;
    }

    const i = setInterval(() => dispatch(tick()), 1000);
    return () => clearInterval(i);
  }, [quizStarted, timeLeft]);

  /* ==========================================================
     AUTOSAVE (DEBOUNCE)
  ========================================================== */
  const queueAutosave = useCallback(() => {
    if (!autosaveReady.current) return;
    if (restoring.current) return;

    const snapshot = {
      currentQuestion,
      userAnswers,
      submittedState,
      timeLeft,
      updatedAt: new Date().toISOString(),
    };

    const key = JSON.stringify({
      currentQuestion,
      userAnswers,
      submittedState,
    });
    if (lastState.current === key) return;
    lastState.current = key;

    pendingSave.current = snapshot;

    if (saveTimer.current) clearTimeout(saveTimer.current);

    saveTimer.current = setTimeout(async () => {
      saveTimer.current = null;
      if (!pendingSave.current || saving.current) return;

      saving.current = true;
      try {
        await dispatch(
          saveProgressToBackend({
            tutorialId,
            userId,
            level: currentLevel,
            progress: pendingSave.current,
          })
        );
        pendingSave.current = null;
      } catch (_) {}
      saving.current = false;
    }, 250);
  }, [
    currentQuestion,
    userAnswers,
    submittedState,
    timeLeft,
    tutorialId,
    userId,
    currentLevel,
  ]);

  useEffect(() => {
    if (!quizStarted) return;
    queueAutosave();
  }, [currentQuestion, userAnswers, submittedState]);

  /* ==========================================================
     HANDLERS
  ========================================================== */
  const handleAnswer = (v) => {
    dispatch(answerQuestion(v));
    dispatch(saveProgress({ tutorialId, userId, level: currentLevel }));
    queueAutosave();
  };

  const handleSubmit = () => {
    dispatch(submitQuestion());
    dispatch(saveProgress({ tutorialId, userId, level: currentLevel }));
    queueAutosave();
  };

  const handleNext = () => {
    dispatch(nextQuestion());
    dispatch(saveProgress({ tutorialId, userId, level: currentLevel }));
    queueAutosave();
  };

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
