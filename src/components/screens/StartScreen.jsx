// src/components/screens/StartScreen.jsx
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  loadProgressFromBackend,
  loadTutorialHeading,
} from "../../store/quiz/quizThunks";

export default function StartScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const mounted = useRef(true);

  // ================================
  //   PARAMETER DARI URL (pakai useLocation)
  // ================================
  const query = new URLSearchParams(location.search);
  const tutorialId = Number(query.get("tutorial") || 1);
  const userId = Number(query.get("user") || 1);

  // ================================
  //   START QUIZ HANDLER
  // ================================
  const handleStart = (level) => {
    navigate(`/quiz/${level}?tutorial=${tutorialId}&user=${userId}`);
  };

  // ================================
  //  LOAD HEADING
  // ================================
  useEffect(() => {
    if (!tutorialId) return;
    dispatch(loadTutorialHeading({ tutorialId }));
  }, [tutorialId, dispatch]);

  const heading = useSelector((state) => state.quiz.tutorialHeading);

  // ================================
  //  LOAD PROGRESS (PARALLEL)
  // ================================
  const [levelStatus, setLevelStatus] = useState({});
  const [loadingStatus, setLoadingStatus] = useState(true);

  const fetchProgressAll = useCallback(async () => {
    setLoadingStatus(true);

    const fixedUser = userId;
    const fixedTut = tutorialId;
    const levels = [1, 2, 3];

    // Build array of promises (parallel)
    const promises = levels.map((lvl) =>
      dispatch(
        loadProgressFromBackend({
          tutorialId: fixedTut,
          userId: fixedUser,
          level: lvl,
        })
      )
        .then((res) => {
          // res may be { payload, meta, ... } or thrown (caught below)
          return { level: lvl, payload: res?.payload ?? null };
        })
        .catch((err) => {
          // treat failure as no-progress
          console.warn("Load progress failed for level", lvl, err);
          return { level: lvl, payload: null };
        })
    );

    try {
      const results = await Promise.all(promises);

      if (!mounted.current) return;

      const status = {};
      results.forEach((r) => {
        // payload truthy -> ada progress (tampilkan "Lanjutkan")
        status[r.level] = r.payload ? "Lanjutkan" : "Mulai";
      });

      setLevelStatus(status);
    } catch (err) {
      console.error("Unexpected error fetching progress:", err);
      if (mounted.current) {
        // fallback: semua Mulai
        setLevelStatus({ 1: "Mulai", 2: "Mulai", 3: "Mulai" });
      }
    } finally {
      if (mounted.current) setLoadingStatus(false);
    }
  }, [tutorialId, userId, dispatch]);

  useEffect(() => {
    mounted.current = true;
    fetchProgressAll();
    return () => {
      mounted.current = false;
    };
  }, [fetchProgressAll]);

  // ================================
  //  BADGE UI
  // ================================
  const renderBadge = (status) => {
    const base =
      "px-3 py-1 text-[10px] font-bold rounded-full shadow-sm border backdrop-blur-sm";

    if (loadingStatus) {
      return (
        <span
          className={`${base} bg-gray-500/20 border-gray-400 text-gray-300`}>
          Memuat...
        </span>
      );
    }

    return status === "Lanjutkan" ? (
      <span
        className={`${base} bg-yellow-500/20 border-yellow-400 text-yellow-300`}>
        Lanjutkan
      </span>
    ) : (
      <span className={`${base} bg-gray-400/20 border-gray-400 text-gray-300`}>
        Mulai
      </span>
    );
  };

  // ================================
  //  LEVEL LIST
  // ================================
  const levels = [
    { level: 1, name: "Mudah", time: "1:00", questions: 3 },
    { level: 2, name: "Sedang", time: "1:15", questions: 3 },
    { level: 3, name: "Sulit", time: "1:30", questions: 3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0c1220] flex flex-col items-center py-12 px-4">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 max-w-md">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
          {heading || "Memuat judul..."}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Pilih level dan mulai tantangan
        </p>
      </motion.div>

      {/* LEVEL GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {levels.map((lvl, i) => (
          <motion.div
            key={lvl.level}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}>
            <div
              onClick={() => handleStart(lvl.level)}
              className="
                p-6 rounded-2xl transition-all duration-300 relative
                cursor-pointer select-none flex flex-col items-center
                bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                hover:shadow-md hover:bg-gray-100 hover:dark:bg-gray-700
              ">
              {/* BADGE */}
              <div className="absolute -top-2 -right-2 translate-x-1">
                {renderBadge(levelStatus[lvl.level])}
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                Level {lvl.level} • {lvl.name}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                {lvl.time} • {lvl.questions} Soal
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* HISTORY BUTTON */}
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
        className="
          mt-12 p-6 rounded-2xl bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700 w-full max-w-4xl
        ">
        <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-3">
          Peraturan Quiz
        </h2>

        <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
          <li>• Setiap level memiliki 3 soal dengan batas waktu tertentu.</li>
          <li>• Skor dihitung berdasarkan jumlah jawaban benar.</li>
          <li>• Bebas memilih level mana saja.</li>
          <li>• Riwayat quiz disimpan otomatis.</li>
        </ul>
      </div>
    </div>
  );
}
