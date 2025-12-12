import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  selectSettings,
  updateSettings,
  toggleTheme,
} from "../store/settings/settingsSlice";

import SettingsScreen from "../components/screens/SettingsScreen";

export default function SettingsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Ambil settings global Redux
  const settings = useSelector(selectSettings);

  // Handler untuk update semua setting
  const handleUpdateSettings = (newValues) => {
    dispatch(updateSettings(newValues));
  };

  return (
    <div className="p-0 m-0">
      <SettingsScreen
        // ==== Current State ====
        settings={settings}
        isDarkMode={settings.theme === "dark"}
        // ==== Actions ====
        onToggleTheme={() => dispatch(toggleTheme())}
        onUpdate={(data) => handleUpdateSettings(data)}
        // Optional: Untuk handler spesifik
        onFontSizeChange={(size) => handleUpdateSettings({ fontSize: size })}
        onFontFamilyChange={(family) =>
          handleUpdateSettings({ fontFamily: family })
        }
        onLayoutWidthChange={(width) =>
          handleUpdateSettings({ layoutWidth: width })
        }
        // Navigasi
        onBack={() => navigate(-1)}
      />
    </div>
  );
}
