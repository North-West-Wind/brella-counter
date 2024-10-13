import { defaultAnalytics, State } from "../common.ts";
import { analytics, lastBattleId, state, todayBrellas, todayGames } from "../store.ts";
import { analyzeFile, analyzeSingleBattle } from "./analyze.ts";
import { safeOkState } from "./state.ts";

function sleep(ms: number) {
	return new Promise(res => setTimeout(res, ms));
}

export async function updateMatches() {
	const url = "https://stat.ink/@NorthWestWind/spl3/index.json";
	state(State.UPDATING);
	try {
		const res = await fetch(url);
		if (res.ok) {
			const json = await res.json();
			const last = lastBattleId();
			lastBattleId(json[0].id);
			if (last) {
				const stored = analytics();
				if (!stored) return;
				// process up to last id
				for (const splatlog of json) {
					if (splatlog.id == last) break;
					analyzeSingleBattle(stored, splatlog, true);
				}
			}
		}
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
	console.log("Recalibrating with stat.ink");
	const url = "https://stat.ink/@NorthWestWind/spl3/index.json";
	state(State.RECALIBRATING);
	try {
		const stored = defaultAnalytics();
		let retries = 0;
		let running = true;
		let pageFirstId = "";
		let page = 1;
		while (running) {
			console.log("Working on page", page);
			const res = await fetch(url + `?page=${page}`);
			if (!res.ok) {
				if (retries >= 5) throw new Error("probably rate limited");
				await sleep(Math.pow(++retries, 3));
			} else {
				retries = 0;
				let first = true;
				const json = await res.json();
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
					analyzeSingleBattle(stored, splatlog, false);
				}
				page++;
			}
		}
		analytics(stored);
		safeOkState(State.RECALIBRATING);
	} catch (err) {
		console.error(err);
		state(State.ERROR);
	}
	console.log("Recalibration completed");
}

export async function recalibrateWithFile() {
	console.log("Recalibrating with file");
	state(State.RECALIBRATING);
	try {
		const result = await analyzeFile();
		lastBattleId(result.lastBattleId);
		analytics(result);
		safeOkState(State.RECALIBRATING);
	} catch (err) {
		console.error(err);
		state(State.ERROR);
	}
	console.log("Recalibration completed");
}