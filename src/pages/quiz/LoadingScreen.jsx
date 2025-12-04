import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

export default function LoadingScreen() {
  return (
    <div
      className="
        min-h-screen flex flex-col items-center justify-center px-4 gap-6
        bg-white text-gray-900
        dark:bg-[#1e2939] dark:text-[#d1d5dc]
      ">
      {/* Spinner */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.3, ease: "linear" }}
        className="flex items-center justify-center">
        <FaSpinner
          className="
            text-[#155dfc]
            text-5xl sm:text-6xl md:text-7xl
          "
        />
      </motion.div>

      {/* Loading Text */}
      <motion.p
        className="
          font-semibold text-base sm:text-lg md:text-xl
          text-gray-700 dark:text-[#d1d5dc]/80
        "
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}>
        Memuat soal...
      </motion.p>
    </div>
  );
}
