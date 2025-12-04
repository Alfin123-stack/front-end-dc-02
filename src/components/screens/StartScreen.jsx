// src/components/screens/StartScreen.jsx
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadQuiz } from "../../store/quizSlice";
import { useNavigate } from "react-router-dom";

export default function StartScreen({
  onStartQuiz,
  unlockedLevels,
  currentLevel,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const tutorialId = Number(query.get("tutorial") || 1);
  const userId = Number(query.get("user") || 1);

  useEffect(() => {
    dispatch(loadQuiz({ tutorialId }));
  }, [tutorialId, dispatch]);

  const levels = [
    {
      level: 1,
      name: "Mudah",
      time: "1 Menit",
      questions: 3,
      color: "#3b82f6",
    },
    {
      level: 2,
      name: "Sedang",
      time: "1 Menit",
      questions: 3,
      color: "#f59e0b",
    },
    {
      level: 3,
      name: "Sulit",
      time: "1 Menit",
      questions: 3,
      color: "#ef4444",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-12 px-4">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 max-w-md">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-2">
          Web Developer Quiz
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Pilih level dan mulai tantanganmu
        </p>
      </motion.div>

      {/* LEVEL CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {levels.map((lvl, i) => {
          const unlocked = unlockedLevels.includes(lvl.level);
          const current = currentLevel === lvl.level;

          return (
            <motion.div
              key={lvl.level}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={unlocked ? { scale: 1.02 } : {}}>
              <div
                onClick={() => unlocked && onStartQuiz(lvl.level)}
                className={`
                  relative p-6 rounded-2xl transition-all duration-300 cursor-pointer select-none flex flex-col items-center justify-center
                  ${
                    unlocked
                      ? "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md"
                      : "bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-800 opacity-50 cursor-not-allowed"
                  }
                `}>
                {/* Level Title */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  Level {lvl.level} • {lvl.name}
                </h3>

                {/* Info */}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {lvl.time} • {lvl.questions} Soal
                </p>

                {/* Progress */}
                {unlocked && (
                  <div className="mt-4 w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: current ? "100%" : "40%" }}
                      transition={{ duration: 0.5 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: lvl.color }}
                    />
                  </div>
                )}

                {/* Lock Overlay */}
                {!unlocked && (
                  <div className="absolute inset-0 bg-black/10 dark:bg-black/20 rounded-2xl" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* BUTTON HISTORY */}
      <div className="mt-12">
        <button
          onClick={() =>
            navigate(`/history/?tutorial=${tutorialId}&user=${userId}`)
          }
          className="px-8 py-3 rounded-2xl text-base bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">
          Lihat Riwayat Quiz
        </button>
      </div>

      {/* RULES */}
      <div className="mt-12 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 w-full max-w-4xl">
        <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-3">
          Peraturan
        </h2>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
          <li>• Minimal kelulusan: 60% untuk membuka level berikutnya</li>
          <li>• Ada batas waktu di setiap level</li>
          <li>• Selesaikan tiap level untuk menguasai seluruh materi</li>
        </ul>
      </div>
    </div>
  );
}
