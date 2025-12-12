// src/components/common/EmptyState.jsx
import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

export default function EmptyState({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 rounded-xl text-center bg-white dark:bg-[#111827]
        border border-gray-200 dark:border-gray-700 shadow-sm
        text-gray-600 dark:text-gray-300">
      {message}
    </motion.div>
  );
}

EmptyState.propTypes = {
  message: PropTypes.string.isRequired,
};
