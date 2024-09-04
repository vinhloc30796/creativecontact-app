import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class", '[data-theme="trungthu-archive-2024"]'],
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        'cc-rose': {
          DEFAULT: "hsl(336.06, 100.0, 57.25)", // #ff257c
          50: "hsl(334.29, 100.0, 97.25)", // #fff1f7
          100: "hsl(336.67, 100.0, 92.94)", // #ffdbe9
          200: "hsl(336.16, 100.0, 85.69)", // #ffb6d3
          300: "hsl(335.78, 100.0, 78.63)", // #ff92be
          400: "hsl(336.0, 100.0, 71.57)", // #ff6ea8
          500: "hsl(335.93, 100.0, 64.31)", // #ff4992
          600: "hsl(336.14, 100.0, 49.8)", // #fe0065
          700: "hsl(336.11, 100.0, 42.35)", // #d80056
          800: "hsl(336.07, 100.0, 34.9)", // #b20047
          900: "hsl(336.0, 100.0, 27.45)", // #8c0038
          1000: "hsl(335.88, 100.0, 20.0)", // #660029
        },
        'cc-cornell-red': {
          DEFAULT: "hsl(356.59, 92.63, 37.25)", // #b70711
          50: "hsl(351.0, 100.0, 96.08)", // #ffebee
          100: "hsl(346.67, 100.0, 89.41)", // #ffc9d5
          200: "hsl(343.15, 100.0, 82.55)", // #ffa6bf
          300: "hsl(341.13, 100.0, 75.69)", // #ff83aa
          400: "hsl(340.0, 100.0, 68.82)", // #ff6095
          500: "hsl(339.28, 100.0, 61.96)", // #ff3d80
          600: "hsl(338.12, 100.0, 50.0)", // #ff005d
          700: "hsl(336.11, 100.0, 42.35)", // #d80056
          800: "hsl(336.07, 100.0, 34.9)", // #b20047
          900: "hsl(336.0, 100.0, 27.45)", // #8c0038
          1000: "hsl(335.88, 100.0, 20.0)", // #660029
        },
        'cc-fuchsia-neutral': {
          DEFAULT: "hsl(325.0, 52.17, 90.98)", // #f4dcea
          100: "hsl(325.33, 52.94, 83.33)", // #ebbed8
          200: "hsl(325.85, 52.0, 75.49)", // #e1a0c5
          300: "hsl(325.81, 52.44, 67.84)", // #d882b3
          400: "hsl(326.6, 51.96, 60.0)", // #ce649f
          500: "hsl(326.88, 51.44, 52.35)", // #c4478c
          600: "hsl(327.97, 51.75, 44.71)", // #ad3776
          700: "hsl(329.07, 51.32, 37.06)", // #8f2e60
          800: "hsl(331.17, 51.68, 29.22)", // #712449
          900: "hsl(334.74, 51.35, 21.76)", // #541b33
          1000: "hsl(340.54, 50.68, 14.31)", // #37121e
          base_white: "hsl(325.0, 52.17, 90.98)", // #f4dcea
          base_black: "hsl(0.0, 51.35, 7.25)", // #1C0909
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config