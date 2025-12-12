// src/pages/ErrorPage.jsx
import React from "react";
import { useNavigate, useRouteError } from "react-router-dom";
import { motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import AppButton from "../components/ui/AppButton";

export default function ErrorPage() {
  const navigate = useNavigate();
  const error = useRouteError();

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
        <FiAlertCircle className="text-6xl text-red-500 mx-auto mb-4" />

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Terjadi Kesalahan
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Aplikasi mengalami error. Kamu bisa mencoba memuat ulang halaman.
        </p>

        {process.env.NODE_ENV === "development" && (
          <pre
            className="
              text-xs bg-gray-100 dark:bg-gray-900 
              text-gray-800 dark:text-gray-300 
              p-4 rounded-xl max-h-40 overflow-auto mb-6 text-left border
              border-gray-300 dark:border-gray-700
            ">
            {error?.message || "Unknown error"}
          </pre>
        )}

        <div className="flex justify-center gap-4">
          <AppButton variant="secondary" onClick={() => navigate(-1)}>
            Kembali
          </AppButton>

          <AppButton variant="primary" onClick={() => window.location.reload()}>
            Muat Ulang
          </AppButton>
        </div>
      </motion.div>
    </div>
  );
}
