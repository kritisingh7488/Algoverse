/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-app)",
        surface: "var(--bg-surface)",
        card: "var(--bg-card)",
        cardAccent: "var(--bg-card-accent)",
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          hover: "var(--color-secondary-hover)",
        },
        accent: "var(--color-accent)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-error)",
        error: "var(--color-error)",
        info: "var(--color-info)",
        textPrimary: "var(--color-text-primary)",
        textSecondary: "var(--color-text-secondary)",
        borderTheme: "var(--color-border)",
      },
      fontFamily: {
        fredoka: ["Fredoka", "sans-serif"],
        heading: ["Fredoka", "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
        body: ["Nunito", "sans-serif"],
        poppins: ["Fredoka", "sans-serif"],
        inter: ["Nunito", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        'button': '18px',
        'input': '18px',
        'card': '28px',
        'dialog': '30px',
        '3xl': '28px',
        '2xl': '18px',
      },
      boxShadow: {
        'soft': 'var(--shadow-soft)',
        'medium': 'var(--shadow-medium)',
        'large': 'var(--shadow-large)',
      }
    },
  },
  plugins: [],
}
