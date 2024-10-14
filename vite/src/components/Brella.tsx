import { useEffect, useLayoutEffect, useState } from "react";
import "./Brella.css";

function Brella(props: { src: string, count: number }) {
	const [brellaCount, setBrellaCount] = useState(props.count);
	const [horizontal, setHorizontal] = useState(globalThis.window.innerWidth > globalThis.window.innerHeight);

	useEffect(() => {
		setBrellaCount(props.count);
	}, [props.count]);

	useLayoutEffect(() => {
		const onresize = () => {
			setHorizontal(globalThis.window.innerWidth > globalThis.window.innerHeight);
		};
		globalThis.window.addEventListener("resize", onresize);
		return () => globalThis.window.removeEventListener("resize", onresize);
	}, []);

	return <div className={"brella " + (horizontal ? "hori" : "vert")}>
		<img src={props.src} />
		<h2>{brellaCount}</h2>
	</div>
}

export default Brella;