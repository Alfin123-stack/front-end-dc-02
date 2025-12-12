import { createSelector } from "@reduxjs/toolkit";

/* SELECTOR */
export const selectScore = createSelector(
  (state) => state.quiz.score,
  (state) => state.quiz.totalQuestions,
  (score, totalQuestions) => ({ score, totalQuestions })
);
