import React from "react";
import { motion } from "framer-motion";
import { FaClock, FaLevelUpAlt } from "react-icons/fa";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { difficultyMap } from "../../../utils/helper";

export default function QuizHeader({ tutorial, timeLeft, variants }) {
  const { level } = useParams();
  const numericLevel = Number(level);

  const difficulty = difficultyMap[numericLevel] ?? "—";

  const minutes = Math.floor((timeLeft || 0) / 60);
  const seconds = String((timeLeft || 0) % 60).padStart(2, "0");

  return (
    <motion.header
      variants={variants}
      initial="hidden"
      animate="visible"
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white leading-snug">
          {tutorial?.title}
        </h1>

        <motion.div
          whileHover={{ scale: 1.04 }}
          className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white/70 dark:bg-white/10 border border-black/10 dark:border-white/10 backdrop-blur-md">
          <FaLevelUpAlt className="text-yellow-500 text-sm" />
          <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200">
            {difficulty}
          </span>
        </motion.div>
      </div>

      <motion.div
        whileHover={{ scale: 1.04 }}
        className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white/70 dark:bg-white/10 border border-black/10 dark:border-white/10 backdrop-blur-md self-start sm:self-auto">
        <FaClock className="text-sm text-gray-700 dark:text-[#155dfc]" />
        <span
          className={`text-sm font-medium transition-all ${
            timeLeft <= 10 ? "text-red-400" : "text-gray-800 dark:text-gray-200"
          }`}>
          {minutes}:{seconds}
        </span>
      </motion.div>
    </motion.header>
  );
}

QuizHeader.propTypes = {
  tutorial: PropTypes.shape({
    title: PropTypes.string,
  }),
  timeLeft: PropTypes.number,
  variants: PropTypes.object,
};

QuizHeader.defaultProps = {
  tutorial: { title: "Judul Tidak Ditemukan" },
  timeLeft: 0,
  variants: {},
};
