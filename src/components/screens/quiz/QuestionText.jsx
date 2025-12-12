import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import { htmlToText } from "html-to-text";
import PropTypes from "prop-types";

export default function QuestionText({ question }) {
  return (
    <div className="flex items-start gap-3 sm:gap-4 mb-6">
      <div className="p-2 rounded-xl bg-[#155dfc]/20 text-[#155dfc] shadow-sm">
        <FaInfoCircle className="text-lg sm:text-xl" />
      </div>

      <h2 className="text-sm sm:text-lg font-semibold leading-relaxed text-gray-900 dark:text-white">
        {htmlToText(question ?? "Soal tidak ditemukan", {
          wordwrap: false,
          selectors: [
            { selector: "img", format: "skip" },
            { selector: "a", options: { hideLinkHrefIfSameAsText: true } },
          ],
        })}
      </h2>
    </div>
  );
}


QuestionText.propTypes = {
  question: PropTypes.string,
};


QuestionText.defaultProps = {
  question: "Soal tidak ditemukan",
};
