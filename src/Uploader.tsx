import { useState } from "preact/hooks";
import "./App.css";
import BrellaCounterColumn from "./components/upload/BrellaCountColumn";
import "./Uploader.css";
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import InfoColumn from "./components/upload/InfoColumn";
import bcrypt from "bcryptjs";
import DateTimePicker from "react-datetime-picker";

const brellas = [
	"spygadget",
	"spygadget_sorella",
	"parashelter",
	"parashelter_sorella",
	"order_shelter_replica",
	"campingshelter",
	"campingshelter_sorella",
	"brella24mk1",
	"brella24mk2"
];

export default function Uploader() {
	const [password, setPassword] = useState("");
	const [counts, setCounts] = useState<{ [key: string]: [number, number] }>({});
	const [date, setDate] = useState<Date | null>();
	const [uploading, setUploading] = useState(false);

	const changeOur = (brella: string) => (val: number) => {
		val = Math.max(0, val);
		if (counts[brella]) counts[brella][0] = val;
		else counts[brella] = [val, 0];
		setCounts({
			...counts
		});
	};

	const changeOther = (brella: string) => (val: number) => {
		val = Math.max(0, val);
		if (counts[brella]) counts[brella][1] = val;
		else counts[brella] = [0, val];
		setCounts({
			...counts
		});
	};

	const upload = () => {
		console.log(date?.getTime());
		return;
		if (uploading) return;
		setUploading(true);

		const our: string[] = [];
		const other: string[] = [];
		for (const [brella, count] of Object.entries(counts)) {
			our.push(...Array(count[0]).fill(brella));
			other.push(...Array(count[1]).fill(brella));
		}

		fetch("/api/manual?password=" + bcrypt.hashSync(password), {
			method: "POST",
			body: JSON.stringify({ our, other, time: date?.getTime() }),
			headers: {
				"Content-Type": "application/json"
			}
		}).then(res => {
			alert(res.status);
		}).catch(err => {
			console.error(err);
			alert("Error!");
		}).finally(() => {
			setUploading(false);
		});
	};

	return <>
		<table>
			<tbody>
				<tr>
					<th>Upload Password</th>
					<td><input className="password" type="password" value={password} onChange={ev => setPassword(ev.currentTarget.value)} /></td>
				</tr>
				<tr>
					<th>Date (optional)</th>
					<td><DateTimePicker value={date} onChange={(date) => setDate(date)} disableClock /></td>
					<td><button disabled={uploading} onClick={upload}>Upload</button></td>
				</tr>
			</tbody>
			
		</table>
		<div className="brellas">
			<InfoColumn />
			{brellas.map(brella => <BrellaCounterColumn
				key={brella}
				brella={brella}
				our={counts[brella] ? counts[brella][0] : 0}
				other={counts[brella] ? counts[brella][1] : 0}
				onOurChange={changeOur(brella)}
				onOtherChange={changeOther(brella)}
			/>)}
		</div>
	</>;
}