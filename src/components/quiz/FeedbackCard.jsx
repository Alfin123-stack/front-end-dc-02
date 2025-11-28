import React from "react";
import { motion } from "framer-motion";
import { FaCheck, FaTimes, FaBook, FaLightbulb } from "react-icons/fa";
import Card from "../ui/Card";

function FeedbackCard({ isCorrect, explanation, funFact, isDarkMode, questionData, userAnswers, currentScore }) {
  // Fungsi untuk menampilkan alasan per pilihan jawaban
  const renderOptionExplanations = () => {
    if (!questionData || !userAnswers) return null;

    const { type, options, correctAnswers, matches, optionExplanations } = questionData;
    const currentUserAnswers = userAnswers[userAnswers.length - 1] || [];
    
    if (type === "multiple_choice" || type === "multiple_choice_multiple" || type === "true_false") {
      return (
        <div className="feedback-section option-explanations mb-4">
          <div className="flex items-center gap-3 mb-3">
            <FaBook className="text-blue-500" />
            <p className="section-label font-bold text-gray-900 dark:text-white">Analisis Jawaban:</p>
          </div>
          <div className="options-list space-y-3">
            {options.map((option, index) => {
              const isCorrectOption = correctAnswers.includes(index);
              const isUserSelected = Array.isArray(currentUserAnswers) 
                ? currentUserAnswers.includes(index)
                : currentUserAnswers === index;
              const explanation = optionExplanations?.[index] || 
                (isCorrectOption ? "Ini adalah jawaban yang benar karena sesuai dengan konsep yang ditanyakan." : "Ini bukan jawaban yang tepat karena tidak sesuai dengan pertanyaan.");
              
              return (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg border transition-all ${
                    isCorrectOption 
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                      : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  } ${isUserSelected ? 'ring-2 ring-blue-300' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium ${isCorrectOption ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                      {option}
                    </span>
                    <div className="flex items-center gap-2">
                      {isCorrectOption && (
                        <span className="px-2 py-1 text-xs font-bold text-white bg-green-500 rounded-full">
                          ✓ Benar
                        </span>
                      )}
                      {isUserSelected && !isCorrectOption && (
                        <span className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                          ✗ Dipilih
                        </span>
                      )}
                      {!isUserSelected && !isCorrectOption && (
                        <span className="px-2 py-1 text-xs font-bold text-gray-500 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">
                          ○ Tidak dipilih
                        </span>
                      )}
                    </div>
                  </div>
                  <p className={`text-sm ${isCorrectOption ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                    {explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (type === "matching" && matches) {
      return (
        <div className="feedback-section option-explanations mb-4">
          <div className="flex items-center gap-3 mb-3">
            <FaBook className="text-blue-500" />
            <p className="section-label font-bold text-gray-900 dark:text-white">Analisis Pasangan:</p>
          </div>
          <div className="matching-explanations space-y-3">
            {options.map((option, index) => {
              const correctMatchIndex = correctAnswers[index];
              const userMatchIndex = currentUserAnswers[index];
              const isCorrect = correctMatchIndex === userMatchIndex;
              const userMatch = userMatchIndex !== undefined ? matches[userMatchIndex] : "[Tidak dijawab]";
              const correctMatch = matches[correctMatchIndex];
              const explanation = optionExplanations?.[index] || 
                (isCorrect 
                  ? `Pasangan "${option}" dengan "${correctMatch}" adalah benar.` 
                  : `Pasangan yang tepat untuk "${option}" adalah "${correctMatch}", bukan "${userMatch}".`);
              
              return (
                <div key={index} className={`p-3 rounded-lg border ${
                  isCorrect 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{option}</span>
                      <span className="text-gray-500">→</span>
                      <span className={isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
                        {userMatch}
                      </span>
                    </div>
                    {!isCorrect && (
                      <span className="text-sm text-blue-600 dark:text-blue-400">
                        Seharusnya: {correctMatch}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                    {explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (type === "drag_drop") {
      return (
        <div className="feedback-section option-explanations mb-4">
          <div className="flex items-center gap-3 mb-3">
            <FaBook className="text-blue-500" />
            <p className="section-label font-bold text-gray-900 dark:text-white">Analisis Urutan:</p>
          </div>
          <div className="dragdrop-explanations space-y-4">
            <div className="correct-order">
              <p className="font-medium text-green-700 dark:text-green-300 mb-2">Urutan yang benar:</p>
              <div className="flex flex-wrap gap-2">
                {correctAnswers.map((answerIndex, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="bg-green-100 dark:bg-green-900/30 px-3 py-2 rounded-lg text-green-800 dark:text-green-200 font-medium">
                      {options[answerIndex]}
                    </span>
                    {index < correctAnswers.length - 1 && (
                      <span className="text-gray-500">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="user-order">
              <p className="font-medium text-blue-700 dark:text-blue-300 mb-2">Jawaban Anda:</p>
              <div className="flex flex-wrap gap-2">
                {currentUserAnswers.map((answerIndex, index) => {
                  const isCorrectPosition = answerIndex === correctAnswers[index];
                  const explanation = isCorrectPosition 
                    ? `Posisi "${options[answerIndex]}" sudah tepat.`
                    : `"${options[answerIndex]}" seharusnya berada di posisi ${index + 1}, bukan posisi ${correctAnswers.indexOf(answerIndex) + 1}.`;
                  
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`px-3 py-2 rounded-lg font-medium ${
                        isCorrectPosition 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                      }`}>
                        <span>
                          {options[answerIndex]}
                          {!isCorrectPosition && (
                            <span className="ml-2 text-xs text-red-600 dark:text-red-400">
                              (seharusnya: {options[correctAnswers[index]]})
                            </span>
                          )}
                        </span>
                      </div>
                      {index < currentUserAnswers.length - 1 && (
                        <span className="text-gray-500">→</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="mb-6"
    >
      <Card className={`p-6 rounded-2xl border-2 ${
        isCorrect 
          ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
          : 'border-red-500 bg-red-50 dark:bg-red-900/20'
      } shadow-lg`}>
        <div className="feedback-content">
          <div className="flex items-start gap-4 mb-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white ${
                isCorrect ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {isCorrect ? <FaCheck size={20} /> : <FaTimes size={20} />}
            </motion.div>

            <div className="flex-1">
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className={`text-xl font-bold mb-2 ${
                  isCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                }`}
              >
                {isCorrect ? "🎉 Jawaban Benar!" : "❌ Jawaban Kurang Tepat"}
              </motion.h3>

              {/* Tampilkan score partial */}
              {(questionData?.type === "multiple_choice_multiple" || 
                questionData?.type === "matching" || 
                questionData?.type === "drag_drop") && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="mb-4"
                >
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg inline-block">
                    <p className="text-blue-800 dark:text-blue-200 font-medium">
                      Skor untuk soal ini: <strong>{currentScore.toFixed(1)}</strong> point
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            {/* Penjelasan per pilihan jawaban */}
            {renderOptionExplanations()}

            <div className="feedback-section bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <div className="text-blue-500 mt-1">
                  <FaBook />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Penjelasan Soal:</p>
                  <p className="text-gray-700 dark:text-gray-300">{explanation}</p>
                </div>
              </div>
            </div>

            {funFact && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="feedback-section bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800"
              >
                <div className="flex items-start gap-3">
                  <div className="text-yellow-500 mt-1">
                    <FaLightbulb />
                  </div>
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Tahukah kamu?</p>
                    <p className="text-yellow-700 dark:text-yellow-300">{funFact}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}

export default FeedbackCard;