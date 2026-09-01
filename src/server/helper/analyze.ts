import moment from "moment";
import { getRuntimePath, saveToTextFile } from "./fs";
import { Buffer } from "node:buffer";
import { defaultAnalytics, NAME_MAP, type Analytics, type Brellas, type Member, type SplatlogLike } from "../common";
import { existsSync } from "node:fs";
import { battles, today } from "../store";
import { logger } from "./logger";
import StatFileHolder from "./stats";

export function analyzeFiles() {
	if (!existsSync(getRuntimePath("stats.json"))) {
		logger.warn("stats.json doesn't exist. Please download it and place it in the work directory.");
		process.exit(1);
	}
	let startDate = 0;
	const analytics = defaultAnalytics();
	for (const splatlog of StatFileHolder.INSTANCE.iterator()) {
		if (splatlog.id) battles().add(splatlog.id);
		if (!startDate || splatlog.start_at.time < startDate) startDate = splatlog.start_at.time;
		analyzeSingleBattle(analytics, splatlog);
	}

	analytics.firstRecord = moment.utc(startDate * 1000).format("YYYY-MM-DD HH:mm:ss");
	let text = `Recalibrated on: ${moment().format("YYYY-MM-DD HH:mm:ss")}`
	text += `\nStart datetime: ${analytics.firstRecord}`;
	text += `\n- ${analytics.totalGames} games`;
	text += `\n- ${analytics.totalBrellas} brellas`;
	text += `\n  - ${analytics.ourBrellas} friends`;
	text += `\n  - ${analytics.otherBrellas} foes`;
	text += `\nSpecifics:`;
	for (const brella of Object.keys(analytics.specifics)) {
		const key = brella as keyof Brellas;
		text += `\n- ${analytics.specifics[key]} ${NAME_MAP[key]}`;
	}
	saveToTextFile("stats.txt", Buffer.from(text));
	return analytics;
}

export function analyzeSingleBattle(analytics: Analytics, splatlog: SplatlogLike) {
	analytics.totalGames++;
	const td = today();
	const startTime = moment.unix(splatlog.start_at.time);
	const timezones: number[] = [];
	for (let ii = -12; ii <= 14; ii++)
		if (startTime.utcOffset(ii).isSame(moment().utcOffset(ii), "day"))
			timezones.push(ii + 12);
	for (const tz of timezones)
		td.games[tz]++;
	const our = splatlog.our_team_members;
	our.forEach((member: Member) => {
		if (member.me || member.weapon.type.key != "brella") return;
		analytics.ourBrellas++;
		analytics.totalBrellas++;
		for (const tz of timezones)
			td.brellas[tz]++;
		if (analytics.specifics[member.weapon.key] !== undefined) analytics.specifics[member.weapon.key]++;
	});
	const their = splatlog.their_team_members;
	their.forEach((member: Member) => {
		if (member.weapon.type.key != "brella") return;
		analytics.otherBrellas++;
		analytics.totalBrellas++;
		for (const tz of timezones)
			td.brellas[tz]++;
		if (analytics.specifics[member.weapon.key] !== undefined) analytics.specifics[member.weapon.key]++;
	});
	if (splatlog.third_team_members) {
		const third = splatlog.third_team_members;
		third.forEach((member: Member) => {
			if (member.weapon.type.key != "brella") return;
			analytics.otherBrellas++;
			analytics.totalBrellas++;
			for (const tz of timezones)
				td.brellas[tz]++;
			if (analytics.specifics[member.weapon.key] !== undefined) analytics.specifics[member.weapon.key]++;
		});
	}
	today(td);
}