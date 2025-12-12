// src/components/screens/history/HistoryItemCard.jsx
import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { HiCalendarDays } from "react-icons/hi2";
import {
  calcScorePercentage,
  getPercentColor,
  levelColor,
} from "../../../utils/helper";
import AppButton from "../../ui/AppButton";

export default function HistoryItemCard({
  item,
  index,
  navigate,
  tutorialId,
  userId,
}) {
  const percentage = calcScorePercentage(item.score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="relative p-5 rounded-xl bg-white dark:bg-[#111827]
        border border-gray-200 dark:border-gray-700 shadow-sm
        hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <span
        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${levelColor(
          item.level
        )}`}>
        Level {item.level}
      </span>

      <div className="mb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">Nilai</p>
        <h3 className={`text-xl font-bold mt-1 ${getPercentColor(percentage)}`}>
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

      {/* ========================
          BUTTON PAKAI AppButton
      ======================== */}
      <AppButton
        onClick={() =>
          navigate(`/history/${item.id}?tutorial=${tutorialId}&user=${userId}`)
        }
        variant="primary"
        size="md"
        className="w-full">
        Lihat Detail
      </AppButton>
    </motion.div>
  );
}

/* ================================
   📌 PropTypes
================================ */
HistoryItemCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired,
    timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
  }).isRequired,

  index: PropTypes.number.isRequired,
  navigate: PropTypes.func.isRequired,
  tutorialId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
