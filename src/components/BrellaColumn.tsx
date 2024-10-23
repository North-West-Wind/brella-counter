import { useEffect, useState } from "react";
import Brella from "./Brella";
import "./BrellaColumn.css";
import { multiRandomBoolean, randomBetween } from "../helper/math";
import { useColor } from "../hooks/useColors";
import { useHorizontal } from "../hooks/useHorizontal";

function BrellaColumn(props: { brellas: string[], integrelle: string }) {
	const horizontal = useHorizontal();
	const color = useColor();
	const [svg, setSvg] = useState(`/integrelle/${props.integrelle}.svg`);

	useEffect(() => {
		fetch(`/integrelle/${props.integrelle}.svg`).then(async res => {
			if (res.ok) {
				await new Promise(res => setTimeout(res, randomBetween(500, 1500, true)));
				const [eyeOpen, mouthOpen] = multiRandomBoolean(2);
				const div = document.createElement("div");
				div.innerHTML = await res.text();
				(div.querySelector("#eye-open") as HTMLElement).style.display = eyeOpen ? "inline" : "none";
				(div.querySelector("#eye-close") as HTMLElement).style.display = !eyeOpen ? "inline" : "none";
				(div.querySelector("#mouth-open") as HTMLElement).style.display = mouthOpen ? "inline" : "none";
				(div.querySelector("#mouth-close") as HTMLElement).style.display = !mouthOpen ? "inline" : "none";
				setSvg('data:image/svg+xml;base64,' + btoa(div.innerHTML));
			}
		});
	}, []);

	const integrelleWrapper = <div className={"integrelle " + (horizontal ? "hori" : "vert") + (svg ? "" : " hidden")}>
		<img src={svg} />
	</div>

	return <div className={horizontal ? "flex-dist" : ""}>
		<div className={horizontal ? "" : "flex vcenter"} style={{ color }}>
			{!horizontal && integrelleWrapper}
			{props.brellas.map(brella => <Brella brella={brella} key={brella} />)}
		</div>
		{horizontal && <hr className="brella-hr" />}
		{horizontal && integrelleWrapper}
		
	</div>
}

export default BrellaColumn;