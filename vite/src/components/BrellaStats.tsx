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
		<BrellaColumn brellas={["parashelter", "parashelter_sorella", "order_shelter_replica"]} integrelle="splat" />
		<BrellaColumn brellas={["spygadget", "spygadget_sorella"]} integrelle="undercover" />
		<BrellaColumn brellas={["campingshelter", "campingshelter_sorella"]} integrelle="tent" />
		<BrellaColumn brellas={["brella24mk1", "brella24mk2"]} integrelle="recycled" />
	</div>
}

export default BrellaStats;