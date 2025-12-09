import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiMiniCheckBadge,
  HiMiniXMark,
  HiMiniCheckCircle,
  HiMiniXCircle,
  HiArrowLeft,
} from "react-icons/hi2";
import { htmlToText } from "html-to-text";
import { loadHistory } from "../../store/quizSlice";

const getPercentColor = (p) => {
  if (p <= 55) return "text-red-500";
  if (p <= 80) return "text-yellow-500";
  return "text-green-600";
};

export default function HistoryDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const history = loadHistory();
  const item = history.find((h) => String(h.id) === String(id));

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#f7f9fc] dark:bg-[#0b1220] text-gray-900 dark:text-gray-200">
        <p className="text-lg font-medium">Data tidak ditemukan.</p>
        <button
          onClick={() => navigate("/history")}
          className="mt-4 px-5 py-2.5 rounded-xl bg-[#155dfc] hover:bg-[#1346d6] text-white font-semibold transition-all">
          Kembali
        </button>
      </div>
    );
  }

  const { quizData, userAnswers, score, totalQuestions, timestamp } = item;
  const percentage =
    item.score > 1 ? Math.round(score) : Math.round(score * 100);

  return (
    <div className="min-h-screen bg-[#f7f9fc] dark:bg-[#0b1220] py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-900 dark:text-gray-200">
        {/* BACK BUTTON */}
        <motion.button
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 font-medium text-[#155dfc] hover:opacity-75 dark:text-[#1e5eff]">
          <HiArrowLeft size={20} />
          Kembali
        </motion.button>

        {/* SCORE HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
            Detail Riwayat Quiz
          </h1>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {timestamp
              ? new Date(timestamp).toLocaleString("id-ID", {
                  timeZone: "Asia/Jakarta",
                  hour12: false,
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Waktu tidak tersedia"}
          </p>

          <p className="text-sm mt-2">
            Tingkat benar:{" "}
            <span className={`${getPercentColor(percentage)} font-semibold`}>
              {percentage}%
            </span>
          </p>
        </motion.div>

        {/* QUESTIONS LIST */}
        <div className="space-y-8">
          {quizData.map((q, i) => {
            const userAns = userAnswers[i] || [];
            const correctAns = q.correctAnswers || [];

            const isCorrect =
              userAns.length === correctAns.length &&
              userAns.every((a) => correctAns.includes(a));

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="
                  p-6 rounded-3xl
                  bg-white/70 dark:bg-[#0f1a27]/40
                  backdrop-blur-xl
                  border border-black/10 dark:border-white/10
                  shadow-[0_8px_40px_rgba(0,0,0,0.06)]
                ">
                {/* HEADER */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <HiMiniCheckBadge className="text-green-500 text-xl" />
                    ) : (
                      <HiMiniXMark className="text-red-500 text-xl" />
                    )}
                    <p className="font-semibold text-lg text-blue-600">
                      Soal {i + 1}
                    </p>
                  </div>

                  <span
                    className={`
                      px-3 py-1 text-xs font-medium rounded-full
                      ${
                        isCorrect
                          ? "bg-green-500/20 text-green-600"
                          : "bg-red-500/20 text-red-600"
                      }
                    `}>
                    {isCorrect ? "Benar" : "Salah"}
                  </span>
                </div>

                {/* QUESTION */}
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  {htmlToText(q.question)}
                </p>

                {/* OPTIONS */}
                <div className="space-y-3">
                  {q.options.map((opt) => {
                    const isUser = userAns.includes(opt.key);
                    const isTrue = correctAns.includes(opt.key);

                    const style =
                      isUser && isTrue
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : isUser && !isTrue
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : isTrue
                        ? "border-green-400 bg-green-50 dark:bg-green-900/10"
                        : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f172a]";

                    return (
                      <motion.div
                        key={opt.key}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`p-4 rounded-xl border ${style}`}>
                        <div className="flex justify-between items-center gap-3">
                          <span className="font-medium">
                            {htmlToText(opt.text)}
                          </span>

                          <div className="flex gap-2">
                            {isUser && (
                              <span className="px-2 py-0.5 text-xs rounded bg-[#155dfc] text-white">
                                Kamu
                              </span>
                            )}
                            {isTrue && (
                              <span className="px-2 py-0.5 text-xs rounded bg-green-600 text-white">
                                Kunci
                              </span>
                            )}
                          </div>
                        </div>

                        {/* FEEDBACK */}
                        {opt.feedback &&
                          ((isTrue && !isCorrect) || (isUser && !isTrue)) && (
                            <div
                              className="
                                mt-3 p-3 rounded-lg text-sm flex gap-2
                                bg-white dark:bg-[#162036]
                                border border-black/10 dark:border-gray-700
                              ">
                              {isTrue ? (
                                <HiMiniCheckCircle className="text-green-500 mt-0.5" />
                              ) : (
                                <HiMiniXCircle className="text-red-500 mt-0.5" />
                              )}
                              <p className="text-gray-700 dark:text-gray-300">
                                {htmlToText(opt.feedback)}
                              </p>
                            </div>
                          )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
