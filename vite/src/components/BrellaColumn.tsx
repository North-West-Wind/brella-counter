import { useLayoutEffect, useState } from "react";
import Brella from "./Brella";
import "./BrellaColumn.css";
import { partialRandomColor } from "../helper/color";

function BrellaColumn(props: { brellas: string[], integrelle: string }) {
	const [horizontal, setHorizontal] = useState(globalThis.window.innerWidth > globalThis.window.innerHeight);
	const [color] = useState(partialRandomColor());

	useLayoutEffect(() => {
		const onresize = () => {
			setHorizontal(globalThis.window.innerWidth > globalThis.window.innerHeight);
		};
		globalThis.window.addEventListener("resize", onresize);
		return () => globalThis.window.removeEventListener("resize", onresize);
	}, []);

	return <div className={horizontal ? "flex-dist" : ""}>
		<div className={horizontal ? "" : "flex vcenter"} style={{ color }}>
			{!horizontal && <img className="integrelle vert" src={`/integrelle/${props.integrelle}.svg`} />}
			{props.brellas.map(brella => <Brella brella={brella} />)}
		</div>
		{horizontal && <hr className="brella-hr" />}
		{horizontal && <img className="integrelle hori" src={`/integrelle/${props.integrelle}.svg`} />}
	</div>
}

export default BrellaColumn;