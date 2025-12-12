import React from "react";
import PropTypes from "prop-types";

export default function CompletionMessage({ percentage }) {
  return (
    <p className="text-sm mt-4 text-gray-700 dark:text-gray-300 text-center max-w-xs mx-auto mb-10">
      {percentage >= 80
        ? "Sangat bagus! Kamu sudah paham betul materinya."
        : percentage >= 60
        ? "Lumayan! Kamu sudah memahami sebagian besar."
        : "Belum maksimal, coba ulangi untuk hasil lebih baik."}
    </p>
  );
}

CompletionMessage.propTypes = {
  percentage: PropTypes.number.isRequired,
};
