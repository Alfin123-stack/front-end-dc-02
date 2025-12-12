// src/store/settings/settingsUtils.js

// ---------------- MAPPER ----------------
export const mapBackendPreferences = (prefs = {}) => {
  const mapped = {};

  if (prefs.layoutWidth) {
    mapped.layoutWidth =
      prefs.layoutWidth === "fullWidth" || prefs.layoutWidth === "mediumWidth"
        ? prefs.layoutWidth
        : "mediumWidth";
  }

  if (prefs.fontStyle) {
    mapped.fontFamily = prefs.fontStyle;
  }

  if (prefs.theme) mapped.theme = prefs.theme;
  if (prefs.fontSize) mapped.fontSize = prefs.fontSize;

  return mapped;
};

// ---------------- APPLY THEME ----------------
export const applyThemeToHtml = (theme) => {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
};

// ---------------- APPLY FONT SIZE ----------------
export const applyFontSizeToHtml = (fontSize) => {
  const root = document.documentElement;

  root.classList.remove("font-small", "font-medium", "font-large");

  if (fontSize === "small") root.classList.add("font-small");
  else if (fontSize === "large") root.classList.add("font-large");
  else root.classList.add("font-medium");
};

// ---------------- SAVE LOCAL STORAGE ----------------
export const saveToLocalStorage = (state) => {
  const cloned = { ...state };
  delete cloned.status;
  delete cloned.error;
  localStorage.setItem("quizSettings", JSON.stringify(cloned));
};
