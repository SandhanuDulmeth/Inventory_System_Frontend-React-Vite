/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", 
    "./public/**/*.html", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
module.exports = {
  corePlugins: {
    preflight: false,
  },
  
}