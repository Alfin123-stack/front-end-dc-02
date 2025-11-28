import React from "react";
import { motion } from "framer-motion";

function Timer({ timeLeft, isDarkMode }) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isWarning = timeLeft <= 60;
  const isCritical = timeLeft <= 30;

  return (
    <motion.div
      className={`timer ${isCritical ? 'timer-critical' : isWarning ? 'timer-warning' : ''} ${isDarkMode ? 'dark' : ''}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isCritical ? [1, 1.05, 1] : 1
      }}
      transition={{ 
        duration: 0.3,
        scale: {
          duration: 0.5,
          repeat: isCritical ? Infinity : 0,
          repeatType: "reverse"
        }
      }}
    >
      <div className="timer-content">
        <motion.div
          animate={isCritical ? { rotate: [0, -10, 10, -10, 0] } : {}}
          transition={{ duration: 0.5, repeat: isCritical ? Infinity : 0 }}
          className="timer-icon"
        >
          {isCritical ? "⚠️" : "⏱️"}
        </motion.div>
        
        <div className="timer-info">
          <p className="timer-label">Waktu Tersisa</p>
          <div className="timer-value-container">
            <motion.span
              key={timeLeft}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className="timer-value"
            >
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </motion.span>
          </div>
        </div>

        {isCritical && (
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="timer-warning-text"
          >
            SEGERA!
          </motion.div>
        )}
      </div>

      <div className="timer-progress">
        <motion.div
          className="timer-progress-fill"
          initial={{ width: "100%" }}
          animate={{ width: `${(timeLeft / 300) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
}

export default Timer;