import { useEffect, useState } from "react";
import { today } from "../App";
import { useColor } from "../hooks/useColors";

function TodayStats() {
	const [brellaCount, setBrellaCount] = useState(today().brellas);
	const [gameCount, setGameCount] = useState(today().games);
	const color = useColor();

	useEffect(() => {
		const update = () => {
			setBrellaCount(today().brellas);
			setGameCount(today().games);
		};

		globalThis.window.addEventListener("custom:update-today", update);
		() => globalThis.window.removeEventListener("custom:update-today", update);
	}, []);
	
	return <h2>
		<span className="number">Today's Brella Rate: </span>
		<span className="number" style={{ color }}>{(brellaCount / gameCount).toPrecision(4)}</span>
		<span className="hint"> ({brellaCount}/{gameCount})</span>
	</h2>
}

export default TodayStats;