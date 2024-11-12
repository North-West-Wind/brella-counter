import { useEffect, useState } from "preact/hooks";
import { analytics } from "../App";

function Details() {
	const [firstRecord, setFirstRecord] = useState(analytics().firstRecord);
	const [timezone, setTimezone] = useState(0);

	useEffect(() => {
		setTimezone(-Math.round(new Date().getTimezoneOffset() / 60))

		const update = () => {
			setFirstRecord(analytics().firstRecord);
		};

		globalThis.window.addEventListener("brella-update", update);
		() => globalThis.window.removeEventListener("brella-update", update);
	}, []);

	return <>
		<h2 className="hint">First Record: {firstRecord}</h2>
		<h2 className="hint">Displaying Time Zone: UTC{timezone > 0 ? `+${timezone}` : timezone}</h2>
	</>
}

export default Details;