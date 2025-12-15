import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  clearHistory,
  loadHistory,
  loadLocalProgress,
  saveLocalProgress,
} from "../quizUtils";

export const saveQuizCacheToBackend = createAsyncThunk(
  "quiz/saveBackendQuizCache",
  async ({ tutorialId, userId, level, quiz }, { rejectWithValue }) => {
    console.log("Saving quiz cache to backend...", {
      tutorialId,
      userId,
      level,
      quiz,
    });
    try {
      const res = await axios.post(
        "https://backend-dc-02.vercel.app/api/quiz/cache",
        { tutorialId, userId, level, quiz }
      );

      if (!res?.data?.success) {
        throw new Error("Gagal menyimpan quiz cache ke server.");
      }

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: err.message || "Terjadi kesalahan" }
      );
    }
  }
);

export const loadProgressFromBackend = createAsyncThunk(
  "quiz/loadBackendProgress",
  async ({ tutorialId, userId, level }, { rejectWithValue }) => {
    try {
      const local = loadLocalProgress(userId, tutorialId, level);
      if (local) return local;

      const res = await axios.get(
        "https://backend-dc-02.vercel.app/api/quiz/progress",
        { params: { tutorialId, userId, level } }
      );

      const data = res?.data?.progress || null;

      if (data) {
        saveLocalProgress(userId, tutorialId, level, data);
      }

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Gagal memuat progress" }
      );
    }
  }
);

export const saveProgressToBackend = createAsyncThunk(
  "quiz/saveBackendProgress",
  async ({ tutorialId, userId, level, progress }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "https://backend-dc-02.vercel.app/api/quiz/progress",
        { tutorialId, userId, level, progress }
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Gagal menyimpan progress" }
      );
    }
  }
);

export const clearBackendQuiz = createAsyncThunk(
  "quiz/clearBackend",
  async (
    { tutorialId, userId, level, cache = true, progress = true },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.delete(
        "https://backend-dc-02.vercel.app/api/quiz/clear",
        { params: { tutorialId, userId, level, cache, progress } }
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Gagal menghapus data quiz" }
      );
    }
  }
);

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

      return res.data.entry;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Gagal menyimpan history" }
      );
    }
  }
);

export const clearQuizHistory = createAsyncThunk(
  "quizHistory/clear",
  async (_, { rejectWithValue }) => {
    try {
      clearHistory();
      await axios.delete(
        "https://backend-dc-02.vercel.app/api/quiz/history/clear"
      );
      return true;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Gagal menghapus history" }
      );
    }
  }
);

export const getQuizHistory = createAsyncThunk(
  "quizHistory/get",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        "https://backend-dc-02.vercel.app/api/quiz/history"
      );

      const list = Array.isArray(res.data.history) ? res.data.history : [];

      localStorage.setItem("quiz_history", JSON.stringify(list));

      return list;
    } catch (err) {
      const local = loadHistory();
      if (local.length) return local;

      return rejectWithValue(
        err.response?.data || { message: "Gagal mengambil history" }
      );
    }
  }
);
