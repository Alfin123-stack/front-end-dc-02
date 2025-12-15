export const initialState = {
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

  history: {
    list: [],
    loading: false,
  },

  restored: false,
  quizLoaded: false,
  score: 0,
  totalQuestions: 0,
};
