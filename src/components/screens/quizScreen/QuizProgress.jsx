import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

export default function QuizProgress({
  current,
  total,
  progress,
  getProgressColor,
}) {
  return (
    <div className="mb-6 sm:mb-7">
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1 px-1">
        <div>
          Pertanyaan {current} dari {total}
        </div>
        <div className="font-semibold text-[#155dfc]">
          {Math.round(progress)}%
        </div>
      </div>

      <div className="w-full h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-white/5 border border-gray-300 dark:border-white/10">
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className={`h-full rounded-full ${getProgressColor(progress)}`}
        />
      </div>
    </div>
  );
}

QuizProgress.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  progress: PropTypes.number.isRequired,
  getProgressColor: PropTypes.func.isRequired,
};
