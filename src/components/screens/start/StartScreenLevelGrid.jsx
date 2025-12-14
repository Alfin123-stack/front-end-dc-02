import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

import StartScreenLevelCard from "./StartScreenLevelCard";
import { levels } from "../../../utils/constants";

export default function StartScreenLevelGrid({
  levelStatus,
  loadingStatus,
  handleStart,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
      {levels.map((lvl, i) => (
        <motion.div
          key={lvl.level}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}>
          <StartScreenLevelCard
            lvl={lvl}
            status={levelStatus[lvl.level]}
            loadingStatus={loadingStatus}
            onClick={() => handleStart(lvl.level)}
          />
        </motion.div>
      ))}
    </div>
  );
}

StartScreenLevelGrid.propTypes = {
  levelStatus: PropTypes.object.isRequired,
  loadingStatus: PropTypes.bool.isRequired,
  handleStart: PropTypes.func.isRequired,
};
