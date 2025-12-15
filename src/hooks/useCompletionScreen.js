import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";

import {
  calcScorePercentage,
  getScoreColorName,
  scoreColorHex,
  scoreColorText,
} from "../utils/helper";
import { selectScore } from "../store/quiz/quizSelector";

export default function useCompletionScreen() {
  const { level } = useParams();
  const location = useLocation();

  const query = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const levelNum = Number(level || 1);
  const tutorialId = Number(query.get("tutorial") || 1);
  const user = query.get("user") || "";

  const { score = 0 } = useSelector((state) => selectScore(state, tutorialId));

  const percentage = calcScorePercentage(score);
  const color = getScoreColorName(percentage);

  return {
    levelNum,
    tutorialId,
    user,
    score,
    percentage,
    color,
    scoreColorHex,
    scoreColorText,
  };
}
