module.exports = {
  plugins: {
    '@tailwindcss/postcss': {
      content: [
        "./app/**/*.{js,ts,jsx,tsx}",
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    },
  },
}
