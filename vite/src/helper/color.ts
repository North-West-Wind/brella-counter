import tinycolor from "tinycolor2";

export function partialRandomColor(lightMode = false) {
	const color = tinycolor("#81f5ff").spin(Math.random() * 360);
	return (lightMode ? color.darken(30) : color).toHexString();
}

export function multiPartialRandomColor(size: number, lightMode = false) {
	return Array(size).fill(() => partialRandomColor(lightMode)).map(fun => fun()) as string[];
}