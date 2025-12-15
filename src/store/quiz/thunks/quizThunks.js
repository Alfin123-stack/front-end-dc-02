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
        throw new Error("Failed to fetch tutorial heading");
      }

      return res.data.heading;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to load tutorial heading" }
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
        throw new Error("Invalid parameters");
      }

      const wrap = (data, fromLocal = false, fromBackend = false) => ({
        tutorialId: tID,
        fromLocal,
        fromBackend,
        data,
      });

      const local = loadQuizCache(uID, tID, lvl);
      if (local?.quizData?.length) {
        return wrap(local, true);
      }

      try {
        const res = await axios.get(
          "https://backend-dc-02.vercel.app/api/quiz/cache",
          { params: { tutorialId: tID, userId: uID, level: lvl } }
        );

        if (res?.data?.success && res.data.quizCache) {
          const cached = {
            tutorial: res.data.quizCache.tutorial,
            meta: res.data.quizCache.meta,
            quizData: normalizeQuiz(res.data.quizCache.quizData),
          };

          console.log("Loaded quiz cache from backend:", cached);

          saveQuizCache(uID, tID, lvl, cached);
          return wrap(cached, false, true);
        }
      } catch {
        throw new Error("Failed to cache quiz");
      }

      const gen = await axios.post(
        "https://backend-dc-02.vercel.app/api/quiz/generate",
        { tutorialId: tID, level: lvl }
      );

      if (!gen?.data?.success || !Array.isArray(gen.data.quiz)) {
        throw new Error("Failed to generate quiz");
      }

      const normalized = {
        tutorial: gen.data.tutorial,
        meta: gen.data.meta,
        quizData: normalizeQuiz(gen.data.quiz),
      };

      console.log("Normalized quiz data:", normalized);

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
        err.response?.data || { message: err.message || "Failed to load quiz" }
      );
    }
  }
);
