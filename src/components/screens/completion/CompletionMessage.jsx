// components/completion/CompletionMessage.jsx
"use client";

import React from "react";
import { motion } from "framer-motion";

import {
  FaTrophy,
  FaRegSmileBeam,
  FaRegLightbulb,
  FaMedal,
} from "react-icons/fa";

export default function CompletionMessage({ percentage, isPassed, kkm }) {
  const state = (() => {
    // PERFECT SCORE
    if (percentage === 100)
      return {
        icon: <FaTrophy size={32} className="text-white drop-shadow-md" />,
        title: "Luar Biasa! 🎉",
        text: "Kamu menjawab semua pertanyaan dengan benar. Nilai sempurna!",
        gradientLight: "from-yellow-400 to-orange-500",
        gradientDark: "dark:from-yellow-500 dark:to-orange-600",
      };

    // PASSED (KKM)
    if (isPassed)
      return {
        icon: <FaMedal size={32} className="text-white drop-shadow-md" />,
        title: "Kamu Lulus! 🏅",
        text: "Nilaimu sudah melewati KKM. Pertahankan prestasinya!",
        gradientLight: "from-green-500 to-emerald-600",
        gradientDark: "dark:from-green-600 dark:to-emerald-700",
      };

    // NOT PASSED
    return {
      icon: <FaRegLightbulb size={32} className="text-white drop-shadow-md" />,
      title: "Semangat Terus! 💡",
      text: `Tidak apa-apa, kamu sudah berusaha. Coba lagi untuk mencapai ${kkm}%.`,
      gradientLight: "from-blue-500 to-cyan-500",
      gradientDark: "dark:from-blue-600 dark:to-cyan-600",
    };
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="mb-6">
      <div
        className={`
          bg-gradient-to-r ${state.gradientLight} ${state.gradientDark}
          text-white rounded-3xl px-7 py-6 shadow-xl
          flex flex-col sm:flex-row sm:items-center gap-3
          backdrop-blur-sm
        `}>
        {/* Icon */}
        <div className="flex items-center justify-center bg-white/20 rounded-2xl p-3 shadow-inner">
          {state.icon}
        </div>

        {/* Text */}
        <div>
          <h3 className="text-xl font-extrabold leading-tight drop-shadow-sm">
            {state.title}
          </h3>
          <p className="text-sm sm:text-base opacity-95 font-medium mt-1">
            {state.text}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
