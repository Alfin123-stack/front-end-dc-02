import { motion } from "framer-motion";

<<<<<<< HEAD
export default function StatCard({ icon, label, value, isDanger }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`
        relative px-5 py-5 md:px-6 md:py-6 rounded-2xl border
        shadow-sm transition-all duration-300
        bg-white dark:bg-[#101828] border-[#d1d5dc]/40 dark:border-[#ffffff15]
      `}>
      {/* LEFT STRIP */}
      <div
        className={`
          absolute left-0 top-0 h-full w-[4px] rounded-l-2xl
          ${isDanger ? "bg-red-500" : "bg-[#155dfc]"}
        `}
      />

      {/* ICON + LABEL */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`
            w-11 h-11 rounded-xl flex items-center justify-center
            bg-[#155dfc]/12 text-[#155dfc] dark:bg-[#155dfc]/20
          `}>
          {icon}
        </div>

        <p className="text-sm font-medium tracking-wide text-[#475569] dark:text-[#d1d5dc]/70">
          {label}
        </p>
      </div>

      {/* VALUE — ONLY THIS TURNS RED */}
      <p
        className={`
          text-3xl font-bold leading-tight
          ${
            isDanger
              ? "text-red-600 dark:text-red-400"
              : "text-[#0f172a] dark:text-white"
          }
        `}>
        {value ?? "-"}
      </p>
=======
export default function StatIconValue({ icon, value, isDanger }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-2">
      {/* ICON */}
      <div
        className={`
          w-9 h-9 flex items-center justify-center rounded-lg
          bg-[#155dfc]/12 text-[#155dfc] dark:bg-[#155dfc]/20
        `}>
        {icon}
      </div>

      {/* VALUE */}
      <span
        className={`
          text-xl font-bold
          ${
            isDanger
              ? "text-red-600 dark:text-red-400"
              : "text-[#f8fafc] dark:text-white"
          }
        `}>
        {value}
      </span>
>>>>>>> 66c974b (adding history screen)
    </motion.div>
  );
}
