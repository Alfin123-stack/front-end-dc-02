import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";

/* -----------------------------
   normalize helper
----------------------------- */
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

      const cached = quiz.session[id];
      if (cached?.quizData && cached?.tutorial && cached?.meta) {
        return { fromLocal: true, tutorialId: id, data: cached };
      }

      const res = await axios.post(
        "https://backend-dc-02.vercel.app/api/ai/generate",
        { tutorialId: id },
        { headers: { "Content-Type": "application/json" } }
      );

      if (!res.data.success) throw new Error("Gagal memuat soal");

      return {
        fromLocal: false,
        tutorialId: id,
        data: {
          tutorial: res.data.tutorial,
          meta: res.data.meta,
          quizData: normalizeQuiz(res.data.quiz),
        },
      };
    } catch (err) {
      return rejectWithValue(err.message);
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

  // SCORE GLOBAL (FIX)
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
    resetQuiz(state) {
      return { ...initialState, session: state.session };
    },
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

    // SIMPAN session TANPA MENGHAPUS score
    saveSession(state, action) {
      const { tutorialId, data } = action.payload;
      const id = Number(tutorialId);
      state.session[id] = {
        ...(state.session[id] || {}),
        ...data,
      };
    },
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

export const {
  setTime,
  tick,
  startQuiz,
  resetQuiz,
  answerQuestion,
  nextQuestion,
  setScore,
  saveSession,
} = quizSlice.actions;

export default quizSlice.reducer;
