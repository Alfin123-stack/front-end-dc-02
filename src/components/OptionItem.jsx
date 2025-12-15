import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { htmlToText } from "html-to-text";
import { HiMiniCheckCircle, HiMiniXCircle } from "react-icons/hi2";

const getOptionHighlight = (isUser, isCorrect) => {
  if (isUser && isCorrect) {
    return "border-green-500 bg-green-50 dark:bg-green-900/20";
  }

  if (isUser && !isCorrect) {
    return "border-red-500 bg-red-50 dark:bg-red-900/20";
  }

  if (isCorrect) {
    return "border-green-400 bg-green-50 dark:bg-green-900/10";
  }

  return "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0f172a]";
};

const shouldShowOptionFeedback = (
  showFeedback,
  isUser,
  isCorrect,
  feedback
) => {
  if (typeof showFeedback === "boolean") return showFeedback;
  return (isUser || isCorrect) && Boolean(feedback);
};

const toPlainText = (html) =>
  htmlToText(html ?? "", {
    wordwrap: false,
  });

export default function OptionItem({
  opt,
  isUser,
  isCorrect,
  showFeedback,
  animation,
}) {
  const highlight = getOptionHighlight(isUser, isCorrect);

  const shouldShowFeedback = shouldShowOptionFeedback(
    showFeedback,
    isUser,
    isCorrect,
    opt.feedback
  );

  return (
    <motion.div
      variants={animation}
      initial={animation ? "initial" : { opacity: 0 }}
      animate={animation ? "animate" : { opacity: 1 }}
      className={`p-4 rounded-xl border ${highlight}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="font-medium">{toPlainText(opt.text)}</span>

        <div className="flex gap-2">
          {isUser && (
            <span className="px-2 py-0.5 text-xs rounded bg-blue-600 text-white shadow-sm">
              Kamu
            </span>
          )}

          {isCorrect && (
            <span className="px-2 py-0.5 text-xs rounded bg-green-600 text-white shadow-sm">
              Kunci
            </span>
          )}
        </div>
      </div>

      {shouldShowFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="mt-3 p-3 rounded-lg bg-white dark:bg-[#162036]
                     border border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            {isCorrect ? (
              <HiMiniCheckCircle className="text-green-500 text-lg mt-0.5" />
            ) : (
              <HiMiniXCircle className="text-red-500 text-lg mt-0.5" />
            )}
            <p className="text-sm">{toPlainText(opt.feedback)}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

OptionItem.propTypes = {
  opt: PropTypes.shape({
    key: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    feedback: PropTypes.string,
  }).isRequired,

  isUser: PropTypes.bool.isRequired,
  isCorrect: PropTypes.bool.isRequired,

  showFeedback: PropTypes.bool,

  animation: PropTypes.shape({
    initial: PropTypes.object,
    animate: PropTypes.object,
  }),
};

OptionItem.defaultProps = {
  showFeedback: null,
  animation: null,
};
