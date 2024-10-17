import { useEffect, useState } from "react";
import "./Brella.css";
import { analytics, Brellas } from "../main";
import { useHorizontal } from "../hooks/useHorizontal";

function Brella(props: { brella: string }) {
	const [brellaCount, setBrellaCount] = useState(0);
	const horizontal = useHorizontal();

	useEffect(() => {
		const update = () => {
			setBrellaCount(analytics().specifics[props.brella as keyof Brellas] || 0);
		};

		globalThis.window.addEventListener("custom:update-analytics", update);
		() => globalThis.window.removeEventListener("custom:update-analytics", update);
	}, []);

	return <div className={"brella " + (horizontal ? "hori" : "vert")}>
		<img src={`/brellas/${props.brella}.png`} />
		<h2 className="number">{brellaCount}</h2>
	</div>
}

export default Brella;