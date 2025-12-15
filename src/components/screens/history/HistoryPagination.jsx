import React from "react";
import PropTypes from "prop-types";

export default function HistoryPagination({
  page,
  totalPages,
  prevPage,
  nextPage,
}) {
  return (
    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <button
        onClick={prevPage}
        disabled={page === 1}
        className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium 
          ${
            page === 1
              ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-gray-900 dark:bg-blue-600 text-white hover:bg-gray-800 dark:hover:bg-blue-700"
          }`}>
        Sebelumnya
      </button>

      <span className="text-center text-sm font-semibold text-gray-600 dark:text-gray-300">
        Halaman {page} dari {totalPages}
      </span>

      <button
        onClick={nextPage}
        disabled={page === totalPages}
        className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium 
          ${
            page === totalPages
              ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-gray-900 dark:bg-blue-600 text-white hover:bg-gray-800 dark:hover:bg-blue-700"
          }`}>
        Berikutnya
      </button>
    </div>
  );
}

HistoryPagination.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  prevPage: PropTypes.func.isRequired,
  nextPage: PropTypes.func.isRequired,
};
