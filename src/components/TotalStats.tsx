import { useEffect, useState } from "react";
import { analytics } from "../App";
import "./TotalStats.css";
import { useColors } from "../hooks/useColors";

function TotalStats() {
	const [brellaCount, setBrellaCount] = useState(0);
	const [gameCount, setGameCount] = useState(0);
	const [brellaColor, gameColor] = useColors(2);

	useEffect(() => {
		const update = () => {
			setBrellaCount(analytics().totalBrellas);
			setGameCount(analytics().totalGames);
		};

		globalThis.window.addEventListener("custom:update-analytics", update);
		() => globalThis.window.removeEventListener("custom:update-analytics", update);
	}, []);
	
	return <h2>
		<span className="hint">(Brellas) </span>
		<span className="number" style={{ color: brellaColor }}>{brellaCount}</span>
		<span className="number"> | </span>
		<span className="number" style={{ color: gameColor }}>{gameCount}</span>
		<span className="hint"> (Games)</span>
	</h2>
}

export default TotalStats;