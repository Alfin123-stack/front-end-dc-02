// import React from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import useQuiz from "../hooks/useQuiz";
// import useSettings from "../hooks/useSettings";
// import ReviewScreen from "../components/screens/ReviewScreen";

// export default function ReviewPage() {
//   const { level } = useParams();
//   const levelNum = Number(level || 1);
//   const navigate = useNavigate();
//   const quiz = useQuiz(levelNum);
//   const { settings, toggleTheme } = useSettings();

//   return (
//     <div
//       id="root"
//       className={`min-h-screen transition-all duration-300 ${
//         settings.orientation === "landscape"
//           ? "landscape-mode"
//           : "portrait-mode"
//       } screen-${settings.screenSize}`}>
//       <ReviewScreen
//         isDarkMode={settings.theme === "dark"}
//         onToggleTheme={toggleTheme}
//         onRestart={() => {
//           quiz.handleRestart();
//           quiz.handleStartQuiz();
//           navigate(`/quiz/${levelNum}`);
//         }}
//         onGoHome={() => navigate("/")}
//         onBackToResults={() => navigate(`/completion/${levelNum}`)}
//         onShowSettings={() => navigate("/settings")}
//         quizData={quiz.quizData}
//         userAnswers={quiz.userAnswers}
//         score={quiz.score}
//         totalQuestions={quiz.quizData.length}
//       />
//     </div>
//   );
// }

import React from "react";

const ReviewPage = () => {
  return <div>ReviewPage</div>;
};

export default ReviewPage;
