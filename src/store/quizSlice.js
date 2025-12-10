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
const quizCacheKey = (userId, tutorialId, level) =>
  `quiz_cache:${userId}:${tutorialId}:${level}`;

const progressKey = (userId, tutorialId, level) =>
  `quiz_progress:${userId}:${tutorialId}:${level}`;

const saveQuizCache = (userId, tutorialId, level, data) => {
  localStorage.setItem(
    quizCacheKey(userId, tutorialId, level),
    JSON.stringify(data)
  );
};

const loadQuizCache = (userId, tutorialId, level) => {
  const json = localStorage.getItem(quizCacheKey(userId, tutorialId, level));
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const deleteLocalQuizCache = (userId, tutorialId, level) => {
  localStorage.removeItem(quizCacheKey(userId, tutorialId, level));
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
   SAVE QUIZ CACHE → BACKEND
======================================================*/
export const saveQuizCacheToBackend = createAsyncThunk(
  "quiz/saveBackendQuizCache",
  async ({ tutorialId, userId, level, quiz }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "https://backend-dc-02.vercel.app/api/quiz/cache",
        {
          tutorialId,
          userId,
          level,
          quiz,
        }
      );

      if (!res?.data?.success) {
        return rejectWithValue("Gagal menyimpan quiz cache ke server.");
      }

      return true;
    } catch (err) {
      console.error("Save quiz cache error:", err.message);
      return rejectWithValue("Gagal menyimpan quiz cache.");
    }
  }
);

/* =====================================================
   LOAD TUTORIAL HEADING (Backend)
======================================================*/
export const loadTutorialHeading = createAsyncThunk(
  "quiz/loadTutorialHeading",
  async ({ tutorialId }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        "https://backend-dc-02.vercel.app/api/tutorial/heading",
        {
          params: { tutorialId },
        }
      );

      if (!res?.data?.success) {
        return rejectWithValue("Gagal mendapatkan heading tutorial.");
      }

      return res.data.heading;
    } catch (err) {
      return rejectWithValue("Gagal menghubungi server (heading).");
    }
  }
);

/* =====================================================
   LOAD QUIZ (localStorage → backend CACHE → generate)
======================================================*/
export const loadQuiz = createAsyncThunk(
  "quiz/loadQuiz",
  async ({ tutorialId, userId, level }, { rejectWithValue }) => {
    try {
      // =====================================================
      // 0. NORMALISASI PARAMETER → KONVERSI KE ANGKA
      // =====================================================
      const tutorialIDNum = Number(tutorialId);
      const userIDNum = Number(userId);
      const levelNum = Number(level);

      // Validasi angka dasar
      if (isNaN(tutorialIDNum) || isNaN(userIDNum) || isNaN(levelNum)) {
        return rejectWithValue(
          "Parameter tidak valid (ID atau level bukan angka)."
        );
      }

      // =====================================================
      // 1. READ LOCAL CACHE DAHULU
      // =====================================================
      const localCache = loadQuizCache(userIDNum, tutorialIDNum, levelNum);

      if (localCache?.quizData) {
        return {
          fromLocal: true,
          tutorialId: tutorialIDNum,
          data: localCache,
        };
      }

      // =====================================================
      // 2. TRY GET BACKEND QUIZ CACHE
      // =====================================================
      let backendCacheRes = null;

      try {
        backendCacheRes = await axios.get(
          "https://backend-dc-02.vercel.app/api/quiz/cache",
          {
            params: {
              tutorialId: tutorialIDNum,
              userId: userIDNum,
              level: levelNum,
            },
          }
        );

        console.log("Backend quiz cache response:", backendCacheRes.data);
      } catch {}

      if (backendCacheRes?.data?.success && backendCacheRes.data.quizCache) {
        const cache = backendCacheRes.data.quizCache;

        console.log("Using backend quiz cache:", cache);

        const backendData = {
          tutorial: cache.tutorial,
          meta: cache.meta,
          quizData: normalizeQuiz(cache.quizData),
        };

        saveQuizCache(userIDNum, tutorialIDNum, levelNum, backendData);

        return {
          fromLocal: false,
          tutorialId: tutorialIDNum,
          data: backendData,
        };
      }

      // =====================================================
      // 3. BYPASS: PAKAI DATA QUIZ STATIC UNTUK DEVELOPMENT
      // =====================================================

      const staticQuizResponse = {
        success: true,
        message: "Quiz generated successfully",
        tutorial: {
          id: 35363,
          title: "Penerapan AI dalam Dunia Nyata",
        },
        meta: {
          level: 1,
          totalQuestions: 3,
          multiple_choice: 3,
          multiple_answer: 0,
        },
        quiz: [
          {
            question:
              "Perangkat inovatif yang dilandasi oleh teknologi AI sehingga memiliki kemampuan untuk melakukan tugas berdasarkan perintah verbal...",
            type: "multiple_choice",
            options: {
              A: {
                text: "Self-driving car",
                isCorrect: false,
                feedback:
                  "Self-driving car adalah mobil tanpa pengemudi, bukan perangkat yang merespon perintah verbal.",
              },
              B: {
                text: "Robot industri",
                isCorrect: false,
                feedback:
                  "Robot industri umumnya melakukan tugas fisik berulang, bukan merespon perintah verbal seperti Smart Speaker.",
              },
              C: {
                text: "Smart Speaker",
                isCorrect: true,
                feedback:
                  "Tepat sekali! Smart Speaker adalah perangkat berbasis AI yang merespons perintah verbal untuk melakukan berbagai tugas.",
              },
              D: {
                text: "Pesawat tanpa awak (Drone)",
                isCorrect: false,
                feedback:
                  "Pesawat tanpa awak (drone) adalah alat terbang yang dikendalikan dari jarak jauh atau secara otomatis, bukan perangkat verbal interaktif.",
              },
              E: {
                text: "Printer 3D",
                isCorrect: false,
                feedback:
                  "Printer 3D adalah perangkat untuk mencetak objek tiga dimensi, tidak berkaitan dengan perintah verbal.",
              },
            },
          },
          {
            question:
              "Salah satu komponen krusial pada Self-driving car adalah sensor yang berfungsi untuk mengukur jarak...",
            type: "multiple_choice",
            options: {
              A: {
                text: "Termometer",
                isCorrect: false,
                feedback: "Termometer mengukur suhu.",
              },
              B: {
                text: "Barometer",
                isCorrect: false,
                feedback: "Barometer mengukur tekanan udara.",
              },
              C: {
                text: "Higrometer",
                isCorrect: false,
                feedback: "Higrometer mengukur kelembaban.",
              },
              D: {
                text: "LIDAR",
                isCorrect: true,
                feedback:
                  "Benar! LIDAR adalah sensor yang digunakan self-driving car untuk mengukur jarak objek di sekitarnya.",
              },
              E: {
                text: "Spektrometer",
                isCorrect: false,
                feedback: "Spektrometer menganalisis cahaya.",
              },
            },
          },
          {
            question:
              "Smart speaker memiliki kemampuan untuk menerima dan memproses perintah verbal...",
            type: "multiple_choice",
            options: {
              A: {
                text: "Computer Vision",
                isCorrect: false,
                feedback: "Digunakan untuk memahami gambar.",
              },
              B: {
                text: "Machine Learning",
                isCorrect: false,
                feedback: "ML adalah konsep lebih umum.",
              },
              C: {
                text: "Natural Language Processing (NLP)",
                isCorrect: true,
                feedback:
                  "Betul! NLP adalah teknologi yang memungkinkan smart speaker memahami bahasa manusia.",
              },
              D: {
                text: "RPA",
                isCorrect: false,
                feedback: "RPA mengotomatiskan tugas berbasis aturan.",
              },
              E: {
                text: "Big Data Analytics",
                isCorrect: false,
                feedback: "Tidak digunakan untuk memahami bahasa.",
              },
            },
          },
        ],
      };

      const normalized = {
        tutorial: staticQuizResponse.tutorial,
        meta: staticQuizResponse.meta,
        quizData: normalizeQuiz(staticQuizResponse.quiz),
      };

      // Simpan ke localStorage
      saveQuizCache(userIDNum, tutorialIDNum, levelNum, normalized);

      return {
        fromLocal: false,
        tutorialId: tutorialIDNum,
        data: normalized,
      };

      // =====================================================
      // (TIDAK ADA PEMANGGILAN /api/quiz/generate LAGI)
      // =====================================================
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
  async ({ tutorialId, userId, level }, { rejectWithValue }) => {
    try {
      const local = localStorage.getItem(
        progressKey(userId, tutorialId, level)
      );
      if (local) return JSON.parse(local);

      const res = await axios.get(
        "https://backend-dc-02.vercel.app/api/quiz/progress",
        {
          params: { tutorialId, userId, level },
        }
      );

      console.log(res.data);

      if (res?.data?.progress) {
        localStorage.setItem(
          progressKey(userId, tutorialId, level),
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
  async ({ tutorialId, userId, level, progress }) => {
    try {
      const save = await axios.post(
        "https://backend-dc-02.vercel.app/api/quiz/progress",
        {
          tutorialId,
          userId,
          level,
          progress,
        }
      );

      console.log("progress", progress);
      console.log(save.data);
    } catch {}
  }
);

/* =====================================================
   CLEAR BACKEND CACHE + PROGRESS (DENGAN QUERY PARAMS)
======================================================*/
export const clearBackendQuiz = createAsyncThunk(
  "quiz/clearBackend",
  async ({ tutorialId, userId, level, cache = true, progress = true }) => {
    try {
      const response = await axios.delete(
        `https://backend-dc-02.vercel.app/api/quiz/clear?cache=${cache}&progress=${progress}`,
        {
          data: {
            tutorialId,
            userId,
            level,
          },
        }
      );

      console.log("Clear backend quiz response:", response.data);
    } catch (err) {
      console.error("Failed to clear quiz:", err);
    }
  }
);

/* =====================================================
   INITIAL STATE
======================================================*/
const initialState = {
  isLoading: false,
  error: null,

  tutorial: null,
  tutorialHeading: null,
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
      const { tutorialId, userId, level } = action.payload;

      const progress = {
        currentQuestion: state.currentQuestion,
        userAnswers: state.userAnswers,
        submittedState: state.submittedState,
        timeLeft: state.timeLeft,
      };

      localStorage.setItem(
        progressKey(userId, tutorialId, level),
        JSON.stringify(progress)
      );
    },

    /* LOAD PROGRESS FROM LOCAL */
    loadProgress(state, action) {
      const { tutorialId, userId, level } = action.payload;

      const json = localStorage.getItem(progressKey(userId, tutorialId, level));
      if (!json) return;

      const data = JSON.parse(json);

      state.currentQuestion = data.currentQuestion ?? 0;
      state.userAnswers = data.userAnswers ?? [];
      state.submittedState = data.submittedState ?? {};
      state.timeLeft = data.timeLeft ?? 30;
    },

    /* CLEAR LOCAL ONLY */
    clearProgress(state, action) {
      const { tutorialId, userId, level } = action.payload;
      localStorage.removeItem(progressKey(userId, tutorialId, level));
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
        console.log("Loaded quiz data:", action.payload);

        state.isLoading = false;
        state.quizLoaded = true;

        // FIX → ambil dari payload.data, bukan payload.quiz
        const { data } = action.payload;

        if (!data) {
          console.warn("No quiz data found in payload:", action.payload);
          state.error = "Data quiz tidak ditemukan.";
          return;
        }

        state.tutorial = data.tutorial || null;
        state.meta = data.meta || {};
        state.quizData = data.quizData || [];

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
      })

      // =============================================
      // LOAD TUTORIAL HEADING
      // =============================================
      .addCase(loadTutorialHeading.fulfilled, (state, action) => {
        state.tutorialHeading = action.payload;
      })
      .addCase(loadTutorialHeading.rejected, (state, action) => {
        // Tidak mem-block quiz, jadi jangan set error global
        console.warn("Failed to load heading:", action.payload);
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
