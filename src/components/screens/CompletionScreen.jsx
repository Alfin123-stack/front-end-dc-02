import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import ScoreRing from "./completion/CompletionScoreRing";
import CompletionHeader from "./completion/CompletionHeader";
import CompletionMessage from "./completion/CompletionMessage";
import CompletionButtons from "./completion/CompletionButtons";

import { selectScore } from "../../store/quiz/quizSlice";

import { deleteQuizCache } from "../../store/quiz/quizUtils";
import {
  calcScorePercentage,
  getScoreColorName,
  scoreColorHex,
  scoreColorText,
} from "../../utils/helper";
import { clearBackendQuiz } from "../../store/quiz/thunks/quizCacheThunks";

export default function CompletionScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { level } = useParams();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const levelNum = Number(level || 1);
  const tutorialId = Number(query.get("tutorial") || 1);
  const user = query.get("user") || "";

  const { score = 0 } = useSelector((state) => selectScore(state, tutorialId));

  /* === Gunakan helper === */
  const percentage = calcScorePercentage(score);
  const color = getScoreColorName(percentage);

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
