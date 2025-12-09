// src/store/quizSlice.js
import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";

/* =====================================================
   LOCAL STORAGE HELPERS
======================================================*/
const quizCacheKey = (tutorialId, userId) =>
  `quiz_cache_${tutorialId}_${userId}`;
const progressKey = (tutorialId, userId) =>
  `quiz_progress_${tutorialId}_${userId}`;

const saveQuizCache = (tutorialId, userId, data) => {
  localStorage.setItem(quizCacheKey(tutorialId, userId), JSON.stringify(data));
};

const loadQuizCache = (tutorialId, userId) => {
  const json = localStorage.getItem(quizCacheKey(tutorialId, userId));
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const deleteLocalQuizCache = (tutorialId, userId) => {
  localStorage.removeItem(quizCacheKey(tutorialId, userId));
};

/* =====================================================
   NORMALIZE QUIZ
======================================================*/
const normalizeQuiz = (quizList = []) => {
  if (!Array.isArray(quizList)) return [];

  return quizList
    .map((q) => {
      const opts = Object.entries(q.options || {}).map(([key, opt]) => ({
        key,
        text: opt?.text ?? "",
        isCorrect: opt?.isCorrect ?? false,
        feedback: opt?.feedback ?? "",
      }));

      return {
        id: q.id,
        question: q.question ?? "",
        explanation: q.explanation ?? "",
        type: q.type ?? "multiple_choice",
        options: opts,
        correctAnswers: opts.filter((o) => o.isCorrect).map((o) => o.key),
        difficulty: q.difficulty ?? "easy",
      };
    })
    .filter((q) => q.question && q.options.length);
};

export const loadHistory = () => {
  try {
    return JSON.parse(localStorage.getItem("quiz_history") || "[]");
  } catch {
    return [];
  }
};

/* =====================================================
   LOAD QUIZ (localStorage → backend CACHE → generate)
======================================================*/
export const loadQuiz = createAsyncThunk(
  "quiz/loadQuiz",
  async ({ tutorialId, userId, force = false }, { rejectWithValue }) => {
    const tid = Number(tutorialId);

    console.log("tutorial id", tutorialId);
    console.log("user", userId);

    try {
      // =====================================================
      // 1. FORCE → DELETE LOCAL CACHE
      // =====================================================
      // if (force) deleteLocalQuizCache(tid, userId);

      // =====================================================
      // 2. TRY READ FROM LOCAL STORAGE
      // =====================================================
      if (!force) {
        const local = loadQuizCache(tid, userId);
        if (local?.quizData) {
          return {
            fromLocal: true,
            tutorialId: tid,
            data: local,
          };
        }
      }

      // =====================================================
      // 3. TRY FETCH FROM BACKEND QUIZ CACHE
      // =====================================================
      let cacheRes = null;
      try {
        cacheRes = await axios.get(
          "https://backend-dc-02.vercel.app/api/quiz/cache",
          {
            params: { tutorialId: tid, userId },
          }
        );
      } catch {}

      if (cacheRes?.data?.success && cacheRes.data.quizCache) {
        const d = {
          tutorial: cacheRes.data.quizCache.tutorial,
          meta: cacheRes.data.quizCache.meta,
          quizData: normalizeQuiz(cacheRes.data.quizCache.quiz),
        };
        saveQuizCache(tid, userId, d);

        return {
          fromLocal: false,
          tutorialId: tid,
          data: d,
        };
      }

      // =====================================================
      // 4. BACKEND: GENERATE QUIZ BARU
      // =====================================================
      let res;
      try {
        res = await axios.post(
          "https://backend-dc-02.vercel.app/api/quiz/generate",
          { tutorialId: tid },
          { headers: { "Content-Type": "application/json" } }
        );
      } catch {
        return rejectWithValue("Gagal menghubungi server.");
      }

      if (!res?.data?.success) {
        return rejectWithValue(
          res?.data?.message || "Server mengembalikan data tidak valid"
        );
      }

      const normalized = {
        tutorial: res.data.tutorial,
        meta: res.data.meta,
        quizData: normalizeQuiz(res.data.quiz),
      };

      saveQuizCache(tid, userId, normalized);

      return {
        fromLocal: false,
        tutorialId: tid,
        data: normalized,
      };
    } catch (err) {
      return rejectWithValue(err?.message || "Terjadi kesalahan.");
    }
  }
);

/* =====================================================
   LOAD PROGRESS (localStorage → backend)
======================================================*/
export const loadProgressFromBackend = createAsyncThunk(
  "quiz/loadBackendProgress",
  async ({ tutorialId, userId }, { rejectWithValue }) => {
    try {
      const local = localStorage.getItem(progressKey(tutorialId, userId));
      if (local) return JSON.parse(local);

      const res = await axios.get(
        "https://backend-dc-02.vercel.app/api/quiz/progress",
        {
          params: { tutorialId, userId },
        }
      );

      if (res?.data?.progress) {
        localStorage.setItem(
          progressKey(tutorialId, userId),
          JSON.stringify(res.data.progress)
        );
        return res.data.progress;
      }

      return null;
    } catch {
      return rejectWithValue("Gagal memuat progress.");
    }
  }
);

/* =====================================================
   SAVE PROGRESS TO BACKEND
======================================================*/
export const saveProgressToBackend = createAsyncThunk(
  "quiz/saveBackendProgress",
  async ({ tutorialId, userId, progress }) => {
    try {
      await axios.post("https://backend-dc-02.vercel.app/api/quiz/progress", {
        tutorialId,
        userId,
        progress,
      });
    } catch {}
  }
);

/* =====================================================
   CLEAR BACKEND CACHE + PROGRESS
======================================================*/
export const clearBackendQuiz = createAsyncThunk(
  "quiz/clearBackend",
  async ({ tutorialId, userId }) => {
    try {
      await axios.delete("https://backend-dc-02.vercel.app/api/quiz/clear", {
        data: { tutorialId, userId },
      });
    } catch {}
  }
);

/* =====================================================
   INITIAL STATE
======================================================*/
const initialState = {
  isLoading: false,
  error: null,

  tutorial: null,
  meta: null,
  quizData: [],

  userAnswers: [],
  submittedState: {},

  quizStarted: false,
  currentQuestion: 0,
  timeLeft: 30,

  quizLoaded: false,
  score: 0,
  totalQuestions: 0,
};

/* =====================================================
   QUIZ SLICE
======================================================*/
const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    tick(state) {
      state.timeLeft -= 1;
    },

    setTime(state, action) {
      state.timeLeft = action.payload;
    },

    startQuiz(state) {
      state.quizStarted = true;
    },

    resetQuiz(state) {
      state.quizStarted = false;
      state.currentQuestion = 0;
      state.timeLeft = 30;
      state.userAnswers = [];
      state.submittedState = {};
      state.score = 0;
      state.totalQuestions = 0;
    },

    invalidateQuiz(state) {
      state.tutorial = null;
      state.meta = null;
      state.quizData = [];
      state.quizLoaded = false;

      state.currentQuestion = 0;
      state.userAnswers = [];
      state.submittedState = {};

      state.quizStarted = false;
      state.timeLeft = 30;

      state.isLoading = false;
      state.error = null;
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

    /* SAVE PROGRESS LOCAL + BACKEND */
    saveProgress(state, action) {
      const { tutorialId, userId } = action.payload;

      const progress = {
        currentQuestion: state.currentQuestion,
        userAnswers: state.userAnswers,
        submittedState: state.submittedState,
        timeLeft: state.timeLeft,
      };

      localStorage.setItem(
        progressKey(tutorialId, userId),
        JSON.stringify(progress)
      );
    },

    /* LOAD PROGRESS FROM LOCAL */
    loadProgress(state, action) {
      const { tutorialId, userId } = action.payload;

      const json = localStorage.getItem(progressKey(tutorialId, userId));
      if (!json) return;

      const data = JSON.parse(json);

      state.currentQuestion = data.currentQuestion ?? 0;
      state.userAnswers = data.userAnswers ?? [];
      state.submittedState = data.submittedState ?? {};
      state.timeLeft = data.timeLeft ?? 30;
    },

    /* CLEAR LOCAL ONLY */
    clearProgress(state, action) {
      const { tutorialId, userId } = action.payload;
      localStorage.removeItem(progressKey(tutorialId, userId));
      deleteLocalQuizCache(tutorialId, userId);
    },

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

  extraReducers: (builder) => {
    builder
      .addCase(loadQuiz.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadQuiz.fulfilled, (state, action) => {
        const { data } = action.payload;

        state.isLoading = false;
        state.quizLoaded = true;

        state.tutorial = data.tutorial;
        state.meta = data.meta;
        state.quizData = data.quizData;

        state.currentQuestion = 0;
        state.userAnswers = [];
        state.submittedState = {};
        state.quizStarted = false;
      })
      .addCase(loadQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(loadProgressFromBackend.fulfilled, (state, action) => {
        if (!action.payload) return;
        const data = action.payload;

        state.currentQuestion = data.currentQuestion ?? 0;
        state.userAnswers = data.userAnswers ?? [];
        state.submittedState = data.submittedState ?? {};
        state.timeLeft = data.timeLeft ?? 30;
      });
  },
});

/* =====================================================
   SELECTORS
======================================================*/
export const selectScore = createSelector(
  (state) => state.quiz.score,
  (state) => state.quiz.totalQuestions,
  (score, totalQuestions) => ({ score, totalQuestions })
);

/* =====================================================
   EXPORTS
======================================================*/
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
