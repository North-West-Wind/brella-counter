import { useEffect, useState } from "react";

export function useHorizontal() {
	const [horizontal, setHorizontal] = useState(globalThis.window !== undefined ? globalThis.window.innerWidth > globalThis.window.innerHeight : true);

	useEffect(() => {
		const onresize = () => {
			setHorizontal(globalThis.window.innerWidth > globalThis.window.innerHeight);
		};
		globalThis.window.addEventListener("resize", onresize);
		return () => globalThis.window.removeEventListener("resize", onresize);
	}, []);

	return horizontal;
}