import { motion } from "framer-motion";
import {
  FaRocket,
  FaClock,
  FaCode,
  FaLock,
  FaUnlock,
  FaStar,
  FaFire,
  FaSkull,
  FaStopwatch,
  FaMoon,
  FaSun,
  FaCog,
} from "react-icons/fa";

function StartScreen({
  isDarkMode,
  onToggleTheme,
  onStartQuiz,
  onShowSettings,
  unlockedLevels,
  currentLevel,
}) {
  const levels = [
    {
      level: 1,
      name: "Mudah",
      time: "1 Menit",
      questions: 3,
      icon: <FaStar className="text-yellow-500" />,
    },
    {
      level: 2,
      name: "Sedang",
      time: "1 Menit",
      questions: 3,
      icon: <FaFire className="text-orange-500" />,
    },
    {
      level: 3,
      name: "Sulit",
      time: "1 Menit",
      questions: 3,
      icon: <FaSkull className="text-red-500" />,
    },
  ];

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 relative transition-colors duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900"
      }`}>
      {/* Floating Bubbles */}
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
          <FaCog
            size={22}
            className={`${isDarkMode ? "text-blue-300" : "text-purple-600"}`}
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

      {/* Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl">
        <div className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 rounded-3xl p-8 border border-white/20 shadow-2xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6">
            <FaRocket className="mx-auto text-purple-500" size={64} />
          </motion.div>

          <h1 className="mb-4 text-4xl font-bold">Web Developer Quiz</h1>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
            Pilih level dan uji pengetahuanmu tentang web development!
          </p>

          {/* LEVELS */}
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
            {levels.map((lvl) => {
              const isUnlocked = unlockedLevels.includes(lvl.level);
              const isCurrent = currentLevel === lvl.level;

              return (
                <motion.div
                  key={lvl.level}
                  whileHover={{ scale: isUnlocked ? 1.05 : 1 }}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    isUnlocked
                      ? isCurrent
                        ? "border-purple-500 bg-purple-100 dark:bg-purple-900/30 shadow-lg cursor-pointer"
                        : "border-green-500 bg-green-100 dark:bg-green-900/20 hover:shadow-lg cursor-pointer"
                      : "border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => {
                    if (isUnlocked) {
                      onStartQuiz(lvl.level);
                    }
                  }}>
                  <div className="mb-3 text-3xl flex justify-center">
                    {lvl.icon}
                  </div>

                  <h3 className="mb-1 text-xl font-bold">Level {lvl.level}</h3>

                  <p className="mb-2 font-semibold">{lvl.name}</p>

                  <div className="flex items-center justify-center gap-2 mb-2">
                    <FaClock className="text-indigo-500" />
                    <span>{lvl.time}</span>
                  </div>

                  <p>{lvl.questions} Pertanyaan</p>

                  <div className="mt-3">
                    {isUnlocked ? (
                      <FaUnlock className="mx-auto text-green-500" />
                    ) : (
                      <FaLock className="mx-auto text-red-500" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Info */}
          <div className="p-6 mb-8 bg-gradient-to-r from-indigo-200 to-purple-200 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl">
            <div className="flex items-center justify-center mb-4">
              <FaCode className="mr-3 text-indigo-500" size={32} />
              <h3 className="text-xl font-bold">Ketentuan</h3>
            </div>

            <p className="mb-2">
              Syarat Kelulusan: 60% untuk membuka level berikutnya
            </p>

            <p className="mb-2 flex items-center justify-center gap-2">
              <FaStopwatch className="text-pink-500" />
              Waktu terbatas per level
            </p>

            <p className="text-gray-600 dark:text-gray-300">
              Kuasai semua level untuk menjadi Web Developer handal!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default StartScreen;
