import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ============================================================
// DEFAULT SETTINGS
// ============================================================
const defaultSettings = {
  theme: "light",

  // font default
  fontFamily: "default",

  fontSize: "medium",

  // orientation sudah dihapus
  layoutWidth: "mediumWidth",
};

// load saved settings
const saved = localStorage.getItem("quizSettings");
const initialState = saved
  ? { ...defaultSettings, ...JSON.parse(saved), status: "idle", error: null }
  : { ...defaultSettings, status: "idle", error: null };

// ============================================================
// BACKEND → REDUX MAPPER
// ============================================================
const mapBackendPreferences = (prefs = {}) => {
  const mapped = {};

  // layoutWidth
  if (prefs.layoutWidth) {
    mapped.layoutWidth =
      prefs.layoutWidth === "fullWidth" || prefs.layoutWidth === "mediumWidth"
        ? prefs.layoutWidth
        : "mediumWidth";
  }

  // fontStyle → fontFamily
  if (prefs.fontStyle) {
    mapped.fontFamily = prefs.fontStyle;
  }

  // theme
  if (prefs.theme) mapped.theme = prefs.theme;

  // fontSize
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
// SLICE
// ============================================================
const settingsSlice = createSlice({
  name: "settings",
  initialState,

  reducers: {
    updateSettings: (state, action) => {
      Object.assign(state, action.payload);
    },

    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
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
