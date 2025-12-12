// src/components/ui/AppButton.jsx
import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

export default function AppButton({
  children,
  onClick,
  iconLeft,
  iconRight,
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}) {
  const base =
    "font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary:
      "bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white",
    dark: "bg-gray-800 hover:bg-gray-900 text-white",
    subtle:
      "bg-transparent border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800",
    indigo: "bg-indigo-600 hover:bg-indigo-700 text-white",

    // ⬇️ NEW
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.03 }}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}>
      {iconLeft && <span className="text-lg">{iconLeft}</span>}
      {children}
      {iconRight && <span className="text-lg">{iconRight}</span>}
    </motion.button>
  );
}

AppButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  iconLeft: PropTypes.node,
  iconRight: PropTypes.node,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "dark",
    "subtle",
    "indigo",
    "danger", // ⬅️ ditambah
  ]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
};
