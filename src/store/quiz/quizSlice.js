import { createSlice } from "@reduxjs/toolkit";
import {
  loadLocalProgress,
  saveLocalProgress,
  deleteLocalProgress,
} from "./quizUtils";

import { initialState } from "./quizInitial";
import { loadQuiz, loadTutorialHeading } from "./thunks/quizThunks";
import {
  getQuizHistory,
  loadProgressFromBackend,
} from "./thunks/quizCacheThunks";

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    tick(state) {
      if (!state.quizStarted) return;
      if (!state.quizLoaded) return;
      if (state.timeLeft <= 0) return;

      state.timeLeft -= 1;
    },

    setTime(state, action) {
      if (state.restored) return;

      state.timeLeft = action.payload;
    },

    startQuiz(state) {
      if (!state.quizLoaded) return;
      state.quizStarted = true;
    },
    resetQuiz(state) {
      state.quizStarted = false;
      state.currentQuestion = 0;
      state.timeLeft = 30;
      state.userAnswers = [];
      state.submittedState = {};
      state.score = 0;
      state.restored = false;
    },

    invalidateQuiz() {
      return {
        ...initialState,
        isLoading: false,
      };
    },

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

    loadProgress(state, action) {
      if (!state.quizLoaded) return;

      const { tutorialId, userId, level } = action.payload;
      const data = loadLocalProgress(userId, tutorialId, level);

      if (!data) return;

      Object.assign(state, {
        currentQuestion: data.currentQuestion ?? 0,
        userAnswers: data.userAnswers ?? [],
        submittedState: data.submittedState ?? {},
        timeLeft: data.timeLeft ?? 30,
        restored: true,
      });
    },

    clearProgress(state, action) {
      const { tutorialId, userId, level } = action.payload;
      deleteLocalProgress(userId, tutorialId, level);
    },

    saveHistory(state, action) {
      const {
        tutorialId,
        userId,
        quizData,
        userAnswers,
        score,
        totalQuestions,
        level,
      } = action.payload;

      const newRecord = {
        id: Date.now(),
        tutorialId,
        userId,
        level,
        quizData,
        userAnswers,
        score,
        totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100),
        timestamp: new Date().toISOString(),
      };

      state.history.list.unshift(newRecord);

      localStorage.setItem("quiz_history", JSON.stringify(state.history.list));
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(loadQuiz.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(loadQuiz.fulfilled, (state, action) => {
        const { data = {} } = action.payload || {};

        if (!data) {
          state.isLoading = false;
          state.error = "Data quiz tidak ditemukan.";
          return;
        }

        Object.assign(state, {
          isLoading: false,
          quizLoaded: true,
          tutorial: data.tutorial ?? null,
          meta: data.meta ?? {},
          quizData: data.quizData ?? [],
        });
      })

      .addCase(loadQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(loadProgressFromBackend.fulfilled, (state, action) => {
        if (!action.payload) return;

        const data = action.payload;

        Object.assign(state, {
          currentQuestion: data.currentQuestion ?? 0,
          userAnswers: data.userAnswers ?? [],
          submittedState: data.submittedState ?? {},
          timeLeft: data.timeLeft ?? 30,
          restored: true,
        });
      })

      .addCase(loadTutorialHeading.fulfilled, (state, action) => {
        state.tutorialHeading = action.payload;
      })

      .addCase(loadTutorialHeading.rejected, (state, action) => {
        console.warn("Failed to load heading:", action.payload);
      })

      .addCase(getQuizHistory.pending, (state) => {
        state.history.loading = true;
      })

      .addCase(getQuizHistory.fulfilled, (state, action) => {
        state.history.loading = false;
        state.history.list = action.payload;
      })

      .addCase(getQuizHistory.rejected, (state) => {
        state.history.loading = false;
      });
  },
});

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
