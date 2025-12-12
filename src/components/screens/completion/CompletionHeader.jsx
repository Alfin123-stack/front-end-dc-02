import { motion } from "framer-motion";
import React from "react";
import PropTypes from "prop-types";

export default function CompletionHeader({ levelNum, color, colorText }) {
  return (
    <div className="text-center mb-8">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`text-3xl font-extrabold ${colorText[color]}`}>
        Level {levelNum} Selesai
      </motion.h1>

      <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
        Berikut hasil latihan kamu
      </p>
    </div>
  );
}

CompletionHeader.propTypes = {
  levelNum: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  colorText: PropTypes.object.isRequired, 
};
