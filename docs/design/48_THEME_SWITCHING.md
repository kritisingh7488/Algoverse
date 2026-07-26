# 48_THEME_SWITCHING.md — Theme Switching Implementation

## 1. Overview & Architecture

AlgoVerse provides an instant, flicker-free theme engine supporting **Quartz Light Mode** (default) and **Obsidian Dark Mode**. The theme system utilizes CSS custom properties (variables) coupled with Tailwind's `dark` class strategy.

---

## 2. Theme Context & React Hook (`ThemeContext.jsx`)

Theme state is managed globally and persisted in `localStorage`.

```jsx
// ThemeContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('algoverse-theme') || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('algoverse-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
```

---

## 3. CSS Variable Mapping & Tailwind Config

```css
/* index.css */
@layer base {
  :root {
    --bg-app: #F9FAFB;
    --bg-surface: #FFFFFF;
    --border-color: #E5E7EB;
    --text-main: #111827;
    --text-muted: #6B7280;
    --primary: #A855F7;
    --accent: #EC4899;
  }

  .dark {
    --bg-app: #090D16;
    --bg-surface: #111827;
    --border-color: #1F2937;
    --text-main: #F9FAFB;
    --text-muted: #9CA3AF;
    --primary: #C084FC;
    --accent: #F472B6;
  }
}
```

---

## 4. Theme Switcher UI Component

The theme toggle button features a smooth sun/moon icon transition:

```jsx
// ThemeToggle.jsx
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-2xl border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all"
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
    >
      {theme === 'light' ? <Moon className="w-4 h-4 text-purple-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
    </button>
  );
};

export default ThemeToggle;
```
