import { useEffect, useState } from "react";
import { analytics } from "../App";
import "./TotalStats.css";
import { useColors } from "../hooks/useColors";

function TeamStats() {
	const [ourCount, setOurCount] = useState(analytics().ourBrellas);
	const [otherCount, setOtherCount] = useState(analytics().otherBrellas);
	const [ourColor, otherColor] = useColors(2);

	useEffect(() => {
		const update = () => {
			setOurCount(analytics().ourBrellas);
			setOtherCount(analytics().otherBrellas);
		};

		globalThis.window.addEventListener("custom:update-analytics", update);
		() => globalThis.window.removeEventListener("custom:update-analytics", update);
	}, []);
	
	return <h2>
		<span className="hint">(Our) </span>
		<span className="number colored" style={{ color: ourColor }}>{ourCount}</span>
		<span className="number"> vs </span>
		<span className="number colored" style={{ color: otherColor }}>{otherCount}</span>
		<span className="hint"> (Other)</span>
	</h2>
}

export default TeamStats;