const { nextui } = require('@nextui-org/react');

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./index.html',
		'./src/**/*.{js,ts,jsx,tsx}',
		'./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			maxHeight: {
				'half-screen': '50vh',
			},
		},
		fontFamily: {
			title: ['Montserrat Alternates', 'sans-serif'],
		},
	},
	darkMode: 'class',
	plugins: [nextui()],
};
