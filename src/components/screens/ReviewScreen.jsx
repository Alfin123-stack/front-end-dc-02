// src/components/screens/ReviewScreen.jsx
<<<<<<< HEAD
import { motion } from "framer-motion";
import React from "react";

=======
import React from "react";
import { motion } from "framer-motion";
>>>>>>> 66c974b (adding history screen)
import {
  HiMiniCheckCircle,
  HiMiniXCircle,
  HiMiniCheckBadge,
  HiMiniXMark,
  HiArrowLeft,
  HiArrowPath,
} from "react-icons/hi2";
import { htmlToText } from "html-to-text";

export default function ReviewScreen({ data, onRestart, onBackToResult }) {
  const { quizData, userAnswers, score, totalQuestions } = data;
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-[#0f172a] dark:to-[#0a1120] text-gray-900 dark:text-gray-200 py-10 px-4">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-teal-400 text-transparent bg-clip-text drop-shadow">
          Review Jawaban Kamu
        </h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 inline-block px-10 py-7 rounded-3xl bg-white dark:bg-[#1e293b] shadow-2xl border border-blue-500/40">
          <p className="font-bold text-2xl flex items-center justify-center gap-2">
            Skor:
            <span className="text-yellow-500 text-4xl">{score}</span>
            <span className="text-gray-500 dark:text-gray-400 text-lg">
              / {totalQuestions}
            </span>
          </p>

          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Tingkat benar: {percentage}%
          </p>
        </motion.div>
      </motion.div>

      {/* CONTENT */}
      <div className="max-w-3xl mx-auto space-y-10">
=======
    <div className="min-h-screen py-12 px-4 bg-gray-50 dark:bg-[#0d1320] text-gray-900 dark:text-gray-200">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
          Review Jawaban
        </h1>

        <div
          className="mt-6 inline-flex flex-col items-center gap-2 
                     bg-white dark:bg-[#111a2b]
                     px-12 py-7 rounded-2xl shadow-md
                     border border-gray-200 dark:border-gray-700">
          <p className="text-xl font-semibold">
            Skor:{" "}
            <span className="text-indigo-500 dark:text-indigo-400 text-4xl font-extrabold">
              {score}
            </span>{" "}
            <span className="text-gray-500">/ {totalQuestions}</span>
          </p>

          <p className="text-sm text-gray-700 dark:text-gray-400">
            Tingkat benar: <span className="font-semibold">{percentage}%</span>
          </p>
        </div>
      </motion.div>

      {/* CONTENT */}
      <div className="max-w-3xl mx-auto space-y-8">
>>>>>>> 66c974b (adding history screen)
        {quizData.map((q, i) => {
          const userAnswer = userAnswers[i] || [];
          const correctAnswers = q.correctAnswers || [];

          const isCorrect =
            userAnswer.length === correctAnswers.length &&
            userAnswer.every((a) => correctAnswers.includes(a));

          return (
            <motion.div
              key={i}
<<<<<<< HEAD
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-7 rounded-3xl bg-white dark:bg-[#1e293b] shadow-2xl border border-gray-200 dark:border-gray-700">
              {/* HEADER SOAL */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  {isCorrect ? (
                    <HiMiniCheckBadge className="text-green-500 text-3xl drop-shadow" />
                  ) : (
                    <HiMiniXMark className="text-red-500 text-3xl drop-shadow" />
                  )}

                  <p className="font-bold text-xl">
                    Soal{" "}
                    <span className="text-blue-600 dark:text-blue-400">
=======
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="p-6 rounded-2xl bg-white dark:bg-[#111a2b]
                         border border-gray-200 dark:border-gray-700 shadow-md">
              {/* HEADER */}
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <HiMiniCheckBadge className="text-green-500 text-2xl" />
                  ) : (
                    <HiMiniXMark className="text-red-500 text-2xl" />
                  )}

                  <p className="font-semibold text-lg">
                    Soal{" "}
                    <span className="text-indigo-500 dark:text-indigo-400">
>>>>>>> 66c974b (adding history screen)
                      {i + 1}
                    </span>
                  </p>
                </div>

                <span
<<<<<<< HEAD
                  className={`px-4 py-1.5 text-xs font-bold rounded-full shadow-md ${
                    isCorrect ? "bg-green-600" : "bg-red-600"
                  } text-white`}>
=======
                  className={`px-3 py-1 text-xs font-medium rounded-full 
                              ${
                                isCorrect
                                  ? "bg-green-500/20 text-green-500"
                                  : "bg-red-500/20 text-red-500"
                              }`}>
>>>>>>> 66c974b (adding history screen)
                  {isCorrect ? "Benar" : "Salah"}
                </span>
              </div>

              {/* QUESTION */}
<<<<<<< HEAD
              <h3 className="text-lg font-semibold mb-4 leading-relaxed">
                {htmlToText(q.question)}
              </h3>

              {/* OPTIONS */}
              <div className="space-y-4">
=======
              <p className="text-base font-medium text-gray-900 dark:text-gray-200 mb-4">
                {htmlToText(q.question)}
              </p>

              {/* OPTIONS */}
              <div className="space-y-3">
>>>>>>> 66c974b (adding history screen)
                {q.options.map((opt) => {
                  const isUser = userAnswer.includes(opt.key);
                  const isTrue = opt.isCorrect === true;

<<<<<<< HEAD
                  // RULE FEEDBACK
                  const showFeedback = isUser || (isTrue && !isUser);
=======
                  const highlight =
                    isUser && isTrue
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : isUser && !isTrue
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : isTrue
                      ? "border-green-400 bg-green-50 dark:bg-green-900/10"
                      : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0f172a]";
>>>>>>> 66c974b (adding history screen)

                  return (
                    <motion.div
                      key={opt.key}
<<<<<<< HEAD
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`p-5 rounded-2xl shadow border ${
                        isUser && isTrue
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : isUser && !isTrue
                          ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                          : isTrue
                          ? "border-green-400 bg-green-50 dark:bg-green-900/10"
                          : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0f172a]"
                      }`}>
                      {/* OPTION TEXT */}
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900 dark:text-gray-200">
=======
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.18 }}
                      className={`p-4 rounded-xl border ${highlight}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">
>>>>>>> 66c974b (adding history screen)
                          {htmlToText(opt.text)}
                        </span>

                        <div className="flex gap-2">
                          {isUser && (
<<<<<<< HEAD
                            <span className="px-3 py-1 text-xs font-bold bg-blue-600 text-white rounded-full shadow">
                              Kamu
                            </span>
                          )}

                          {isTrue && (
                            <span className="px-3 py-1 text-xs font-bold bg-green-600 text-white rounded-full shadow">
=======
                            <span className="px-2 py-0.5 text-xs rounded bg-indigo-600 text-white shadow-sm">
                              Kamu
                            </span>
                          )}
                          {isTrue && (
                            <span className="px-2 py-0.5 text-xs rounded bg-green-600 text-white shadow-sm">
>>>>>>> 66c974b (adding history screen)
                              Kunci
                            </span>
                          )}
                        </div>
                      </div>

<<<<<<< HEAD
                      {/* FEEDBACK CARD PREMIUM */}
                      {showFeedback && opt.feedback && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25 }}
                          className="mt-4 p-4 rounded-xl bg-white dark:bg-[#172033] border border-gray-300 dark:border-gray-700 shadow-md">
                          <div className="flex items-start gap-3">
                            {isTrue ? (
                              <HiMiniCheckCircle className="text-green-500 text-xl mt-1" />
                            ) : (
                              <HiMiniXCircle className="text-red-500 text-xl mt-1" />
                            )}

                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
=======
                      {/* FEEDBACK */}
                      {(isUser || isTrue) && opt.feedback && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.18 }}
                          className="mt-3 p-3 rounded-lg 
                                     bg-white dark:bg-[#162036]
                                     border border-gray-200 dark:border-gray-700">
                          <div className="flex gap-2">
                            {isTrue ? (
                              <HiMiniCheckCircle className="text-green-500 text-lg mt-0.5" />
                            ) : (
                              <HiMiniXCircle className="text-red-500 text-lg mt-0.5" />
                            )}

                            <p className="text-sm text-gray-700 dark:text-gray-300">
>>>>>>> 66c974b (adding history screen)
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
<<<<<<< HEAD
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onBackToResult}
            className="px-8 py-3 font-semibold rounded-xl bg-gray-800 hover:bg-black text-white shadow-md flex items-center gap-2">
            <HiArrowLeft className="text-lg" />
            Kembali ke Hasil
=======
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-14">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onBackToResult}
            className="px-7 py-3 font-semibold rounded-xl 
                       bg-gray-800 hover:bg-gray-900 
                       text-white shadow-md flex items-center gap-2">
            <HiArrowLeft />
            Kembali
>>>>>>> 66c974b (adding history screen)
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onRestart}
<<<<<<< HEAD
            className="px-8 py-3 font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center gap-2">
            <HiArrowPath className="text-lg" />
            Ulangi Quiz
=======
            className="px-7 py-3 font-semibold rounded-xl
                       bg-indigo-600 hover:bg-indigo-700
                       text-white shadow-md flex items-center gap-2">
            <HiArrowPath />
            Ulangi
>>>>>>> 66c974b (adding history screen)
          </motion.button>
        </div>
      </div>
    </div>
  );
}
