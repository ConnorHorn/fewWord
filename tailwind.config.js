module.exports = {
  daisyui: {
    themes: [
      "business"
    ],
    theme: {
      extend: {
        width: {
          76: "19rem", // This is equivalent to 76 pixels
        },
      },
    },
  },
  content: ['./public/index.html', './src/**/*.svelte'],
  plugins: [require('daisyui')],
};
