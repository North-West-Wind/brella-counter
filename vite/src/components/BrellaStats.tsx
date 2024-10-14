import { useLayoutEffect, useState } from "react";
import BrellaColumn from "./BrellaColumn.tsx";

function BrellaStats() {
	const [horizontal, setHorizontal] = useState(globalThis.window.innerWidth > globalThis.window.innerHeight);

	useLayoutEffect(() => {
		const onresize = () => {
			setHorizontal(globalThis.window.innerWidth > globalThis.window.innerHeight);
		};
		globalThis.window.addEventListener("resize", onresize);
		return () => globalThis.window.removeEventListener("resize", onresize);
	}, []);

	return <div className={"flex hcenter" + (horizontal ? "" : " vflex")} style={{ alignItems: horizontal ? "end" : "" }}>
		<BrellaColumn brellas={["splat_brella", "sorella_brella", "order_brella"]} integrelle="splat" />
		<BrellaColumn brellas={["undercover_brella", "undercover_sorella_brella"]} integrelle="undercover" />
		<BrellaColumn brellas={["tenta_brella", "tenta_sorella_brella"]} integrelle="tent" />
		<BrellaColumn brellas={["recycled_mk1", "recycled_mk2"]} integrelle="recycled" />
	</div>
}

export default BrellaStats;