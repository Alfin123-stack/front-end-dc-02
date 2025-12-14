// hooks/useQuizEngine.js
import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

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

import { loadLocalProgress } from "../store/quiz/quizUtils";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getTimeByLevel } from "../utils/helper";
import { loadQuiz } from "../store/quiz/thunks/quizThunks";
import {
  clearBackendQuiz,
  loadProgressFromBackend,
  saveProgressToBackend,
  saveQuizHistory,
} from "../store/quiz/thunks/quizCacheThunks";

export function useQuizEngine() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const currentLevel = Number(useParams().level);
  console.log("level", currentLevel);

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
  } = useSelector((s) => s.quiz);

  // Flags control
  const restoring = useRef(true);
  const autosaveReady = useRef(false);
  const finishing = useRef(false);
  const autosaveInterval = useRef(null);
  const mounted = useRef(true);

  const pendingSave = useRef(null);
  const saveTimer = useRef(null);
  const saving = useRef(false);
  const lastState = useRef("");

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      restoring.current = true;
      autosaveReady.current = false;

      try {
        await dispatch(
          loadQuiz({ tutorialId, userId, level: currentLevel })
        ).unwrap();
      } catch (err) {
        console.warn("⚠️ Load quiz failed:", err);
      }

      if (!mounted.current || !active) return;

      // 1️⃣ RESTORE LOCAL
      const local = loadLocalProgress(userId, tutorialId, currentLevel);

      if (local) {
        dispatch(loadProgress({ tutorialId, userId, level: currentLevel }));
      } else {
        // 2️⃣ RESTORE BACKEND
        try {
          const res = await dispatch(
            loadProgressFromBackend({
              tutorialId,
              userId,
              level: currentLevel,
            })
          );

          if (
            res?.meta?.requestStatus === "fulfilled" &&
            mounted.current &&
            active
          ) {
            dispatch(loadProgress({ tutorialId, userId, level: currentLevel }));
          }
        } catch (err) {
          console.warn("⚠️ Load progress failed:", err);
        }
      }

      dispatch(setTime(getTimeByLevel(currentLevel)));
      console.log("Set time for level", currentLevel);

      if (mounted.current && active) {
        dispatch(startQuiz());
      }

      restoring.current = false;
      autosaveReady.current = true;
    })();

    return () => {
      active = false;
    };
  }, [tutorialId, userId, currentLevel, dispatch]);

  useEffect(() => {
    if (!quizStarted) return;
    if (!autosaveReady.current) return;

    const snapshot = {
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
        progress: snapshot,
      })
    );
  }, [quizStarted]);

  /* ==========================================================
     TIMER
  ========================================================== */
  useEffect(() => {
    if (!quizStarted) return;

    const interval = setInterval(() => {
      dispatch(tick());
    }, 1000);

    return () => clearInterval(interval);
  }, [quizStarted, dispatch]);

  /* ==========================================================
     AUTOSAVE (DEBOUNCE)
  ========================================================== */
  const queueAutosave = useCallback(() => {
    if (!autosaveReady.current) return;
    if (restoring.current) return;

    const key = JSON.stringify({
      currentQuestion,
      userAnswers,
      submittedState,
      timeLeft,
    });

    if (lastState.current === key) return;
    lastState.current = key;

    pendingSave.current = {
      currentQuestion,
      userAnswers,
      submittedState,
      timeLeft,
      updatedAt: new Date().toISOString(),
    };
  }, [currentQuestion, userAnswers, submittedState, timeLeft]);

  useEffect(() => {
    if (!quizStarted) return;
    queueAutosave();
  }, [currentQuestion, userAnswers, submittedState, timeLeft, queueAutosave]);

  useEffect(() => {
    if (!quizStarted) return;

    autosaveInterval.current = setInterval(async () => {
      if (!autosaveReady.current) return;
      if (!pendingSave.current) return;
      if (saving.current) return;

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

        pendingSave.current = null;
      } catch (err) {
        console.warn("⚠️ Autosave failed:", err);
      }

      saving.current = false;
    }, 3000);

    return () => clearInterval(autosaveInterval.current);
  }, [quizStarted, tutorialId, userId, currentLevel, dispatch]);

  const handleFinish = useCallback(async () => {
    if (finishing.current) return;
    finishing.current = true;

    autosaveReady.current = false;
    restoring.current = true;

    if (saveTimer.current) clearTimeout(saveTimer.current);

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
      } catch (err) {
        console.warn("⚠️ Final save failed:", err);
      }
      saving.current = false;
      pendingSave.current = null;
    }

    // Score calculation
    let raw = 0;
    quizData.forEach((q, i) => {
      const u = userAnswers[i] || [];
      const c = q.correctAnswers || [];

      if (q.type === "multiple_choice" || q.type === "true_false") {
        if (u[0] === c[0]) raw++;
      } else if (q.type === "multiple_answer") {
        const benar = u.filter((v) => c.includes(v)).length;
        raw += benar / (c.length || 1);
      }
    });

    const finalScore = Math.round((raw / quizData.length) * 100);

    dispatch(setScore({ score: finalScore, totalQuestions: quizData.length }));

    // ✅ SIMPAN KE REDIS (BACKEND)
    try {
      await dispatch(
        saveQuizHistory({
          tutorialId,
          quizData,
          userAnswers,
          score: finalScore,
          level: currentLevel,
          totalQuestions: quizData.length,
        })
      ).unwrap();
    } catch (err) {
      console.warn("⚠️ Save history failed:", err);
    }

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
      console.warn("⚠️ Clear backend quiz failed:", err);
    }

    localStorage.removeItem(
      `quiz_progress:${userId}:${tutorialId}:${currentLevel}`
    );

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
   TIMEOUT HANDLER (TIME LEFT <= 0)
========================================================== */
  useEffect(() => {
    if (!quizStarted) return;
    if (timeLeft > 0) return;

    console.warn("⏱️ TIME OVER → auto finish");

    handleFinish();
  }, [timeLeft, quizStarted, handleFinish]);

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

  return {
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
  };
}
