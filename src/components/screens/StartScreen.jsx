// src/components/screens/StartScreen.jsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  loadProgressFromBackend,
  loadTutorialHeading,
} from "../../store/quizSlice";

export default function StartScreen({ onStartQuiz }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const query = new URLSearchParams(location.search);
  const tutorialId = Number(query.get("tutorial") || 1);
  const userId = Number(query.get("user") || 1);

  // ================================
  // LOAD HEADING
  // ================================
  useEffect(() => {
    if (tutorialId) {
      dispatch(loadTutorialHeading({ tutorialId }));
    }
  }, [tutorialId, dispatch]);

  const heading = useSelector((state) => state.quiz.tutorialHeading);

  // ================================
  // LEVEL STATUS
  // ================================
  const [levelStatus, setLevelStatus] = useState({});
  const [loadingStatus, setLoadingStatus] = useState(true);

  useEffect(() => {
    const loadStatus = async () => {
      const status = {};

      for (let level = 1; level <= 3; level++) {
        const result = await dispatch(
          loadProgressFromBackend({ tutorialId, userId, level })
        );

        status[level] = result.payload ? "Lanjutkan" : "Mulai";
      }

      setLevelStatus(status);
      setLoadingStatus(false);
    };

    loadStatus();
  }, [tutorialId, userId, dispatch]);

  // ================================
  // LEVEL CONFIG
  // ================================
  const levels = [
    { level: 1, name: "Mudah", time: "1:00", questions: 3 },
    { level: 2, name: "Sedang", time: "1:15", questions: 3 },
    { level: 3, name: "Sulit", time: "1:30", questions: 3 },
  ];

  // ================================
  // BADGE UI RESPONSIVE
  // ================================
  const renderBadge = (status) => {
    const base =
      "px-3 py-0.5 text-[10px] sm:text-[11px] font-bold rounded-full shadow-sm border backdrop-blur-sm whitespace-nowrap";

    if (loadingStatus) {
      return (
        <span
          className={`${base} bg-gray-500/20 border-gray-400 text-gray-300`}>
          Memuat...
        </span>
      );
    }

    if (status === "Lanjutkan") {
      return (
        <span
          className={`${base} bg-yellow-500/20 border-yellow-400 text-yellow-400 dark:text-yellow-300`}>
          Lanjutkan
        </span>
      );
    }

    return (
      <span
        className={`${base} bg-gray-400/20 border-gray-400 text-gray-500 dark:text-gray-300`}>
        Mulai
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0c1220] flex flex-col items-center py-10 px-4 sm:px-6">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 sm:mb-12 max-w-md">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 leading-tight">
          {heading || "Memuat judul..."}
        </h1>

        <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
          Pilih level dan mulai tantangan
        </p>
      </motion.div>

      {/* LEVEL LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full max-w-4xl">
        {levels.map((lvl, i) => (
          <motion.div
            key={lvl.level}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}>
            <div
              onClick={() => onStartQuiz(lvl.level)}
              className="
                p-5 sm:p-6 rounded-2xl transition-all duration-300 relative
                cursor-pointer select-none flex flex-col items-center
                bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                hover:shadow-md hover:bg-gray-100 hover:dark:bg-gray-700
              ">
              {/* BADGE (RESPONSIVE POSITION) */}
              <div className="absolute -top-2 -right-2 sm:-top-2 sm:-right-2 translate-x-1">
                {renderBadge(levelStatus[lvl.level])}
              </div>

              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1">
                Level {lvl.level} • {lvl.name}
              </h3>

              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {lvl.time} • {lvl.questions} Soal
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* HISTORY BUTTON */}
      <div className="mt-10">
        <button
          onClick={() =>
            navigate(`/history/?tutorial=${tutorialId}&user=${userId}`)
          }
          className="
            px-7 py-3 rounded-xl text-sm sm:text-base
            bg-blue-600 hover:bg-blue-700
            text-white font-semibold transition-colors
          ">
          Riwayat Quiz
        </button>
      </div>

      {/* RULES */}
      <div
        className="
          mt-12 p-5 sm:p-6 rounded-2xl bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700 
          w-full max-w-4xl
        ">
        <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-3">
          Peraturan Quiz
        </h2>

        <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          <li>• Setiap level memiliki 3 soal dengan batas waktu tertentu.</li>
          <li>• Skor dihitung berdasarkan jumlah jawaban benar.</li>
          <li>• Bebas memilih level mana saja.</li>
          <li>• Riwayat quiz disimpan otomatis.</li>
        </ul>
      </div>
    </div>
  );
}
