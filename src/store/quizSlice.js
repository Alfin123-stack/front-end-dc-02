import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";

/* -----------------------------
   normalize helper
----------------------------- */

/* -----------------------------
   localStorage QUIZ CACHE helper
----------------------------- */
const saveQuizCache = (tutorialId, data) => {
  localStorage.setItem(`quiz_cache_${tutorialId}`, JSON.stringify(data));
};

const loadQuizCache = (tutorialId) => {
  const json = localStorage.getItem(`quiz_cache_${tutorialId}`);
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const normalizeQuiz = (quizList = []) => {
  if (!Array.isArray(quizList)) return [];

  return quizList
    .map((q) => {
      const rawOptions = q.options || {};

      const opts = Object.entries(rawOptions).map(([key, opt]) => ({
        key,
        text: opt?.text ?? "",
        isCorrect: opt?.isCorrect ?? false,
        feedback: opt?.feedback ?? "",
      }));

      return {
        id: q.id,
        type: q.type ?? "multiple_choice",
        question: q.question ?? "",
        explanation: q.explanation ?? "",
        options: opts,
        correctAnswers: opts.filter((o) => o.isCorrect).map((o) => o.key),
        difficulty: q.difficulty ?? "easy",
      };
    })
    .filter((q) => q.question && q.options.length);
};

/* -----------------------------
   loadQuiz thunk
----------------------------- */
export const loadQuiz = createAsyncThunk(
  "quiz/loadQuiz",
  async ({ tutorialId }, { getState, rejectWithValue }) => {
    try {
      const id = Number(tutorialId);
      const { quiz } = getState();

      /* -----------------------------
         1. CEK LOCALSTORAGE
      ----------------------------- */
      const localCache = loadQuizCache(id);

      if (localCache?.quizData && localCache?.tutorial && localCache?.meta) {
        return {
          fromLocal: true,
          tutorialId: id,
          data: localCache,
        };
      }

      /* -----------------------------
         2. CEK REDUX SESSION CACHE
      ----------------------------- */
      const cached = quiz.session[id];
      if (cached?.quizData && cached?.tutorial && cached?.meta) {
        return {
          fromLocal: true,
          tutorialId: id,
          data: cached,
        };
      }

      /* -----------------------------
         3. FETCH API
      ----------------------------- */
      let res;
      try {
        res = await axios.post(
          "https://backend-dc-02.vercel.app/api/quiz/generate",
          { tutorialId: id },
          { headers: { "Content-Type": "application/json" } }
        );
      } catch {
        return rejectWithValue("Gagal menghubungi server. Coba lagi.");
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

      /* -----------------------------
         4. SIMPAN CACHE → LOCALSTORAGE
      ----------------------------- */
      saveQuizCache(id, normalized);

      return {
        fromLocal: false,
        tutorialId: id,
        data: normalized,
      };
    } catch (err) {
      return rejectWithValue(err?.message || "Terjadi kesalahan");
    }
  }
);

/* -----------------------------
   initialState
----------------------------- */
const initialState = {
  isLoading: false,
  error: null,

  tutorial: null,
  meta: null,
  quizData: [],
  userAnswers: [],
  quizStarted: false,
  currentQuestion: 0,
  timeLeft: 30,

  score: 0,
  totalQuestions: 0,

  session: {},
};

/* -----------------------------
   slice
----------------------------- */
const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setTime(state, action) {
      state.timeLeft = action.payload;
    },
    tick(state) {
      state.timeLeft -= 1;
    },
    startQuiz(state) {
      state.quizStarted = true;
    },
<<<<<<< HEAD
    resetQuiz(state) {
      return { ...initialState, session: state.session };
=======
    resetQuiz(state, action) {
      const tutorialId = action.payload;

      // HAPUS PROGRESS USER
      state.userAnswers = [];
      state.currentQuestion = 0;
      state.timeLeft = 30;
      state.quizStarted = false;

      // HAPUS SCORE
      state.score = 0;
      state.totalQuestions = 0;

      // GANTI quizData MENGGUNAKAN session cache agar tidak fetch ulang
      const cached = state.session[tutorialId];
      if (cached) {
        state.quizData = cached.quizData || [];
        state.tutorial = cached.tutorial || null;
        state.meta = cached.meta || null;
      }

      // TIDAK reset session!
>>>>>>> 66c974b (adding history screen)
    },

    // SIMPAN jawaban user
    answerQuestion(state, action) {
      state.userAnswers[state.currentQuestion] = action.payload;
    },

    nextQuestion(state) {
      if (state.currentQuestion < state.quizData.length - 1)
        state.currentQuestion++;
    },

    // SCORE GLOBAL
    setScore(state, action) {
      state.score = action.payload.score;
      state.totalQuestions = action.payload.totalQuestions;
    },

    // CACHE session dari API
    saveSession(state, action) {
      const { tutorialId, data } = action.payload;
      const id = Number(tutorialId);
      state.session[id] = {
        ...(state.session[id] || {}),
        ...data,
      };
    },

    /* -----------------------------
       SAVE PROGRESS → LOCALSTORAGE
    ----------------------------- */
    saveProgress(state, action) {
      const { tutorialId, userId } = action.payload;
      const key = `quiz_progress_${tutorialId}_${userId}`;

      const progress = {
        currentQuestion: state.currentQuestion,
        userAnswers: state.userAnswers,
        timeLeft: state.timeLeft,
      };

      localStorage.setItem(key, JSON.stringify(progress));
    },

    /* -----------------------------
       LOAD PROGRESS ← LOCALSTORAGE
    ----------------------------- */
    loadProgress(state, action) {
      const { tutorialId, userId } = action.payload;
      const key = `quiz_progress_${tutorialId}_${userId}`;

      const saved = localStorage.getItem(key);
      if (saved) {
        const data = JSON.parse(saved);

        state.currentQuestion = data.currentQuestion ?? 0;
        state.userAnswers = data.userAnswers ?? [];
        state.timeLeft = data.timeLeft ?? state.timeLeft;
      }
    },

    /* -----------------------------
       CLEAR PROGRESS (selesai quiz)
    ----------------------------- */
    clearProgress(state, action) {
      const { tutorialId, userId } = action.payload;

      // Hapus progress
      localStorage.removeItem(`quiz_progress_${tutorialId}_${userId}`);

      // Hapus quiz cache juga
      localStorage.removeItem(`quiz_cache_${tutorialId}`);
    },
<<<<<<< HEAD
=======

    saveHistory(state, action) {
      const { tutorialId, quizData, userAnswers, score, totalQuestions } =
        action.payload;

      const key = "quiz_history";

      // ambil existing history
      const existing = JSON.parse(localStorage.getItem(key) || "[]");

      const newRecord = {
        id: Date.now(), // unique id
        tutorialId,
        quizData,
        userAnswers,
        score,
        totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100),
        timestamp: new Date().toISOString(),
      };

      const updated = [newRecord, ...existing];

      localStorage.setItem(key, JSON.stringify(updated));
    },
>>>>>>> 66c974b (adding history screen)
  },

  extraReducers: (builder) => {
    builder
      .addCase(loadQuiz.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(loadQuiz.fulfilled, (state, action) => {
        const { fromLocal, tutorialId, data } = action.payload;

        state.isLoading = false;

        state.tutorial = data.tutorial;
        state.meta = data.meta;
        state.quizData = data.quizData;
        state.userAnswers = [];
        state.quizStarted = false;
        state.currentQuestion = 0;

        if (!fromLocal) {
          state.session[tutorialId] = {
            ...(state.session[tutorialId] || {}),
            tutorial: data.tutorial,
            meta: data.meta,
            quizData: data.quizData,
          };
        }
      })

      .addCase(loadQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const selectScore = createSelector(
  (state) => state.quiz.score,
  (state) => state.quiz.totalQuestions,
  (score, totalQuestions) => ({
    score,
    totalQuestions,
  })
);
<<<<<<< HEAD
=======
export const loadHistory = () => {
  try {
    return JSON.parse(localStorage.getItem("quiz_history") || "[]");
  } catch {
    return [];
  }
};
>>>>>>> 66c974b (adding history screen)

export const {
  setTime,
  tick,
  startQuiz,
  resetQuiz,
  answerQuestion,
  nextQuestion,
  setScore,
<<<<<<< HEAD
=======
  saveHistory,
>>>>>>> 66c974b (adding history screen)
  saveSession,
  saveProgress,
  loadProgress,
  clearProgress,
} = quizSlice.actions;

export default quizSlice.reducer;
