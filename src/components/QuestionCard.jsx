import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { HiMiniCheckBadge, HiMiniXMark } from "react-icons/hi2";
import { htmlToText } from "html-to-text";

import OptionItem from "./OptionItem";

export default function QuestionCard({
  data,
  index,
  userAnswer,
  correctAnswer,
  animation,
}) {
  const question = data;
  const userAns = userAnswer || [];
  const correctAns = correctAnswer || [];

  const isCorrect =
    userAns.length === correctAns.length &&
    userAns.every((a) => correctAns.includes(a));

  return (
    <motion.div
      variants={animation}
      initial={animation ? "initial" : { opacity: 0, y: 14 }}
      animate={animation ? "animate" : { opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="
        p-6 rounded-3xl
        bg-white/70 dark:bg-[#0f1a27]/40
        backdrop-blur-xl
        border border-black/10 dark:border-white/10
        shadow-[0_8px_40px_rgba(0,0,0,0.06)]
      ">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          {isCorrect ? (
            <HiMiniCheckBadge className="text-green-500 text-xl" />
          ) : (
            <HiMiniXMark className="text-red-500 text-xl" />
          )}

          <p className="font-semibold text-lg text-blue-600">
            Soal {index + 1}
          </p>
        </div>

        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            isCorrect
              ? "bg-green-500/20 text-green-600"
              : "bg-red-500/20 text-red-600"
          }`}>
          {isCorrect ? "Benar" : "Salah"}
        </span>
      </div>

      <p className="text-base font-semibold mb-4">
        {htmlToText(question.question)}
      </p>

      <div className="space-y-3">
        {question.options.map((opt) => {
          const isUser = userAns.includes(opt.key);
          const isTrue = correctAns.includes(opt.key);

          return (
            <OptionItem
              key={opt.key}
              opt={opt}
              isUser={isUser}
              isCorrect={isTrue}
              showFeedback={
                opt.feedback && ((isTrue && !isCorrect) || (isUser && !isTrue))
              }
              animation={animation?.option}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

QuestionCard.propTypes = {
  data: PropTypes.shape({
    question: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        text: PropTypes.string,
        feedback: PropTypes.string,
      })
    ).isRequired,
    correctAnswers: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,

  index: PropTypes.number.isRequired,

  userAnswer: PropTypes.arrayOf(PropTypes.string).isRequired,
  correctAnswer: PropTypes.arrayOf(PropTypes.string).isRequired,

  animation: PropTypes.shape({
    initial: PropTypes.object,
    animate: PropTypes.object,
    option: PropTypes.object,
  }),
};
