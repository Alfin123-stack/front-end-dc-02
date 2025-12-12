import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { HiArrowLeft } from "react-icons/hi2";
import { fadeUp } from "../utils/animations";
import { formatTimestamp, getPercentColor } from "../utils/helper";
import AppButton from "./ui/AppButton";

export default function QuizHeader({
  mode, // "history" | "review"
  timestamp, // hanya untuk history
  percentage, // untuk keduanya
  onBack, // hanya untuk history
}) {
  const percentColor = getPercentColor(percentage);

  return (
    <div className="mb-10">
      {/* ------------------------------
          HISTORY MODE (dengan tombol back)
      -------------------------------- */}
      {mode === "history" && (
        <>
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8">
            <AppButton
              variant="subtle"
              size="sm"
              iconLeft={<HiArrowLeft size={20} />}
              onClick={onBack}>
              Kembali
            </AppButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
              Detail Riwayat Quiz
            </h1>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {formatTimestamp(timestamp)}
            </p>

            <p className="text-sm mt-2">
              Tingkat benar:{" "}
              <span className={`${percentColor} font-semibold`}>
                {percentage}%
              </span>
            </p>
          </motion.div>
        </>
      )}

      {/* ------------------------------
          REVIEW MODE
      -------------------------------- */}
      {mode === "review" && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Review Jawaban Kamu
          </h1>

          <motion.div
            variants={fadeUp}
            className="mt-6 inline-flex flex-col items-center gap-2 bg-white dark:bg-[#111a2b]
                       px-10 py-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-400">
              Tingkat benar:{" "}
              <span className={`font-semibold ${percentColor}`}>
                {percentage}%
              </span>
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

/* -------------------------------------
   PROP TYPES
-------------------------------------- */
QuizHeader.propTypes = {
  mode: PropTypes.oneOf(["history", "review"]).isRequired,

  timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onBack: PropTypes.func,

  percentage: PropTypes.number.isRequired,
};
