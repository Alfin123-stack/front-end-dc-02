import React from "react";
import PropTypes from "prop-types";
import AppButton from "../../ui/AppButton";

export default function StartScreenHistoryButton({ goToHistory }) {
  return (
    <div className="mt-12">
      <AppButton
        onClick={goToHistory}
        variant="primary"
        size="md"
        className="rounded-2xl">
        Riwayat Quiz
      </AppButton>
    </div>
  );
}

StartScreenHistoryButton.propTypes = {
  goToHistory: PropTypes.func.isRequired,
};
