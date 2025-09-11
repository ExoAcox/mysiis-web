/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */

const colors = require("./styles/theme/colors.json");
const fontSize = require("./styles/theme/fonts.json");
const boxShadow = require("./styles/theme/shadows.json");

const fontKeys = Object.keys(fontSize);
const fontSafeList = [...fontKeys.map((font) => `text-${font}`), ...fontKeys.map((font) => `md:text-${font}`)];

module.exports = {
    safelist: [...fontSafeList],
    content: ["./public/**/*.html", "./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./features/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        screens: {
            "2xl": { max: "1535px" },
            xl: { max: "1279px" },
            lg: { max: "1023px" },
            md: { max: "767px" },
            sm: { max: "579px" },
            xs: { max: "359px" },
        },
        extend: {
            colors,
            fontSize,
            boxShadow,
            fontFamily: {
                sans: ["'Nunito'", "sans-serif"],
                nunito: ["'Nunito'", "sans-serif"],
            },
            spacing: {
                4.5: "1.125rem",
                5.5: "1.375rem",
                9: "2.25rem",
                17: "4.25rem",
                18: "4.5rem",
            },
            maxWidth: {
                default: "1280px",
            },
        },
    },
    plugins: [require("tailwindcss-debug-screens"), require("@tailwindcss/line-clamp")],
};
