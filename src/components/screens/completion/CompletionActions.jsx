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
  onGoDashboard,
  onShareScore,
  onGoHome, // ← tambahkan prop
}) {
  const base =
    "flex items-center justify-center gap-3 w-full sm:w-auto " +
    "px-5 py-3 md:px-7 md:py-4 rounded-2xl font-semibold md:font-bold " +
    "text-sm md:text-lg select-none transition-all active:scale-95 " +
    "border backdrop-blur-md text-white";

  const hoverAnim = {
    whileHover: { scale: 1.03 },
  };

  return (
    <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 md:gap-5 mt-10 md:mt-12 w-full px-3">
      {/* NEXT LEVEL */}
      {canGoNextLevel && (
        <motion.button
          {...hoverAnim}
          onClick={onNextLevel}
          className={`${base}
            bg-gradient-to-br from-emerald-500 to-emerald-700
            dark:from-emerald-600 dark:to-emerald-800
            border-emerald-400/20
          `}>
          <PiArrowElbowRightBold size={22} />
          <span>Level {currentLevel + 1}</span>
        </motion.button>
      )}

      {/* REVIEW */}
      <motion.button
        {...hoverAnim}
        onClick={onShowReview}
        className={`${base}
          bg-gradient-to-br from-blue-500 to-indigo-600
          dark:from-blue-600 dark:to-indigo-800
          border-blue-400/20
        `}>
        <PiBooksBold size={22} />
        <span>Pembahasan</span>
      </motion.button>

      {/* RETAKE */}
      <motion.button
        {...hoverAnim}
        onClick={onRestart}
        className={`${base}
          bg-gradient-to-br from-gray-600 to-gray-800
          dark:from-zinc-700 dark:to-zinc-900
          border-zinc-400/20
        `}>
        <PiArrowCounterClockwiseBold size={22} />
        <span>Ulangi</span>
      </motion.button>

      {/* HOME — SELALU ADA */}
      <motion.button
        {...hoverAnim}
        onClick={onGoHome}
        className={`${base}
          bg-gradient-to-br from-slate-500 to-slate-700
          dark:from-slate-600 dark:to-slate-800
          border-slate-400/20
        `}>
        <PiHouseBold size={22} />
        <span>Home</span>
      </motion.button>

      {/* DASHBOARD (opsional) */}
      {onGoDashboard && (
        <motion.button
          {...hoverAnim}
          onClick={onGoDashboard}
          className={`${base}
            bg-gradient-to-br from-slate-600 to-slate-800
            dark:from-slate-700 dark:to-slate-900
            border-slate-400/20
          `}>
          <PiHouseBold size={22} />
          <span>Dashboard</span>
        </motion.button>
      )}

      {/* SHARE */}
      {onShareScore && (
        <motion.button
          {...hoverAnim}
          onClick={onShareScore}
          className={`${base}
            bg-gradient-to-br from-purple-500 to-fuchsia-600
            dark:from-purple-600 dark:to-fuchsia-800
            border-purple-400/20
          `}>
          <PiShareFatBold size={22} />
          <span>Bagikan</span>
        </motion.button>
      )}
    </div>
  );
}
