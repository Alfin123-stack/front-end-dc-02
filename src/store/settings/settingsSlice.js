import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./settingsInitial";
import {
  applyThemeToHtml,
  applyFontSizeToHtml,
  saveToLocalStorage,
  mapBackendPreferences,
} from "./settingsUtils";
import { fetchUserPreferences } from "./settingsThunks";

const settingsSlice = createSlice({
  name: "settings",
  initialState,

  reducers: {
    updateSettings: (state, action) => {
      Object.assign(state, action.payload);
      saveToLocalStorage(state);

      if (action.payload.theme) applyThemeToHtml(action.payload.theme);
      if (action.payload.fontSize) applyFontSizeToHtml(action.payload.fontSize);
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

export const { updateSettings, toggleTheme } = settingsSlice.actions;

export default settingsSlice.reducer;
