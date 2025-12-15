import { htmlToText } from "html-to-text";

export const getProgressColor = (p) => {
  if (p >= 80) return "bg-[#155dfc]";
  if (p >= 50) return "bg-green-500";
  return "bg-red-500";
};

export const levelColor = (lvl) => {
  switch (lvl) {
    case 1:
      return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
    case 2:
      return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300";
    case 3:
      return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
    default:
      return "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
  }
};

export const getPercentColor = (p) => {
  if (p <= 55) return "text-red-500";
  if (p <= 80) return "text-yellow-500";
  return "text-green-600";
};

export const formatTimestamp = (ts) => {
  if (!ts) return "Waktu tidak tersedia";

  return new Date(ts).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    hour12: false,
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const calcScorePercentage = (score) =>
  score <= 1 ? Math.round(score * 100) : Math.round(score);

export const scoreColorHex = {
  red: "#ef4444",
  yellow: "#eab308",
  green: "#22c55e",
};

export const scoreColorText = {
  red: "text-red-600 dark:text-red-400",
  yellow: "text-yellow-500 dark:text-yellow-400",
  green: "text-green-500 dark:text-green-400",
};

export const allowNextLevel = (percentage, currentLevel) =>
  percentage >= 60 && currentLevel < 3;

export const getScoreColorName = (p) => {
  if (p < 55) return "red";
  if (p < 80) return "yellow";
  return "green";
};

export const getFilteredHistory = (history, tutorialId) => {
  return history.filter(
    (item) => Number(item.tutorialId) === Number(tutorialId)
  );
};

export const paginate = (items, page, limit) => {
  const start = (page - 1) * limit;
  return items.slice(start, start + limit);
};

export const getTotalPages = (items, limit) => {
  return Math.ceil(items.length / limit);
};

export const getStatusBadge = (status, loading) => {
  const base =
    "px-3 py-1 text-[10px] font-bold rounded-full shadow-sm border backdrop-blur-sm";

  if (loading)
    return {
      className: `${base} bg-gray-500/20 border-gray-400 text-gray-300`,
      label: "Memuat...",
    };

  if (status === "Lanjutkan")
    return {
      className: `${base} bg-yellow-500/20 border-yellow-400 text-yellow-300`,
      label: "Lanjutkan",
    };

  return {
    className: `${base} bg-gray-400/20 border-gray-400 text-gray-300`,
    label: "Mulai",
  };
};

export const getTimeByLevel = (level) => {
  const map = { 1: 60, 2: 75, 3: 90 };
  return map[level] ?? 30;
};

export const difficultyMap = {
  1: "Mudah",
  2: "Sedang",
  3: "Sulit",
};

export function getOptionHighlight({ isUser, isCorrect }) {
  if (isUser && isCorrect) {
    return "border-green-500 bg-green-50 dark:bg-green-900/20";
  }

  if (isUser && !isCorrect) {
    return "border-red-500 bg-red-50 dark:bg-red-900/20";
  }

  if (isCorrect) {
    return "border-green-400 bg-green-50 dark:bg-green-900/10";
  }

  return "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0f172a]";
}

export function shouldShowOptionFeedback({
  showFeedback,
  isUser,
  isCorrect,
  feedback,
}) {
  if (typeof showFeedback === "boolean") return showFeedback;
  return (isUser || isCorrect) && Boolean(feedback);
}

export function toPlainText(html) {
  return htmlToText(html ?? "", {
    wordwrap: false,
    selectors: [{ selector: "img", format: "skip" }],
  });
}

export const getDetailHistory = (history, idDetail) =>
  history.find((h) => String(h.id) === String(idDetail));
