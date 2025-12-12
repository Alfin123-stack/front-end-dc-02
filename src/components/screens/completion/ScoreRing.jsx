import { motion } from "framer-motion";
import React from "react";
import PropTypes from "prop-types";

export default function ScoreRing({ percentage, color, colorHex, colorText }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      className="flex flex-col items-center mb-6">
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="absolute transform -rotate-90" width="170" height="170">
          <circle
            cx="85"
            cy="85"
            r="70"
            stroke="#e5e7eb"
            strokeWidth="12"
            fill="transparent"
          />

          <circle
            cx="85"
            cy="85"
            r="70"
            stroke={colorHex[color]}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={440}
            strokeDashoffset={440 - (440 * percentage) / 100}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>

        <p className={`text-4xl font-black ${colorText[color]}`}>
          {percentage}%
        </p>
      </div>
    </motion.div>
  );
}

/* ============================
   PROP TYPES
============================ */
ScoreRing.propTypes = {
  percentage: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired, // "red" | "yellow" | "green"
  colorHex: PropTypes.objectOf(PropTypes.string).isRequired,
  colorText: PropTypes.objectOf(PropTypes.string).isRequired,
};
