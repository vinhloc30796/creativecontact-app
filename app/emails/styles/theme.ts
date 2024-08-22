// import from tailwind.config.ts
import config from '@/tailwind.config';
const colors = {
  transparent: 'transparent',
  current: 'currentColor',
  black: '#000000',
  white: '#ffffff',
  primary: 'hsl(11.93, 86.1%, 63.33%)',
  'primary-foreground': 'hsl(0, 0%, 100%)',
  secondary: 'hsl(12.5, 85.71%, 94.51%)',
  'secondary-foreground': 'hsl(0, 0%, 0%)',
  muted: 'hsl(11.25, 88.89%, 96.47%)',
  'muted-foreground': 'hsl(0, 0%, 40%)',
  accent: 'hsl(11.25, 88.89%, 96.47%)',
  'accent-foreground': 'hsl(11.93, 86.1%, 63.33%)',
  destructive: 'hsl(0, 84.2%, 60.2%)',
  'destructive-foreground': 'hsl(210, 40%, 98%)',
  border: 'hsl(0, 0%, 90.2%)',
  background: 'hsl(0, 0%, 100%)',
  foreground: 'hsl(11.25, 50%, 6.27%)',
};

export const theme = {
  content: [
    './emails/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    colors: colors,
    extend: {
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'],
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
      },
      borderRadius: {
        'none': '0',
        'sm': '2px',
        'DEFAULT': '4px',
        'md': '6px',
        'lg': '8px',
        'full': '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
    // Disable features not widely supported in email clients
    container: false,
    animation: false,
    // You may need to disable other features as well
  },
};