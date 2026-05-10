/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0A2540",
          light: "#1a3a5c",
          dark: "#061829",
        },
        accent: {
          DEFAULT: "#0066FF",
          light: "#3385ff",
          dark: "#0052cc",
        },
        warning: {
          DEFAULT: "#FF6B35",
          light: "#ff8f66",
          dark: "#cc5629",
        },
        success: "#10B981",
        error: "#EF4444",
        warningYellow: "#F59E0B",
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#374151",
          700: "#1F2937",
          800: "#111827",
          900: "#111827",
        },
      },
      fontFamily: {
        sans: ["Noto Sans SC", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        card: "0 4px 6px rgba(0, 0, 0, 0.07)",
        hover: "0 10px 15px rgba(0, 0, 0, 0.1)",
        modal: "0 25px 50px rgba(0, 0, 0, 0.25)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "progress": "progress 1.5s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        progress: {
          "0%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      transitionTimingFunction: {
        "expert": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        200: "200ms",
        300: "300ms",
        500: "500ms",
      },
    },
  },
  plugins: [],
};
