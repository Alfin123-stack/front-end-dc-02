import React from "react";
import { useNavigate } from "react-router-dom";

import QuestionList from "../QuestionList";
import QuestionHeader from "../QuestionHeader";
import EmptyState from "../ui/EmptyState";
import LoadingState from "./history/HistoryLoading";
import useHistoryDetailScreen from "../../hooks/useHistoryDetailScreen";

export default function HistoryDetailScreen() {
  const navigate = useNavigate();

  const { loading, item, percentage } = useHistoryDetailScreen();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center px-4">
        <LoadingState message="Memuat detail riwayat..." />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4">
        <EmptyState message="Data riwayat tidak ditemukan." />
      </div>
    );
  }

  const { quizData, userAnswers, timestamp } = item;

  return (
    <div className="min-h-screen bg-[#f7f9fc] dark:bg-[#0b1220] py-10">
      <div className="max-w-3xl mx-auto px-4 text-gray-900 dark:text-gray-200">
        <QuestionHeader
          mode="history"
          percentage={percentage}
          timestamp={timestamp}
          onBack={() => navigate(-1)}
        />

        <QuestionList quizData={quizData} userAnswers={userAnswers} />
      </div>
    </div>
  );
}
