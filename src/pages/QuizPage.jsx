// QUIZ PAGE – FULL REDUX TOOLKIT VERSION (FIXED FOR GLOBAL SCORE)
import React, { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  loadQuiz,
  startQuiz,
  tick,
  answerQuestion,
  nextQuestion,
  setTime,
  setScore,
} from "../store/quizSlice";

import useSettings from "../hooks/useSettings";
import LoadingScreen from "./quiz/LoadingScreen";
import StartQuizCard from "./quiz/StartQuizCard";
import QuizScreen from "../components/screens/QuizScreen";

export default function QuizPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { level } = useParams();

  const currentLevel = Number(level);
  const query = new URLSearchParams(location.search);
  const tutorialId = Number(query.get("tutorial") || 1);

  const { settings, toggleTheme } = useSettings();

  const {
    isLoading,
    quizData,
    tutorial,
    meta,
    userAnswers,
    quizStarted,
    timeLeft,
    currentQuestion,
    error,
  } = useSelector((state) => state.quiz);

  /* ---------------------------------------------------
     SET TIMER BASED ON LEVEL
  --------------------------------------------------- */
  useEffect(() => {
    const levelTime = { 1: 60, 2: 90, 3: 120 };
    dispatch(setTime(levelTime[currentLevel] || 30));
  }, [currentLevel, dispatch]);

  /* ---------------------------------------------------
     LOAD QUIZ USING REDUX THUNK
  --------------------------------------------------- */
  useEffect(() => {
    dispatch(loadQuiz({ tutorialId }));
  }, [tutorialId, dispatch]);

  /* ---------------------------------------------------
     TIMER TICK
  --------------------------------------------------- */
  useEffect(() => {
    if (!quizStarted) return;

    if (timeLeft <= 0) {
      handleFinishQuiz();
      return;
    }

    const timer = setInterval(() => {
      dispatch(tick());
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, timeLeft, dispatch]);

  /* ---------------------------------------------------
     FINISH QUIZ
  --------------------------------------------------- */
  const handleFinishQuiz = () => {
    if (!quizData.length) return;

    let score = 0;

    quizData.forEach((q, i) => {
      const user = userAnswers[i] || [];
      const correct = q.correctAnswers || [];

      if (["multiple_choice", "true_false"].includes(q.type)) {
        if (user[0] === correct[0]) score++;
      } else if (q.type === "multiple_answer") {
        if (correct.length > 0) {
          score +=
            user.filter((a) => correct.includes(a)).length / correct.length;
        }
      }
    });

    const finalScore = Math.round(score);
    const totalQuestions = quizData.length;

    // ⬇ HANYA score + totalQuestions, TIDAK ADA tutorialId
    dispatch(
      setScore({
        score: finalScore,
        totalQuestions,
      })
    );

    // BAWA tutorialId supaya CompletionPage bisa ambil session
    navigate(`/completion/${currentLevel}?tutorial=${tutorialId}`);
  };

  /* ---------------------------------------------------
     LOADING UI
  --------------------------------------------------- */
  if (isLoading) {
    return <LoadingScreen theme={settings.theme} />;
  }

  if (error || !quizData.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">
            Soal tidak tersedia
          </h2>
          <p>Silakan coba lagi nanti.</p>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------
     MAIN RENDER
  --------------------------------------------------- */
  return (
    <div
      className={`min-h-screen flex justify-center items-center flex-col ${
        settings.theme === "dark"
          ? "bg-[#0B0F19] text-white"
          : "bg-gray-100 text-gray-900"
      }`}>
      <div className="w-full max-w-4xl p-6">
        {!quizStarted ? (
          <StartQuizCard
            meta={meta}
            data={{
              quizData,
              tutorial,
              userAnswers,
              timeLeft,
              currentQuestion,
            }}
            level={currentLevel}
            theme={settings.theme}
            onStart={() => dispatch(startQuiz())}
          />
        ) : (
          <QuizScreen
            data={{
              quizData,
              tutorial,
              userAnswers,
              timeLeft,
              currentQuestion,
            }}
            settings={settings}
            onToggleTheme={toggleTheme}
            onGoHome={() => navigate("/")}
            onAnswer={(ans) => dispatch(answerQuestion(ans))}
            onNext={() => dispatch(nextQuestion())}
            onFinish={handleFinishQuiz}
          />
        )}
      </div>
    </div>
  );
}
