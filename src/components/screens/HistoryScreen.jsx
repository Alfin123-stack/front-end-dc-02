import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiArrowLeft } from "react-icons/hi";
import { loadHistory } from "../../store/quizSlice";

export default function HistoryScreen() {
  const navigate = useNavigate();
  const history = loadHistory();

  const query = new URLSearchParams(location.search);
  const tutorialId = Number(query.get("tutorial") || 1);
  const userId = Number(query.get("user") || 1);

  return (
    <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#0d1623] py-10">
      <div className="w-full mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* BACK BUTTON */}
        <motion.button
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 font-medium text-[#155dfc] hover:text-[#1346d6] dark:text-[#1e5eff] transition-colors">
          <HiArrowLeft size={20} />
          Kembali
        </motion.button>

        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Riwayat Quiz
        </motion.h1>

        {/* EMPTY STATE */}
        {history.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600 dark:text-gray-300">
            Belum ada riwayat quiz.
          </motion.p>
        )}

        {/* LIST HISTORY */}
        <div className="space-y-5">
          {history.map((item, i) => {
            const percentage = Math.round(
              (item.score / item.totalQuestions) * 100
            );
            const date = item.timestamp
              ? new Date(item.timestamp).toLocaleString()
              : "Waktu tidak tersedia";

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-2xl bg-white dark:bg-[#0f1a27] border-2 border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between gap-4">
                  {/* INFO */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Quiz #{item.tutorialId}
                    </h2>

                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      Skor:{" "}
                      <span className="font-semibold text-[#155dfc]">
                        {item.score}
                      </span>
                      /{item.totalQuestions}
                      <span className="ml-2 text-xs font-semibold text-[#155dfc]">
                        ({percentage}%)
                      </span>
                    </p>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {date}
                    </p>
                  </div>

                  {/* BUTTON DETAIL */}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() =>
                      navigate(
                        `/history/${item.id}?tutorial=${tutorialId}&user=${userId}`
                      )
                    }
                    className="px-5 py-2.5 rounded-xl bg-[#155dfc] hover:bg-[#1346d6] text-white font-semibold text-sm border-2 border-[#155dfc] transition-colors">
                    Detail
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
