import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  loadQuizCache,
  saveQuizCache,
  loadLocalProgress,
  saveLocalProgress,
  normalizeQuiz,
} from "./quizUtils";
import { staticQuizResponse } from "../../utils/constants";

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
      return rejectWithValue("Gagal menghubungi server (heading).", err);
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

      const wrap = (data, fromLocal = false) => ({
        tutorialId: tID,
        fromLocal,
        data,
      });

      /* =====================================================
         1. LOCAL CACHE
      ====================================================== */
      const local = loadQuizCache(uID, tID, lvl);
      if (local?.quizData) {
        return wrap(local, true);
      }

      /* =====================================================
         2. BACKEND CACHE
      ====================================================== */
      let backend = null;
      try {
        const res = await axios.get(
          "https://backend-dc-02.vercel.app/api/quiz/cache",
          { params: { tutorialId: tID, userId: uID, level: lvl } }
        );
        backend = res.data;
      } catch (err) {
        console.warn("⚠️ Backend cache fetch failed:", err?.message);
      }

      if (backend?.success && backend.quizCache) {
        const normalized = {
          tutorial: backend.quizCache.tutorial,
          meta: backend.quizCache.meta,
          quizData: normalizeQuiz(backend.quizCache.quizData),
        };

        saveQuizCache(uID, tID, lvl, normalized);
        return wrap(normalized);
      }

      /* =====================================================
         3. BACKEND QUIZ GENERATOR
            — Jika cache tidak ada, generate dari tutorial content
      ====================================================== */
      try {
        const gen = await axios.post(
          "https://backend-dc-02.vercel.app/api/quiz/generate",
          { tutorialId: tID, level: lvl }
        );

        if (gen?.data?.success && Array.isArray(gen.data.quiz)) {
          const normalized = {
            tutorial: gen.data.tutorial,
            meta: gen.data.meta,
            quizData: normalizeQuiz(gen.data.quiz),
          };

          // simpan cache
          saveQuizCache(uID, tID, lvl, normalized);

          return wrap(normalized);
        }
      } catch (err) {
        console.warn("⚠️ Generate API failed:", err?.message);
      }

      /* =====================================================
         4. STATIC FALLBACK
      ====================================================== */
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
      return rejectWithValue("Gagal memuat progress.", err);
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

/* ======================================================
   GET QUIZ HISTORY
   GET /quiz/history
====================================================== */
export const getQuizHistory = createAsyncThunk(
  "quizHistory/get",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        "https://backend-dc-02.vercel.app/api/quiz/history"
      );

      return res.data.history || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Gagal mengambil history" }
      );
    }
  }
);

/* ======================================================
   SAVE QUIZ HISTORY (RAW)
   POST /quiz/history
====================================================== */
export const saveQuizHistory = createAsyncThunk(
  "quizHistory/save",
  async (
    { tutorialId, quizData, userAnswers, score, totalQuestions, level },
    { rejectWithValue }
  ) => {
    try {
      const payload = {
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

      const res = await axios.post(
        "https://backend-dc-02.vercel.app/api/quiz/history",
        payload
      );

      return res.data.entry; // backend balikin RAW entry
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Gagal menyimpan history" }
      );
    }
  }
);

/* ======================================================
   CLEAR ALL QUIZ HISTORY
   DELETE /quiz/history/clear
====================================================== */
export const clearQuizHistory = createAsyncThunk(
  "quizHistory/clear",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        "https://backend-dc-02.vercel.app/api/quiz/history/clear"
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Gagal menghapus history" }
      );
    }
  }
);
