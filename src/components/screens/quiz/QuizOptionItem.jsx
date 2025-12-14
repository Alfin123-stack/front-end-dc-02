import {
  FaCheckSquare,
  FaRegSquare,
  FaDotCircle,
  FaRegDotCircle,
} from "react-icons/fa";

import { motion, AnimatePresence } from "framer-motion";
import { htmlToText } from "html-to-text";
import React from "react";
import PropTypes from "prop-types";

export default function OptionItem({
  option,
  isSelected,
  onSelect,
  isMultipleAnswer,
}) {
  return (
    <motion.div
      onClick={onSelect}
      whileTap={{ scale: 0.97 }}
      className={`
        relative p-5 md:p-6 rounded-2xl border cursor-pointer select-none
        overflow-hidden transition-all duration-300 group
        ${
          isSelected
            ? "border-blue-500 bg-blue-500/10 dark:bg-blue-900/30 shadow-lg shadow-blue-500/20"
            : "border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700/60"
        }
      `}>
      <span
        className="
          absolute inset-0 opacity-0 group-active:opacity-100
          bg-blue-300/20 dark:bg-blue-700/20 transition-all duration-[180ms]
        "
      />

      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -10, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="
              absolute left-0 top-0 h-full w-1.5 
              bg-blue-600 dark:bg-blue-500 rounded-r-lg
              shadow-[0_0_10px_2px_rgba(59,130,246,0.45)]
            "
          />
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.22 }}>
            {isMultipleAnswer ? (
              isSelected ? (
                <FaCheckSquare className="text-blue-600 dark:text-blue-400 text-2xl" />
              ) : (
                <FaRegSquare className="text-gray-400 dark:text-gray-300 text-2xl" />
              )
            ) : isSelected ? (
              <FaDotCircle className="text-blue-600 dark:text-blue-400 text-2xl" />
            ) : (
              <FaRegDotCircle className="text-gray-400 dark:text-gray-300 text-2xl" />
            )}
          </motion.div>

          <span
            className="
              font-normal text-gray-900 dark:text-gray-200 
              text-sm leading-snug
            ">
            {htmlToText(option.text || "")}
          </span>
        </div>

        <AnimatePresence>
          {isSelected && (
            <motion.span
              initial={{ y: -6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -6, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="
                px-3 py-1 text-[10px] md:text-xs rounded-full 
                bg-blue-600 text-white dark:bg-blue-700 shadow-md
                tracking-wide
              ">
              Dipilih
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

OptionItem.propTypes = {
  option: PropTypes.shape({
    text: PropTypes.string.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  isMultipleAnswer: PropTypes.bool,
};

OptionItem.defaultProps = {
  isMultipleAnswer: false,
};
