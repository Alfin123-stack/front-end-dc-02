import React from "react";
import { motion } from "framer-motion";
import { FaMoon, FaSun } from "react-icons/fa";
import Button from "../ui/Button";

function ThemeToggle({ isDark, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        onClick={onToggle}
        className={`theme-toggle ${isDark ? 'dark' : ''}`}
        size="icon"
      >
        <motion.div
          key={isDark ? "moon" : "sun"}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {isDark ? <FaMoon /> : <FaSun />}
        </motion.div>
      </Button>
    </motion.div>
  );
}

export default ThemeToggle;