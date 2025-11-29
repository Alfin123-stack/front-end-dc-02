import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaClock,
  FaStar,
  FaCode,
  FaTrophy,
  FaInfoCircle,
} from "react-icons/fa";
import { FiSend, FiArrowRight } from "react-icons/fi";

import OptionItem from "./quizScreen/OptionItem";
import FeedbackBox from "./quizScreen/FeedbackBox";
import StatCard from "./quizScreen/StatCard";

export default function QuizScreen({ data, onAnswer, onNext, onFinish }) {
  const [showResult, setShowResult] = useState(false);

  const { tutorial, quizData, currentQuestion, userAnswers, timeLeft } = data;

  const q = quizData[currentQuestion];
  const selected = userAnswers[currentQuestion] || [];

  const updateAnswer = (arr) => onAnswer(arr);

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

  const handleSubmit = () => setShowResult(true);

  const handleNext = () => {
    setShowResult(false);
    currentQuestion < quizData.length - 1 ? onNext() : onFinish();
  };

  const progress = ((currentQuestion + 1) / quizData.length) * 100;
  const allowSubmit = selected.length > 0;

  return (
    <div className="min-h-screen bg-[#E9EEFF] dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <div className="w-full mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center py-8 sm:py-10">
          <h1 className="flex items-center gap-3 text-3xl sm:text-4xl font-bold tracking-wide text-center">
            <FaCode className="text-blue-500" />
            <span>{tutorial?.title}</span>
            <FaTrophy className="text-yellow-400" />
          </h1>

          <div className="mt-3 px-4 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-semibold border border-gray-300 dark:border-gray-700">
            <span className="opacity-70">Tingkat Kesulitan: </span>
            <span className="capitalize text-blue-600 dark:text-blue-400">
              {q.difficulty}
            </span>
          </div>
        </motion.div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto px-2 mb-6">
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

        {/* PROGRESS */}
        <div className="max-w-3xl mx-auto px-2 mb-6">
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

        {/* QUESTION */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="max-w-3xl mx-auto p-6 sm:p-7 rounded-xl border shadow-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          {/* Question Title */}
          <div className="flex items-start gap-3 mb-6">
            <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
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

          {/* CTA */}
          <div className="mt-10 text-center">
            {!showResult ? (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleSubmit}
                disabled={!allowSubmit}
                className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white font-semibold
                  ${
                    allowSubmit
                      ? "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}>
                <FiSend className="text-lg" />
                Submit Jawaban
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white font-semibold bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg">
                {currentQuestion < quizData.length - 1
                  ? "Lanjut Soal Berikutnya"
                  : "Selesai"}
                <FiArrowRight className="text-lg" />
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
