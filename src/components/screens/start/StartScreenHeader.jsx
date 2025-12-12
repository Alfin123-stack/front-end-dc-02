import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

export default function StartScreenHeader({ heading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12 max-w-md">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
        {heading || "Memuat judul..."}
      </h1>

      <p className="text-gray-600 dark:text-gray-300 text-lg">
        Pilih level dan mulai tantangan
      </p>
    </motion.div>
  );
}

StartScreenHeader.propTypes = {
  heading: PropTypes.string,
};
