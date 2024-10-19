import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { multiPartialRandomColor, partialRandomColor } from "../helper/color";
import { useDark } from "./useDark";

export function useColors(size: number) {
	const isDark = useDark();
	const [colors, setColors] = useState(multiPartialRandomColor(size, !isDark));

	useEffect(() => {
		setColors(multiPartialRandomColor(size, !isDark));
	}, [isDark]);

	return colors;
}

export function useColor() {
	const systemPrefersDark = useMediaQuery({ query: "(prefers-color-scheme: dark)" }, undefined, prefersDark => { setIsDark(prefersDark); });
	const [isDark, setIsDark] = useState(systemPrefersDark);
	const [color, setColor] = useState(partialRandomColor(!isDark));

	useEffect(() => {
		setColor(partialRandomColor(!isDark));
	}, [isDark]);

	return color;
}