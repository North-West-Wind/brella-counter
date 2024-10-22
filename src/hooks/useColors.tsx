import { useEffect, useState } from "react";
import { multiPartialRandomColor, partialRandomColor } from "../helper/color";
import { useDark } from "./useDark";

export function useColors(size: number) {
	const isDark = useDark();
	const [colors, setColors] = useState(Array(size).fill("#7f7f7f"));

	useEffect(() => {
		setColors(multiPartialRandomColor(size, !isDark));
	}, []);

	useEffect(() => {
		setColors(multiPartialRandomColor(size, !isDark));
	}, [isDark]);

	return colors;
}

export function useColor() {
	const isDark = useDark();
	const [color, setColor] = useState("#7f7f7f");

	useEffect(() => {
		setColor(partialRandomColor(!isDark));
	}, []);

	useEffect(() => {
		setColor(partialRandomColor(!isDark));
	}, [isDark]);

	return color;
}