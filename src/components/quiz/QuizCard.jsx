import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QuizCard = ({
  question,
  options,
  correctAnswers,
  onAnswerSelect,
  selectedAnswers,
  showResult,
  isMultipleAnswer,
  maxSelections,
  questionType,
  onSubmit,
  textAnswer,
  onTextAnswerChange,
  userAnswer,
  isCorrect,
  explanation,
  funFact,
  currentScore
}) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle submit dengan animasi feedback
  const handleSubmitWithFeedback = () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    onSubmit();
    
    // Delay sedikit sebelum menampilkan feedback
    setTimeout(() => {
      setShowFeedback(true);
      setIsSubmitting(false);
    }, 500);
  };

  // Render feedback untuk setiap opsi
  const renderOptionFeedback = (optionIndex) => {
    if (!showFeedback || !showResult) return null;

    const isSelected = selectedAnswers.includes(optionIndex);
    const isCorrectOption = correctAnswers.includes(optionIndex);
    
    if (!isSelected && !isCorrectOption) return null;

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        transition={{ duration: 0.3 }}
        className={`mt-2 p-3 rounded-lg border ${
          isCorrectOption 
            ? 'border-green-200 bg-green-50 dark:bg-green-900/20' 
            : 'border-red-200 bg-red-50 dark:bg-red-900/20'
        }`}
      >
        <div className="flex items-start gap-2">
          <span className={`text-sm font-medium ${
            isCorrectOption 
              ? 'text-green-700 dark:text-green-300' 
              : 'text-red-700 dark:text-red-300'
          }`}>
            {isCorrectOption ? '✓ Benar' : '✗ Salah'}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {isCorrectOption 
              ? 'Ini adalah jawaban yang benar.' 
              : 'Ini bukan jawaban yang tepat.'}
          </span>
        </div>
      </motion.div>
    );
  };

  // Render feedback card lengkap
  const renderCompleteFeedback = () => {
    if (!showFeedback || !showResult) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, type: "spring" }}
        className="mt-6"
      >
        <div className={`p-6 rounded-2xl border-2 ${
          isCorrect 
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
            : 'border-red-500 bg-red-50 dark:bg-red-900/20'
        } shadow-lg`}>
          <div className="flex items-start gap-4 mb-4">
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white ${
              isCorrect ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {isCorrect ? '✓' : '✗'}
            </div>
            
            <div className="flex-1">
              <h3 className={`text-xl font-bold mb-2 ${
                isCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
              }`}>
                {isCorrect ? "🎉 Jawaban Benar!" : "❌ Jawaban Kurang Tepat"}
              </h3>
              
              {/* Score partial untuk tipe soal tertentu */}
              {(questionType === "multiple_choice_multiple" || 
                questionType === "matching" || 
                questionType === "drag_drop") && (
                <div className="mb-3 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg inline-block">
                  <p className="text-blue-800 dark:text-blue-200 font-medium">
                    Skor: <strong>{currentScore.toFixed(1)}</strong> point
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {/* Penjelasan */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <p className="font-medium text-gray-900 dark:text-white mb-2">Penjelasan:</p>
              <p className="text-gray-700 dark:text-gray-300">{explanation}</p>
            </div>

            {/* Fun Fact */}
            {funFact && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Tahukah kamu?</p>
                <p className="text-yellow-700 dark:text-yellow-300">{funFact}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderQuestionContent = () => {
    // Text-based questions
    if (questionType === "short_answer" || questionType === "number" || questionType === "essay") {
      return (
        <div className="space-y-4">
          <textarea
            className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 resize-none transition-all duration-200"
            value={textAnswer}
            onChange={(e) => onTextAnswerChange(e.target.value)}
            placeholder={
              questionType === "number" 
                ? "Masukkan angka..." 
                : questionType === "essay"
                ? "Tulis jawaban essay Anda di sini..."
                : "Tulis jawaban singkat Anda di sini..."
            }
            rows={questionType === "essay" ? 6 : 3}
            disabled={showResult}
          />
          {!showResult && (
            <div className="text-center">
              <button 
                onClick={handleSubmitWithFeedback}
                className={`py-3 px-8 rounded-xl font-bold text-lg transition-all duration-300 ${
                  !textAnswer.trim() || isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                    : 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
                disabled={!textAnswer.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Jawaban'
                )}
              </button>
            </div>
          )}
        </div>
      );
    }

    // Multiple choice questions
    return (
      <div className="space-y-3">
        {options.map((option, index) => {
          const isSelected = selectedAnswers.includes(index);
          const isCorrectOption = correctAnswers.includes(index);
          const showCorrect = showResult && isCorrectOption;
          const showWrong = showResult && isSelected && !isCorrectOption;

          return (
            <div key={index} className="space-y-2">
              <div
                className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  showResult ? 'cursor-default' : 'hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
                } ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-600'
                } ${
                  showCorrect 
                    ? '!border-green-500 !bg-green-50 dark:!bg-green-900/20' 
                    : showWrong
                    ? '!border-red-500 !bg-red-50 dark:!bg-red-900/20'
                    : ''
                }`}
                onClick={() => !showResult && onAnswerSelect(index)}
              >
                <div className="flex items-center gap-4 w-full">
                  {/* Radio/Checkbox Indicator */}
                  <div className="flex items-center justify-center">
                    {isMultipleAnswer ? (
                      <div className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-all ${
                        isSelected || showCorrect
                          ? 'bg-blue-500 border-blue-500 text-white'
                          : showWrong
                          ? 'bg-red-500 border-red-500 text-white'
                          : 'border-gray-400 dark:border-gray-500'
                      }`}>
                        {(isSelected || showCorrect) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-sm font-bold"
                          >
                            ✓
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center transition-all ${
                        isSelected || showCorrect
                          ? 'bg-blue-500 border-blue-500'
                          : showWrong
                          ? 'bg-red-500 border-red-500'
                          : 'border-gray-400 dark:border-gray-500'
                      }`}>
                        {(isSelected || showCorrect) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-white rounded-full"
                          />
                        )}
                      </div>
                    )}
                  </div>
                  
                  <span className={`flex-1 text-left ${
                    showCorrect ? 'text-green-800 dark:text-green-200' :
                    showWrong ? 'text-red-800 dark:text-red-200' :
                    isSelected ? 'text-blue-800 dark:text-blue-200' :
                    'text-gray-800 dark:text-gray-200'
                  }`}>
                    {option}
                  </span>
                  
                  {/* Result Icons */}
                  {showCorrect && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-green-500"
                    >
                      ✓
                    </motion.div>
                  )}
                  {showWrong && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-red-500"
                    >
                      ✗
                    </motion.div>
                  )}
                </div>
              </div>
              
              {/* Feedback dropdown untuk setiap opsi */}
              <AnimatePresence>
                {renderOptionFeedback(index)}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 rounded-3xl p-8 mb-6 border border-white/20 shadow-2xl">
      {/* Question Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="flex items-center justify-center w-10 h-10 text-xl font-bold text-blue-600 bg-blue-100 rounded-full dark:bg-blue-900/30 dark:text-blue-300">
          ?
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-center mb-2">{question}</h2>
          {isMultipleAnswer && !showResult && (
            <div className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full dark:bg-green-900/20 dark:text-green-300 inline-block">
              📝 Pilih {maxSelections} jawaban
            </div>
          )}
        </div>
      </div>
      
      {/* Question Content */}
      {renderQuestionContent()}
      
      {/* Selection Hint */}
      {isMultipleAnswer && !showResult && selectedAnswers.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="p-4 mt-4 text-sm text-gray-600 bg-blue-50 rounded-xl dark:bg-blue-900/20 dark:text-gray-300"
        >
          💡 Terpilih: {selectedAnswers.length} dari {maxSelections} jawaban
          {selectedAnswers.length === maxSelections && (
            <span className="ml-2 font-medium text-green-600 dark:text-green-400">
              ✓ Siap submit!
            </span>
          )}
        </motion.div>
      )}

      {/* Submit Button untuk Multiple Choice */}
      {!showResult && questionType !== "short_answer" && questionType !== "number" && questionType !== "essay" && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-6"
        >
          <button
            onClick={handleSubmitWithFeedback}
            disabled={
              selectedAnswers.length === 0 || 
              (isMultipleAnswer && selectedAnswers.length !== maxSelections) ||
              isSubmitting
            }
            className={`py-3 px-8 rounded-xl font-bold text-lg transition-all duration-300 w-full max-w-md ${
              selectedAnswers.length === 0 || 
              (isMultipleAnswer && selectedAnswers.length !== maxSelections) ||
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Jawaban'
            )}
          </button>
        </motion.div>
      )}

      {/* Complete Feedback Card */}
      <AnimatePresence>
        {renderCompleteFeedback()}
      </AnimatePresence>
    </div>
  );
};

export default QuizCard;