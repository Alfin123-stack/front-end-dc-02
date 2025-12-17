import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { saveQuizCache, normalizeQuiz, loadQuizCache } from "../quizUtils";
import { saveQuizCacheToBackend } from "./quizCacheThunks";

export const loadTutorialHeading = createAsyncThunk(
  "quiz/loadTutorialHeading",
  async ({ tutorialId }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        "https://backend-dc-02.vercel.app/api/tutorial/heading",
        { params: { tutorialId } }
      );

      if (!res?.data?.success) {
        throw new Error("Failed to fetch tutorial heading.");
      }

      return res.data.heading;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || {
          message: "Failed to load tutorial heading.",
        }
      );
    }
  }
);

export const loadQuiz = createAsyncThunk(
  "quiz/loadQuiz",
  async ({ tutorialId, userId, level }, { rejectWithValue, dispatch }) => {
    try {
      const tID = Number(tutorialId);
      const uID = Number(userId);
      const lvl = Number(level);

      if ([tID, uID, lvl].some(Number.isNaN)) {
        throw new Error("Invalid parameters.");
      }

      const wrap = (data, fromLocal = false, fromBackend = false) => ({
        tutorialId: tID,
        fromLocal,
        fromBackend,
        data,
      });

      const isValidQuiz = (q) =>
        q && Array.isArray(q.quizData) && q.quizData.length > 0;

      const clearLocalQuizCache = () => {
        try {
          localStorage.removeItem(`quiz_cache:${uID}:${tID}:${lvl}`);
        } catch (err) {
          console.warn("Failed to clear local quiz cache.", err.message);
        }
      };

      const local = loadQuizCache(uID, tID, lvl);
      if (isValidQuiz(local)) {
        return wrap(local, true);
      }

      try {
        const res = await axios.get(
          "https://backend-dc-02.vercel.app/api/quiz/cache",
          { params: { tutorialId: tID, userId: uID, level: lvl } }
        );

        const qc = res?.data?.quizCache;

        if (res?.data?.success && !qc) {
          clearLocalQuizCache();
        }

        if (res?.data?.success && qc) {
          const cached = {
            tutorial: qc.tutorial,
            meta: qc.meta,
            quizData: normalizeQuiz(qc.quizData),
          };

          if (isValidQuiz(cached)) {
            saveQuizCache(uID, tID, lvl, cached);
            return wrap(cached, false, true);
          }
        }
      } catch (err) {
        console.warn("Failed to load quiz cache from backend.", err.message);
      }

      const gen = await axios.post(
        "https://backend-dc-02.vercel.app/api/quiz/generate",
        { tutorialId: tID, level: lvl }
      );

      if (!gen?.data?.success || !Array.isArray(gen.data.quiz)) {
        throw new Error("Failed to generate quiz.");
      }

      const normalized = {
        tutorial: gen.data.tutorial,
        meta: gen.data.meta,
        quizData: normalizeQuiz(gen.data.quiz),
      };

      if (!isValidQuiz(normalized)) {
        throw new Error("Generated quiz is empty.");
      }

      saveQuizCache(uID, tID, lvl, normalized);

      dispatch(
        saveQuizCacheToBackend({
          tutorialId: tID,
          userId: uID,
          level: lvl,
          quiz: normalized,
        })
      );

      return wrap(normalized);
    } catch (err) {
      return rejectWithValue(
        err.response?.data || {
          message: err.message || "Failed to load quiz.",
        }
      );
    }
  }
);
