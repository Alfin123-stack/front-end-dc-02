import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ============================================================
// DEFAULT SETTINGS
// ============================================================
const defaultSettings = {
  theme: "light",
  fontFamily: "default",
  fontSize: "medium",
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

      console.log("Fetched preferences:", json.data);
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
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
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

      // apply theme change if included
      if (action.payload.theme) {
        applyThemeToHtml(action.payload.theme);
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
