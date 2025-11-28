// src/App.jsx
import { Provider, useDispatch } from "react-redux";
import UnlockProvider from "./contexts/UnlockProvider";
import AppRouter from "./router/AppRouter";
import store from "./store/store";
import { Toaster } from "sonner";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetchUserPreferences } from "./store/settingsSlice";

function SettingsDOMEffect() {
  // hanya theme yang perlu apply langsung
  const theme = store.getState().settings.theme;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return null;
}

function LoadUserPreferences() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userId = params.get("user");

    if (userId) {
      dispatch(fetchUserPreferences(userId));
    }
  }, [dispatch, location.search]);

  return null;
}

export default function App() {
  return (
    <Provider store={store}>
      <LoadUserPreferences />
      <SettingsDOMEffect />

      <Toaster position="top-right" richColors />
      <UnlockProvider>
        <AppRouter />
      </UnlockProvider>
    </Provider>
  );
}
