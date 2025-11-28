import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaClock,
  FaStar,
  FaCode,
  FaTrophy,
  FaInfoCircle,
  FaSun,
  FaMoon,
  FaCogs,
} from "react-icons/fa";
import { FiSend, FiArrowRight } from "react-icons/fi";

import OptionItem from "./quizScreen/OptionItem";
import FeedbackBox from "./quizScreen/FeedbackBox";
import StatCard from "./quizScreen/StatCard";
import { useNavigate } from "react-router-dom";

export default function QuizScreen({
  data,
  settings,
  onAnswer,
  onNext,
  onFinish,
  onToggleTheme,
}) {
  const navigate = useNavigate();
  const [showResult, setShowResult] = useState(false);

  const { tutorial, quizData, currentQuestion, userAnswers, timeLeft } = data;

  const q = quizData[currentQuestion];
  console.log(q);
  const selected = userAnswers[currentQuestion] || [];

  /* ==========================================================
     UPDATE ANSWER (Redux)
  ========================================================== */
  const updateAnswer = (arr) => {
    onAnswer(arr); // ← langsung kirim ke Redux
  };

  /* ==========================================================
     TOGGLE OPTION
  ========================================================== */
  const toggleSelect = (key) => {
    if (showResult) return;

    const isMultiple = q.type === "multiple_answer";
    const maxCorrect = q.correctAnswers.length;
    const already = selected.includes(key);

    if (!isMultiple) return updateAnswer([key]);
    if (already) return updateAnswer(selected.filter((v) => v !== key));
    if (selected.length < maxCorrect) return updateAnswer([...selected, key]);

    updateAnswer([...selected.slice(1), key]);
  };

  /* ==========================================================
     SUBMIT ANSWER (SHOW RESULT)
  ========================================================== */
  const handleSubmit = () => setShowResult(true);

  /* ==========================================================
     NEXT QUESTION OR FINISH QUIZ
  ========================================================== */
  const handleNext = () => {
    setShowResult(false);

    if (currentQuestion < quizData.length - 1) {
      onNext(); // ← Redux next question
    } else {
      onFinish(); // ← lengkapin quiz
    }
  };

  const progress = ((currentQuestion + 1) / quizData.length) * 100;
  const allowSubmit = selected.length > 0;

  return (
    <div
      className="
        min-h-screen 
        bg-[#E9EEFF] dark:bg-gray-900 
        text-gray-900 dark:text-white
        transition-colors duration-300 rounded-xl
      ">
      <div
        className="
          w-full mx-auto 
          max-w-4xl
          px-4 sm:px-6 lg:px-8 
          py-6
        ">
        {/* SETTINGS BUTTON */}
        <div className="fixed top-6 right-6 z-50">
          <button
            onClick={() => navigate("/settings")}
            className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 border shadow-lg hover:scale-110 transition">
            <FaCogs size={22} />
          </button>
        </div>

        {/* THEME BUTTON */}
        <div className="fixed top-6 left-6 z-50">
          <button
            onClick={onToggleTheme}
            className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 border shadow-lg hover:scale-110 transition">
            {settings.theme === "dark" ? (
              <FaMoon size={22} />
            ) : (
              <FaSun size={22} />
            )}
          </button>
        </div>

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center py-8 sm:py-10">
          {/* Title */}
          <h1
            className="
              flex items-center gap-2 sm:gap-3 
              text-2xl sm:text-3xl lg:text-4xl 
              font-bold tracking-wide text-center
            ">
            <FaCode className="text-blue-500" />
            <span>{tutorial?.title}</span>
            <FaTrophy className="text-yellow-400" />
          </h1>

          {/* Difficulty */}
          <div
            className="
              mt-3 px-3 sm:px-4 py-1.5 
              rounded-full 
              text-xs sm:text-sm font-semibold 
              bg-gray-100 dark:bg-gray-800 
              border border-gray-300 dark:border-gray-700
            ">
            <span className="opacity-70">Tingkat Kesulitan:</span>{" "}
            <span className="capitalize text-blue-600 dark:text-blue-400">
              {q.difficulty}
            </span>
          </div>
        </motion.div>

        {/* STATS */}
        <div
          className="
            grid grid-cols-2 
            gap-3 sm:gap-4 
            max-w-3xl mx-auto 
            px-2 sm:px-4 
            mb-6
          ">
          <StatCard
            icon={<FaClock />}
            label="Sisa Waktu"
            value={`${Math.floor(timeLeft / 60)}:${String(
              timeLeft % 60
            ).padStart(2, "0")}`}
          />

          <StatCard
            icon={<FaStar className="text-yellow-500" />}
            label="Nomor Soal"
            value={`${currentQuestion + 1}/${quizData.length}`}
          />
        </div>

        {/* PROGRESS BAR */}
        <div className="max-w-3xl mx-auto px-2 sm:px-4 mb-6">
          <div className="flex justify-between text-xs sm:text-sm mb-1">
            <span>
              Pertanyaan {currentQuestion + 1} dari {quizData.length}
            </span>
            <span className="text-blue-600 font-bold">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="w-full h-3 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.35 }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
            />
          </div>
        </div>

        {/* QUESTION BLOCK */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className={`
            max-w-3xl mx-auto 
            p-5 sm:p-7 
            rounded-xl border shadow-md
            ${
              settings.theme === "dark"
                ? "bg-[#111827] border-gray-700 shadow-black/20"
                : "bg-white border-gray-200 shadow-gray-200/60"
            }
          `}>
          {/* Question */}
          <div className="flex items-start gap-3 mb-6">
            <div
              className="
                p-2.5 rounded-lg 
                bg-blue-50 dark:bg-blue-900/30 
                text-blue-600 dark:text-blue-300
              ">
              <FaInfoCircle className="text-xl" />
            </div>

            <h2 className="text-lg sm:text-xl font-semibold leading-relaxed">
              {q.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-4">
            {q.options.map((opt) => {
              const isSelected = selected.includes(opt.key);
              const isCorrect = q.correctAnswers.includes(opt.key);

              return (
                <motion.div
                  key={opt.key}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}>
                  <OptionItem
                    option={opt}
                    isSelected={isSelected}
                    isMultipleAnswer={q.type === "multiple_answer"}
                    onSelect={() => toggleSelect(opt.key)}
                  />

                  {showResult && isSelected && (
                    <FeedbackBox
                      isCorrect={isCorrect}
                      explanation={opt.feedback}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* CTA BUTTON */}
          <div className="mt-10 text-center">
            {!showResult ? (
              <motion.button
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.08 }}
                onClick={handleSubmit}
                disabled={!allowSubmit}
                className={`
                  inline-flex items-center gap-2 
                  px-6 sm:px-8 py-3 
                  rounded-xl text-white 
                  font-semibold tracking-wide
                  transition-all duration-300
                  ${
                    allowSubmit
                      ? "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                      : "bg-gray-400 cursor-not-allowed opacity-80"
                  }
                `}>
                <FiSend className="text-lg" />
                <span>Submit Jawaban</span>
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.08 }}
                onClick={handleNext}
                className="
                  inline-flex items-center gap-2 
                  px-6 sm:px-8 py-3 
                  rounded-xl text-white 
                  font-semibold tracking-wide
                  bg-blue-600 hover:bg-blue-700 
                  shadow-md hover:shadow-lg
                ">
                <span>
                  {currentQuestion < quizData.length - 1
                    ? "Lanjut Soal Berikutnya"
                    : "Selesai"}
                </span>
                <FiArrowRight className="text-lg" />
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
