import { useState } from "react";
import { multiPartialRandomColor, partialRandomColor } from "../helper/color";

export function useColors(size: number) {
	const [colors] = useState(multiPartialRandomColor(size));
	return colors;
}

export function useColor() {
	const [color] = useState(partialRandomColor());
	return color;
}