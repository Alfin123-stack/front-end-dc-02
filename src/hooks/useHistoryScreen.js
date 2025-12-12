import { useState, useMemo } from "react";

import { clearHistory, loadHistory } from "../store/quiz/quizUtils";
import { getFilteredHistory, getTotalPages, paginate } from "../utils/helper";

export default function useHistoryScreen(tutorialId) {
  const ITEMS_LIMIT = 3;

  // State utama
  const [showConfirm, setShowConfirm] = useState(false);
  const [historyState, setHistoryState] = useState(loadHistory());
  const [page, setPage] = useState(1);

  // Filter by tutorial
  const filteredHistory = useMemo(
    () => getFilteredHistory(historyState, tutorialId),
    [historyState, tutorialId]
  );

  // Pagination
  const totalPages = getTotalPages(filteredHistory, ITEMS_LIMIT);

  const paginatedHistory = useMemo(
    () => paginate(filteredHistory, page, ITEMS_LIMIT),
    [filteredHistory, page]
  );

  const nextPage = () => page < totalPages && setPage(page + 1);
  const prevPage = () => page > 1 && setPage(page - 1);

  // Delete All
  const handleDeleteAll = () => {
    clearHistory();
    setHistoryState([]);
    setPage(1);
    setShowConfirm(false);
  };

  return {
    showConfirm,
    setShowConfirm,
    historyState,
    filteredHistory,
    paginatedHistory,
    totalPages,
    page,
    setPage,
    nextPage,
    prevPage,
    handleDeleteAll,
  };
}
