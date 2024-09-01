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
          DEFAULT: '#ff257c',
          50: '#fff1f7',
          100: '#ffdbe9',
          200: '#ffb6d3',
          300: '#ff92be',
          400: '#ff6ea8',
          500: '#ff4992',
          600: '#fe0065',
          700: '#d80056',
          800: '#b20047',
          900: '#8c0038',
          1000: '#660029',
        },
        'cc-cornell-red': {
          DEFAULT: '#b70711',
          50: '#ffebee',
          100: '#ffc9d5',
          200: '#ffa6bf',
          300: '#ff83aa',
          400: '#ff6095',
          500: '#ff3d80',
          600: '#ff005d',
          700: '#d80056',
          800: '#b20047',
          900: '#8c0038',
          1000: '#660029',
        },
        'cc-fuchsia-neutral': {
          DEFAULT: '#f4dcea', // base-white
          100: '#ebbed8',
          200: '#e1a0c5',
          300: '#d882b3',
          400: '#ce649f',
          500: '#c4478c',
          600: '#ad3776',
          700: '#8f2e60',
          800: '#712449',
          900: '#541b33',
          1000: '#37121e',
          base_white: '#f4dcea',
          base_black: '#1C0909',
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