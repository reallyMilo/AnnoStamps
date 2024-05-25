import type { Config } from 'tailwindcss'

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      backgroundImage: {
        'main-background': "url('/anno2.jpg')",
      },
      colors: {
        default: '#F0F3F4',
        midnight: '#222939',
        primary: '#6DD3C0',
        secondary: '#F6AE2D',
        accent: '#B11E47',
      },
    },
    fontFamily: {
      sans: ['Poppins', 'system-ui'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
  ],
} satisfies Config
