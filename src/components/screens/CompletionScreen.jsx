"use client";

import React from "react";
import { useSelector } from "react-redux";
import { selectScore } from "../../store/quizSlice";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaHome,
  FaRedo,
  FaBookOpen,
  FaArrowRight,
} from "react-icons/fa";

export default function CompletionScreen() {
  const navigate = useNavigate();
  const { level } = useParams();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const levelNum = Number(level || 1);
  const tutorialId = Number(query.get("tutorial") || 1);
  const user = query.get("user") || "";

  const { score = 0, totalQuestions = 1 } = useSelector((state) =>
    selectScore(state, tutorialId)
  );

  const percentage = Math.round((score / totalQuestions) * 100) || 0;
  const kkm = 60;
  const isPassed = percentage >= kkm;
  const canGoNextLevel = isPassed && levelNum < 3;

  // PROGRESS BAR COLOR LOGIC
  const getColor = () => {
    if (percentage < 60) return "bg-red-500";
    if (percentage < 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          w-full max-w-2xl rounded-3xl p-6 md:p-10
          bg-white/75 dark:bg-gray-900/70
          backdrop-blur-xl border border-white/40 dark:border-gray-800
          shadow-xl
        ">
        {/* STATUS BADGE */}
        <div className="flex flex-col items-center mb-10">
          {isPassed ? (
            <FaCheckCircle className="text-green-500 text-6xl mb-4" />
          ) : (
            <FaTimesCircle className="text-red-500 text-6xl mb-4" />
          )}

          <h1
            className={`
              text-3xl font-extrabold tracking-tight
              ${
                isPassed
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }
            `}>
            {isPassed ? "Selamat! Kamu Lulus 🎉" : "Belum Lulus 😢"}
          </h1>

          <p className="mt-2 text-sm opacity-60">
            KKM: {kkm} • Level {levelNum}
          </p>
        </div>

        {/* SCORE BOX */}
        <div
          className="
            rounded-2xl p-6 mb-10 border shadow-md
            bg-white dark:bg-gray-800
            border-gray-200 dark:border-gray-700
          ">
          <h2 className="text-center text-lg font-medium mb-5 opacity-80">
            Nilai Akhir Kamu
          </h2>

          <p
            className={`
              text-6xl font-black text-center mb-2
              ${
                isPassed
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }
            `}>
            {percentage}%
          </p>

          <p className="text-center text-sm opacity-60">
            {score} jawaban benar dari {totalQuestions} soal
          </p>

          {/* PROGRESS BAR */}
          <div className="mt-6">
            <div className="w-full bg-gray-300/40 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className={`h-full rounded-full ${getColor()}`}
              />
            </div>
          </div>
        </div>

        {/* MESSAGE */}
        <div className="text-center mb-10">
          <p className="text-base opacity-80 leading-relaxed">
            {isPassed
              ? "Kerja bagus! Kamu sudah memahami materi ini dengan baik."
              : "Tetap semangat! Pelajari lagi materinya, kamu pasti bisa."}
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() =>
              navigate(
                `/review/${levelNum}?tutorial=${tutorialId}&user=${user}`
              )
            }
            className="
              flex items-center justify-center gap-2 px-6 py-3 rounded-xl
              bg-blue-600 hover:bg-blue-700 text-white font-semibold
              transition-all shadow
            ">
            <FaBookOpen /> Review Jawaban
          </button>

          <button
            onClick={() =>
              navigate(`/quiz/${levelNum}?tutorial=${tutorialId}&user=${user}`)
            }
            className="
              flex items-center justify-center gap-2 px-6 py-3 rounded-xl
              bg-yellow-500 hover:bg-yellow-600 text-white font-semibold
              transition-all shadow
            ">
            <FaRedo /> Ulangi Quiz
          </button>

          {canGoNextLevel && (
            <button
              onClick={() =>
                navigate(
                  `/quiz/${levelNum + 1}?tutorial=${tutorialId}&user=${user}`
                )
              }
              className="
                flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                bg-green-600 hover:bg-green-700 text-white font-semibold
                transition-all shadow
              ">
              <FaArrowRight /> Lanjut Level {levelNum + 1}
            </button>
          )}

          <button
            onClick={() => navigate(`/?tutorial=${tutorialId}&user=${user}`)}
            className="
              flex items-center justify-center gap-2 px-5 py-3 rounded-xl
              bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600
              text-gray-800 dark:text-gray-200 font-medium transition-all
            ">
            <FaHome /> Kembali ke Beranda
          </button>
        </div>
      </motion.div>
    </div>
  );
}
