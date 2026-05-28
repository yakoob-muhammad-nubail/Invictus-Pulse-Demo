import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const getStoredTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "dark";
  }

  try {
    const stored = window.localStorage.getItem("invictus-theme");
    return stored === "light" || stored === "dark" ? stored : "dark";
  } catch (error) {
    console.warn("Theme storage is unavailable. Falling back to dark mode.", error);
    return "dark";
  }
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme());

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem("invictus-theme", theme);
    } catch (error) {
      console.warn("Unable to persist theme preference.", error);
    }

    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggleTheme = () => setThemeState((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
