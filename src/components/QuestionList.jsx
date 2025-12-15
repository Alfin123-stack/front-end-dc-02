import React from "react";
import PropTypes from "prop-types";
import QuestionCard from "./QuestionCard";

export default function QuestionList({ quizData, userAnswers }) {
  return (
    <div className="space-y-8">
      {quizData.map((q, i) => (
        <QuestionCard
          key={i}
          data={q}
          index={i}
          userAnswer={userAnswers[i] || []}
          correctAnswer={q.correctAnswers || []}
        />
      ))}
    </div>
  );
}

QuestionList.propTypes = {
  quizData: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      ).isRequired,
      correctAnswers: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      ).isRequired,
    })
  ).isRequired,

  userAnswers: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
  ).isRequired,
};
