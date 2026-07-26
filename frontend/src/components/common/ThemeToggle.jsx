import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      className={`p-2.5 rounded-2xl bg-card border-2 border-borderTheme text-textPrimary hover:border-primary shadow-soft flex items-center gap-2 font-heading text-xs transition-colors ${className}`}
      title={`Switch to ${theme === 'light' ? 'Dark (Obsidian)' : 'Light (Quartz)'} Mode`}
    >
      {theme === 'light' ? (
        <>
          <Moon className="w-4 h-4 text-secondary" />
          <span className="hidden sm:inline font-bold">Obsidian</span>
        </>
      ) : (
        <>
          <Sun className="w-4 h-4 text-warning" />
          <span className="hidden sm:inline font-bold">Quartz</span>
        </>
      )}
    </motion.button>
  );
};

export default ThemeToggle;
