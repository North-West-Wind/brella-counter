import { useLayoutEffect, useState } from "react";
import Brella from "./Brella";

function BrellaColumn(props: { brellas: string[], integrelle: string }) {
	const [horizontal, setHorizontal] = useState(globalThis.window.innerWidth > globalThis.window.innerHeight);

	useLayoutEffect(() => {
		const onresize = () => {
			setHorizontal(globalThis.window.innerWidth > globalThis.window.innerHeight);
		};
		globalThis.window.addEventListener("resize", onresize);
		return () => globalThis.window.removeEventListener("resize", onresize);
	}, []);

	return <div className={horizontal ? "flex-fill" : "flex vcenter"}>
		{props.brellas.map(brella => <Brella brella={brella} />)}
	</div>
}

export default BrellaColumn;