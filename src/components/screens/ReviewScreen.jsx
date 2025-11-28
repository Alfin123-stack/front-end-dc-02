import { motion } from "framer-motion";
import {
  FaCheck,
  FaTimes,
  FaRedo,
  FaHome,
  FaArrowLeft,
  FaCog,
  FaInfoCircle,
  FaLightbulb,
  FaSun,
  FaMoon,
  FaCogs,
} from "react-icons/fa";

export default function ReviewScreen({
  isDarkMode,
  onToggleTheme,
  onRestart,
  onGoHome,
  onBackToResults,
  onShowSettings,
  quizData,
  userAnswers,
  score,
  totalQuestions,
}) {
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div
      className={`min-h-screen flex flex-col items-center py-10 relative transition-colors duration-500
      ${
        isDarkMode
          ? "bg-[#0D1117] text-white"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900"
      }`}>
      {/* Floating Background Bubbles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-72 h-72 bg-pink-400/10 rounded-full -top-16 -left-16 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-green-400/10 rounded-full -bottom-20 -right-20 animate-pulse delay-500"></div>
        <div className="absolute w-64 h-64 bg-yellow-400/10 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse delay-700"></div>
      </div>

      {/* Settings Button */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={onShowSettings}
          className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm 
                   border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl 
                   transition-all duration-300 hover:scale-110 flex items-center justify-center">
          <FaCogs
            size={22}
            className={`transition-colors ${
              isDarkMode ? "text-blue-300" : "text-purple-600"
            }`}
          />
        </button>
      </div>

      {/* Theme Toggle */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={onToggleTheme}
          className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm 
                   border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl 
                   transition-all duration-300 hover:scale-110 flex items-center justify-center">
          {isDarkMode ? (
            <FaMoon className="text-purple-400" size={22} />
          ) : (
            <FaSun className="text-yellow-500" size={22} />
          )}
        </button>
      </div>

      {/* --- HEADER --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full px-4 mb-8 text-center">
        <h1 className="mb-3 text-4xl font-extrabold tracking-tight">
          📝 Review Jawaban Kamu
        </h1>

        <div
          className="inline-block px-7 py-4 text-lg rounded-2xl text-white shadow-lg
          bg-gradient-to-r from-blue-500 to-purple-600">
          <p className="font-bold">
            Skor:{" "}
            <span className="text-yellow-300">
              {score}/{totalQuestions}
            </span>{" "}
            ({percentage}%)
          </p>
        </div>
      </motion.div>

      {/* CONTENT */}
      <div className="flex justify-center w-full px-4 flex-1">
        <div className="w-full max-w-4xl space-y-6">
          {quizData.map((questionData, i) => {
            const userAnswer = userAnswers[i] || [];
            const correct = questionData.correctAnswers;

            const isCorrect =
              userAnswer.length === correct.length &&
              userAnswer.every((a) => correct.includes(a)) &&
              correct.every((a) => userAnswer.includes(a));

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-7 rounded-3xl backdrop-blur
                bg-white/70 dark:bg-gray-900/60 
                border border-white/20 shadow-xl">
                {/* --- Title Row --- */}
                <div className="flex justify-between items-center pb-4 mb-5 border-b border-gray-300/50 dark:border-gray-700/50">
                  <div className="flex items-center gap-3">
                    {isCorrect ? (
                      <FaCheck className="text-green-500" size={20} />
                    ) : (
                      <FaTimes className="text-red-500" size={20} />
                    )}
                    <p className="font-bold text-lg">Pertanyaan {i + 1}</p>
                  </div>

                  <div
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      isCorrect
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    }`}>
                    {isCorrect ? "Benar ✓" : "Salah ✗"}
                  </div>
                </div>

                {/* --- QUESTION TEXT --- */}
                <h3 className="text-xl font-semibold mb-4 leading-relaxed">
                  {questionData.question}
                </h3>

                {/* --- OPTIONS --- */}
                <div className="space-y-3">
                  {questionData.options.map((opt, index) => {
                    const isUser = userAnswer.includes(index);
                    const isCorrect = correct.includes(index);

                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-xl border-2 transition
                      ${
                        isUser && isCorrect
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : isUser && !isCorrect
                          ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                          : isCorrect
                          ? "border-green-300 bg-green-50/60 dark:bg-green-900/10"
                          : "border-gray-300 dark:border-gray-600"
                      }`}>
                        <div className="flex justify-between items-center">
                          <span className="text-base">{opt}</span>

                          <div className="flex gap-2">
                            {isUser && (
                              <span className="px-2 py-1 text-xs font-bold text-white bg-blue-500 rounded">
                                Jawaban Kamu
                              </span>
                            )}
                            {isCorrect && (
                              <span className="px-2 py-1 text-xs font-bold text-white bg-green-500 rounded">
                                Benar
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* --- EXPLANATION --- */}
                <div className="mt-5">
                  <h4 className="flex items-center gap-2 mb-2 text-lg font-bold text-blue-500 dark:text-blue-300">
                    <FaInfoCircle /> Penjelasan
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {questionData.explanation}
                  </p>
                </div>

                {/* --- FUN FACT --- */}
                {questionData.funFact && (
                  <div className="mt-4 p-4 bg-yellow-100/80 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded">
                    <h4 className="flex items-center gap-2 mb-1 font-bold text-yellow-600 dark:text-yellow-300">
                      <FaLightbulb /> Fun Fact
                    </h4>
                    <p className="text-yellow-800 dark:text-yellow-200">
                      {questionData.funFact}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* --- ACTION BUTTONS --- */}
          <div className="text-center mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={onBackToResults}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-7 py-3 text-white font-bold rounded-xl shadow
              bg-gray-600 hover:bg-gray-700 flex items-center gap-2">
              <FaArrowLeft /> Kembali ke Hasil
            </motion.button>

            <motion.button
              onClick={onRestart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-7 py-3 text-white font-bold rounded-xl shadow
              bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
              flex items-center gap-2">
              <FaRedo /> Ulangi Quiz
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
