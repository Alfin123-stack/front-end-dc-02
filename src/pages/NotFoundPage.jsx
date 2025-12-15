import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiAlertTriangle } from "react-icons/fi";
import AppButton from "../components/ui/AppButton";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0c1220] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          rounded-2xl shadow-md p-10 max-w-lg w-full text-center
        ">
        <FiAlertTriangle className="text-6xl text-yellow-500 mx-auto mb-4" />

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Halaman Tidak Ditemukan
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Maaf, halaman yang kamu minta tidak tersedia atau sudah dipindahkan.
        </p>

        <AppButton variant="primary" size="md" onClick={() => navigate("/")}>
          Kembali ke Beranda
        </AppButton>
      </motion.div>
    </div>
  );
}
