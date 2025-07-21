import {heroui} from '@heroui/theme';
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}",
    "./node_modules/@heroui/theme/dist/components/(calendar|button|ripple|spinner).js"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [heroui()],
};
