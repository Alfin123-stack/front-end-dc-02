// src/components/screens/QuizScreen.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaClock, FaInfoCircle, FaLevelUpAlt } from "react-icons/fa";
import { FiSend, FiArrowRight } from "react-icons/fi";
import { htmlToText } from "html-to-text";

import OptionItem from "./quizScreen/OptionItem";
import FeedbackBox from "./quizScreen/FeedbackBox";

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

const getProgressColor = (p) => {
  if (p >= 80) return "bg-[#155dfc]";
  if (p >= 50) return "bg-green-500";
  return "bg-red-500";
};

export default function QuizScreen({
  data,
  onAnswer,
  onNext,
  onSubmit,
  onFinish,
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

  const allowSubmit = Boolean(q)
    ? isMultiple
      ? selected.length === requiredAnswers
      : selected.length > 0
    : false;

  const timeMinutes = Math.floor((timeLeft || 0) / 60);
  const timeSeconds = String((timeLeft || 0) % 60).padStart(2, "0");

  const progress =
    quizData && quizData.length > 0
      ? ((currentQuestion + 1) / quizData.length) * 100
      : 0;

  return (
    <div className="min-h-screen bg-[#f7f9fc] dark:bg-[#0b1220] py-6 sm:py-10 transition-all duration-300">
      <div className="w-full mx-auto max-w-3xl px-3 sm:px-6 lg:px-8">
        {/* HEADER */}
        <motion.header
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white leading-snug">
              {tutorial?.title}
            </h1>

            <motion.div
              whileHover={{ scale: 1.04 }}
              className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white/70 dark:bg-white/10 border border-black/10 dark:border-white/10 backdrop-blur-md">
              <FaLevelUpAlt className="text-yellow-500 text-sm" />
              <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200">
                {q?.difficulty ?? "—"}
              </span>
            </motion.div>
          </div>

          <motion.div
            whileHover={{ scale: 1.04 }}
            className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white/70 dark:bg-white/10 border border-black/10 dark:border-white/10 backdrop-blur-md self-start sm:self-auto">
            <FaClock className="text-sm text-gray-700 dark:text-[#155dfc]" />
            <span
              className={`text-sm font-medium transition-all ${
                timeLeft <= 10
                  ? "text-red-400"
                  : "text-gray-800 dark:text-gray-200"
              }`}>
              {timeMinutes}:{timeSeconds}
            </span>
          </motion.div>
        </motion.header>

        {/* PROGRESS BAR */}
        <div className="mb-6 sm:mb-7">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1 px-1">
            <div>
              Pertanyaan {Math.min(currentQuestion + 1, quizData?.length || 0)}{" "}
              dari {quizData?.length || 0}
            </div>
            <div className="font-semibold text-[#155dfc]">
              {Math.round(progress)}%
            </div>
          </div>

          <div className="w-full h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-white/5 border border-gray-300 dark:border-white/10">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className={`h-full rounded-full ${getProgressColor(progress)}`}
            />
          </div>
        </div>

        {/* QUESTION CARD */}
        <AnimatePresence mode="wait">
          <motion.main
            key={currentQuestion}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            className="p-5 sm:p-7 rounded-3xl mb-8 bg-white/80 dark:bg-[#0f1a27]/40 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.05)] transition-all">
            {/* QUESTION */}
            <div className="flex items-start gap-3 sm:gap-4 mb-6">
              <div className="p-2 rounded-xl bg-[#155dfc]/20 text-[#155dfc] shadow-sm">
                <FaInfoCircle className="text-lg sm:text-xl" />
              </div>

              <h2 className="text-sm sm:text-lg font-semibold leading-relaxed text-gray-900 dark:text-white">
                {htmlToText(q?.question ?? "Soal tidak ditemukan", {
                  wordwrap: false,
                  selectors: [
                    { selector: "img", format: "skip" },
                    {
                      selector: "a",
                      options: { hideLinkHrefIfSameAsText: true },
                    },
                  ],
                })}
              </h2>
            </div>

            {/* OPTIONS */}
            <div className="space-y-3 sm:space-y-4">
              {(q?.options || []).map((opt) => {
                const isSelected = selected.includes(opt.key);
                const isCorrect = (q?.correctAnswers || []).includes(opt.key);

                return (
                  <motion.div
                    key={opt.key}
                    variants={fadeSlide}
                    initial="hidden"
                    animate="visible"
                    className="rounded-2xl overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.04)] bg-white/90 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 transition-all">
                    <OptionItem
                      option={opt}
                      isSelected={isSelected}
                      isMultipleAnswer={isMultiple}
                      onSelect={() => toggleSelect(opt.key)}
                      compact
                    />

                    {showResult && isSelected && (
                      <div className="px-4 pb-4">
                        <FeedbackBox
                          isCorrect={isCorrect}
                          explanation={opt.feedback}
                        />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-8 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
                Pilih jawaban lalu klik{" "}
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  Submit
                </span>
              </div>

              <div className="w-full sm:w-auto">
                {!showResult ? (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: allowSubmit ? 1.03 : 1 }}
                    onClick={handleSubmit}
                    disabled={!allowSubmit || lockAction}
                    className={`w-full sm:w-auto inline-flex justify-center items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all ${
                      allowSubmit && !lockAction
                        ? "bg-[#155dfc] hover:bg-[#1346d6] text-white"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    } ${lockAction ? "opacity-50" : ""}`}>
                    <FiSend className="text-lg" />
                    <span>Submit</span>
                  </motion.button>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: !lockAction ? 1.03 : 1 }}
                    onClick={handleNext}
                    disabled={lockAction}
                    className={`w-full sm:w-auto inline-flex justify-center items-center gap-2 px-6 py-2.5 rounded-xl bg-[#155dfc] hover:bg-[#1346d6] text-white font-semibold ${
                      lockAction ? "opacity-50 cursor-not-allowed" : ""
                    }`}>
                    <span>
                      {currentQuestion < (quizData?.length || 0) - 1
                        ? "Lanjutkan"
                        : "Selesai"}
                    </span>
                    <FiArrowRight className="text-lg" />
                  </motion.button>
                )}
              </div>
            </div>
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
