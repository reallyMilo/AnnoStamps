import type { Config } from 'tailwindcss'

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      backgroundImage: {
        'main-background': "url('/anno2.jpg')",
      },
    },
    fontFamily: {
      sans: ['Poppins', 'system-ui'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
} satisfies Config
