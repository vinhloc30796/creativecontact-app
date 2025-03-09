import type { Config } from "tailwindcss"
import plugin from "tailwindcss/plugin"

const config = {
  darkMode: [
    "class",
    '[data-theme="trungthu-archive-2024"]',
    // For some reason: Type 'string' is not assignable to type 'undefined'.ts(2322)
    // @ts-ignore
    '[data-theme="early-access-2024"]'
  ],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-plus-jakarta-sans)', 'Plus Jakarta Sans', 'Century Gothic', 'Arial', 'Helvetica', 'sans-serif'],
      },
      colors: {
        border: "hsla(var(--border), <alpha-value>)",
        input: "hsla(var(--input), <alpha-value>)",
        ring: "hsla(var(--ring), <alpha-value>)",
        background: "hsla(var(--background), <alpha-value>)",
        foreground: "hsla(var(--foreground), <alpha-value>)",
        primary: {
          DEFAULT: "hsla(var(--primary), <alpha-value>)",
          foreground: "hsla(var(--primary-foreground), <alpha-value>)",
          50: "hsla(var(--primary-50), <alpha-value>)",
          100: "hsla(var(--primary-100), <alpha-value>)",
          200: "hsla(var(--primary-200), <alpha-value>)",
          300: "hsla(var(--primary-300), <alpha-value>)",
          400: "hsla(var(--primary-400), <alpha-value>)",
          500: "hsla(var(--primary-500), <alpha-value>)",
          600: "hsla(var(--primary-600), <alpha-value>)",
          700: "hsla(var(--primary-700), <alpha-value>)",
          800: "hsla(var(--primary-800), <alpha-value>)",
          900: "hsla(var(--primary-900), <alpha-value>)",
          1000: "hsla(var(--primary-1000), <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsla(var(--secondary), <alpha-value>)",
          foreground: "hsla(var(--secondary-foreground), <alpha-value>)",
          50: "hsla(var(--secondary-50), <alpha-value>)",
          100: "hsla(var(--secondary-100), <alpha-value>)",
          200: "hsla(var(--secondary-200), <alpha-value>)",
          300: "hsla(var(--secondary-300), <alpha-value>)",
          400: "hsla(var(--secondary-400), <alpha-value>)",
          500: "hsla(var(--secondary-500), <alpha-value>)",
          600: "hsla(var(--secondary-600), <alpha-value>)",
          700: "hsla(var(--secondary-700), <alpha-value>)",
          800: "hsla(var(--secondary-800), <alpha-value>)",
          900: "hsla(var(--secondary-900), <alpha-value>)",
          1000: "hsla(var(--secondary-1000), <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsla(var(--destructive), <alpha-value>)",
          foreground: "hsla(var(--destructive-foreground), <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsla(var(--muted), <alpha-value>)",
          foreground: "hsla(var(--muted-foreground), <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsla(var(--accent), <alpha-value>)",
          foreground: "hsla(var(--accent-foreground), <alpha-value>)",
          50: "hsla(var(--accent-50), <alpha-value>)",
          100: "hsla(var(--accent-100), <alpha-value>)",
          200: "hsla(var(--accent-200), <alpha-value>)",
          300: "hsla(var(--accent-300), <alpha-value>)",
          400: "hsla(var(--accent-400), <alpha-value>)",
          500: "hsla(var(--accent-500), <alpha-value>)",
          600: "hsla(var(--accent-600), <alpha-value>)",
          700: "hsla(var(--accent-700), <alpha-value>)",
          800: "hsla(var(--accent-800), <alpha-value>)",
          900: "hsla(var(--accent-900), <alpha-value>)",
          1000: "hsla(var(--accent-1000), <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsla(var(--popover), <alpha-value>)",
          foreground: "hsla(var(--popover-foreground), <alpha-value>)",
        },
        card: {
          DEFAULT: "hsla(var(--card), <alpha-value>)",
          foreground: "hsla(var(--card-foreground), <alpha-value>)",
        },
        'cc-rose': {
          DEFAULT: "hsla(336.06, 100.0%, 57.25%, 1)", // #ff257c
          50: "hsla(334.29, 100.0%, 97.25%, 1)", // #fff1f7
          100: "hsla(336.67, 100.0%, 92.94%, 1)", // #ffdbe9
          200: "hsla(336.16, 100.0%, 85.69%, 1)", // #ffb6d3
          300: "hsla(335.78, 100.0%, 78.63%, 1)", // #ff92be
          400: "hsla(336.0, 100.0%, 71.57%, 1)", // #ff6ea8
          500: "hsla(335.93, 100.0%, 64.31%, 1)", // #ff4992
          600: "hsla(336.14, 100.0%, 49.8%, 1)", // #fe0065
          700: "hsla(336.11, 100.0%, 42.35%, 1)", // #d80056
          800: "hsla(336.07, 100.0%, 34.9%, 1)", // #b20047
          900: "hsla(336.0, 100.0%, 27.45%, 1)", // #8c0038
          1000: "hsla(335.88, 100.0%, 20.0%, 1)", // #660029
        },
        'cc-kelly': {
          DEFAULT: "hsla(103.9, 56.16, 42.94)", // #51AB30
          50: "hsla(102.86, 16.28, 91.57)", // #e8ede6
          100: "hsla(106.67, 28.12, 87.45)", // #dae8d6
          200: "hsla(107.14, 31.82, 82.75)", // #cbe1c5
          300: "hsla(106.83, 35.04, 77.06)", // #b9d9b0
          400: "hsla(106.67, 35.06, 69.8)", // #a3cd97
          500: "hsla(106.67, 35.29, 60.0)", // #85bd75
          600: "hsla(105.44, 44.21, 45.69)", // #5aa841
          700: "hsla(103.9, 56.16, 42.94)", // #51ab30
          800: "hsla(104.42, 50.0, 40.78)", // #4f9c34
          900: "hsla(103.64, 100.0, 21.57)", // #1e6e00
          1000: "hsla(105.88, 39.53, 16.86)", // #223c1a
        },
        'cc-lime': {
          DEFAULT: "hsla(87.11, 85.57, 61.96)", // #A6F14B
          50: "hsla(90.0, 18.18, 91.37)", // #e9ede5
          100: "hsla(92.73, 44.0, 85.29)", // #d8eac9
          200: "hsla(91.7, 49.53, 79.02)", // #c8e4af
          300: "hsla(91.82, 47.14, 72.55)", // #b7da98
          400: "hsla(91.2, 42.37, 65.29)", // #a5cc81
          500: "hsla(90.0, 37.84, 56.47)", // #90ba66
          600: "hsla(88.33, 48.21, 43.92)", // #73a63a
          700: "hsla(87.24, 70.37, 57.65)", // #9adf47
          800: "hsla(84.75, 71.08, 48.82)", // #8cd524
          900: "hsla(85.33, 70.31, 25.1)", // #476d13
          1000: "hsla(89.19, 38.95, 18.63)", // #30421d
        },
        'cc-cornell-red': {
          DEFAULT: "hsla(356.59, 92.63%, 37.25%, 1)", // #b70711
          50: "hsla(351.0, 100.0%, 96.08%, 1)", // #ffebee
          100: "hsla(346.67, 100.0%, 89.41%, 1)", // #ffc9d5
          200: "hsla(343.15, 100.0%, 82.55%, 1)", // #ffa6bf
          300: "hsla(341.13, 100.0%, 75.69%, 1)", // #ff83aa
          400: "hsla(340.0, 100.0%, 68.82%, 1)", // #ff6095
          500: "hsla(339.28, 100.0%, 61.96%, 1)", // #ff3d80
          600: "hsla(338.12, 100.0%, 50.0%, 1)", // #ff005d
          700: "hsla(336.11, 100.0%, 42.35%, 1)", // #d80056
          800: "hsla(336.07, 100.0%, 34.9%, 1)", // #b20047
          900: "hsla(336.0, 100.0%, 27.45%, 1)", // #8c0038
          1000: "hsla(335.88, 100.0%, 20.0%, 1)", // #660029
        },
        'cc-fuchsia-neutral': {
          DEFAULT: "hsla(325.0, 52.17%, 90.98%, 1)", // #f4dcea
          100: "hsla(325.33, 52.94%, 83.33%, 1)", // #ebbed8
          200: "hsla(325.85, 52.0%, 75.49%, 1)", // #e1a0c5
          300: "hsla(325.81, 52.44%, 67.84%, 1)", // #d882b3
          400: "hsla(326.6, 51.96%, 60.0%, 1)", // #ce649f
          500: "hsla(326.88, 51.44%, 52.35%, 1)", // #c4478c
          600: "hsla(327.97, 51.75%, 44.71%, 1)", // #ad3776
          700: "hsla(329.07, 51.32%, 37.06%, 1)", // #8f2e60
          800: "hsla(331.17, 51.68%, 29.22%, 1)", // #712449
          900: "hsla(334.74, 51.35%, 21.76%, 1)", // #541b33
          1000: "hsla(340.54, 50.68%, 14.31%, 1)", // #37121e
          base_white: "hsla(325.0, 52.17%, 90.98%, 1)", // #f4dcea
          base_black: "hsla(0.0, 51.35%, 7.25%, 1)", // #1C0909
        },

      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "marquee": {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "marquee": "marquee 25s linear infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@designbycode/tailwindcss-text-shadow"),
  ],
} satisfies Config

export default config