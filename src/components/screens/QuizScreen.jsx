// src/components/screens/QuizScreen.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaClock, FaInfoCircle, FaLevelUpAlt } from "react-icons/fa";
import { FiSend, FiArrowRight } from "react-icons/fi";
import { htmlToText } from "html-to-text";

import OptionItem from "./quizScreen/OptionItem";
import FeedbackBox from "./quizScreen/FeedbackBox";

/* ---------- helpers ---------- */
const getProgressColor = (p) => {
  if (p >= 80) return "bg-[#155dfc]";
  if (p >= 50) return "bg-green-500";
  return "bg-red-500";
};

export default function QuizScreen({ data, onAnswer, onNext, onFinish }) {
  const [showResult, setShowResult] = useState(false);
  const [lockAction, setLockAction] = useState(false);

  const { tutorial, quizData, currentQuestion, userAnswers, timeLeft } = data;
  const q = quizData[currentQuestion];
  const selected = userAnswers[currentQuestion] || [];

  /* Update answer */
  const updateAnswer = (arr) => onAnswer(arr);

  /* Select / unselect logic */
  const toggleSelect = (key) => {
    if (showResult) return;

    const isMultiple = q.type === "multiple_answer";
    const maxCorrect = q.correctAnswers?.length || 1;
    const already = selected.includes(key);

    if (!isMultiple) return updateAnswer([key]);
    if (already) return updateAnswer(selected.filter((v) => v !== key));
    if (selected.length < maxCorrect) return updateAnswer([...selected, key]);

    updateAnswer([...selected.slice(1), key]);
  };

  /* Submit */
  const handleSubmit = () => {
    if (lockAction) return;
    setLockAction(true);
    setShowResult(true);
    setTimeout(() => setLockAction(false), 300);
  };

  /* Next or Finish */
  const handleNext = () => {
    if (lockAction) return;
    setLockAction(true);
    setShowResult(false);

    if (currentQuestion < quizData.length - 1) {
      onNext();
      setTimeout(() => setLockAction(false), 300);
    } else {
      onFinish();
    }
  };

  const progress = ((currentQuestion + 1) / quizData.length) * 100;
  const allowSubmit = selected.length > 0;

  const timeMinutes = Math.floor(timeLeft / 60);
  const timeSeconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="min-h-screen bg-[#f7f9fc] dark:bg-[#0b1220] py-10">
      <div className="w-full mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              {tutorial?.title}
            </h1>

            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white/60 dark:bg-white/10 border border-black/10 dark:border-white/10 backdrop-blur-md">
              <FaLevelUpAlt className="text-yellow-500 text-sm" />
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {q.difficulty}
              </span>
            </div>
          </div>

          {/* TIMER */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white/60 dark:bg-white/10 border border-black/10 dark:border-white/10 backdrop-blur-md">
            <FaClock className="text-sm text-gray-700 dark:text-[#155dfc]" />
            <span
              className={`text-sm font-medium ${
                timeLeft <= 10
                  ? "text-red-400"
                  : "text-gray-800 dark:text-gray-200"
              }`}>
              {timeMinutes}:{timeSeconds}
            </span>
          </div>
        </motion.header>

        {/* PROGRESS BAR */}
        <div className="mb-7">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <div>
              Pertanyaan {currentQuestion + 1} dari {quizData.length}
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
        <motion.main
          key={currentQuestion}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="p-7 rounded-3xl mb-8 bg-white/70 dark:bg-[#0f1a27]/40 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.06)]">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-2.5 rounded-xl bg-[#155dfc]/15 text-[#155dfc] shadow-sm">
              <FaInfoCircle className="text-xl" />
            </div>

            <h2 className="text-base sm:text-lg font-semibold leading-relaxed text-gray-900 dark:text-white">
              {htmlToText(q?.question ?? "", {
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
          <div className="space-y-4">
            {q.options.map((opt) => {
              const isSelected = selected.includes(opt.key);
              const isCorrect = q.correctAnswers.includes(opt.key);

              return (
                <motion.div
                  key={opt.key}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.18 }}
                  className="rounded-2xl overflow-hidden shadow-[0_4px_18px_rgba(0,0,0,0.04)] bg-white/80 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 transition-all">
                  <OptionItem
                    option={opt}
                    isSelected={isSelected}
                    isMultipleAnswer={q.type === "multiple_answer"}
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

          {/* ACTIONS */}
          <div className="mt-8 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Pilih jawaban lalu klik{" "}
              <span className="font-medium text-gray-800 dark:text-gray-200">
                Submit
              </span>
            </div>

            <div>
              {!showResult ? (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={!allowSubmit || lockAction}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all ${
                    allowSubmit && !lockAction
                      ? "bg-[#155dfc] hover:bg-[#1346d6] text-white"
                      : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                  } ${lockAction ? "opacity-50" : ""}`}>
                  <FiSend className="text-lg" />
                  <span>Submit</span>
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  disabled={lockAction}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#155dfc] hover:bg-[#1346d6] text-white font-semibold ${
                    lockAction ? "opacity-50 cursor-not-allowed" : ""
                  }`}>
                  <span>
                    {currentQuestion < quizData.length - 1
                      ? "Lanjutkan"
                      : "Selesai"}
                  </span>
                  <FiArrowRight className="text-lg" />
                </motion.button>
              )}
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
