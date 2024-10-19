import { useState } from "react";
import { useMediaQuery } from "react-responsive";

export function useDark() {
	const systemPrefersDark = useMediaQuery({ query: "(prefers-color-scheme: dark)" }, undefined, prefersDark => { setIsDark(prefersDark); });
	const [isDark, setIsDark] = useState(systemPrefersDark);

	return isDark;
}