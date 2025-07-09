import { useEffect, useState } from "preact/hooks";
import Brella from "./Brella";
import "./BrellaColumn.css";
import { multiRandomBoolean, randomBetween } from "../helper/math";
import { useColor } from "../hooks/useColors";
import { wait } from "../helper/control";

const TRANSITION_DELAY = 250;

function BrellaColumn(props: { brellas: string[], integrelle: string }) {
	const color = useColor();
	const [svg, setSvg] = useState(`/integrelle/${props.integrelle}.svg`);
	const [changing, setChanging] = useState(false);

	useEffect(() => {
		fetch(`/integrelle/${props.integrelle}.svg`).then(async res => {
			if (res.ok) {
				const delay = randomBetween(500, 1500, true) - TRANSITION_DELAY;
				await wait(delay);
				setChanging(true);
				await wait(TRANSITION_DELAY);
				const [eyeOpen, mouthOpen] = multiRandomBoolean(2);
				const div = document.createElement("div");
				div.innerHTML = await res.text();
				(div.querySelector("#eye-open") as HTMLElement).style.display = eyeOpen ? "inline" : "none";
				(div.querySelector("#eye-close") as HTMLElement).style.display = !eyeOpen ? "inline" : "none";
				(div.querySelector("#mouth-open") as HTMLElement).style.display = mouthOpen ? "inline" : "none";
				(div.querySelector("#mouth-close") as HTMLElement).style.display = !mouthOpen ? "inline" : "none";
				setSvg('data:image/svg+xml;base64,' + btoa(div.innerHTML));
				setChanging(false);
			}
		});
	}, []);

	const integrelleWrapper = <div className={"integrelle " + (svg ? "" : " hidden")}>
		<img src={svg} className={(changing ? "changing" : "")} />
	</div>

	return <div className={"brella-column"}>
		<div className={"inner-brella-column"} style={{ color }}>
			{integrelleWrapper}
			{props.brellas.map(brella => <Brella brella={brella} key={brella} />)}
		</div>
		<hr className="brella-hr" />
		{integrelleWrapper}
		
	</div>
}

export default BrellaColumn;