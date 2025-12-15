import React from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";

import ScoreRing from "./completion/CompletionScoreRing";
import CompletionHeader from "./completion/CompletionHeader";
import CompletionMessage from "./completion/CompletionMessage";
import CompletionButtons from "./completion/CompletionButtons";

import { deleteQuizCache } from "../../store/quiz/quizUtils";
import { clearBackendQuiz } from "../../store/quiz/thunks/quizCacheThunks";
import useCompletionScreen from "../../hooks/useCompletionScreen";
import { useNavigate } from "react-router-dom";

export default function CompletionScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    levelNum,
    tutorialId,
    user,
    percentage,
    color,
    scoreColorHex,
    scoreColorText,
  } = useCompletionScreen();

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-b 
        from-blue-50 to-blue-100 
        dark:from-[#0b1120] dark:to-[#0a0f1a]
        py-14 px-5 text-gray-900 dark:text-gray-200">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          whileHover={{ scale: 1.005 }}
          className="
            p-10 rounded-3xl shadow-xl
            bg-white/80 dark:bg-[#111827]/70 backdrop-blur-xl
            border border-white/20 dark:border-gray-700/40
          ">
          <CompletionHeader
            levelNum={levelNum}
            color={color}
            colorText={scoreColorText}
          />

          <ScoreRing
            percentage={percentage}
            color={color}
            colorHex={scoreColorHex}
            colorText={scoreColorText}
          />

          <CompletionMessage percentage={percentage} />

          <CompletionButtons
            levelNum={levelNum}
            tutorialId={tutorialId}
            user={user}
            navigate={navigate}
            dispatch={dispatch}
            clearBackendQuiz={clearBackendQuiz}
            deleteLocalQuizCache={deleteQuizCache}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
