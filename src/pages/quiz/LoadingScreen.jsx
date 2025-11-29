import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

export default function LoadingScreen() {
  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 gap-8 
      transition-colors duration-300
      bg-blue-50 text-gray-800
      dark:bg-[#0B0F19] dark:text-white`}>
      {/* Icon Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative flex items-center justify-center">
        {/* Outer Glow */}
        <motion.div
          className={`absolute rounded-full blur-xl 
          bg-blue-400/30 dark:bg-blue-600/30`}
          style={{ width: "6rem", height: "6rem" }}
          animate={{ opacity: [0.6, 0.2, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Spinner Icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="flex items-center justify-center">
          <FaSpinner
            className={`
              drop-shadow-lg
              text-blue-600 dark:text-blue-400
              text-5xl sm:text-6xl md:text-7xl lg:text-8xl
            `}
          />
        </motion.div>
      </motion.div>

      {/* Text */}
      <motion.p
        className="font-semibold opacity-90 text-base sm:text-lg md:text-xl"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}>
        Memuat soal...
      </motion.p>
    </div>
  );
}
