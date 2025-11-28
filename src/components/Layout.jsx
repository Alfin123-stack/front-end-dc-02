// src/layout/Layout.jsx
import React from "react";
import { useSelector } from "react-redux";
import { selectSettings } from "../store/settingsSlice";

export default function Layout({ children }) {
  const settings = useSelector(selectSettings);

  return (
    <div
      className={`
        screen-${settings.layoutWidth}
        font-${settings.fontFamily}
        font-${settings.fontSize}
      `}>
      {children}
    </div>
  );
}
