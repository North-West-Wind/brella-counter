import { State, type SplatlogLike } from "../common";
import { analytics, lastBattleId, state, todayBrellas, todayGames } from "../store";
import { analyzeFile, analyzeSingleBattle, simplifySplatlog } from "./analyze";
import { appendToTextFile } from "./fs";
import { safeOkState } from "./state";

const USER = process.env.STAT_USER || "NorthWestWind";

function sleep(ms: number) {
	return new Promise(res => setTimeout(res, ms));
}

export async function updateMatches() {
	const url = `https://stat.ink/@${USER}/spl3/index.json`;
	state(State.UPDATING);
	try {
		const stored = analytics();
		const last = lastBattleId();
		const updateAll = !last;
		if (updateAll) console.log("No last battle ID found. Trying to fetch every page.");
		else console.log(`Last battle ID is ${last}. Will stop when reached.`);
		let retries = 0;
		let running = true;
		let pageFirstId = "";
		let page = 1;
		let count = 0;
		const stack: string[] = [];
		while (running) {
			let first = true;
			const pageUrl = url + `?page=${page}`;
			console.log(`Fetching page ${page} with url ${pageUrl}`);
			const res = await fetch(url + `?page=${page}`);
			if (!res.ok) {
				if (retries >= 5) throw new Error("probably rate limited");
				await sleep(Math.pow(++retries, 3));
			} else {
				retries = 0;
				const json = await res.json() as SplatlogLike[];
				// process up to last id
				for (const splatlog of json) {
					if (first) {
						if (splatlog.id == pageFirstId) {
							// we have finished the final page
							running = false;
							break;
						}
						pageFirstId = splatlog.id;
						if (page == 1) lastBattleId(splatlog.id);
						first = false;
					}
					if (!updateAll && splatlog.id == last) {
						running = false;
						break;
					}
					console.log(`Processing ${++count}-th splatlog with ID ${splatlog.id}...`);
					analyzeSingleBattle(stored, splatlog);
					stack.push(JSON.stringify(simplifySplatlog(splatlog)));
				}
				page++;
			}
		}
		console.log(`Adding ${count} new entries to stats.json`);
		if (stack.length) appendToTextFile("stats.json", "\n" + stack.reverse().join("\n"));
		safeOkState(State.UPDATING);
	} catch (err) {
		console.error(err);
		state(State.ERROR);
	}
}

export function resetDay() {
	todayGames(0);
	todayBrellas(0);
}

export async function recalibrate() {
	console.log("Recalibrating with file");
	state(State.RECALIBRATING);
	try {
		const result = await analyzeFile();
		if (result) {
			lastBattleId(result.lastBattleId);
			analytics(result);
		}
		await updateMatches();
		safeOkState(State.RECALIBRATING);
	} catch (err) {
		console.error(err);
		state(State.ERROR);
	}
	console.log("Recalibration completed");
}