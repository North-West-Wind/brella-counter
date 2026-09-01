import moment from "moment";
import { State, type SplatlogLike } from "../common";
import { analytics, battles, state, today } from "../store";
import { analyzeFiles, analyzeSingleBattle } from "./analyze";
import { safeOkState } from "./state";
import { broadcast } from "../sse";
import { logger } from "./logger";
import StatFileHolder from "./stats";

const USER = process.env.STAT_USER || "NorthWestWind";

export async function updateMatches() {
	const url = `https://stat.ink/@${USER}/spl3/index.json`;
	if (state() == State.UPDATING || state() == State.RECALIBRATING) return;
	state(State.UPDATING);
	try {
		const stored = analytics();
		let running = true;
		let pageFirstId = "";
		let page = 1;
		let count = 0;
		const stack: SplatlogLike[] = [];
		while (running) {
			let first = true;
			const pageUrl = url + `?page=${page}`;
			logger.debug(`Fetching page ${page} with url ${pageUrl}`);
			const res = await fetch(url + `?page=${page}`);
			if (!res.ok) throw new Error("Probably rate limited");
		
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
					first = false;
				}
				if (battles().has(splatlog.id)) {
					running = false;
					break;
				}
				logger.debug(`Processing ${++count}-th splatlog with ID ${splatlog.id}...`);
				analyzeSingleBattle(stored, splatlog);
				stack.push(splatlog);
				battles().add(splatlog.id);
			}
			page++;
		}
		logger.debug(`Adding ${count} new entries to stats.json`);
		if (stack.length) {
			StatFileHolder.INSTANCE.append(...stack.reverse());
			broadcast();
		}
		safeOkState(State.UPDATING);
		logger.info(`Processed ${count} entries from stat.ink`);
	} catch (err) {
		logger.error(err, "Error updating matches");
		state(State.ERROR);
	}
}

export function updateManual(splatlog: SplatlogLike) {
	state(State.UPDATING);
	const stored = analytics();
	logger.debug(`Processing manual splatlog with ID ${splatlog.id}...`);
	analyzeSingleBattle(stored, splatlog);
	StatFileHolder.INSTANCE.append(splatlog);
	broadcast();
	safeOkState(State.UPDATING);
}

export function resetDay() {
	const td = today()!;
	for (let ii = -12; ii <= 14; ii++) {
		if (moment().utcOffset(ii).get("h") == 0) {
			td.brellas[ii + 12] = 0;
			td.games[ii + 12] = 0;
			break;
		}
	}
	today(td);
	broadcast();
}

export async function recalibrate() {
	logger.info("Recalibrating with file");
	state(State.RECALIBRATING);
	try {
		const result = analyzeFiles();
		if (result) analytics(result);
		safeOkState(State.RECALIBRATING);
		await updateMatches();
		broadcast();
	} catch (err) {
		logger.error(err, "Error recalibrating");
		state(State.ERROR);
	}
	logger.info("Recalibration completed");
}