import React from "react";
import { motion } from "framer-motion";
import OptionItem from "./QuizOptionItem";
import FeedbackBox from "./QuizFeedbackBox";
import PropTypes from "prop-types";

export default function OptionsList({
  options,
  selected,
  correctAnswers,
  showResult,
  isMultiple,
  toggleSelect,
  fadeSlide,
}) {
  return (
    <div className="space-y-3 sm:space-y-4">
      {(options || []).map((opt) => {
        const isSelected = selected.includes(opt.key);
        const isCorrect = (correctAnswers || []).includes(opt.key);

        return (
          <motion.div
            key={opt.key}
            variants={fadeSlide}
            initial="hidden"
            animate="visible"
            className="rounded-2xl overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.04)] bg-white/90 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 transition-all">
            <OptionItem
              option={opt}
              isSelected={isSelected}
              isMultipleAnswer={isMultiple}
              onSelect={() => toggleSelect(opt.key)}
              compact
            />

            {showResult && isSelected && (
              <div className="px-4 pb-4">
                <FeedbackBox isCorrect={isCorrect} explanation={opt.feedback} />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

OptionsList.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      feedback: PropTypes.string,
    })
  ).isRequired,

  selected: PropTypes.arrayOf(PropTypes.string).isRequired,

  correctAnswers: PropTypes.arrayOf(PropTypes.string),

  showResult: PropTypes.bool.isRequired,

  isMultiple: PropTypes.bool,

  toggleSelect: PropTypes.func.isRequired,

  fadeSlide: PropTypes.shape({
    hidden: PropTypes.object,
    visible: PropTypes.object,
  }).isRequired,
};

OptionsList.defaultProps = {
  correctAnswers: [],
  isMultiple: false,
};
