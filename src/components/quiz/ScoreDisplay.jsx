import React from "react";
import { motion } from "framer-motion";

function ScoreDisplay({ score, total, isDarkMode }) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  
  const getScoreColor = () => {
    if (percentage === 100) return "text-green-600 dark:text-green-400";
    if (percentage >= 70) return "text-blue-600 dark:text-blue-400";
    if (percentage >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <motion.div
      className={`p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 ${isDarkMode ? 'dark' : ''}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div 
            className="text-3xl"
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            🏆
          </motion.div>

          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Skor Anda</p>
            <div className="flex items-center gap-2">
              <motion.span
                key={score}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`text-2xl font-bold ${getScoreColor()}`}
              >
                {score} / {total}
              </motion.span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
            percentage === 100 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
            percentage >= 70 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
          }`}>
            {percentage}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default ScoreDisplay;