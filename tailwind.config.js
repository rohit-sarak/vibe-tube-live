/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Optional custom color definitions
      },
      spacing: {
        // Optional custom spacing values
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: {
      body: {
        fontFamily: 'sans',
        fontWeight: '400',
        lineHeight: '1.5',
        backgroundColor: '#111827', // Tailwind’s gray-900 (for dark mode)
        color: '#f9fafb', // Tailwind’s gray-50
      },
    },
  },
};
