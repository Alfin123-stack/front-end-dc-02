// src/components/common/HistoryDeleteModal.jsx
import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import AppButton from "../../ui/AppButton";


export default function HistoryDeleteModal({
  handleDeleteAll,
  setShowConfirm,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white dark:bg-[#111827] p-6 rounded-xl shadow-xl max-w-sm w-full">
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
          Yakin ingin menghapus <b>semua riwayat quiz</b>? Tindakan ini tidak
          bisa dibatalkan.
        </p>

        <div className="flex justify-end gap-3">
          <AppButton
            variant="secondary"
            size="sm"
            onClick={() => setShowConfirm(false)}>
            Batal
          </AppButton>

          <AppButton
            variant="danger" // ⬅️ pakai variant danger
            size="sm"
            onClick={handleDeleteAll}>
            Hapus
          </AppButton>
        </div>
      </motion.div>
    </motion.div>
  );
}

HistoryDeleteModal.propTypes = {
  handleDeleteAll: PropTypes.func.isRequired,
  setShowConfirm: PropTypes.func.isRequired,
};
