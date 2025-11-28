import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  selectSettings,
  updateSettings,
  toggleTheme,
} from "../store/settingsSlice";

import SettingsScreen from "../components/screens/SettingsScreen";

export default function SettingsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Ambil settings dari Redux
  const settings = useSelector(selectSettings);

  return (
    <div>
      <SettingsScreen
        isDarkMode={settings.theme === "dark"}
        // Redux Actions
        onToggleTheme={() => dispatch(toggleTheme())}
        updateSettings={(data) => dispatch(updateSettings(data))}
        // Navigasi
        onBack={() => navigate(-1)}
        // Data settings
        settings={settings}
      />
    </div>
  );
}
