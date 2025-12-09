// src/components/screens/StartScreen.jsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function StartScreen({ onStartQuiz }) {
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const tutorialId = Number(query.get("tutorial") || 1);
  const userId = Number(query.get("user") || 1);

  const levels = [
    {
      level: 1,
      name: "Mudah",
      time: "1 Menit",
      questions: 3,
      color: "#3b82f6", // biru
    },
    {
      level: 2,
      name: "Sedang",
      time: "1 Menit",
      questions: 3,
      color: "#f59e0b", // kuning
    },
    {
      level: 3,
      name: "Sulit",
      time: "1 Menit",
      questions: 3,
      color: "#ef4444", // merah
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0c1220] flex flex-col items-center py-12 px-4">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 max-w-md">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-2">
          Quiz
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Pilih level dan mulai tantangan
        </p>
      </motion.div>

      {/* LEVEL CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {levels.map((lvl, i) => (
          <motion.div
            key={lvl.level}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}>
            <div
              onClick={() => onStartQuiz(lvl.level)}
              className="
                relative p-6 rounded-2xl transition-all duration-300
                cursor-pointer select-none flex flex-col items-center justify-center
                bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                hover:bg-gray-100 hover:dark:bg-gray-700 hover:shadow-md
              ">
              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                Level {lvl.level} • {lvl.name}
              </h3>

              {/* Info */}
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {lvl.time} • {lvl.questions} Soal
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* BUTTON HISTORY */}
      <div className="mt-12">
        <button
          onClick={() =>
            navigate(`/history/?tutorial=${tutorialId}&user=${userId}`)
          }
          className="
            px-8 py-3 rounded-2xl text-base
            bg-blue-600 hover:bg-blue-700
            text-white font-semibold transition-colors
          ">
          Riwayat Quiz
        </button>
      </div>

      {/* RULES */}
      <div
        className="mt-12 p-6 rounded-2xl bg-white dark:bg-gray-800 
                      border border-gray-200 dark:border-gray-700 
                      w-full max-w-4xl">
        <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-3">
          Peraturan Quiz
        </h2>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
          <li>• Setiap level memiliki 3 soal dengan batas waktu tertentu.</li>
          <li>• Skor dihitung berdasarkan jumlah jawaban benar.</li>
          <li>• Kamu bebas memilih level mana saja.</li>
          <li>• Riwayat quiz akan disimpan otomatis.</li>
        </ul>
      </div>
    </div>
  );
}
