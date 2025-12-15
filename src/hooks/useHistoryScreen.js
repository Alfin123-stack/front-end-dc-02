import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import { getFilteredHistory, getTotalPages, paginate } from "../utils/helper";
import {
  clearQuizHistory,
  getQuizHistory,
} from "../store/quiz/thunks/quizCacheThunks";
import { ITEMS_LIMIT } from "../utils/constants";

export default function useHistoryScreen(tutorialId) {
  const dispatch = useDispatch();

  const [showConfirm, setShowConfirm] = useState(false);
  const [historyState, setHistoryState] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    dispatch(getQuizHistory())
      .unwrap()
      .then((data) => {
        if (mounted) setHistoryState(data || []);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  const filteredHistory = useMemo(
    () => getFilteredHistory(historyState, tutorialId),
    [historyState, tutorialId]
  );

  const totalPages = getTotalPages(filteredHistory, ITEMS_LIMIT);

  const paginatedHistory = useMemo(
    () => paginate(filteredHistory, page, ITEMS_LIMIT),
    [filteredHistory, page]
  );

  const nextPage = () => page < totalPages && setPage(page + 1);
  const prevPage = () => page > 1 && setPage(page - 1);

  const handleDeleteAll = async () => {
    try {
      await dispatch(clearQuizHistory()).unwrap();
      setHistoryState([]);
      setPage(1);
      setShowConfirm(false);
    } catch (err) {
      console.warn("Gagal clear history", err);
    }
  };

  return {
    loading,
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
