import { useEffect, useLayoutEffect, useState } from "react";
import Brella from "./Brella";
import "./BrellaColumn.css";
import { partialRandomColor } from "../helper/color";
import { multiRandomBoolean, randomBoolean } from "../helper/math";
import { SVG } from "@svgdotjs/svg.js";

function BrellaColumn(props: { brellas: string[], integrelle: string, integrelleOptions?: { eyeOpen?: boolean, mouthOpen?: boolean } }) {
	const [horizontal, setHorizontal] = useState(globalThis.window.innerWidth > globalThis.window.innerHeight);
	const [color] = useState(partialRandomColor());
	const [svg, setSvg] = useState("");

	useEffect(() => {
		fetch(`/integrelle/${props.integrelle}.svg`).then(async res => {
			if (res.ok) {
				const [eyeOpen, mouthOpen] = props.integrelleOptions ? [props.integrelleOptions.eyeOpen ?? randomBoolean(), props.integrelleOptions.mouthOpen ?? randomBoolean()] : multiRandomBoolean(2);
				console.log(`for integrelle ${props.integrelle}:`, eyeOpen, mouthOpen);
				const draw = SVG();
				draw.svg(await res.text());
				draw.find("#eye-open").forEach(item => item.css({ display: eyeOpen ? "inline" : "none" }));
				draw.find("#eye-close").forEach(item => item.css({ display: !eyeOpen ? "inline" : "none" }));
				draw.find("#mouth-open").forEach(item => item.css({ display: mouthOpen ? "inline" : "none" }));
				draw.find("#mouth-close").forEach(item => item.css({ display: !mouthOpen ? "inline" : "none" }));

				setSvg('data:image/svg+xml;base64,' + btoa(draw.svg(false)));
			}
		});
	}, []);

	useLayoutEffect(() => {
		const onresize = () => {
			setHorizontal(globalThis.window.innerWidth > globalThis.window.innerHeight);
		};
		globalThis.window.addEventListener("resize", onresize);
		return () => globalThis.window.removeEventListener("resize", onresize);
	}, []);

	return <div className={horizontal ? "flex-dist" : ""}>
		<div className={horizontal ? "" : "flex vcenter"} style={{ color }}>
			{!horizontal && svg && <img className="integrelle vert" src={svg} />}
			{props.brellas.map(brella => <Brella brella={brella} />)}
		</div>
		{horizontal && <hr className="brella-hr" />}
		{horizontal && svg && <img className="integrelle hori" src={svg} />}
		
	</div>
}

export default BrellaColumn;