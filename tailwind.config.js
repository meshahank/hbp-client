/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Lora', 'Crimson Text', 'Source Serif Pro', 'Georgia', 'serif'],
        'headline': ['Lora', 'Crimson Text', 'Georgia', 'serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'reading': ['Source Serif Pro', 'Crimson Text', 'Georgia', 'serif'],
      },
      colors: {
        editorial: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        accent: {
          50: '#fefdf8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        }
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: '#334155',
            lineHeight: '1.7',
            fontSize: '1.125rem',
            p: {
              marginTop: '1.5em',
              marginBottom: '1.5em',
            },
            h1: {
              fontFamily: 'Lora, Crimson Text, Georgia, serif',
              fontWeight: '700',
              letterSpacing: '-0.02em',
            },
            h2: {
              fontFamily: 'Lora, Crimson Text, Georgia, serif',
              fontWeight: '600',
              letterSpacing: '-0.01em',
            },
            h3: {
              fontFamily: 'Lora, Crimson Text, Georgia, serif',
              fontWeight: '600',
            },
            blockquote: {
              fontStyle: 'italic',
              borderLeftColor: '#cbd5e1',
              borderLeftWidth: '4px',
              paddingLeft: '1.5rem',
              fontSize: '1.25rem',
              lineHeight: '1.6',
            },
          },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
    },
  },
  plugins: [],
}
