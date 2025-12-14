import React from "react";
import { motion } from "framer-motion";
import { HiArrowLeft, HiArrowPath } from "react-icons/hi2";

import { containerStagger } from "../../utils/animations";
import QuestionList from "../QuestionList";
import QuizHeader from "../QuizHeader";
import AppButton from "../ui/AppButton";
import EmptyState from "../ui/EmptyState";
import useReviewScreen from "../../hooks/useReviewScreen";

export default function ReviewScreen() {
  const {
    quizData,
    userAnswers,
    score,
    handleRestart,
    handleBackToResult,
    isEmpty,
  } = useReviewScreen();

  if (isEmpty) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0d1320]">
        <EmptyState message="Tidak ada data untuk direview." />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 bg-gray-50 dark:bg-[#0d1320] text-gray-900 dark:text-gray-200">
      <QuizHeader mode="review" percentage={score} />

      <motion.div
        className="max-w-3xl mx-auto space-y-10"
        variants={containerStagger}
        initial="hidden"
        animate="show">
        <QuestionList quizData={quizData} userAnswers={userAnswers} />

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-14">
          <AppButton
            onClick={handleBackToResult}
            iconLeft={<HiArrowLeft />}
            variant="dark">
            Kembali ke Hasil
          </AppButton>

          <AppButton
            onClick={handleRestart}
            iconLeft={<HiArrowPath />}
            variant="primary">
            Ulangi Quiz
          </AppButton>
        </div>
      </motion.div>
    </div>
  );
}
