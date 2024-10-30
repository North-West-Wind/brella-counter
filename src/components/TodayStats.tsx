import { useEffect, useState } from "react";
import { today } from "../App";
import { useColor } from "../hooks/useColors";

function TodayStats() {
	const [brellaCount, setBrellaCount] = useState(today().brellas[12]);
	const [gameCount, setGameCount] = useState(today().games[12]);
	const color = useColor();

	useEffect(() => {
		let index = -Math.round(new Date().getTimezoneOffset() / 60) + 12;
		const update = () => {
			setBrellaCount(today().brellas[index]);
			setGameCount(today().games[index]);
		};

		globalThis.window.addEventListener("custom:update-today", update);
		() => globalThis.window.removeEventListener("custom:update-today", update);
	}, []);
	
	return <h2>
		<span className="number">Today's Brella Rate: </span>
		<span className="number colored" style={{ color }}>{(brellaCount / gameCount).toPrecision(4)}</span>
		<span className="hint"> ({brellaCount}/{gameCount})</span>
	</h2>
}

export default TodayStats;