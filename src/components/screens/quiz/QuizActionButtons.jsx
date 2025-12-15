import React from "react";
import PropTypes from "prop-types";
import { FiSend, FiArrowRight } from "react-icons/fi";
import AppButton from "../../ui/AppButton";

export default function ActionButtons({
  showResult,
  allowSubmit,
  lockAction,
  handleSubmit,
  handleNext,
  currentQuestion,
  total,
}) {
  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
        Pilih jawaban lalu klik{" "}
        <span className="font-medium text-gray-800 dark:text-gray-200">
          Submit
        </span>
      </div>

      <div className="w-full sm:w-auto">
        {!showResult ? (
          <AppButton
            onClick={handleSubmit}
            disabled={!allowSubmit || lockAction}
            variant={allowSubmit && !lockAction ? "primary" : "secondary"}
            size="md"
            iconLeft={<FiSend />}
            className={`w-full sm:w-auto ${
              (!allowSubmit || lockAction) && "opacity-50 cursor-not-allowed"
            }`}>
            Submit
          </AppButton>
        ) : (
          <AppButton
            onClick={handleNext}
            disabled={lockAction}
            variant="primary"
            size="md"
            iconRight={<FiArrowRight />}
            className={`w-full sm:w-auto ${
              lockAction && "opacity-50 cursor-not-allowed"
            }`}>
            {currentQuestion < total - 1 ? "Lanjutkan" : "Selesai"}
          </AppButton>
        )}
      </div>
    </div>
  );
}

ActionButtons.propTypes = {
  showResult: PropTypes.bool.isRequired,
  allowSubmit: PropTypes.bool.isRequired,
  lockAction: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  currentQuestion: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};
