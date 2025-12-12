import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import quizReducer from "./quiz/quizSlice";
import settingsReducer from "./settings/settingsSlice";

const quizPersistConfig = {
  key: "quiz",
  storage,
};

const settingsPersistConfig = {
  key: "settings",
  storage,
};

const store = configureStore({
  reducer: {
    quiz: persistReducer(quizPersistConfig, quizReducer),
    settings: persistReducer(settingsPersistConfig, settingsReducer),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export default store;
