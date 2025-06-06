import "./BrellaCountColumn.css";

export default function InfoColumn() {
	return <div className="brella">
		<img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
		<div className="num-container">
			<div style={{ fontSize: "1vmax", padding: ".5vmax" }}>Our</div>
		</div>
		<div className="num-container">
			<div style={{ fontSize: "1vmax", padding: ".5vmax" }}>Other</div>
		</div>
	</div>
}