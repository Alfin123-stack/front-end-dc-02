import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  clearHistory,
  loadHistory,
  loadLocalProgress,
  replaceHistory,
  saveLocalProgress,
} from "../quizUtils";

export const saveQuizCacheToBackend = createAsyncThunk(
  "quiz/saveBackendQuizCache",
  async ({ tutorialId, userId, level, quiz }, { rejectWithValue }) => {
    try {
      console.log("Saving quiz cache to backend:", {
        tutorialId,
        userId,
        level,
        quiz,
      });
      const res = await axios.post(
        "https://backend-dc-02.vercel.app/api/quiz/cache",
        { tutorialId, userId, level, quiz }
      );

      if (!res?.data?.success) {
        return rejectWithValue("Gagal menyimpan quiz cache ke server.");
      }

      console.log("Save quiz cache response:", res.data);

      return res.data;
    } catch (err) {
      console.error("Save quiz cache error:", err.message);
      return rejectWithValue("Gagal menyimpan quiz cache.");
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
      return null;
    }
  }
);

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

      console.log("Save quiz history response:", res.data);
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
      const local = loadHistory();
      if (local.length) {
        axios
          .get("https://backend-dc-02.vercel.app/api/quiz/history")
          .then((res) => {
            if (Array.isArray(res.data.history)) {
              replaceHistory(res.data.history);
            }
          })
          .catch(() => {});
        return local;
      }

      const res = await axios.get(
        "https://backend-dc-02.vercel.app/api/quiz/history"
      );

      const list = res.data.history || [];
      replaceHistory(list);
      return list;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Gagal mengambil history" }
      );
    }
  }
);
