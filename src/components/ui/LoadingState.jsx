import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

export default function LoadingState({ message = "Memuat data..." }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        p-8 rounded-xl text-center
        bg-white dark:bg-[#111827]
        border border-gray-200 dark:border-gray-700
        shadow-sm
        text-gray-600 dark:text-gray-300
        flex flex-col items-center gap-4
      ">
      <div className="h-6 w-6 rounded-full border-2 border-gray-300 border-t-transparent dark:border-gray-600 animate-spin" />

      <span className="text-sm">{message}</span>
    </motion.div>
  );
}

LoadingState.propTypes = {
  message: PropTypes.string,
};
