import { motion } from "framer-motion";

export default function StatCard({ icon, label, value }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="
        flex-1 p-5 md:p-6 rounded-2xl relative overflow-hidden
        bg-white/80 dark:bg-gray-800/70
        border border-gray-200 dark:border-gray-700
        shadow-[0_4px_14px_rgba(0,0,0,0.07)]
        hover:shadow-[0_6px_18px_rgba(0,0,0,0.13)]
        transition-all duration-300
        backdrop-blur-md
        group
      ">
      {/* Soft Glow Gradient on Hover */}
      <div
        className="
          absolute inset-0 opacity-0 group-hover:opacity-100
          transition-all duration-300 rounded-2xl pointer-events-none
          bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-indigo-600/10
        "
      />

      {/* ICON + LABEL */}
      <div className="flex items-center gap-4 mb-3">
        {icon && (
          <div
            className="
              text-blue-600 dark:text-blue-400
              bg-blue-100/70 dark:bg-blue-900/30
              p-3 rounded-xl shadow-sm
              flex items-center justify-center
            ">
            {icon}
          </div>
        )}

        <p
          className="
            text-sm md:text-base font-semibold tracking-wide
            text-gray-700 dark:text-gray-300
          ">
          {label}
        </p>
      </div>

      {/* VALUE */}
      <p
        className="
          text-3xl md:text-4xl font-extrabold
          text-gray-900 dark:text-white
          leading-tight tracking-tight
        ">
        {value ?? "-"}
      </p>
    </motion.div>
  );
}
