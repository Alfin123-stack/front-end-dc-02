import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import QuestionList from "../QuestionList";
import { loadHistory } from "../../store/quiz/quizUtils";
import QuizHeader from "../QuizHeader";

import { calcScorePercentage } from "../../utils/helper";
import EmptyState from "../ui/EmptyState";

export default function HistoryDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const history = loadHistory();
  const item = history.find((h) => String(h.id) === String(id));

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4">
        <EmptyState message="Data riwayat tidak ditemukan." />
      </div>
    );
  }

  const { quizData, userAnswers, score, timestamp } = item;
  const percentage = calcScorePercentage(score);

  return (
    <div className="min-h-screen bg-[#f7f9fc] dark:bg-[#0b1220] py-10">
      <div className="max-w-3xl mx-auto px-4 text-gray-900 dark:text-gray-200">
        <QuizHeader
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
