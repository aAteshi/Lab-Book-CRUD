import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      // Background colors
      background: isDarkMode ? "#1a1a2e" : "#fef7f7",
      surface: isDarkMode ? "#2d2d44" : "#ffffff",
      cardBackground: isDarkMode ? "#2d2d44" : "#ffffff",

      // Primary colors - Pink theme
      primary: isDarkMode ? "#ff6b9d" : "#ff6b9d",
      primaryLight: isDarkMode ? "#ff9ec7" : "#ffb3d1",
      secondary: isDarkMode ? "#c44fab" : "#e91e63",
      accent: isDarkMode ? "#ff4757" : "#ff6b9d",

      // Header colors
      headerBackground: isDarkMode ? "#ff6b9d" : "#ff9ec7",

      // Text colors
      text: isDarkMode ? "#ffffff" : "#2d3748",
      textSecondary: isDarkMode ? "#cbd5e0" : "#718096",
      textMuted: isDarkMode ? "#a0aec0" : "#9ca3af",

      // Card colors
      cardBorder: isDarkMode ? "#4a5568" : "#e2e8f0",
      cardShadow: isDarkMode ? "#ff6b9d" : "#ff9ec7",

      // Skill badge colors
      skillBadge: isDarkMode ? "#ff6b9d" : "#ff9ec7",
      skillText: "#ffffff",

      // Icon colors
      iconBackground: isDarkMode ? "#ff6b9d" : "#ff9ec7",

      // Status colors
      statusOnline: "#48bb78",

      // Floating elements
      floatingElement1: isDarkMode ? "#ff6b9d" : "#ffb3d1",
      floatingElement2: isDarkMode ? "#c44fab" : "#ff9ec7",
      floatingElement3: isDarkMode ? "#ff4757" : "#ffc0cb",

      // Border colors
      border: isDarkMode ? "#4a5568" : "#e2e8f0",
    },
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
