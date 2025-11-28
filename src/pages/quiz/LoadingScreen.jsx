import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

export default function LoadingScreen({ theme }) {
  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center gap-6 transition ${
        isDark ? "bg-[#0B0F19] text-white" : "bg-blue-50 text-gray-800"
      }`}>
      {/* Icon Spinner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative">
        {/* Outer Glow Ring */}
        <motion.div
          className={`w-28 h-28 rounded-full absolute top-0 left-0 blur-xl ${
            isDark ? "bg-blue-600/30" : "bg-blue-400/30"
          }`}
          animate={{ opacity: [0.6, 0.2, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Spinning Icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="flex items-center justify-center">
          <FaSpinner
            className={`text-6xl ${
              isDark ? "text-blue-400" : "text-blue-600"
            } drop-shadow-lg`}
          />
        </motion.div>
      </motion.div>

      {/* Loading Text */}
      <motion.p
        className="text-lg font-semibold opacity-80"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}>
        Memuat soal...
      </motion.p>
    </div>
  );
}
