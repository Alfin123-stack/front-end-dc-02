// components/completion/ScoreCard.jsx
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
  /** ===============================
   *  SANITASI & PEMBERSIHAN ANGKA
   * =============================== */
  const cleanScore = Number(score || 0); // Pastikan integer
  const cleanTotal = Number(totalQuestions || 1);

  // Hitung ulang persentase agar tidak salah
  const fixedPercentage = Number(((cleanScore / cleanTotal) * 100).toFixed(2));

  /** ===============================
   *  ICON STATUS
   * =============================== */
  const StatusIcon = () => {
    if (timeUp)
      return (
        <FaClock
          size={100}
          className="mx-auto text-red-400 dark:text-red-300 drop-shadow-xl"
        />
      );

    if (isPassed)
      return (
        <FaTrophy
          size={100}
          className="mx-auto text-yellow-400 drop-shadow-[0_0_20px_rgba(255,200,0,0.6)]"
        />
      );

    return (
      <FaStar
        size={100}
        className="mx-auto text-gray-300 dark:text-gray-500 drop-shadow"
      />
    );
  };

  return (
    <div className="flex flex-col items-center mb-12 w-full px-4">
      {/* ICON STATUS */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 140, damping: 12 }}
        className="mb-6">
        <StatusIcon />
      </motion.div>

      {/* BADGE LEVEL */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          px-5 py-1.5 rounded-full text-sm
          bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20
          dark:from-purple-700/30 dark:to-fuchsia-700/30
          border border-purple-500/40 dark:border-purple-300/30
          text-purple-700 dark:text-purple-200
          font-semibold shadow-md backdrop-blur-md mb-4
        ">
        Level {currentLevel}
      </motion.div>

      {/* HEADER */}
      <h2 className="text-3xl font-extrabold text-center mb-4 tracking-tight">
        {timeUp ? "⏰ Waktu Habis!" : "Level Selesai 🎉"}
      </h2>

      {/* INFO BAR */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          w-full text-center mb-6 px-4 py-3 rounded-2xl 
          bg-blue-100/60 dark:bg-blue-900/40 
          border border-blue-300/40 dark:border-blue-700/40
          shadow-sm backdrop-blur-sm
        ">
        <p className="font-semibold text-sm sm:text-base flex items-center justify-center gap-2 flex-wrap">
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
              <FaCheckCircle /> LULUS 🎉
            </span>
          ) : (
            <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-bold">
              <FaTimesCircle /> BELUM LULUS
            </span>
          )}
        </p>
      </motion.div>

      {/* MAIN SCORE CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`
          relative w-full max-w-md py-10 px-6 rounded-3xl 
          shadow-2xl overflow-hidden border backdrop-blur-xl
          ${
            isPassed
              ? "bg-gradient-to-br from-green-500/80 to-emerald-600/90 border-green-300/40 dark:border-green-800/40"
              : "bg-gradient-to-br from-blue-500/80 to-indigo-600/90 border-indigo-300/40 dark:border-indigo-800/40"
          }
          text-white
        `}>
        {/* Glow Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.2),transparent)] opacity-40" />

        {/* Label */}
        <p className="text-lg text-center opacity-90 flex items-center justify-center gap-2 mb-1">
          <FaChartPie /> Skor Akhir
        </p>

        {/* Big Score */}
        <p className="text-6xl font-extrabold text-center mt-2 drop-shadow-lg">
          {cleanScore} / {cleanTotal}
        </p>

        {/* Percentage */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-4xl font-extrabold text-center mt-2 drop-shadow">
          {fixedPercentage}%
        </motion.p>

        {/* Mini icons */}
        <div className="flex justify-center gap-5 mt-7 opacity-90 text-xl">
          <FaStar className="drop-shadow" />
          <FaStar className="drop-shadow" />
          <FaStar className="drop-shadow" />
        </div>
      </motion.div>
    </div>
  );
}
