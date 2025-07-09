import "./BrellaStats.css";
import BrellaColumn from "./BrellaColumn.tsx";

function BrellaStats() {
	return <div className={"flex hcenter brella-stats"}>
		<BrellaColumn brellas={["parashelter", "parashelter_sorella", "order_shelter_replica"]} integrelle="splat" />
		<BrellaColumn brellas={["spygadget", "spygadget_sorella", "spygadget_ryo"]} integrelle="undercover" />
		<BrellaColumn brellas={["campingshelter", "campingshelter_sorella", "campingshelter_crem"]} integrelle="tent" />
		<BrellaColumn brellas={["brella24mk1", "brella24mk2"]} integrelle="recycled" />
	</div>
}

export default BrellaStats;