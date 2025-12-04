import React from "react";
import { motion } from "framer-motion";
import {
  FaFont,
  FaPalette,
  FaHome,
  FaMoon,
  FaSun,
  FaExpand,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function SettingsScreen({
  settings,
  onToggleTheme,
  onUpdate,
  onBack,
  onFontSizeChange,
  onFontFamilyChange,
  onLayoutWidthChange,
}) {
  const navigate = useNavigate();

  /* ================================
      OPTIONS
  =================================*/
  const fontFamilies = [
    { label: "Default (Arial)", value: "default" },
    { label: "Serif (Georgia)", value: "serif" },
    { label: "Dyslexic (OpenDyslexic)", value: "open-dyslexic" },
  ];

  const fontSizes = [
    { label: "Kecil", value: "small" },
    { label: "Sedang", value: "medium" },
    { label: "Besar", value: "large" },
  ];

  const widthOptions = [
    { label: "Medium Width", value: "mediumWidth" },
    { label: "Full Width", value: "fullWidth" },
  ];

  /* ================================
      RESET DEFAULT
  =================================*/
  const resetDefault = () => {
    onUpdate({
      theme: "light",
      fontFamily: "default",
      fontSize: "medium",
      layoutWidth: "mediumWidth",
    });
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 relative transition-colors duration-500 ${
        settings.theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900"
      }`}>
      {/* CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl">
        <div className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-xl">
          <h1 className="flex items-center justify-center gap-3 text-3xl font-bold mb-8">
            <FaPalette className="text-blue-500" />
            Pengaturan Tampilan
          </h1>

          <div className="space-y-6">
            {/* FONT FAMILY */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <FaFont className="text-blue-500" />
                <span className="font-medium">Jenis Font</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {fontFamilies.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => onFontFamilyChange(item.value)}
                    className={`p-3 rounded-lg border-2 transition ${
                      settings.fontFamily === item.value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                    }`}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* FONT SIZE */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <FaFont className="text-blue-500" />
                <span className="font-medium">Ukuran Font</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {fontSizes.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => onFontSizeChange(item.value)}
                    className={`p-3 rounded-lg border-2 transition ${
                      settings.fontSize === item.value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                    }`}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* LAYOUT WIDTH */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <FaExpand className="text-blue-500" />
                <span className="font-medium">Lebar Tampilan</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {widthOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onLayoutWidthChange(option.value)}
                    className={`p-3 rounded-lg border-2 transition ${
                      settings.layoutWidth === option.value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                    }`}>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* RESET */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-xl">
              <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-3">
                Reset Pengaturan
              </h3>
              <button
                onClick={resetDefault}
                className="w-full py-2 bg-red-500 hover:bg-red-600 transition text-white rounded-lg">
                Reset ke Default
              </button>
            </div>

            {/* PREVIEW */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-xl">
              <h3 className="font-medium mb-2 text-blue-700 dark:text-blue-300">
                Pratinjau
              </h3>
              <p>Font: {settings.fontFamily}</p>
              <p>Ukuran: {settings.fontSize}</p>
              <p>Lebar: {settings.layoutWidth}</p>
              <p>Theme: {settings.theme}</p>
            </div>
          </div>

          {/* BACK BUTTON */}
          <button
            onClick={onBack}
            className="mt-6 w-full py-2 rounded-lg bg-gray-700 hover:bg-gray-800 text-white transition">
            Kembali
          </button>
        </div>
      </motion.div>
    </div>
  );
}
