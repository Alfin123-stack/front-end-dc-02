import React from "react";
import PropTypes from "prop-types";
import { AnimatePresence } from "framer-motion";

import QuizHeader from "./quiz/QuizHeader";
import QuizProgress from "./quiz/QuizProgress";
import QuestionCard from "./quiz/QuizCard";
import { getProgressColor } from "../../utils/helper";
import useQuizScreen from "../../hooks/useQuizScreen";
import { fadeInUp, fadeSlide } from "../../utils/animations";

export default function QuizScreen(props) {
  const { data } = props;

  const {
    q,
    selected,
    showResult,
    lockAction,
    toggleSelect,
    handleSubmit,
    handleNext,
    isMultiple,
    allowSubmit,
    progress,
  } = useQuizScreen(props);


  const { tutorial, quizData, currentQuestion, timeLeft } = data;

  return (
    <div className="min-h-screen bg-[#f7f9fc] dark:bg-[#0b1220] py-6 sm:py-10 transition-all duration-300">
      <div className="w-full mx-auto max-w-3xl px-3 sm:px-6 lg:px-8">
        <QuizHeader
          tutorial={tutorial}
          timeLeft={timeLeft}
          variants={fadeInUp}
        />

        <QuizProgress
          current={Math.min(currentQuestion + 1, quizData?.length || 0)}
          total={quizData?.length || 0}
          progress={progress}
          getProgressColor={getProgressColor}
        />

        <AnimatePresence mode="wait">
          <QuestionCard
            key={currentQuestion}
            q={q}
            fadeInUp={fadeInUp}
            fadeSlide={fadeSlide}
            selected={selected}
            showResult={showResult}
            isMultiple={isMultiple}
            toggleSelect={toggleSelect}
            allowSubmit={allowSubmit}
            lockAction={lockAction}
            handleSubmit={handleSubmit}
            handleNext={handleNext}
            currentQuestion={currentQuestion}
            total={quizData?.length || 0}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

QuizScreen.propTypes = {
  data: PropTypes.shape({
    tutorial: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      image: PropTypes.string,
    }),

    quizData: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        question: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string,
            text: PropTypes.string.isRequired,
          })
        ).isRequired,
        correctAnswer: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        difficulty: PropTypes.string,
        explanation: PropTypes.string,
      })
    ),

    currentQuestion: PropTypes.number.isRequired,
    timeLeft: PropTypes.number.isRequired,
  }).isRequired,

  onAnswer: PropTypes.func,
  onNext: PropTypes.func,
  onFinish: PropTypes.func,
  saveProgress: PropTypes.func,
  clearProgress: PropTypes.func,
};
