import { useEffect, useState } from "preact/hooks";
import "./Brella.css";
import { analytics, Brellas } from "../App";
import { useHorizontal } from "../hooks/useHorizontal";

function Brella(props: { brella: string }) {
	const [brellaCount, setBrellaCount] = useState(analytics().specifics[props.brella as keyof Brellas]);
	const horizontal = useHorizontal();

	useEffect(() => {
		const update = () => {
			setBrellaCount(analytics().specifics[props.brella as keyof Brellas]);
		};

		globalThis.window.addEventListener("brella-update", update);
		() => globalThis.window.removeEventListener("brella-update", update);
	}, []);

	return <div className={"brella " + (horizontal ? "hori" : "vert")}>
		<img src={`/brellas/${props.brella}.png`} />
		<h2 className="number colored">{brellaCount}</h2>
	</div>
}

export default Brella;