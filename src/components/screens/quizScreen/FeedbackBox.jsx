/* ------------------------------------------------------
    FEEDBACK BOX – PREMIUM RESPONSIVE MODERN UI
-------------------------------------------------------*/
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function FeedbackBox({ isCorrect, explanation }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`mt-6 p-5 md:p-6 rounded-2xl border shadow-lg relative overflow-hidden
        ${
          isCorrect
            ? "border-green-300 bg-gradient-to-br from-green-100/70 to-green-200/50 dark:from-green-900/40 dark:to-green-800/20"
            : "border-red-300 bg-gradient-to-br from-red-100/70 to-red-200/50 dark:from-red-900/40 dark:to-red-800/20"
        }
      `}>
      {/* Soft Glow Decoration */}
      <div
        className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-30
          ${
            isCorrect
              ? "bg-green-300 dark:bg-green-600/40"
              : "bg-red-400 dark:bg-red-600/40"
          }
      `}
      />

      {/* Header Status */}
      <div className="flex items-center gap-4 mb-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 12 }}>
          {isCorrect ? (
            <FaCheckCircle className="text-green-600 dark:text-green-300 text-3xl md:text-4xl" />
          ) : (
            <FaTimesCircle className="text-red-600 dark:text-red-300 text-3xl md:text-4xl" />
          )}
        </motion.div>

        <div>
          <p
            className={`text-lg md:text-xl font-bold ${
              isCorrect
                ? "text-green-800 dark:text-green-300"
                : "text-red-800 dark:text-red-300"
            }`}>
            {isCorrect ? "Jawaban Tepat! 🎉" : "Jawaban Belum Tepat 😥"}
          </p>

          <span
            className={`inline-block mt-1 text-[11px] md:text-xs px-2 py-0.5 rounded-full font-semibold
              ${isCorrect ? "bg-green-600 text-white" : "bg-red-600 text-white"}
            `}>
            {isCorrect ? "CORRECT" : "INCORRECT"}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-[1px] w-full bg-gray-300/70 dark:bg-gray-700/50 my-4" />

      {/* Explanation */}
      <div className="flex gap-3 md:gap-4">
        <FaInfoCircle className="text-gray-700 dark:text-gray-300 mt-1 text-lg md:text-xl" />

        <div
          className="text-gray-800 dark:text-gray-200 leading-relaxed 
          bg-white/70 dark:bg-gray-800/40 p-4 rounded-xl border 
          border-gray-200 dark:border-gray-700 shadow-sm flex-1">
          {explanation ? (
            <p className="text-sm md:text-base">
              <span className="font-semibold">Penjelasan: </span>
              {explanation}
            </p>
          ) : (
            <p className="italic opacity-70 text-sm md:text-base">
              Tidak ada penjelasan untuk soal ini.
            </p>
          )}
        </div>
      </div>

      {/* Motivation */}
      <p
        className={`mt-4 text-xs md:text-sm italic ${
          isCorrect
            ? "text-green-700 dark:text-green-300"
            : "text-red-700 dark:text-red-300"
        }`}>
        {isCorrect
          ? "Mantap! Pertahankan ritmemu 🔥"
          : "Belum tepat, tapi kamu pasti bisa! Coba lagi ya 💪"}
      </p>
    </motion.div>
  );
}
