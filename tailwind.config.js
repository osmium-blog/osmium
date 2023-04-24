import { config } from './lib/server/config'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  content: [
    './components/**/*.{js,jsx,tsx}',
    './layouts/**/*.{js,jsx,tsx}',
    './lib/**/*.{js,jsx,tsx}',
    './pages/**/*.{js,jsx,tsx}',
    './app/**/*.{js,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        day: {
          DEFAULT: config.lightBackground || '#ffffff',
        },
        night: {
          DEFAULT: config.darkBackground || '#191919',
        },
      },
      borderRadius: {
        DEFAULT: '3px',
      },
    },
  },
}
