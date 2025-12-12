
import React from "react";
import PropTypes from "prop-types";
import { HiBookOpen, HiArrowPath, HiHome } from "react-icons/hi2";
import { clearProgress, invalidateQuiz } from "../../../store/quiz/quizSlice";

import AppButton from "../../ui/AppButton";

export default function CompletionButtons({
  levelNum,
  tutorialId,
  user,
  navigate,
  dispatch,
  clearBackendQuiz,
  deleteLocalQuizCache,
}) {
  return (
    <div className="flex flex-col gap-3">

      <AppButton
        iconLeft={<HiBookOpen />}
        variant="primary"
        onClick={() =>
          navigate(`/review/${levelNum}?tutorial=${tutorialId}&user=${user}`)
        }>
        Review Jawaban
      </AppButton>


      <AppButton
        iconLeft={<HiArrowPath />}
        variant="secondary"
        onClick={() => {
          dispatch(clearProgress({ tutorialId, user, level: levelNum }));
          navigate(`/quiz/${levelNum}?tutorial=${tutorialId}&user=${user}`);
        }}>
        Ulangi Quiz
      </AppButton>


      <AppButton
        iconLeft={<HiHome />}
        variant="secondary"
        onClick={async () => {
          await dispatch(
            clearBackendQuiz({
              tutorialId,
              userId: user,
              level: levelNum,
              cache: true,
              progress: false,
            })
          );

          deleteLocalQuizCache(user, tutorialId, levelNum);
          dispatch(invalidateQuiz());

          navigate(`/?tutorial=${tutorialId}&user=${user}`);
        }}>
        Kembali ke Dashboard
      </AppButton>
    </div>
  );
}

CompletionButtons.propTypes = {
  levelNum: PropTypes.number.isRequired,
  tutorialId: PropTypes.number.isRequired,
  user: PropTypes.string.isRequired,
  canGoNextLevel: PropTypes.bool.isRequired,
  navigate: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  clearBackendQuiz: PropTypes.func.isRequired,
  deleteLocalQuizCache: PropTypes.func.isRequired,
};
