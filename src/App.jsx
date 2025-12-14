import React from "react";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import AppRouter from "./router/AppRouter";
import store, { persistor } from "./store/store";
import { fetchUserPreferences } from "./store/settings/settingsThunks";

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
      <PersistGate loading={null} persistor={persistor}>
        <LoadUserPreferences />

        <AppRouter />
      </PersistGate>
    </Provider>
  );
}
