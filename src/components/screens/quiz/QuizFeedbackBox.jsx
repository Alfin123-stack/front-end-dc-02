import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { htmlToText } from "html-to-text";
import PropTypes from "prop-types";
import React from "react";

export default function FeedbackBox({ isCorrect, explanation }) {
  const cleanExplanation = explanation
    ? htmlToText(explanation, {
        wordwrap: false,
        selectors: [
          { selector: "i", format: "inline" },
          { selector: "b", format: "inline" },
        ],
      })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`
        mt-6 p-5 md:p-6 rounded-2xl border relative overflow-hidden
        shadow-[0_8px_30px_rgb(0,0,0,0.12)]
        transition-all duration-300
        ${
          isCorrect
            ? "border-green-300 bg-gradient-to-br from-green-100/70 to-green-200/40 dark:from-green-900/40 dark:to-green-800/25"
            : "border-red-300 bg-gradient-to-br from-red-100/70 to-red-200/40 dark:from-red-900/40 dark:to-red-800/25"
        }
      `}>
      <div
        className={`
          absolute -top-16 -right-12 w-40 h-40 rounded-full blur-3xl opacity-25
          ${
            isCorrect
              ? "bg-green-300 dark:bg-green-500/40"
              : "bg-red-400 dark:bg-red-600/40"
          }
        `}
      />

      <div className="flex items-center gap-4 mb-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 12 }}>
          {isCorrect ? (
            <FaCheckCircle className="text-green-600 dark:text-green-300 text-3xl md:text-4xl" />
          ) : (
            <FaTimesCircle className="text-red-600 dark:text-red-300 text-3xl md:text-4xl" />
          )}
        </motion.div>

        <div>
          <p
            className={`
              text-base font-bold
              ${
                isCorrect
                  ? "text-green-800 dark:text-green-300"
                  : "text-red-800 dark:text-red-300"
              }
            `}>
            {isCorrect ? "Jawaban Tepat!" : "Jawaban Belum Tepat"}
          </p>

          <span
            className={`
              inline-block mt-1 text-[11px] md:text-xs px-2 py-0.5 rounded-full font-semibold
              shadow-sm
              ${isCorrect ? "bg-green-600 text-white" : "bg-red-600 text-white"}
            `}>
            {isCorrect ? "Benar" : "Salah"}
          </span>
        </div>
      </div>

      <div className="h-[1px] w-full bg-gray-300/70 dark:bg-gray-700/40 my-4" />

      <div className="flex gap-3 md:gap-4">
        <FaInfoCircle className="text-gray-700 dark:text-gray-300 mt-1 text-lg md:text-xl" />

        <div
          className="
          flex-1 leading-relaxed
          text-gray-800 dark:text-gray-100
          bg-white/80 dark:bg-gray-800/50
          p-4 rounded-xl
          border border-gray-200 dark:border-gray-700
          shadow-sm
        ">
          {cleanExplanation ? (
            <p className="text-sm">
              <span className="font-semibold">Penjelasan: </span>
              <br />
              {cleanExplanation}
            </p>
          ) : (
            <p className="italic opacity-70 text-sm md:text-base">
              Tidak ada penjelasan untuk soal ini.
            </p>
          )}
        </div>
      </div>

      <p
        className={`
          mt-4 text-xs md:text-sm italic
          ${
            isCorrect
              ? "text-green-700 dark:text-green-300"
              : "text-red-700 dark:text-red-300"
          }
        `}>
        {isCorrect
          ? "Mantap! Pertahankan ritmemu"
          : "Belum tepat, tapi kamu pasti bisa! Coba lagi ya"}
      </p>
    </motion.div>
  );
}

FeedbackBox.propTypes = {
  isCorrect: PropTypes.bool.isRequired,
  explanation: PropTypes.string,
};
