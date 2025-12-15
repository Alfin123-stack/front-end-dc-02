import React from "react";
import PropTypes from "prop-types";
import { getStatusBadge } from "../../../utils/helper";

export default function StartScreenLevelCard({
  lvl,
  status,
  loadingStatus,
  onClick,
}) {
  const badge = getStatusBadge(status, loadingStatus);

  return (
    <div
      onClick={onClick}
      className="p-6 rounded-2xl cursor-pointer bg-white dark:bg-gray-800
                 border border-gray-200 dark:border-gray-700
                 hover:bg-gray-100 hover:dark:bg-gray-700 transition-all relative">
      <div className="absolute -top-2 -right-2 translate-x-1">
        {badge && (
          <span
            className={`px-2 py-1 text-xs rounded-lg font-medium ${badge.className}`}>
            {badge.label}
          </span>
        )}
      </div>

      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
        Level {lvl.level} • {lvl.name}
      </h3>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        {lvl.time} • {lvl.questions} Soal
      </p>
    </div>
  );
}

StartScreenLevelCard.propTypes = {
  lvl: PropTypes.shape({
    level: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    questions: PropTypes.number.isRequired,
  }).isRequired,

  status: PropTypes.string,
  loadingStatus: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};
