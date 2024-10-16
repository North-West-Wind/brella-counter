import { createReadStream } from "node:fs";
import moment from "moment";
import { createInterface } from "node:readline";
import { getRuntimePath, saveToTextFile } from "./fs.ts";
import { Buffer } from "node:buffer";
import { defaultAnalytics, NAME_MAP, type Analytics, type Brellas, type Member, type SplatlogLike } from "../common.ts";
import { existsSync } from "node:fs";
import { todayBrellas, todayGames } from "../store.ts";

export function analyzeFile() {
	return new Promise<Analytics & { lastBattleId: string } | null>((res) => {
		if (!existsSync(getRuntimePath("stats.json"))) {
			console.log("stats.json doesn't exist");
			res(null);
		}
		let startDate = 0;
		const analytics = defaultAnalytics();
		let lastBattleId = "";
		const inputStream = createReadStream(getRuntimePath("stats.json"));
		const lineReader = createInterface({ input: inputStream, terminal: false });
		lineReader.on("line", line => {
			if (!line) return;
			const json = JSON.parse(line);
			lastBattleId = json.id;
			if (!startDate || json.start_at.time < startDate) startDate = json.start_at.time;
			analyzeSingleBattle(analytics, json, false);
		});
		lineReader.on("close", () => {
			analytics.firstRecord = moment.utc(startDate * 1000).format("YYYY-MM-DD HH:mm:ss");
			let text = `Recalibrated on: ${moment().format("YYYY-MM-DD HH:mm:ss")}`
			text += `\nStart datetime: ${analytics.firstRecord}`;
			text += `\n- ${analytics.totalGames} games`;
			text += `\n- ${analytics.totalBrellas} brellas`;
			text += `\n  - ${analytics.ourBrellas} friends`;
			text += `\n  - ${analytics.otherBrellas} foes`;
			text += `\nSpecifics:`;
			for (const brella of Object.keys(analytics.specifics)) {
				text += `\n- ${analytics.specifics[brella as keyof Brellas]} ${NAME_MAP[brella]}`;
			}
			saveToTextFile("stats.txt", Buffer.from(text));
			res(Object.assign(analytics, { lastBattleId }));
		});
	});
}

export function analyzeSingleBattle(analytics: Analytics, splatlog: SplatlogLike, today: boolean) {
	analytics.totalGames++;
	if (today) todayGames((todayGames() || 0) + 1);
	const our = splatlog.our_team_members;
	our.forEach((member: Member) => {
		if (member.me || member.weapon.type.key != "brella") return;
		analytics.ourBrellas++;
		analytics.totalBrellas++;
		if (today) todayBrellas((todayBrellas() || 0) + 1);
		if (analytics.specifics[member.weapon.key] !== undefined) analytics.specifics[member.weapon.key]++;
	});
	const their = splatlog.their_team_members;
	their.forEach((member: Member) => {
		if (member.weapon.type.key != "brella") return;
		analytics.otherBrellas++;
		analytics.totalBrellas++;
		if (today) todayBrellas((todayBrellas() || 0) + 1);
		if (analytics.specifics[member.weapon.key] !== undefined) analytics.specifics[member.weapon.key]++;
	});
	if (splatlog.third_team_members) {
		const third = splatlog.third_team_members;
		third.forEach((member: Member) => {
			if (member.weapon.type.key != "brella") return;
			analytics.otherBrellas++;
			analytics.totalBrellas++;
			if (today) todayBrellas((todayBrellas() || 0) + 1);
			if (analytics.specifics[member.weapon.key] !== undefined) analytics.specifics[member.weapon.key]++;
		});
	}
}

export function simplifySplatlog(splatlog: SplatlogLike) {
	return {
		id: splatlog.id,
		start_at: { time: splatlog.start_at.time },
		our_team_members: splatlog.our_team_members,
		their_team_members: splatlog.their_team_members,
		third_team_members: splatlog.third_team_members
	};
}