import { motion } from "framer-motion";
import { FaClock, FaListOl, FaChartLine, FaBook, FaPlay } from "react-icons/fa";

export default function StartQuizCard({ meta, level, onStart, data }) {
  const { quizData, tutorial, timeLeft: time, currentQuestion } = data;
  const q = quizData[currentQuestion];

  console.log(q);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="
        p-6 rounded-2xl border shadow-xl transition 
        backdrop-blur-md
        bg-white/90 border-gray-200 text-gray-900 shadow-gray-300/50
        dark:bg-[#111827]/90 dark:border-gray-700 dark:text-white dark:shadow-black/40
      ">
      {/* Title */}
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          whileHover={{ rotate: -10, scale: 1.1 }}
          transition={{ duration: 0.2 }}>
          <FaBook className="text-3xl text-blue-500" />
        </motion.div>

        <h2 className="text-2xl font-bold">
          {tutorial?.title || "Quiz Pembelajaran"}
        </h2>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Level <span className="font-semibold">{level}</span> •{" "}
        {meta?.description || "Uji kemampuanmu sekarang!"}
      </p>

      {/* Info Grid */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        {/* Jumlah Soal */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="
            p-4 rounded-xl flex items-center gap-4 transition
            bg-gray-100 dark:bg-gray-800/80
          ">
          <FaListOl className="text-2xl text-blue-400" />
          <div>
            <p className="text-sm opacity-70">Jumlah Soal</p>
            <p className="text-lg font-semibold">{quizData.length} Soal</p>
          </div>
        </motion.div>

        {/* Waktu */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="
            p-4 rounded-xl flex items-center gap-4 transition
            bg-gray-100 dark:bg-gray-800/80
          ">
          <FaClock className="text-2xl text-yellow-400" />
          <div>
            <p className="text-sm opacity-70">Waktu Tersedia</p>
            <p className="text-lg font-semibold">{time} Detik</p>
          </div>
        </motion.div>

        {/* Difficulty */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="
            p-4 rounded-xl flex items-center gap-4 transition
            bg-gray-100 dark:bg-gray-800/80
          ">
          <FaChartLine className="text-2xl text-green-400" />
          <div>
            <p className="text-sm opacity-70">Tingkat Kesulitan</p>
            <p className="text-lg font-semibold capitalize">
              {q?.difficulty || "Tidak diketahui"}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Start */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        className="
          w-full py-3 rounded-xl font-semibold text-lg flex items-center justify-center gap-2
          shadow-lg transition
          bg-blue-600 hover:bg-blue-700 text-white
        ">
        <FaPlay className="text-sm" />
        Mulai Quiz
      </motion.button>
    </motion.div>
  );
}
