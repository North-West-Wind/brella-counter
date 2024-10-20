import { useEffect, useState } from "react";
import { today } from "../main";
import { useColor } from "../hooks/useColors";

function TodayStats() {
	const [brellaCount, setBrellaCount] = useState(0);
	const [gameCount, setGameCount] = useState(0);
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