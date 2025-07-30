/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./src/**/*.{html,js,twig,scss}",
  ],
  theme: {
    extend: {
      // default breakpoints but with 40px removed
      screens: {
        // xs: '480px',
        // sm: '640px',
        // md: '768px',
        // lg: '1024px',
        // xl: '1280px',
        // "2xl": '1440px',

        // adding xs to the rest
        'xs': '475px',
        '2k': '2560px',
        '3k': '2880px',
        '4k': '3840px',
        // if you did not add this, you would have only "xs"
        ...defaultTheme.screens,

      },
    },
    fontSize: {
      base: '1rem',
      sm: '0.8rem',
      md: '1.4rem',
      lg: '1.5rem',
      xl: '1.6rem',
      '2xl': '1.8rem',
    },
    aspectRatio: {
      auto: 'auto',
      square: '1 / 1',
      video: '16 / 9',
      test: '13 / 5',
      team: '3 / 4',
      homebanner: '2 / 3',
    },
    colors: {
      "green":'#005D37',
      "blue": "#0076fe",
      "black": "#000",
      "white": "#fff",
      "yellow": "#F8ED21",
    },
    fontFamily: {
      "svn-signatie": ["SVNSignatie", "sans-serif"],
      "montserrat": ['Montserrat', 'sans-serif'],
    },
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      'extra-bold': '800',
      black: '900'
    },
    container: {
      // you can configure the container to be centered
      center: true,

      // or have default horizontal padding
      padding: {
        DEFAULT: '0',
        md: '2rem',
      },


    },
  },
  plugins: [
    function ({
      addComponents
    }) {
      addComponents({
        '.container': {
          maxWidth: '100%',
          '@screen lg': {
            maxWidth: 'calc(100% - 140px)'
          },
          '@screen xl': {
            maxWidth: '1280px',
          },
          '@screen 2xl': {
            maxWidth: '85vw',
          },
        }
      })
    }
  ],
}