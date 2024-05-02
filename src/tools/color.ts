export function generateColorFromText(s: string) {
	let color = [0, 0, 0];

	for (let i = 0; i < s.length; i++) {
		color[i % 3] += s.charCodeAt(i);
	}

	color = color.map((v) => v % 256);

	return `#${color[0].toString(16).padStart(2, '0')}${color[1]
		.toString(16)
		.padStart(2, '0')}${color[2].toString(16).padStart(2, '0')}`;
}
