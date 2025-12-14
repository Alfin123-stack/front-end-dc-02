import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadTutorialHeading } from "../store/quiz/thunks/quizThunks";
import { loadProgressFromBackend } from "../store/quiz/thunks/quizCacheThunks";

export function useStartScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const mounted = useRef(true);

  const query = new URLSearchParams(location.search);
  const tutorialId = Number(query.get("tutorial") || 1);
  const userId = Number(query.get("user") || 1);

  useEffect(() => {
    if (!tutorialId) return;
    dispatch(loadTutorialHeading({ tutorialId }));
  }, [tutorialId, dispatch]);

  const heading = useSelector((state) => state.quiz.tutorialHeading);

  const [levelStatus, setLevelStatus] = useState({});
  const [loadingStatus, setLoadingStatus] = useState(true);

  const fetchProgressAll = useCallback(async () => {
    setLoadingStatus(true);

    const levels = [1, 2, 3];

    const promises = levels.map(async (lvl) => {
      const key = `quiz_progress:${userId}:${tutorialId}:${lvl}`;

      try {
        // 1) LOCAL
        const local = localStorage.getItem(key);
        if (local) {
          return { level: lvl, hasProgress: true };
        }

        const res = await dispatch(
          loadProgressFromBackend({
            tutorialId,
            userId,
            level: lvl,
          })
        );

        return { level: lvl, hasProgress: !!res.payload };
      } catch (err) {
        console.warn(`Load progress error (level ${lvl})`, err);
        return { level: lvl, hasProgress: false };
      }
    });

    try {
      const results = await Promise.all(promises);
      if (!mounted.current) return;

      const status = {};
      results.forEach((r) => {
        status[r.level] = r.hasProgress ? "Lanjutkan" : "Mulai";
      });

      setLevelStatus(status);
    } catch {
      if (mounted.current) {
        setLevelStatus({ 1: "Mulai", 2: "Mulai", 3: "Mulai" });
      }
    } finally {
      if (mounted.current) setLoadingStatus(false);
    }
  }, [tutorialId, userId, dispatch]);

  useEffect(() => {
    mounted.current = true;
    fetchProgressAll();
    return () => (mounted.current = false);
  }, [fetchProgressAll]);

  const handleStart = (level) => {
    navigate(`/quiz/${level}?tutorial=${tutorialId}&user=${userId}`);
  };

  const goToHistory = () =>
    navigate(`/history/?tutorial=${tutorialId}&user=${userId}`);

  return {
    heading,
    tutorialId,
    userId,
    loadingStatus,
    levelStatus,
    handleStart,
    goToHistory,
  };
}
