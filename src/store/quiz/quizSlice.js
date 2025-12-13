import { createSelector, createSlice } from "@reduxjs/toolkit";
import {
  loadLocalProgress,
  saveLocalProgress,
  deleteLocalProgress,
} from "./quizUtils";

import { initialState } from "./quizInitial";
import {
  loadProgressFromBackend,
  loadQuiz,
  loadTutorialHeading,
} from "./quizThunks";

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    tick(state) {
      state.timeLeft -= 1;
    },

    setTime(state, action) {
      console.log("SET TIME PAYLOAD", action.payload);
      state.timeLeft = action.payload;
    },

    startQuiz(state) {
      state.quizStarted = true;
    },

    /* -----------------------------------------------------
       RESET QUIZ (SOFT RESET SAAT USER RESTART)
    ------------------------------------------------------*/
    resetQuiz(state) {
      state.quizStarted = false;
      state.currentQuestion = 0;
      state.timeLeft = 30;
      state.userAnswers = [];
      state.submittedState = {};
      state.score = 0;
      // totalQuestions tidak perlu direset
    },

    /* -----------------------------------------------------
       INVALIDATE QUIZ (CLEAR STATE LENGKAP)
    ------------------------------------------------------*/
    invalidateQuiz() {
      return {
        ...initialState,
        isLoading: false,
      };
    },

    /* -----------------------------------------------------
       JAWABAN USER
    ------------------------------------------------------*/
    answerQuestion(state, action) {
      state.userAnswers[state.currentQuestion] = action.payload;
    },

    submitQuestion(state) {
      state.submittedState[state.currentQuestion] = true;
    },

    nextQuestion(state) {
      if (state.currentQuestion < state.quizData.length - 1) {
        state.currentQuestion++;
      }
    },

    setScore(state, action) {
      state.score = action.payload.score;
      state.totalQuestions = action.payload.totalQuestions;
    },

    /* -----------------------------------------------------
       PROGRESS: SAVE (LOCAL)
    ------------------------------------------------------*/
    saveProgress(state, action) {
      const { tutorialId, userId, level } = action.payload;

      const snapshot = {
        currentQuestion: state.currentQuestion,
        userAnswers: state.userAnswers,
        submittedState: state.submittedState,
        timeLeft: state.timeLeft,
      };

      saveLocalProgress(userId, tutorialId, level, snapshot);
    },

    /* -----------------------------------------------------
       PROGRESS: LOAD (LOCAL)
    ------------------------------------------------------*/
    loadProgress(state, action) {
      if (!state.quizLoaded) return; // FIX race condition

      const { tutorialId, userId, level } = action.payload;
      const data = loadLocalProgress(userId, tutorialId, level);

      if (!data) return;

      Object.assign(state, {
        currentQuestion: data.currentQuestion ?? 0,
        userAnswers: data.userAnswers ?? [],
        submittedState: data.submittedState ?? {},
        timeLeft: data.timeLeft ?? 30,
      });
    },

    /* -----------------------------------------------------
       PROGRESS: CLEAR (LOCAL)
    ------------------------------------------------------*/
    clearProgress(state, action) {
      const { tutorialId, userId, level } = action.payload;
      deleteLocalProgress(userId, tutorialId, level);
    },

    /* -----------------------------------------------------
       HISTORY
    ------------------------------------------------------*/
    saveHistory(state, action) {
      const {
        tutorialId,
        quizData,
        userAnswers,
        score,
        totalQuestions,
        level,
      } = action.payload;

      const key = "quiz_history";
      const existing = JSON.parse(localStorage.getItem(key) || "[]");

      const newRecord = {
        id: Date.now(),
        tutorialId,
        level,
        quizData,
        userAnswers,
        score,
        totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100),
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem(key, JSON.stringify([newRecord, ...existing]));
    },
  },

  /* ---------------------------------------------------------
     EXTRA REDUCERS (THUNKS)
  ----------------------------------------------------------*/
  extraReducers: (builder) => {
    builder
      /* -----------------------------------------------------
         LOAD QUIZ
      ------------------------------------------------------*/
      .addCase(loadQuiz.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(loadQuiz.fulfilled, (state, action) => {
        const { data = {} } = action.payload || {}; // FIX destructure aman

        if (!data) {
          state.isLoading = false;
          state.error = "Data quiz tidak ditemukan.";
          return;
        }

        // reset state quiz saat load quiz baru
        Object.assign(state, {
          isLoading: false,
          quizLoaded: true,

          tutorial: data.tutorial ?? null,
          meta: data.meta ?? {},
          quizData: data.quizData ?? [],

          // reset progress
          currentQuestion: 0,
          userAnswers: [],
          submittedState: {},
          timeLeft: 30,
          quizStarted: false,
        });
      })

      .addCase(loadQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      /* -----------------------------------------------------
         LOAD PROGRESS (BACKEND)
      ------------------------------------------------------*/
      .addCase(loadProgressFromBackend.fulfilled, (state, action) => {
        if (!state.quizLoaded) return; // FIX race condition
        if (!action.payload) return;

        const data = action.payload;

        Object.assign(state, {
          currentQuestion: data.currentQuestion ?? 0,
          userAnswers: data.userAnswers ?? [],
          submittedState: data.submittedState ?? {},
          timeLeft: data.timeLeft ?? 30,
        });
      })

      /* -----------------------------------------------------
         LOAD TUTORIAL HEADING
      ------------------------------------------------------*/
      .addCase(loadTutorialHeading.fulfilled, (state, action) => {
        state.tutorialHeading = action.payload;
      })

      .addCase(loadTutorialHeading.rejected, (state, action) => {
        console.warn("Failed to load heading:", action.payload);
      });
  },
});

/* SELECTOR */
export const selectScore = createSelector(
  (state) => state.quiz.score,
  (state) => state.quiz.totalQuestions,
  (score, totalQuestions) => ({ score, totalQuestions })
);

export const {
  tick,
  setTime,
  startQuiz,
  resetQuiz,
  invalidateQuiz,
  answerQuestion,
  submitQuestion,
  nextQuestion,
  setScore,
  saveHistory,
  saveProgress,
  loadProgress,
  clearProgress,
} = quizSlice.actions;

export default quizSlice.reducer;
