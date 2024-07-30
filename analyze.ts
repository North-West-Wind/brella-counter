import { createReadStream, existsSync, mkdirSync, writeFileSync } from "fs";
import moment from "moment";
import { createInterface } from "readline";

if (!process.argv[2])
	throw new Error("Please provide a stat.ink JSON file");

if (!existsSync(process.argv[2]))
	throw new Error(`${process.argv[2]} doesn't exist`);

mkdirSync("work", { recursive: true });

const NAME_MAP: { [key: string]: string } = {
	spygadget: "vunder", // vunder
	spygadget_sorella: "sunder", // sunder
	parashelter: "vbrella", // vbrella
	parashelter_sorella: "sbrella", // sbrella
	order_shelter_replica: "order brella", // order brella
	campingshelter: "vtent", // vtent
	campingshelter_sorella: "stent", // stent
	brella24mk1: "recycled I", // recycled 1
	brella24mk2: "recycled II", // recycled 2
};

let startDate = 0;
let brellas: { [key: string]: number } = {
	spygadget: 0, // vunder
	spygadget_sorella: 0, // sunder
	parashelter: 0, // vbrella
	parashelter_sorella: 0, // sbrella
	order_shelter_replica: 0, // order brella
	campingshelter: 0, // vtent
	campingshelter_sorella: 0, // stent
	brella24mk1: 0, // recycled 1
	brella24mk2: 0, // recycled 2
}
let ourBrellas = 0, otherBrellas = 0, games = 0;
const inputStream = createReadStream(process.argv[2]);
const lineReader = createInterface({ input: inputStream, terminal: false });
lineReader.on("line", line => {
	if (!line) return;
	games++;
	const json = JSON.parse(line);
	if (!startDate || json.start_at.time < startDate) startDate = json.start_at.time;
	const our = json.our_team_members;
	our.forEach((member: any) => {
		if (member.me || member.weapon.type.key != "brella") return;
		ourBrellas++;
		if (brellas[member.weapon.key] !== undefined) brellas[member.weapon.key]++;
	});
	const their = json.their_team_members;
	their.forEach((member: any) => {
		if (member.weapon.type.key != "brella") return;
		otherBrellas++;
		if (brellas[member.weapon.key] !== undefined) brellas[member.weapon.key]++;
	});
	const third = json.third_team_members;
	if (third)
		third.forEach((member: any) => {
			if (member.weapon.type.key != "brella") return;
			otherBrellas++;
			if (brellas[member.weapon.key] !== undefined) brellas[member.weapon.key]++;
		});
});
lineReader.on("close", () => {
	let text = `Start datetime: ${moment.utc(startDate * 1000).format("YYYY-MM-DD HH:mm:ss")}`;
	text += `\n- ${games} games`;
	text += `\n- ${Array.from(Object.values(brellas)).reduce((a, b) => a + b)} brellas`;
	text += `\n  - ${ourBrellas} friends`;
	text += `\n  - ${otherBrellas} foes`;
	text += `\nSpecifics:`;
	for (const brella of Object.keys(brellas)) {
		text += `\n- ${brellas[brella]} ${NAME_MAP[brella]}`;
	}
	console.log(text);
	writeFileSync("./work/stats.txt", text);
});

