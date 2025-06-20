import { defaultAnalytics, defaultToday, State, Today, type Analytics } from "./common";

const internal: {
	lastBattleId: string,
	analytics: Analytics,
	today: Today,
	state: State,
	battles: Set<string>,
} = {
	lastBattleId: "",
	analytics: defaultAnalytics(),
	today: defaultToday(),
	state: State.STARTING,
	battles: new Set()
};

export function analytics(ne?: Analytics) {
	if (ne !== undefined) internal.analytics = ne;
	return internal.analytics;
}

export function today(ne?: Today) {
	if (ne !== undefined) internal.today = ne;
	return internal.today;
}

export function state(ne?: State) {
	if (ne !== undefined) internal.state = ne;
	return internal.state;
}

export function battles() {
	return internal.battles;
}