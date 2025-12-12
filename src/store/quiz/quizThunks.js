import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  loadQuizCache,
  saveQuizCache,
  loadLocalProgress,
  saveLocalProgress,
  normalizeQuiz,
} from "./quizUtils";

/* =====================================================
   SAVE QUIZ CACHE → BACKEND
======================================================*/
export const saveQuizCacheToBackend = createAsyncThunk(
  "quiz/saveBackendQuizCache",
  async ({ tutorialId, userId, level, quiz }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "https://backend-dc-02.vercel.app/api/quiz/cache",
        { tutorialId, userId, level, quiz }
      );

      if (!res?.data?.success) {
        return rejectWithValue("Gagal menyimpan quiz cache ke server.");
      }

      return res.data;
    } catch (err) {
      console.error("Save quiz cache error:", err.message);
      return rejectWithValue("Gagal menyimpan quiz cache.");
    }
  }
);

/* =====================================================
   GET QUIZ CACHE → BACKEND
======================================================*/
export const getQuizCacheFromBackend = createAsyncThunk(
  "quiz/getBackendQuizCache",
  async ({ tutorialId, userId, level }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        "https://backend-dc-02.vercel.app/api/quiz/cache",
        {
          params: { tutorialId, userId, level },
        }
      );

      if (!res?.data?.success) {
        return rejectWithValue("Gagal mengambil quiz cache dari server.");
      }

      return res.data; // { success: true, quizCache: ... }
    } catch (err) {
      console.error("Get quiz cache error:", err.message);
      return rejectWithValue("Gagal mengambil quiz cache.");
    }
  }
);

/* =====================================================
   LOAD TUTORIAL HEADING
======================================================*/
export const loadTutorialHeading = createAsyncThunk(
  "quiz/loadTutorialHeading",
  async ({ tutorialId }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        "https://backend-dc-02.vercel.app/api/tutorial/heading",
        { params: { tutorialId } }
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
   LOAD QUIZ (local → backend → fallback)
======================================================*/
export const loadQuiz = createAsyncThunk(
  "quiz/loadQuiz",
  async ({ tutorialId, userId, level }, { rejectWithValue }) => {
    try {
      const tID = Number(tutorialId);
      const uID = Number(userId);
      const lvl = Number(level);

      if ([tID, uID, lvl].some((v) => isNaN(v))) {
        return rejectWithValue("Parameter tidak valid.");
      }

      // Helper
      const wrap = (data, fromLocal = false) => ({
        tutorialId: tID,
        fromLocal,
        data,
      });

      /* =========================================
         1. LOAD FROM LOCAL CACHE (via utils)
      =========================================*/
      const local = loadQuizCache(uID, tID, lvl);
      if (local?.quizData) {
        return wrap(local, true);
      }

      /* =========================================
         2. LOAD FROM BACKEND CACHE
      =========================================*/
      let backend = null;
      try {
        const res = await axios.get(
          "https://backend-dc-02.vercel.app/api/quiz/cache",
          { params: { tutorialId: tID, userId: uID, level: lvl } }
        );
        backend = res.data;
      } catch (_) {}

      if (backend?.success && backend.quizCache) {
        const normalized = {
          tutorial: backend.quizCache.tutorial,
          meta: backend.quizCache.meta,
          quizData: normalizeQuiz(backend.quizCache.quizData),
        };

        saveQuizCache(uID, tID, lvl, normalized);
        return wrap(normalized);
      }

      /* =========================================
         3. STATIC FALLBACK
         (gunakan file staticQuizResponse terpisah)
      =========================================*/

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
      const resp = staticQuizResponse;

      const fallback = {
        tutorial: resp.tutorial,
        meta: resp.meta,
        quizData: normalizeQuiz(resp.quiz),
      };

      saveQuizCache(uID, tID, lvl, fallback);

      return wrap(fallback);
    } catch (err) {
      return rejectWithValue(err?.message || "Terjadi kesalahan.");
    }
  }
);

/* =====================================================
   LOAD PROGRESS (local → backend)
======================================================*/
export const loadProgressFromBackend = createAsyncThunk(
  "quiz/loadBackendProgress",
  async ({ tutorialId, userId, level }, { rejectWithValue }) => {
    try {
      /* ---------------------------------------
         1. LOCAL STORAGE via utils
      ----------------------------------------*/
      const local = loadLocalProgress(userId, tutorialId, level);
      if (local) return local;

      /* ---------------------------------------
         2. FETCH BACKEND
      ----------------------------------------*/
      const res = await axios.get(
        "https://backend-dc-02.vercel.app/api/quiz/progress",
        { params: { tutorialId, userId, level } }
      );

      const data = res?.data?.progress;
      if (data) {
        saveLocalProgress(userId, tutorialId, level, data);
        return data;
      }

      return null;
    } catch (err) {
      return rejectWithValue("Gagal memuat progress.");
    }
  }
);

/* =====================================================
   SAVE PROGRESS → BACKEND
======================================================*/
export const saveProgressToBackend = createAsyncThunk(
  "quiz/saveBackendProgress",
  async ({ tutorialId, userId, level, progress }) => {
    try {
      const res = await axios.post(
        "https://backend-dc-02.vercel.app/api/quiz/progress",
        { tutorialId, userId, level, progress }
      );

      return res.data;
    } catch {
      return null; // silent error for autosave
    }
  }
);

/* =====================================================
   CLEAR BACKEND CACHE + PROGRESS
======================================================*/
export const clearBackendQuiz = createAsyncThunk(
  "quiz/clearBackend",
  async (
    { tutorialId, userId, level, cache = true, progress = true },
    thunkAPI
  ) => {
    try {
      const res = await axios.delete(
        "https://backend-dc-02.vercel.app/api/quiz/clear",
        {
          params: { tutorialId, userId, level, cache, progress },
        }
      );

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);
