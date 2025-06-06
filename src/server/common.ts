export type Member = {
	me: boolean;
	weapon: {
		type: { key: string };
		key: keyof Brellas;
	};
}

export const NAME_MAP = {
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

export type Brellas = {
	[key in keyof typeof NAME_MAP]: number;
}

export type Analytics = {
	firstRecord: string,
	totalGames: number,
	totalBrellas: number,
	ourBrellas: number,
	otherBrellas: number,
	specifics: Brellas
}

export type Today = {
	brellas: number[],
	games: number[],
};

export enum State {
	STARTING = "starting",
	OK = "ok",
	RECALIBRATING = "recalibrating",
	UPDATING = "updating",
	ERROR = "error",
}

export function defaultAnalytics() {
	return {
		firstRecord: "",
		totalGames: 0,
		totalBrellas: 0,
		ourBrellas: 0,
		otherBrellas: 0,
		specifics: defaultBrellas(),
	} as Analytics;
}

export function defaultBrellas() {
	return {
		spygadget: 0, // vunder
		spygadget_sorella: 0, // sunder
		parashelter: 0, // vbrella
		parashelter_sorella: 0, // sbrella
		order_shelter_replica: 0, // order brella
		campingshelter: 0, // vtent
		campingshelter_sorella: 0, // stent
		brella24mk1: 0, // recycled 1
		brella24mk2: 0, // recycled 2
	} as Brellas;
}

export function defaultToday() {
	return {
		brellas: Array(12 + 1 + 14).fill(0),
		games: Array(12 + 1 + 14).fill(0)
	} as Today;
}

export type SplatlogLike = {
	id: string,
	start_at: { time: number },
	our_team_members: Member[],
	their_team_members: Member[],
	third_team_members?: Member[],
}

export type ManualData = {
	our?: (keyof Brellas)[];
	other?: (keyof Brellas)[];
	time?: number;
}