// src/store/settings/settingsThunks.js

import { createAsyncThunk } from "@reduxjs/toolkit";

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
