import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { saveQuizCache, normalizeQuiz, loadQuizCache } from "../quizUtils";
import { staticQuizResponse } from "../../../utils/constants";
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
        return rejectWithValue("Gagal mendapatkan heading tutorial.");
      }

      return res.data.heading;
    } catch (err) {
      return rejectWithValue("Gagal menghubungi server (heading).", err);
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

      if ([tID, uID, lvl].some((v) => isNaN(v))) {
        return rejectWithValue("Parameter tidak valid.");
      }

      const wrap = (data, fromLocal = false, fromBackend = false) => ({
        tutorialId: tID,
        fromLocal,
        fromBackend,
        data,
      });

      /* ===============================
         1️⃣ LOCAL QUIZ CACHE
      =============================== */
      const local = loadQuizCache(uID, tID, lvl);
      if (local?.quizData?.length) {
        return wrap(local, true, false);
      }

      /* ===============================
         2️⃣ BACKEND QUIZ CACHE
      =============================== */
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

          saveQuizCache(uID, tID, lvl, cached);
          return wrap(cached, false, true);
        }
      } catch (err) {
        console.warn("⚠️ Backend cache gagal:", err?.message);
      }

      /* ===============================
         3️⃣ GENERATE QUIZ
      =============================== */
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

          console.log("Generated quiz:", normalized);

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
        }
      } catch (err) {
        console.warn("⚠️ Generate API failed:", err?.message);
      }

      /* ===============================
         4️⃣ FALLBACK
      =============================== */
      const resp = staticQuizResponse;
      const fallback = {
        tutorial: resp.tutorial,
        meta: resp.meta,
        quizData: normalizeQuiz(resp.quiz),
      };

      saveQuizCache(uID, tID, lvl, fallback);

      dispatch(
        saveQuizCacheToBackend({
          tutorialId: tID,
          userId: uID,
          level: lvl,
          quiz: fallback,
        })
      );

      return wrap(fallback);
    } catch (err) {
      return rejectWithValue(err?.message || "Terjadi kesalahan.");
    }
  }
);
