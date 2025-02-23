import { useDispatch } from "react-redux";
import { useAppSelector } from "@/hooks/useAppSelector";
import { toggleTheme } from "@/features/theme/themeSlice";
import { MoonIcon, SunIcon } from "lucide-react";
import IconButton from "@/components/icon-button/IconButton";

export function ThemeToggle() {
  const dispatch = useDispatch();
  const theme = useAppSelector((state) => state.themeState.theme);

  return (
    <IconButton
      className="p-2 hover:bg-muted"
      onClick={() => dispatch(toggleTheme())}
    >
      {theme === "dark" ? (
        <SunIcon className="text-primary size-5" />
      ) : (
        <MoonIcon className="text-primary size-5" />
      )}
    </IconButton>
  );
}
