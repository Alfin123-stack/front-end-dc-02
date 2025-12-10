// CompletionScreen.jsx
"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectScore,
  clearBackendQuiz,
  deleteLocalQuizCache,
} from "../../store/quizSlice";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { HiBookOpen, HiArrowPath, HiArrowRight, HiHome } from "react-icons/hi2";

export default function CompletionScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { level } = useParams();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const levelNum = Number(level || 1);
  const tutorialId = Number(query.get("tutorial") || 1);
  const user = query.get("user") || "";

  const { score = 0 } = useSelector((state) => selectScore(state, tutorialId));
  const percentage = score <= 1 ? Math.round(score * 100) : Math.round(score);

  const color = percentage < 55 ? "red" : percentage < 80 ? "yellow" : "green";

  const colorHex = {
    red: "#ef4444",
    yellow: "#eab308",
    green: "#22c55e",
  };

  const colorText = {
    red: "text-red-600 dark:text-red-400",
    yellow: "text-yellow-500 dark:text-yellow-400",
    green: "text-green-500 dark:text-green-400",
  };

  const canGoNextLevel = percentage >= 60 && levelNum < 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-b 
        from-blue-50 to-blue-100 
        dark:from-[#0b1120] dark:to-[#0a0f1a]
        py-14 px-5 text-gray-900 dark:text-gray-200">
      <div className="max-w-lg mx-auto">
        {/* CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          whileHover={{ scale: 1.005 }}
          className="
            p-10 rounded-3xl shadow-xl
            bg-white/80 dark:bg-[#111827]/70 backdrop-blur-xl
            border border-white/20 dark:border-gray-700/40
          ">
          {/* TITLE */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`text-3xl font-extrabold ${colorText[color]}`}>
              Level {levelNum} Selesai
            </motion.h1>

            <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
              Berikut hasil latihan kamu
            </p>
          </div>

          {/* SCORE RING */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="flex flex-col items-center mb-10">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg
                className="absolute transform -rotate-90"
                width="170"
                height="170">
                <circle
                  cx="85"
                  cy="85"
                  r="70"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="transparent"
                />
                <circle
                  cx="85"
                  cy="85"
                  r="70"
                  stroke={colorHex[color]}
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={440}
                  strokeDashoffset={440 - (440 * percentage) / 100}
                  strokeLinecap="round"
                  className="transition-[stroke-dashoffset] duration-700 ease-out"
                />
              </svg>

              <p className={`text-4xl font-black ${colorText[color]}`}>
                {percentage}%
              </p>
            </div>

            <p className="text-sm mt-4 text-gray-700 dark:text-gray-300 text-center max-w-xs">
              {percentage >= 80
                ? "Sangat bagus! Kamu sudah paham betul materinya."
                : percentage >= 60
                ? "Lumayan! Kamu sudah memahami sebagian besar."
                : "Belum maksimal, coba ulangi untuk hasil lebih baik."}
            </p>
          </motion.div>

          {/* BUTTONS */}
          <div className="flex flex-col gap-3">
            {/* REVIEW */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                navigate(
                  `/review/${levelNum}?tutorial=${tutorialId}&user=${user}`
                )
              }
              className="
                flex items-center justify-center gap-2 px-5 py-3 rounded-xl
                bg-blue-600 hover:bg-blue-700 text-white font-semibold
                transition shadow-sm
              ">
              <HiBookOpen className="text-lg" />
              Review Jawaban
            </motion.button>

            {/* ULANGI QUIZ */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                navigate(
                  `/quiz/${levelNum}?tutorial=${tutorialId}&user=${user}`
                )
              }
              className="
                flex items-center justify-center gap-2 px-5 py-3 rounded-xl
                font-semibold transition shadow-sm
                bg-gray-200 hover:bg-gray-300 text-gray-900
                dark:bg-[#1f2937] dark:hover:bg-[#374151] dark:text-white
              ">
              <HiArrowPath className="text-lg" />
              Ulangi Quiz
            </motion.button>

            {/* NEXT LEVEL */}
            {canGoNextLevel && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  navigate(
                    `/quiz/${levelNum + 1}?tutorial=${tutorialId}&user=${user}`
                  )
                }
                className="
                  flex items-center justify-center gap-2 px-5 py-3 rounded-xl
                  bg-indigo-600 hover:bg-indigo-700 text-white font-semibold
                  shadow-sm
                ">
                <HiArrowRight className="text-lg" />
                Lanjut ke Level {levelNum + 1}
              </motion.button>
            )}

            {/* BACK HOME */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={async () => {
                await dispatch(
                  clearBackendQuiz({
                    tutorialId,
                    userId: user,
                    level,
                    cache: true,
                    progress: false,
                  })
                );

                deleteLocalQuizCache(user, tutorialId, level);

                navigate(`/?tutorial=${tutorialId}&user=${user}`);
              }}
              className="
                flex items-center justify-center gap-2 px-5 py-3 rounded-xl
                bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold
                dark:bg-[#1f2937] dark:hover:bg-[#374151] dark:text-white
                transition shadow-sm
              ">
              <HiHome className="text-lg" />
              Kembali ke Dashboard
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
