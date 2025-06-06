import { useEffect, useState } from "preact/hooks";
import "./BrellaCountColumn.css";

export default function BrellaCounterColumn(props: { brella: string, our: number, other: number, onOurChange: (val: number) => void, onOtherChange: (val: number) => void  }) {
	const [our, setOur] = useState(props.our);
	const [other, setOther] = useState(props.other);

	useEffect(() => {
		setOur(props.our);
	}, [props.our]);

	useEffect(() => {
		setOther(props.other);
	}, [props.other]);

	return <div className="brella">
		<img src={`/brellas/${props.brella}.png`} />
		<div className="num-container">
			<input type="number" value={props.our} onChange={(ev) => props.onOurChange(ev.currentTarget.valueAsNumber)} />
			<div className="button" onClick={() => props.onOurChange(our + 1)}>+</div>
			<div className="button" onClick={() => props.onOurChange(our - 1)}>-</div>
		</div>
		<div className="num-container">
			<input type="number" value={props.other} onChange={(ev) => props.onOtherChange(ev.currentTarget.valueAsNumber)} />
			<div className="button" onClick={() => props.onOtherChange(other + 1)}>+</div>
			<div className="button" onClick={() => props.onOtherChange(other - 1)}>-</div>
		</div>
	</div>
}