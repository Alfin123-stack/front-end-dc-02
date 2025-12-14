import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { selectSettings } from "../store/settings/settingsSlice";

export default function Layout({ children }) {
  const settings = useSelector(selectSettings);

  return (
    <div
      className={`
        min-h-screen 
        transition-colors duration-300

        /* LIGHT MODE */
        bg-white text-gray-900
        
        /* DARK MODE */
        dark:bg-[#1e2939] 
        dark:text-[#d1d5dc]

        screen-${settings.layoutWidth}
        font-${settings.fontFamily}
        font-${settings.fontSize}
      `}>
      <main className="relative z-10 p-4 sm:p-6">{children}</main>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
