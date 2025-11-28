import React, { createContext, useEffect, useState } from "react";

export const UnlockContext = createContext();

export default function UnlockProvider({ children }) {
  const [unlockedLevels, setUnlockedLevels] = useState([1]);

  // Load from localStorage (once)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("unlockedLevels");
      if (raw) setUnlockedLevels(JSON.parse(raw));
    } catch (e) {
      console.warn("UnlockProvider: failed to read unlockedLevels", e);
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("unlockedLevels", JSON.stringify(unlockedLevels));
    } catch (e) {
      console.warn("UnlockProvider: failed to write unlockedLevels", e);
    }
  }, [unlockedLevels]);

  const unlockLevel = (level) => {
    setUnlockedLevels((prev) =>
      prev.includes(level) ? prev : [...prev, level]
    );
  };

  const resetUnlocks = () => setUnlockedLevels([1]);

  return (
    <UnlockContext.Provider
      value={{ unlockedLevels, unlockLevel, resetUnlocks }}>
      {children}
    </UnlockContext.Provider>
  );
}
