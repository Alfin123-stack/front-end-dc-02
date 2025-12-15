import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getQuizHistory } from "../store/quiz/thunks/quizCacheThunks";
import { calcScorePercentage, getDetailHistory } from "../utils/helper";

export default function useHistoryDetailScreen() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { list = [], loading } = useSelector((state) => state.quiz.history);

  useEffect(() => {
    if (!list.length) {
      dispatch(getQuizHistory());
    }
  }, [dispatch, list.length]);

  const item = useMemo(() => getDetailHistory(list, id), [list, id]);

  const percentage = item ? calcScorePercentage(item.score) : 0;

  return {
    loading,
    item,
    percentage,
  };
}
