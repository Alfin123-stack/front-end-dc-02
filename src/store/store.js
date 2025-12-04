import { configureStore } from "@reduxjs/toolkit";
import quizReducer from "./quizSlice";
import settingsReducer from "./settingsSlice";

const store = configureStore({
  reducer: {
    quiz: quizReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // biar aman kalau ada non-serializable value
    }),
});

// ⬇️ RTK way of subscribing untuk menyimpan settings ke localStorage
store.subscribe(() => {
  try {
    const state = store.getState();
    localStorage.setItem("quizSettings", JSON.stringify(state.settings));
  } catch (err) {
    console.error("Failed to save settings:", err);
  }
});

export default store;
