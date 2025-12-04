<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaClock,
  FaStar,
  FaCode,
  FaTrophy,
  FaInfoCircle,
} from "react-icons/fa";
=======
// src/components/screens/QuizScreen.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaClock, FaInfoCircle, FaLevelUpAlt } from "react-icons/fa";
>>>>>>> 66c974b (adding history screen)
import { FiSend, FiArrowRight } from "react-icons/fi";

import OptionItem from "./quizScreen/OptionItem";
import FeedbackBox from "./quizScreen/FeedbackBox";
<<<<<<< HEAD
import StatCard from "./quizScreen/StatCard";

import { htmlToText } from "html-to-text";

// Progress color
=======
import { htmlToText } from "html-to-text";

/* ---------- helper ---------- */
>>>>>>> 66c974b (adding history screen)
const getProgressColor = (p) => {
  if (p >= 80) return "bg-[#155dfc]";
  if (p >= 50) return "bg-green-500";
  return "bg-red-500";
};

export default function QuizScreen({ data, onAnswer, onNext, onFinish }) {
  const [showResult, setShowResult] = useState(false);

<<<<<<< HEAD
=======
  // FIX: lock double-click submit/next
  const [lockAction, setLockAction] = useState(false);

>>>>>>> 66c974b (adding history screen)
  const { tutorial, quizData, currentQuestion, userAnswers, timeLeft } = data;

  const q = quizData[currentQuestion];
  const selected = userAnswers[currentQuestion] || [];

<<<<<<< HEAD
  /* -------------------------
    SAFE UPDATE ANSWER
  ---------------------------- */
  const updateAnswer = (arr) => {
    onAnswer(arr); // Redux update
  };

  /* -------------------------
    HANDLE SELECT OPTION
  ---------------------------- */
=======
  /* Update answer */
  const updateAnswer = (arr) => onAnswer(arr);

  /* Toggle select */
>>>>>>> 66c974b (adding history screen)
  const toggleSelect = (key) => {
    if (showResult) return;

    const isMultiple = q.type === "multiple_answer";
    const maxCorrect = q.correctAnswers?.length || 1;
    const already = selected.includes(key);

<<<<<<< HEAD
    // SINGLE ANSWER (MCQ / TRUE-FALSE)
    if (!isMultiple) {
      return updateAnswer([key]);
    }

    // UNSELECT (multiple answer)
    if (already) {
      return updateAnswer(selected.filter((v) => v !== key));
    }

    // SELECT NEW (limit == jumlah jawaban benar)
    if (selected.length < maxCorrect) {
      return updateAnswer([...selected, key]);
    }

    // Jika lebih → geser array (auto replace)
    updateAnswer([...selected.slice(1), key]);
  };

  /* -------------------------
    SUBMIT & NEXT
  ---------------------------- */
  const handleSubmit = () => setShowResult(true);

  const handleNext = () => {
    setShowResult(false);
    if (currentQuestion < quizData.length - 1) return onNext();
    return onFinish();
  };

  /* -------------------------
    PROGRESS BAR
  ---------------------------- */
  const progress = ((currentQuestion + 1) / quizData.length) * 100;
  const allowSubmit = selected.length > 0;

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-[#1e2939] dark:text-[#d1d5dc]">
      <div className="w-full mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 border border-[#155dfc] rounded-xl">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center py-8">
          <h1 className="flex items-center gap-3 text-3xl sm:text-4xl font-bold text-center">
            <FaCode className="text-[#155dfc]" />
            <span className="leading-tight">{tutorial?.title}</span>
            <FaTrophy className="text-yellow-400" />
          </h1>

          {/* Difficulty */}
          <div className="mt-3 px-4 py-1.5 rounded-full bg-[#F1F5F9] dark:bg-[#101828] border border-[#155dfc] text-sm font-medium">
            <span className="opacity-70 mr-1">Tingkat Kesulitan:</span>
            <span className="capitalize text-[#155dfc] font-semibold">
              {q.difficulty}
            </span>
          </div>
        </motion.div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto px-2 mb-8">
          <StatCard
            icon={<FaClock />}
            label="Sisa Waktu"
            value={`${Math.floor(timeLeft / 60)}:${String(
              timeLeft % 60
            ).padStart(2, "0")}`}
            isDanger={timeLeft <= 10}
          />

          <StatCard
            icon={<FaStar className="text-yellow-500" />}
            label="Nomor Soal"
            value={`${currentQuestion + 1}/${quizData.length}`}
          />
        </div>

        {/* PROGRESS BAR */}
        <div className="max-w-3xl mx-auto px-2 mb-8">
          <div className="flex justify-between text-xs sm:text-sm mb-1">
            <span>
              Pertanyaan {currentQuestion + 1} dari {quizData.length}
            </span>
            <span className="font-bold text-[#155dfc]">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="w-full h-3 bg-gray-300/50 dark:bg-[#101828] rounded-full overflow-hidden">
=======
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
      onFinish(); // FINAL — will trigger ONLY once
    }
  };

  const progress = ((currentQuestion + 1) / quizData.length) * 100;
  const allowSubmit = selected.length > 0;

  const timeMinutes = Math.floor(timeLeft / 60);
  const timeSeconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="min-h-screen bg-[#f7f9fc] dark:bg-[#0b1220] py-10">
      <div className="w-full mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* TOP BAR */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              {tutorial?.title}
            </h1>

            {/* Level Badge */}
            <div
              className="
              flex items-center gap-2 px-3 py-1 rounded-xl
              bg-white/60 dark:bg-white/10
              border border-black/10 dark:border-white/10
              backdrop-blur-md
            ">
              <FaLevelUpAlt className="text-yellow-500 text-sm" />
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {q.difficulty}
              </span>
            </div>
          </div>

          {/* Timer */}
          <div
            className="
            flex items-center gap-2 px-3 py-1 rounded-xl
            bg-white/60 dark:bg-white/10
            border border-black/10 dark:border-white/10
            backdrop-blur-md
          ">
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

          <div
            className="
            w-full h-2 rounded-full overflow-hidden
            bg-gray-200 dark:bg-white/5 border border-gray-300 dark:border-white/10
          ">
>>>>>>> 66c974b (adding history screen)
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className={`h-full rounded-full ${getProgressColor(progress)}`}
            />
          </div>
        </div>

<<<<<<< HEAD
        {/* QUESTION */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="max-w-3xl mx-auto p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#101828] border border-[#155dfc]">
          {/* QUESTION TITLE */}
          <div className="flex items-start gap-3 mb-6">
            <div className="p-2.5 rounded-lg bg-[#155dfc]/15 text-[#155dfc] dark:bg-[#155dfc]/25">
              <FaInfoCircle className="text-xl" />
            </div>

            <h2 className="text-lg sm:text-xl font-semibold leading-relaxed">
=======
        {/* QUESTION CARD */}
        <motion.main
          key={currentQuestion}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="
            p-7 rounded-3xl mb-8
            bg-white/70 dark:bg-[#0f1a27]/40
            backdrop-blur-xl
            border border-black/10 dark:border-white/10
            shadow-[0_8px_40px_rgba(0,0,0,0.06)]
          ">
          {/* QUESTION HEADER */}
          <div className="flex items-start gap-4 mb-6">
            <div className="p-2.5 rounded-xl bg-[#155dfc]/15 text-[#155dfc] shadow-sm">
              <FaInfoCircle className="text-xl" />
            </div>

            <h2 className="text-base sm:text-lg font-semibold leading-relaxed text-gray-900 dark:text-white">
>>>>>>> 66c974b (adding history screen)
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
<<<<<<< HEAD
                  transition={{ duration: 0.22 }}>
=======
                  transition={{ duration: 0.18 }}
                  className="
                    rounded-2xl overflow-hidden 
                    shadow-[0_4px_18px_rgba(0,0,0,0.04)]
                    bg-white/80 dark:bg-white/5 backdrop-blur-md
                    border border-gray-200 dark:border-white/10
                    hover:bg-white dark:hover:bg-white/10
                    transition-all
                  ">
>>>>>>> 66c974b (adding history screen)
                  <OptionItem
                    option={opt}
                    isSelected={isSelected}
                    isMultipleAnswer={q.type === "multiple_answer"}
                    onSelect={() => toggleSelect(opt.key)}
<<<<<<< HEAD
                  />

                  {showResult && isSelected && (
                    <FeedbackBox
                      isCorrect={isCorrect}
                      explanation={opt.feedback}
                    />
=======
                    compact
                  />

                  {showResult && isSelected && (
                    <div className="px-4 pb-4">
                      <FeedbackBox
                        isCorrect={isCorrect}
                        explanation={opt.feedback}
                      />
                    </div>
>>>>>>> 66c974b (adding history screen)
                  )}
                </motion.div>
              );
            })}
          </div>

<<<<<<< HEAD
          {/* SUBMIT / NEXT */}
          <div className="mt-10 text-center">
            {!showResult ? (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleSubmit}
                disabled={!allowSubmit}
                className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white font-semibold transition-all ${
                  allowSubmit
                    ? "bg-[#155dfc] hover:bg-blue-700"
                    : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                }`}>
                <FiSend className="text-lg" />
                Submit Jawaban
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white font-semibold bg-[#155dfc] hover:bg-blue-700">
                {currentQuestion < quizData.length - 1
                  ? "Lanjut Soal Berikutnya"
                  : "Selesai"}
                <FiArrowRight className="text-lg" />
              </motion.button>
            )}
          </div>
        </motion.div>
=======
          {/* ACTION BUTTONS */}
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
                  className={`
                    inline-flex items-center gap-2 px-6 py-2.5 rounded-xl
                    font-semibold transition-all
                    ${
                      allowSubmit && !lockAction
                        ? "bg-[#155dfc] hover:bg-[#1346d6] text-white"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    }
                    ${lockAction ? "opacity-50" : ""}
                  `}>
                  <FiSend className="text-lg" />
                  <span>Submit</span>
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  disabled={lockAction}
                  className={`
                    inline-flex items-center gap-2 px-6 py-2.5 rounded-xl
                    bg-[#155dfc] hover:bg-[#1346d6] text-white font-semibold
                    ${lockAction ? "opacity-50 cursor-not-allowed" : ""}
                  `}>
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
>>>>>>> 66c974b (adding history screen)
      </div>
    </div>
  );
}
