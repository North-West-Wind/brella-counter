import { useEffect, useState } from "react";
import Brella from "./Brella";
import "./BrellaColumn.css";
import { multiRandomBoolean } from "../helper/math";
import { SVG } from "@svgdotjs/svg.js";
import { useColor } from "../hooks/useColors";
import { useHorizontal } from "../hooks/useHorizontal";

function BrellaColumn(props: { brellas: string[], integrelle: string }) {
	const horizontal = useHorizontal();
	const color = useColor();
	const [svg, setSvg] = useState("");

	useEffect(() => {
		fetch(`/integrelle/${props.integrelle}.svg`).then(async res => {
			if (res.ok) {
				const [eyeOpen, mouthOpen] = multiRandomBoolean(2);
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