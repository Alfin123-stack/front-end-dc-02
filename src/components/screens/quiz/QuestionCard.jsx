import React from "react";
import { motion } from "framer-motion";
import QuestionText from "./QuestionText";
import OptionsList from "./QuizOptionsList";
import ActionButtons from "./QuizActionButtons";
import PropTypes from "prop-types";

export default function QuestionCard({
  q,
  fadeInUp,
  fadeSlide,
  selected,
  showResult,
  isMultiple,
  toggleSelect,
  allowSubmit,
  lockAction,
  handleSubmit,
  handleNext,
  currentQuestion,
  total,
}) {
  return (
    <motion.main
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
      className="p-5 sm:p-7 rounded-3xl mb-8 bg-white/80 dark:bg-[#0f1a27]/40 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.05)] transition-all">
      <QuestionText question={q?.question} />

      <OptionsList
        options={q?.options}
        selected={selected}
        correctAnswers={q?.correctAnswers}
        showResult={showResult}
        isMultiple={isMultiple}
        toggleSelect={toggleSelect}
        fadeSlide={fadeSlide}
      />

      <ActionButtons
        showResult={showResult}
        allowSubmit={allowSubmit}
        lockAction={lockAction}
        handleSubmit={handleSubmit}
        handleNext={handleNext}
        currentQuestion={currentQuestion}
        total={total}
      />
    </motion.main>
  );
}

/* =====================================================
    PROP TYPES
===================================================== */
QuestionCard.propTypes = {
  q: PropTypes.shape({
    question: PropTypes.string,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        feedback: PropTypes.string,
      })
    ),
    correctAnswers: PropTypes.arrayOf(PropTypes.string),
    difficulty: PropTypes.string,
    type: PropTypes.string,
  }),

  fadeInUp: PropTypes.shape({
    hidden: PropTypes.object,
    visible: PropTypes.object,
  }).isRequired,

  fadeSlide: PropTypes.shape({
    hidden: PropTypes.object,
    visible: PropTypes.object,
  }).isRequired,

  selected: PropTypes.arrayOf(PropTypes.string).isRequired,

  showResult: PropTypes.bool.isRequired,

  isMultiple: PropTypes.bool.isRequired,

  toggleSelect: PropTypes.func.isRequired,

  allowSubmit: PropTypes.bool.isRequired,

  lockAction: PropTypes.bool.isRequired,

  handleSubmit: PropTypes.func.isRequired,

  handleNext: PropTypes.func.isRequired,

  currentQuestion: PropTypes.number.isRequired,

  total: PropTypes.number.isRequired,
};

QuestionCard.defaultProps = {
  q: null,
};
