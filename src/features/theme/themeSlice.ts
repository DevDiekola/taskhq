import { createSlice } from "@reduxjs/toolkit";
import { Theme, ThemeState } from "./themeModel";
import { THEME_LOCAL_STORAGE_KEY, THEME_SLICE_NAME } from "@/constants/theme";

const initialState: ThemeState = {
  theme: (localStorage.getItem(THEME_LOCAL_STORAGE_KEY) as Theme) || "dark",
};

document.documentElement.classList.toggle(
  "dark",
  initialState.theme === "dark"
);

const themeSlice = createSlice({
  name: THEME_SLICE_NAME,
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", state.theme === "dark");
      localStorage.setItem("theme", state.theme);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
