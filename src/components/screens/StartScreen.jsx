<<<<<<< HEAD
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
} from "react-icons/fa";
=======
// src/components/screens/StartScreen.jsx
import { motion } from "framer-motion";
import { useEffect } from "react";
import { FaClock } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { loadQuiz } from "../../store/quizSlice";
import { useNavigate } from "react-router-dom";
>>>>>>> 66c974b (adding history screen)

export default function StartScreen({
  onStartQuiz,
  unlockedLevels,
  currentLevel,
}) {
  const levels = [
    {
      level: 1,
      name: "Mudah",
      time: "1 Menit",
      questions: 3,
<<<<<<< HEAD
      icon: <FaStar />,
=======
>>>>>>> 66c974b (adding history screen)
      color: "#3b82f6",
    },
    {
      level: 2,
      name: "Sedang",
      time: "1 Menit",
      questions: 3,
<<<<<<< HEAD
      icon: <FaFire />,
=======
>>>>>>> 66c974b (adding history screen)
      color: "#f59e0b",
    },
    {
      level: 3,
      name: "Sulit",
      time: "1 Menit",
      questions: 3,
<<<<<<< HEAD
      icon: <FaSkull />,
=======
>>>>>>> 66c974b (adding history screen)
      color: "#ef4444",
    },
  ];

<<<<<<< HEAD
  return (
    <div className="min-h-screen px-6 py-10 flex justify-center bg-[#f6f8fa] dark:bg-[#0d1623] transition-colors">
      <div className="w-full max-w-3xl space-y-10">
        {/* HEADER */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-5">
            <FaRocket size={50} className="mx-auto text-[#155dfc]" />
          </motion.div>

          <h1 className="text-3xl font-bold text-[#155dfc] tracking-tight">
            Web Developer Quiz
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mt-2 text-base">
            Pilih level yang ingin kamu kerjakan. Tiap level punya tantangan
            berbeda.
          </p>
        </div>

        {/* LEVEL LIST PREMIUM */}
        <div className="space-y-5">
          {levels.map((lvl, index) => {
            const isUnlocked = unlockedLevels.includes(lvl.level);
            const isCurrent = currentLevel === lvl.level;
=======
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { quizData } = useSelector((state) => state.quiz);

  const query = new URLSearchParams(location.search);
  const tutorialId = Number(query.get("tutorial") || 1);
  const userId = Number(query.get("user") || 1);

  useEffect(() => {
    dispatch(loadQuiz({ tutorialId }));
  }, [tutorialId, dispatch]);

  return (
    <div className="min-h-screen px-6 py-10 flex justify-center bg-[#f0f2f5] dark:bg-[#0d1623]">
      <div className="w-full max-w-5xl space-y-12">
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-block px-5 py-2 rounded-full bg-[#155dfc]/10 border border-[#155dfc]">
            <span className="text-[#155dfc] text-sm font-semibold tracking-wide">
              WEB DEVELOPER QUIZ
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Pilih Level
          </h1>

          <p className="text-gray-600 dark:text-gray-300 text-base">
            Mulai dari level mudah hingga level lanjutan. Semua harus dibuka
            bertahap.
          </p>
        </div>

        {/* GRID CARD — LEVEL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((lvl, i) => {
            const unlocked = unlockedLevels.includes(lvl.level);
            const current = currentLevel === lvl.level;
>>>>>>> 66c974b (adding history screen)

            return (
              <motion.div
                key={lvl.level}
<<<<<<< HEAD
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={isUnlocked ? { scale: 1.01 } : {}}
                onClick={() => isUnlocked && onStartQuiz(lvl.level)}
                className={`
                  group relative flex items-center justify-between
                  px-6 py-5 rounded-2xl border transition-all select-none

                  ${
                    isUnlocked
                      ? "cursor-pointer bg-white dark:bg-[#111c2d] border-gray-200 dark:border-[#1e2f43] hover:shadow-lg"
                      : "cursor-not-allowed bg-gray-100 dark:bg-[#1d2635] border-gray-300 opacity-50"
                  }
                `}>
                {/* LEFT */}
                <div className="flex items-center gap-4">
                  <div
                    className="text-2xl p-3 rounded-xl"
                    style={{ color: lvl.color, background: lvl.color + "15" }}>
                    {lvl.icon}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Level {lvl.level} • {lvl.name}
                    </h3>

                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <span className="flex items-center gap-1">
                        <FaClock className="text-[#155dfc]" />
                        {lvl.time}
                      </span>
                      <span>•</span>
                      <span>{lvl.questions} Pertanyaan</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3">
                  {/* PROGRESS */}
                  {isUnlocked && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: isCurrent ? "100%" : "55%" }}
                      transition={{ duration: 0.5 }}
                      className="h-2 rounded-full bg-gray-200 dark:bg-[#1e293b] w-20 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ backgroundColor: lvl.color }}
                      />
                    </motion.div>
                  )}

                  {isUnlocked ? (
                    <FaUnlock className="text-green-500" size={18} />
                  ) : (
                    <FaLock className="text-red-500" size={18} />
                  )}
                </div>

                {/* LOCKED OVERLAY */}
                {!isUnlocked && (
                  <div className="absolute inset-0 rounded-2xl bg-black/10 dark:bg-black/20 backdrop-blur-sm" />
                )}
=======
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}>
                <button
                  disabled={!unlocked}
                  onClick={() => unlocked && onStartQuiz(lvl.level)}
                  className={`
                    w-full p-6 rounded-2xl text-left
                    border-2
                    transition-colors
                    ${
                      unlocked
                        ? "border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f1a27] hover:bg-gray-50 dark:hover:bg-[#111b2c]"
                        : "border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-[#1b2533] opacity-50 cursor-not-allowed"
                    }
                  `}>
                  {/* LEVEL NUMBER */}
                  <div
                    className="w-14 h-14 flex items-center justify-center rounded-xl text-white font-semibold mb-3"
                    style={{ backgroundColor: lvl.color }}>
                    {lvl.level}
                  </div>

                  {/* TITLE */}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {lvl.name}
                  </h3>

                  {/* TIME & QUESTION */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <FaClock size={14} className="text-[#155dfc]" />
                    <span>{lvl.time}</span>
                    <span>•</span>
                    <span>{lvl.questions} Soal</span>
                  </div>

                  {/* PROGRESS MINI BAR */}
                  {unlocked && (
                    <div className="mt-4 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: current ? "100%" : "40%",
                          backgroundColor: lvl.color,
                        }}
                      />
                    </div>
                  )}
                </button>
>>>>>>> 66c974b (adding history screen)
              </motion.div>
            );
          })}
        </div>

<<<<<<< HEAD
        {/* RULES SECTION */}
        <div className="p-6 border rounded-2xl bg-white dark:bg-[#111c2d] border-gray-200 dark:border-[#1f2d43]">
          <div className="flex items-center gap-3 mb-3">
            <FaCode className="text-[#155dfc]" />
            <h2 className="font-semibold text-lg text-[#155dfc]">Peraturan</h2>
          </div>

          <ul className="text-gray-700 dark:text-gray-300 space-y-2 text-sm">
            <li>
              • Minimal nilai kelulusan: 60% untuk membuka level berikutnya
            </li>
            <li className="flex items-center gap-2">
              <FaStopwatch className="text-[#155dfc]" /> Setiap level memiliki
              batas waktu
            </li>
            <li>• Jawab sebaik mungkin untuk menyelesaikan semua level</li>
          </ul>
=======
        {/* BUTTON HISTORY */}
        <div className="flex justify-center">
          <button
            onClick={() =>
              navigate(`/history/?tutorial=${tutorialId}&user=${userId}`)
            }
            className="
              mt-2 px-6 py-3 rounded-2xl font-medium
              bg-[#155dfc] text-white border-2 border-[#155dfc]
              transition-colors hover:bg-[#0f3be3]
            ">
            Lihat Riwayat Quiz
          </button>
        </div>

        {/* RULES */}
        <div className="p-8 rounded-2xl bg-white dark:bg-[#0f1a27] border-2 border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-xl text-[#155dfc] mb-4">
            Peraturan
          </h2>

          <div className="space-y-4 text-gray-700 dark:text-gray-300 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-[#155dfc]"></div>
              <p>Kelulusan minimal 60% untuk membuka level berikutnya.</p>
            </div>

            <div className="flex items-start gap-3">
              <FaClock size={14} className="text-[#155dfc] mt-1" />
              <p>
                Waktu setiap level terbatas dan harus diselesaikan sebelum
                habis.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-[#155dfc]"></div>
              <p>
                Semua level harus diselesaikan untuk menguasai keseluruhan
                materi.
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 dark:border-gray-700"></div>

          <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
            Ikuti setiap level dan tingkatkan kemampuanmu secara bertahap.
          </div>
>>>>>>> 66c974b (adding history screen)
        </div>
      </div>
    </div>
  );
}
