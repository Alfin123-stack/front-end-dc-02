import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { HiArrowLeft } from "react-icons/hi2";
import AppButton from "../../ui/AppButton";

export default function HistoryHeader({
  navigate,
  filteredLength,
  setShowConfirm,
}) {
  return (
    <div className="flex items-center justify-between mb-8">
      {/* Tombol Kembali */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}>
        <AppButton
          variant="subtle"
          size="sm"
          iconLeft={<HiArrowLeft size={18} />}
          onClick={() => navigate(-1)}>
          Kembali
        </AppButton>
      </motion.div>

      {/* Tombol Hapus Riwayat */}
      {filteredLength > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}>
          <AppButton
            variant="danger"
            size="sm"
            onClick={() => setShowConfirm(true)}>
            Hapus Riwayat
          </AppButton>
        </motion.div>
      )}
    </div>
  );
}

HistoryHeader.propTypes = {
  navigate: PropTypes.func.isRequired,
  filteredLength: PropTypes.number.isRequired,
  setShowConfirm: PropTypes.func.isRequired,
};
