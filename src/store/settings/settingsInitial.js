export const defaultSettings = {
  theme: "light",
  fontFamily: "default",
  fontSize: "medium",
  layoutWidth: "mediumWidth",
};

const saved = localStorage.getItem("quizSettings");

export const initialState = saved
  ? { ...defaultSettings, ...JSON.parse(saved), status: "idle", error: null }
  : { ...defaultSettings, status: "idle", error: null };
