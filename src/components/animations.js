// src/components/screens/review/animations.js
export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export const fadeLeft = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.25 } },
};

export const containerStagger = {
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};
