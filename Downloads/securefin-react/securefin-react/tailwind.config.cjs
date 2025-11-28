/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0F172A', // slate-900
                secondary: '#1E293B', // slate-800
                accent: '#10B981', // emerald-500
                danger: '#EF4444', // red-500
                warning: '#F59E0B', // amber-500
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
