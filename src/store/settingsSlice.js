import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ============================================================
// DEFAULT SETTINGS
// ============================================================
const defaultSettings = {
  theme: "light",
  fontFamily: "default",
  fontSize: "medium", // small | medium | large
  layoutWidth: "mediumWidth",
};

// Load saved settings
const saved = localStorage.getItem("quizSettings");
const initialState = saved
  ? { ...defaultSettings, ...JSON.parse(saved), status: "idle", error: null }
  : { ...defaultSettings, status: "idle", error: null };

// ============================================================
// BACKEND → REDUX MAPPER
// ============================================================
const mapBackendPreferences = (prefs = {}) => {
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

// ============================================================
// THUNK: Fetch user preferences
// ============================================================
export const fetchUserPreferences = createAsyncThunk(
  "settings/fetchUserPreferences",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `https://backend-dc-02.vercel.app/api/users/${userId}/preferences`
      );

      const json = await res.json();
      if (!json?.data?.preference) {
        return rejectWithValue("Invalid preference data");
      }

      return json.data.preference;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ============================================================
// Helper: apply theme to <html>
// ============================================================
const applyThemeToHtml = (theme) => {
  const root = document.documentElement;

  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
};

// ============================================================
// Helper: apply font size to <html>
// ============================================================
// CSS kamu memakai:
//  .font-small  { --font-scale: 0.90 }
//  .font-medium { --font-scale: 1 }
//  .font-large  { --font-scale: 1.15 }
const applyFontSizeToHtml = (fontSize) => {
  const root = document.documentElement;

  // Hapus class sebelumnya
  root.classList.remove("font-small", "font-medium", "font-large");

  if (fontSize === "small") root.classList.add("font-small");
  else if (fontSize === "large") root.classList.add("font-large");
  else root.classList.add("font-medium"); // default
};

// ============================================================
// Helper: Save to localStorage
// ============================================================
const saveToLocalStorage = (state) => {
  const cloned = { ...state };
  delete cloned.status;
  delete cloned.error;
  localStorage.setItem("quizSettings", JSON.stringify(cloned));
};

// ============================================================
// SLICE
// ============================================================
const settingsSlice = createSlice({
  name: "settings",
  initialState,

  reducers: {
    updateSettings: (state, action) => {
      Object.assign(state, action.payload);
      saveToLocalStorage(state);

      // apply theme
      if (action.payload.theme) {
        applyThemeToHtml(action.payload.theme);
      }

      // apply font size
      if (action.payload.fontSize) {
        applyFontSizeToHtml(action.payload.fontSize);
      }
    },

    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      applyThemeToHtml(state.theme);
      saveToLocalStorage(state);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPreferences.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserPreferences.fulfilled, (state, action) => {
        state.status = "succeeded";

        const mapped = mapBackendPreferences(action.payload);
        Object.assign(state, mapped);

        applyThemeToHtml(mapped.theme || state.theme);
        applyFontSizeToHtml(mapped.fontSize || state.fontSize);

        saveToLocalStorage(state);
      })
      .addCase(fetchUserPreferences.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load preferences";
      });
  },
});

// EXPORTS
export const { updateSettings, toggleTheme } = settingsSlice.actions;
export const selectSettings = (state) => state.settings;

export default settingsSlice.reducer;
