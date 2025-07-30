/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';
import animate from 'tailwindcss-animate';

const customTheme = {
    extend: {
        colors: {
            success: {
                100: "#49de50",
                200: "#42c748",
            },
            destructive: {
                100: "#f75353",
                200: "#c44141",
            },
            primary: {
                100: "#dddfff",
                200: "#cac5fe",
            },
            light: {
                100: "#d6e0ff",
                400: "#6870a6",
                600: "#4f557d",
                800: "#24273a",
            },
            dark: {
                100: "#020408",
                200: "#27282f",
                300: "#242633",
            },
        },
        borderRadius: {
            DEFAULT: "0.625rem",
        },
        fontFamily: {
            sans: ["Mona Sans", "sans-serif"],
        },
    },
};

export default {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: customTheme,
    plugins: [
        animate,
        plugin(function ({ addUtilities }) {
            addUtilities({
                ".dark-gradient": {
                    background: "linear-gradient(to bottom, #1A1C20, #08090D)",
                },
                ".blue-gradient-dark": {
                    background: "linear-gradient(to bottom, #171532, #08090D)",
                },
                ".border-gradient": {
                    background: "linear-gradient(to bottom, #4B4D4F, #4B4D4F33)",
                },
                ".flex-center": {
                    display: "flex",
                    "align-items": "center",
                    "justify-content": "center",
                },
                ".animate-fadeIn": {
                    animation: "fadeIn 0.3s ease-in-out",
                },
                "@keyframes fadeIn": {
                    from: {
                        opacity: "0",
                        transform: "translateY(5px)",
                    },
                    to: {
                        opacity: "1",
                        transform: "translateY(0)",
                    },
                },
            });
        }),
    ],
};
