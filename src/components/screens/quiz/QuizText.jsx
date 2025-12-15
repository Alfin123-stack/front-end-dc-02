import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import { htmlToText } from "html-to-text";
import PropTypes from "prop-types";

export default function QuizText({ question }) {
  const text = htmlToText(question || "Soal tidak ditemukan", {
    wordwrap: false,
    selectors: [
      { selector: "img", format: "skip" },
      { selector: "a", options: { hideLinkHrefIfSameAsText: true } },
    ],
  });

  return (
    <div className="flex items-start gap-3 sm:gap-4 md:gap-5 mb-5 sm:mb-6 md:mb-7">
      <div
        className="
          flex-shrink-0
          p-2 sm:p-2.5 md:p-3
          rounded-xl sm:rounded-2xl
          bg-[#155dfc]/20 text-[#155dfc]
          shadow-sm
        "
        aria-hidden="true">
        <FaInfoCircle className="text-base sm:text-lg md:text-xl" />
      </div>

      <h2
        className="
          text-sm sm:text-base md:text-lg lg:text-xl
          font-semibold
          leading-relaxed sm:leading-relaxed md:leading-loose
          text-gray-900 dark:text-white
          break-words
        ">
        {text}
      </h2>
    </div>
  );
}

QuizText.propTypes = {
  question: PropTypes.string,
};

QuizText.defaultProps = {
  question: "Soal tidak ditemukan",
};
