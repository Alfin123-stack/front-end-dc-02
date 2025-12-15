import { useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function useReviewScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { level } = useParams();

  const currentLevel = Number(level);
  const query = new URLSearchParams(location.search);

  const tutorialId = Number(query.get("tutorial") || 1);
  const userId = Number(query.get("user") || 1);

  const { quizData, userAnswers, score } = useSelector((state) => state.quiz);

  const handleBackToResult = () => {
    navigate(
      `/completion/${currentLevel}?tutorial=${tutorialId}&user=${userId}`,
      {
        replace: true,
      }
    );
  };

  const isEmpty = useMemo(() => !quizData || quizData.length === 0, [quizData]);

  return {
    quizData,
    userAnswers,
    score,
    tutorialId,
    userId,
    currentLevel,
    handleBackToResult,
    isEmpty,
  };
}
