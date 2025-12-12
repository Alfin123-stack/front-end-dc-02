/* =====================================================
   LOCALSTORAGE SAFE HELPERS
======================================================*/
const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`❗ Failed to save "${key}"`, error);
  }
};

const safeGet = (key, fallback = null) => {
  try {
    const json = localStorage.getItem(key);
    return json ? JSON.parse(json) : fallback;
  } catch (error) {
    console.warn(`❗ Failed to load "${key}"`, error);
    return fallback;
  }
};

const safeRemove = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`❗ Failed to delete "${key}"`, error);
  }
};

/* =====================================================
   KEY GENERATOR
======================================================*/
export const quizCacheKey = (userId, tutorialId, level) =>
  `quiz_cache:${userId}:${tutorialId}:${level}`;

export const progressKey = (userId, tutorialId, level) =>
  `quiz_progress:${userId}:${tutorialId}:${level}`;

export const HISTORY_KEY = "quiz_history";

/* =====================================================
   QUIZ CACHE (per user + tutorial + level)
======================================================*/
export const saveQuizCache = (userId, tutorialId, level, data) =>
  safeSet(quizCacheKey(userId, tutorialId, level), data);

export const loadQuizCache = (userId, tutorialId, level) =>
  safeGet(quizCacheKey(userId, tutorialId, level), null);

export const deleteQuizCache = (userId, tutorialId, level) =>
  safeRemove(quizCacheKey(userId, tutorialId, level));

/* =====================================================
   PROGRESS (per user + tutorial + level)
======================================================*/
export const saveLocalProgress = (userId, tutorialId, level, data) =>
  safeSet(progressKey(userId, tutorialId, level), data);

export const loadLocalProgress = (userId, tutorialId, level) =>
  safeGet(progressKey(userId, tutorialId, level), null);

export const deleteLocalProgress = (userId, tutorialId, level) =>
  safeRemove(progressKey(userId, tutorialId, level));

/* =====================================================
   HISTORY (GLOBAL)
======================================================*/
export const loadHistory = () => safeGet(HISTORY_KEY, []);

export const saveHistory = (entry) => {
  const list = loadHistory();
  list.unshift(entry); // data terbaru paling atas
  safeSet(HISTORY_KEY, list);
};

export const deleteHistoryItem = (id) => {
  const list = loadHistory();
  const filtered = list.filter((h) => h.id !== id);
  safeSet(HISTORY_KEY, filtered);
};

export const clearHistory = () => safeRemove(HISTORY_KEY);

/* =====================================================
   NORMALIZATION
======================================================*/
export const normalizeQuiz = (quizList = []) => {
  if (!Array.isArray(quizList)) return [];

  return quizList
    .map((q) => {
      const opts = Object.entries(q.options || {}).map(([key, opt]) => ({
        key,
        text: opt?.text ?? "",
        isCorrect: opt?.isCorrect ?? false,
        feedback: opt?.feedback ?? "",
      }));

      return {
        id: q.id,
        question: q.question ?? "",
        explanation: q.explanation ?? "",
        type: q.type ?? "multiple_choice",
        options: opts,
        correctAnswers: opts.filter((o) => o.isCorrect).map((o) => o.key),
        difficulty: q.difficulty ?? "easy",
      };
    })
    .filter((q) => q.question && q.options.length);
};
