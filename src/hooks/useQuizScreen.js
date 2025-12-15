import { useState, useEffect, useMemo } from "react";

export default function useQuizScreen({
  data,
  onAnswer,
  onNext,
  onSubmit,
  onFinish,
  onAutosaveInit,
}) {
  const [showResult, setShowResult] = useState(false);
  const [lockAction, setLockAction] = useState(false);

  const { quizData, currentQuestion, userAnswers, submittedState } = data;

  const q = useMemo(
    () => quizData?.[currentQuestion] || null,
    [quizData, currentQuestion]
  );

  const selected = userAnswers?.[currentQuestion] || [];

  useEffect(() => {
    if (typeof onAutosaveInit === "function") {
      onAutosaveInit();
    }
  }, [onAutosaveInit]);

  useEffect(() => {
    const isSubmitted =
      submittedState?.[currentQuestion] ||
      submittedState?.[String(currentQuestion)];

    setShowResult(Boolean(isSubmitted));

    setLockAction(false);
  }, [currentQuestion, submittedState]);

  const updateAnswer = (arr) => {
    if (!q || showResult) return;
    onAnswer(arr);
  };

  const toggleSelect = (key) => {
    if (!q || showResult) return;

    const isMultiple = q.type === "multiple_answer";
    const maxCorrect = q.correctAnswers?.length || 1;
    const already = selected.includes(key);

    if (!isMultiple) {
      return updateAnswer([key]);
    }

    if (already) {
      return updateAnswer(selected.filter((v) => v !== key));
    }

    if (selected.length < maxCorrect) {
      return updateAnswer([...selected, key]);
    }

    updateAnswer([...selected.slice(1), key]);
  };

  const handleSubmit = () => {
    if (lockAction || !q) return;

    setLockAction(true);
    onSubmit();
    setShowResult(true);

    setTimeout(() => {
      setLockAction(false);
    }, 260);
  };

  const handleNext = () => {
    if (lockAction || !q) return;

    setLockAction(true);
    setShowResult(false);

    if (currentQuestion < (quizData?.length || 0) - 1) {
      onNext();
      setTimeout(() => {
        setLockAction(false);
      }, 260);
    } else {
      onFinish();
    }
  };

  const isMultiple = q?.type === "multiple_answer";
  const requiredAnswers = q?.correctAnswers?.length || 1;

  const allowSubmit = q
    ? isMultiple
      ? selected.length === requiredAnswers
      : selected.length > 0
    : false;

  const progress =
    quizData?.length > 0 ? ((currentQuestion + 1) / quizData.length) * 100 : 0;

  return {
    q,
    selected,
    showResult,
    lockAction,
    toggleSelect,
    handleSubmit,
    handleNext,
    isMultiple,
    requiredAnswers,
    allowSubmit,
    progress,
  };
}
