module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ['./src/components/**/*.{js,ts,jsx,tsx}', './src/pages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'accent-1': '#333',
      },
    },
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'active'],
    margin: ['responsive', 'hover', 'focus'],
    padding: ['responsive', 'hover', 'focus'],
    backgroundOpacity: ['responsive', 'hover'],
    zIndex: ['responsive', 'hover'],
  },
  plugins: [],
}
