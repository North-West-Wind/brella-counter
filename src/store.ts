import { State, type Analytics } from "./common.ts";

const internal: Partial<{
	lastBattleId: string,
	analytics: Analytics,
	todayGames: number,
	todayBrellas: number,
	state: State
}> = {
	todayGames: 0,
	todayBrellas: 0,
	state: State.STARTING
};

export function lastBattleId(ne?: string) {
	if (ne !== undefined) internal.lastBattleId = ne;
	return internal.lastBattleId;
}

export function analytics(ne?: Analytics) {
	if (ne !== undefined) internal.analytics = ne;
	return internal.analytics;
}

export function todayGames(ne?: number) {
	if (ne !== undefined) internal.todayGames = ne;
	return internal.todayGames;
}

export function todayBrellas(ne?: number) {
	if (ne !== undefined) internal.todayBrellas = ne;
	return internal.todayBrellas;
}

export function state(ne?: State) {
	if (ne !== undefined) internal.state = ne;
	return internal.state;
}