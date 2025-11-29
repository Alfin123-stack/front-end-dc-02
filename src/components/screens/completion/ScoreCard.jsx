"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FaTrophy,
  FaClock,
  FaStar,
  FaCheckCircle,
  FaTimesCircle,
  FaChartPie,
  FaMedal,
} from "react-icons/fa";

export default function ScoreCard({
  isPassed,
  percentage,
  score,
  totalQuestions,
  timeUp,
  currentLevel,
  kkm,
}) {
  const cleanScore = Number(score || 0);
  const cleanTotal = Number(totalQuestions || 1);
  const fixedPercentage = Number(((cleanScore / cleanTotal) * 100).toFixed(2));

  /** ===============================
   *  STATUS ICON
   * =============================== */
  const StatusIcon = () => {
    if (timeUp)
      return (
        <FaClock
          size={90}
          className="mx-auto text-red-500 dark:text-red-400 drop-shadow"
        />
      );

    if (isPassed)
      return (
        <FaTrophy
          size={90}
          className="mx-auto text-yellow-400 dark:text-yellow-300 drop-shadow"
        />
      );

    return (
      <FaMedal
        size={90}
        className="mx-auto text-gray-300 dark:text-gray-500 drop-shadow"
      />
    );
  };

  return (
    <div className="flex flex-col items-center mb-12 w-full px-4 sm:px-6 lg:px-8">
      {/* STATUS ICON */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 140, damping: 12 }}
        className="mb-6">
        <StatusIcon />
      </motion.div>

      {/* LEVEL BADGE */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          px-5 py-1.5 rounded-full text-sm
          bg-purple-500/15 dark:bg-purple-700/20
          border border-purple-500/30 dark:border-purple-400/20
          text-purple-700 dark:text-purple-200
          font-semibold shadow-sm backdrop-blur
          mb-4
        ">
        Level {currentLevel}
      </motion.div>

      {/* PAGE TITLE */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-4 tracking-tight">
        {timeUp ? "⏰ Waktu Habis" : "Level Selesai 🎉"}
      </h2>

      {/* INFO BAR */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          w-full text-center mb-6 px-4 py-3 rounded-2xl 
          bg-blue-100/60 dark:bg-blue-900/40 
          border border-blue-300/40 dark:border-blue-700/40
          shadow-sm backdrop-blur
        ">
        <p className="font-semibold text-sm sm:text-base flex items-center justify-center gap-3 flex-wrap">
          <span className="flex items-center gap-1">
            <FaChartPie className="text-blue-600 dark:text-blue-300" />
            KKM: <b>{kkm}%</b>
          </span>

          <span>•</span>

          <span className="flex items-center gap-1">
            Nilai Kamu: <b>{fixedPercentage}%</b>
          </span>

          <span>•</span>

          {isPassed ? (
            <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold">
              <FaCheckCircle /> LULUS
            </span>
          ) : (
            <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-bold">
              <FaTimesCircle /> BELUM LULUS
            </span>
          )}
        </p>
      </motion.div>

      {/* SCORE CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className={`
          relative w-full max-w-md py-10 px-6 rounded-3xl 
          shadow-xl overflow-hidden border backdrop-blur-xl
          ${
            isPassed
              ? "bg-gradient-to-br from-green-600 to-emerald-700 dark:from-green-700 dark:to-emerald-800 border-green-300/30 dark:border-green-800/40"
              : "bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 border-blue-300/30 dark:border-blue-800/40"
          }
          text-white
        `}>
        {/* LABEL */}
        <p className="text-lg text-center opacity-90 flex items-center justify-center gap-2 mb-1">
          <FaChartPie /> Skor Akhir
        </p>

        {/* BIG SCORE */}
        <p className="text-6xl sm:text-7xl font-extrabold text-center mt-2 drop-shadow">
          {cleanScore} / {cleanTotal}
        </p>

        {/* PERCENT */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-4xl sm:text-5xl font-extrabold text-center mt-2 drop-shadow">
          {fixedPercentage}%
        </motion.p>

        {/* MINI ICONS */}
        <div className="flex justify-center gap-5 mt-7 opacity-95 text-xl">
          <FaStar className="drop-shadow" />
          <FaStar className="drop-shadow" />
          <FaStar className="drop-shadow" />
        </div>
      </motion.div>
    </div>
  );
}
