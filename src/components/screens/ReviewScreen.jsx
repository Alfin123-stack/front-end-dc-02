// src/components/screens/ReviewScreen.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  HiMiniCheckCircle,
  HiMiniXCircle,
  HiMiniCheckBadge,
  HiMiniXMark,
  HiArrowLeft,
  HiArrowPath,
} from "react-icons/hi2";
import { htmlToText } from "html-to-text";

// Variants animasi halus
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.25 } },
};

const containerStagger = {
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export default function ReviewScreen({ data, onRestart, onBackToResult }) {
  const { quizData, userAnswers, score } = data;

  const percentage = score;
  const percentageColor =
    percentage <= 55
      ? "text-red-600"
      : percentage <= 80
      ? "text-yellow-500"
      : "text-green-600";

  return (
    <div className="min-h-screen py-10 px-4 bg-gray-50 dark:bg-[#0d1320] text-gray-900 dark:text-gray-200">
      {/* HEADER */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Review Jawaban Kamu
        </h1>

        <motion.div
          variants={fadeUp}
          className="mt-6 inline-flex flex-col items-center gap-2 bg-white dark:bg-[#111a2b]
                     px-10 py-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-700 dark:text-gray-400">
            Tingkat benar:{" "}
            <span className={`font-semibold ${percentageColor}`}>
              {percentage}%
            </span>
          </p>
        </motion.div>
      </motion.div>

      {/* LIST REVIEW */}
      <motion.div
        className="max-w-3xl mx-auto space-y-10"
        variants={containerStagger}
        initial="hidden"
        animate="show">
        {quizData.map((q, i) => {
          const userAnswer = userAnswers[i] || [];
          const correctAnswers = q.correctAnswers || [];

          const isCorrect =
            userAnswer.length === correctAnswers.length &&
            userAnswer.every((a) => correctAnswers.includes(a));

          return (
            <motion.div
              key={i}
              variants={fadeUp}
              className="p-6 rounded-2xl bg-white dark:bg-[#111a2b]
                         border border-gray-200 dark:border-gray-700 shadow-md">
              {/* HEADER SOAL */}
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-3">
                  {isCorrect ? (
                    <HiMiniCheckBadge className="text-green-500 text-2xl" />
                  ) : (
                    <HiMiniXMark className="text-red-500 text-2xl" />
                  )}

                  <p className="font-semibold text-lg text-blue-600 dark:text-blue-400">
                    Soal {i + 1}
                  </p>
                </div>

                <span
                  className={`px-4 py-1 text-xs font-medium rounded-full shadow-sm
                      ${
                        isCorrect
                          ? "bg-green-500/20 text-green-600 dark:text-green-400"
                          : "bg-red-500/20 text-red-600 dark:text-red-400"
                      }`}>
                  {isCorrect ? "Benar" : "Salah"}
                </span>
              </div>

              {/* QUESTION */}
              <p className="text-base font-medium mb-4">
                {htmlToText(q.question)}
              </p>

              {/* OPTIONS */}
              <div className="space-y-3">
                {q.options.map((opt) => {
                  const isUser = userAnswer.includes(opt.key);
                  const isTrue = opt.isCorrect === true;

                  const highlight =
                    isUser && isTrue
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : isUser && !isTrue
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : isTrue
                      ? "border-green-400 bg-green-50 dark:bg-green-900/10"
                      : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0f172a]";

                  return (
                    <motion.div
                      key={opt.key}
                      variants={fadeLeft}
                      className={`p-4 rounded-xl border ${highlight}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">
                          {htmlToText(opt.text)}
                        </span>

                        <div className="flex gap-2">
                          {isUser && (
                            <span className="px-2 py-0.5 text-xs rounded bg-blue-600 text-white shadow-sm">
                              Kamu
                            </span>
                          )}
                          {isTrue && (
                            <span className="px-2 py-0.5 text-xs rounded bg-green-600 text-white shadow-sm">
                              Kunci
                            </span>
                          )}
                        </div>
                      </div>

                      {(isUser || isTrue) && opt.feedback && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.22 }}
                          className="mt-3 p-3 rounded-lg bg-white dark:bg-[#162036]
                                     border border-gray-200 dark:border-gray-700">
                          <div className="flex gap-2">
                            {isTrue ? (
                              <HiMiniCheckCircle className="text-green-500 text-lg mt-0.5" />
                            ) : (
                              <HiMiniXCircle className="text-red-500 text-lg mt-0.5" />
                            )}
                            <p className="text-sm">
                              {htmlToText(opt.feedback)}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-14">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            onClick={onBackToResult}
            className="px-7 py-3 font-semibold rounded-xl 
                       bg-gray-800 hover:bg-gray-900 text-white 
                       shadow-md flex items-center gap-2 transition-all">
            <HiArrowLeft />
            Kembali ke Hasil
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            onClick={onRestart}
            className="px-7 py-3 font-semibold rounded-xl
                       bg-blue-600 hover:bg-blue-700 text-white 
                       shadow-md flex items-center gap-2 transition-all">
            <HiArrowPath />
            Ulangi Quiz
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
