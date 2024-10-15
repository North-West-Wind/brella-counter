import tinycolor from "tinycolor2";

export function partialRandomColor() {
	return tinycolor("#81f5ff").spin(Math.random() * 360).toHexString();
}

export function multiPartialRandomColor(size: number) {
	return Array(size).fill(partialRandomColor).map(fun => fun()) as string[];
}