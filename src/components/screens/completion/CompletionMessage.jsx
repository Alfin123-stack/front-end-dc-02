"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaTrophy, FaRegLightbulb, FaMedal } from "react-icons/fa";

export default function CompletionMessage({ percentage, isPassed, kkm }) {
  const state = (() => {
    if (percentage === 100)
      return {
        icon: (
          <FaTrophy
            size={34}
            className="text-white drop-shadow-sm dark:text-yellow-300"
          />
        ),
        titleIcon: (
          <FaTrophy className="text-white dark:text-yellow-300" size={20} />
        ),
        title: "Luar Biasa! 🎉",
        text: "Kamu menjawab semua pertanyaan dengan benar!",
        gradient: "from-yellow-400 to-orange-500",
        gradientDark: "dark:from-yellow-500 dark:to-amber-600",
      };

    if (isPassed)
      return {
        icon: (
          <FaMedal
            size={34}
            className="text-white drop-shadow-sm dark:text-yellow-300"
          />
        ),
        titleIcon: (
          <FaMedal className="text-white dark:text-yellow-300" size={20} />
        ),
        title: "Kamu Lulus! 🏅",
        text: "Nilaimu sudah melewati KKM. Keren banget!",
        gradient: "from-green-500 to-emerald-600",
        gradientDark: "dark:from-green-600 dark:to-emerald-700",
      };

    return {
      icon: (
        <FaRegLightbulb
          size={34}
          className="text-white drop-shadow-sm dark:text-yellow-300"
        />
      ),
      titleIcon: (
        <FaRegLightbulb className="text-white dark:text-yellow-300" size={20} />
      ),
      title: "Semangat Terus! 💡",
      text: `Coba lagi untuk mencapai ${kkm}%.`,
      gradient: "from-blue-500 to-cyan-500",
      gradientDark: "dark:from-blue-600 dark:to-cyan-700",
    };
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full">
      <div
        className={`
          bg-gradient-to-r ${state.gradient} ${state.gradientDark}
          text-white dark:text-gray-100 rounded-3xl px-6 sm:px-7 py-6
          shadow-lg dark:shadow-xl
          flex flex-col sm:flex-row sm:items-center gap-4
        `}>
        {/* ICON BESAR */}
        <div
          className="
            flex items-center justify-center
            bg-white/25 dark:bg-white/10
            rounded-2xl p-3 sm:p-4
            shadow-inner backdrop-blur-sm
          ">
          {state.icon}
        </div>

        {/* TEXT + ICON TITLE */}
        <div className="flex-1">
          <h3 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
            {state.titleIcon}
            {state.title}
          </h3>

          <p className="text-sm sm:text-base opacity-95 mt-1 leading-relaxed">
            {state.text}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
