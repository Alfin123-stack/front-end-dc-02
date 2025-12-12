// src/components/screens/QuizScreen.jsx
import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

import QuizHeader from "./quizScreen/QuizHeader";
import QuizProgress from "./quizScreen/QuizProgress";
import QuestionCard from "./quizScreen/QuestionCard";
import { getProgressColor } from "../../utils/helper";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const fadeSlide = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.22 } },
};

export default function QuizScreen({
  data,
  onAnswer,
  onNext,
  onSubmit,
  onFinish,
  onAutosaveInit, // <<< === tambahkan ini
}) {
  const [showResult, setShowResult] = useState(false);
  const [lockAction, setLockAction] = useState(false);

  const {
    tutorial,
    quizData,
    currentQuestion,
    userAnswers,
    timeLeft,
    submittedState,
  } = data;

  const q = quizData?.[currentQuestion] || null;
  const selected = userAnswers?.[currentQuestion] || [];

  // ========== AUTOSAVE SAAT SCREEN MOUNT ==========
  useEffect(() => {
    if (typeof onAutosaveInit === "function") {
      onAutosaveInit(); // 🔥 panggil autosave awal
    }
  }, []);

  useEffect(() => {
    const isSubmitted = Boolean(submittedState?.[currentQuestion]);
    setShowResult(isSubmitted);
  }, [currentQuestion, submittedState]);

  const updateAnswer = (arr) => {
    if (!q) return;
    onAnswer(arr);
  };

  const toggleSelect = (key) => {
    if (!q) return;
    if (showResult) return;

    const isMultiple = q.type === "multiple_answer";
    const maxCorrect = q.correctAnswers?.length || 1;
    const already = selected.includes(key);

    if (!isMultiple) return updateAnswer([key]);
    if (already) return updateAnswer(selected.filter((v) => v !== key));

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
    setTimeout(() => setLockAction(false), 260);
  };

  const handleNext = () => {
    if (lockAction || !q) return;
    setLockAction(true);
    setShowResult(false);

    if (currentQuestion < (quizData?.length || 0) - 1) {
      onNext();
      setTimeout(() => setLockAction(false), 260);
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
    quizData && quizData.length > 0
      ? ((currentQuestion + 1) / quizData.length) * 100
      : 0;

  return (
    <div className="min-h-screen bg-[#f7f9fc] dark:bg-[#0b1220] py-6 sm:py-10 transition-all duration-300">
      <div className="w-full mx-auto max-w-3xl px-3 sm:px-6 lg:px-8">
        {/* HEADER */}
        <QuizHeader
          tutorial={tutorial}
          difficulty={q?.difficulty}
          timeLeft={timeLeft}
          variants={fadeInUp}
        />

        {/* PROGRESS BAR */}
        <QuizProgress
          current={Math.min(currentQuestion + 1, quizData?.length || 0)}
          total={quizData?.length || 0}
          progress={progress}
          getProgressColor={getProgressColor}
        />

        {/* QUESTION CARD */}
        <AnimatePresence mode="wait">
          <QuestionCard
            key={currentQuestion}
            q={q}
            fadeInUp={fadeInUp}
            fadeSlide={fadeSlide}
            selected={selected}
            showResult={showResult}
            isMultiple={isMultiple}
            toggleSelect={toggleSelect}
            allowSubmit={allowSubmit}
            lockAction={lockAction}
            handleSubmit={handleSubmit}
            handleNext={handleNext}
            currentQuestion={currentQuestion}
            total={quizData?.length || 0}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}
