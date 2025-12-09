import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiArrowLeft, HiCalendarDays } from "react-icons/hi2";
import { loadHistory } from "../../store/quizSlice";

export default function HistoryScreen() {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const history = loadHistory();

  const query = new URLSearchParams(location.search);
  const tutorialId = Number(query.get("tutorial") || 1);
  const userId = Number(query.get("user") || 1);

  const filteredHistory = history.filter(
    (item) => Number(item.tutorialId) === Number(tutorialId)
  );

  /* ---------------- PAGINATION ---------------- */
  const ITEMS_PER_PAGE = 5;
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE);

  const paginatedHistory = filteredHistory.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const nextPage = () => page < totalPages && setPage(page + 1);
  const prevPage = () => page > 1 && setPage(page - 1);

  /* ---------------- HELPERS ---------------- */
  const getScoreColor = (percentage) => {
    if (percentage >= 70) return "text-green-600 dark:text-green-400";
    if (percentage >= 40) return "text-yellow-500 dark:text-yellow-300";
    return "text-red-500 dark:text-red-400";
  };

  const levelColor = (lvl) => {
    switch (lvl) {
      case 1:
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case 2:
        return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300";
      case 3:
        return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  /* ---------------- DELETE ALL ---------------- */
  const handleDeleteAll = () => {
    localStorage.removeItem("quiz_history");
    setShowConfirm(false);
    navigate(0); // refresh
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d111a] py-10 px-4 text-gray-900 dark:text-gray-200">
      <div className="max-w-xl mx-auto">
        {/* HEADER: BACK + DELETE TOP RIGHT */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 font-medium 
              text-blue-600 dark:text-blue-400 hover:opacity-70 transition-all">
            <HiArrowLeft size={20} />
            Kembali
          </motion.button>

          {filteredHistory.length > 0 && (
            <motion.button
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setShowConfirm(true)}
              className="text-red-600 dark:text-red-400 text-sm font-semibold hover:opacity-70">
              Hapus Riwayat
            </motion.button>
          )}
        </div>

        {/* EMPTY */}
        {filteredHistory.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 rounded-xl text-center
              bg-white dark:bg-[#111827]
              border border-gray-200 dark:border-gray-700
              shadow-sm text-gray-600 dark:text-gray-300">
            Belum ada riwayat untuk tutorial ini.
          </motion.div>
        )}

        {/* LIST + PAGINATION */}
        <div className="space-y-5">
          {paginatedHistory.map((item, i) => {
            const percentage =
              item.score > 1
                ? Math.round(item.score)
                : Math.round(item.score * 100);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="relative p-5 rounded-xl bg-white dark:bg-[#111827]
                  border border-gray-200 dark:border-gray-700
                  shadow-sm hover:shadow-md hover:-translate-y-0.5
                  transition-all duration-300">
                <span
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${levelColor(
                    item.level
                  )}`}>
                  Level {item.level}
                </span>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Nilai
                  </p>
                  <h3
                    className={`text-xl font-bold mt-1 ${getScoreColor(
                      percentage
                    )}`}>
                    {percentage}%
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-5">
                  <HiCalendarDays size={16} />
                  <span className="text-xs font-medium">
                    {new Date(item.timestamp).toLocaleString("id-ID", {
                      timeZone: "Asia/Jakarta",
                      hour12: false,
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() =>
                    navigate(
                      `/history/${item.id}?tutorial=${tutorialId}&user=${userId}`
                    )
                  }
                  className="w-full py-2.5 rounded-lg font-semibold text-sm
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    transition-all shadow-sm">
                  Lihat Detail
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* PAGINATION BUTTONS */}
        {filteredHistory.length > 5 && (
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={prevPage}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg text-sm font-medium 
                ${
                  page === 1
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-900 dark:bg-blue-600 text-white hover:bg-gray-800 dark:hover:bg-blue-700"
                }`}>
              Prev
            </button>

            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
              {page} / {totalPages}
            </span>

            <button
              onClick={nextPage}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-lg text-sm font-medium 
                ${
                  page === totalPages
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-900 dark:bg-blue-600 text-white hover:bg-gray-800 dark:hover:bg-blue-700"
                }`}>
              Next
            </button>
          </div>
        )}
      </div>

      {/* CONFIRM MODAL */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 flex items-center justify-center px-4">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-[#111827] p-6 rounded-xl shadow-xl max-w-sm w-full">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
                Yakin ingin menghapus <b>semua riwayat quiz</b>? Tindakan ini
                tidak bisa dibatalkan.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 dark:bg-gray-700">
                  Batal
                </button>

                <button
                  onClick={handleDeleteAll}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700">
                  Hapus
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
