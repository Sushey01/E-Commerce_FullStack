import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

// Theme context type
type Theme = "dark" | "light" | "system";

interface ThemeProviderContext {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// Create theme context
const ThemeProviderContext = createContext<ThemeProviderContext | undefined>(
  undefined
);

// Theme provider props
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export default function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// Hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
