// components/completion/CompletionActions.jsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  PiArrowElbowRightBold,
  PiBooksBold,
  PiArrowCounterClockwiseBold,
  PiHouseBold,
  PiShareFatBold,
} from "react-icons/pi";

export default function CompletionActions({
  canGoNextLevel,
  currentLevel,
  onNextLevel,
  onShowReview,
  onRestart,
  onGoDashboard, // optional
  onShareScore, // optional
}) {
  const buttonBase =
    "flex items-center gap-3 px-7 py-4 text-lg font-bold rounded-2xl shadow-xl " +
    "transition-all select-none backdrop-blur-sm " +
    "text-white dark:text-white";

  const hoverAnim = {
    whileHover: { scale: 1.07, boxShadow: "0 0 20px rgba(255,255,255,0.25)" },
    whileTap: { scale: 0.95 },
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center flex-wrap gap-5 mt-12">
      {/* NEXT LEVEL */}
      {canGoNextLevel && (
        <motion.button
          onClick={onNextLevel}
          {...hoverAnim}
          className={`${buttonBase} bg-gradient-to-r 
            from-green-400 to-emerald-600 
            dark:from-green-500 dark:to-emerald-700`}>
          <PiArrowElbowRightBold size={24} />
          Lanjut ke Level {currentLevel + 1}
        </motion.button>
      )}

      {/* REVIEW */}
      <motion.button
        onClick={onShowReview}
        {...hoverAnim}
        className={`${buttonBase} bg-gradient-to-r 
          from-blue-500 to-indigo-600 
          dark:from-blue-600 dark:to-indigo-700`}>
        <PiBooksBold size={24} />
        Lihat Pembahasan
      </motion.button>

      {/* RETAKE */}
      <motion.button
        onClick={onRestart}
        {...hoverAnim}
        className={`${buttonBase} bg-gradient-to-r 
          from-gray-600 to-gray-800 
          dark:from-gray-500 dark:to-gray-700`}>
        <PiArrowCounterClockwiseBold size={24} />
        Ulangi Quiz
      </motion.button>

      {/* OPTIONAL — GO TO DASHBOARD */}
      {onGoDashboard && (
        <motion.button
          onClick={onGoDashboard}
          {...hoverAnim}
          className={`${buttonBase} bg-gradient-to-r 
            from-slate-500 to-slate-700 
            dark:from-slate-600 dark:to-slate-800`}>
          <PiHouseBold size={24} />
          Kembali ke Dashboard
        </motion.button>
      )}

      {/* OPTIONAL — SHARE SCORE */}
      {onShareScore && (
        <motion.button
          onClick={onShareScore}
          {...hoverAnim}
          className={`${buttonBase} bg-gradient-to-r 
            from-purple-500 to-fuchsia-600 
            dark:from-purple-600 dark:to-fuchsia-700`}>
          <PiShareFatBold size={24} />
          Bagikan Nilai
        </motion.button>
      )}
    </div>
  );
}
