import { renderToString } from "react-dom/server";
import App from "../App";
import { analytics, todayBrellas, todayGames } from "./store";
import { readdirSync } from "fs";

const STATIC_CONFIG: { [key: string]: string | (() => string) } = {
	title: "Brella Counter",
	url: "https://brella.northwestw.in",
	image: () => {
		const files = readdirSync("./public/integrelle/png").filter(file => file.endsWith(".png"));
		return `/integrelle/png/${files[Math.floor(Math.random() * files.length)]}`;
	},
	author: "NorthWestWind",
	twitterCreator: "@NorthWestWindNW"
};

export function renderMeta(html: string) {
	for (const key in STATIC_CONFIG) {
		const prop = STATIC_CONFIG[key];
		html = html.replace(new RegExp(`\\{${key}\\}`, "g"), typeof prop === "string" ? prop : prop());
	}
	const stored = analytics();
	const {
		spygadget,
		spygadget_sorella,
		parashelter,
		parashelter_sorella,
		order_shelter_replica,
		campingshelter,
		campingshelter_sorella,
		brella24mk1,
		brella24mk2,
	} = stored.specifics;
	const brellas = todayBrellas();
	const games = todayGames();
	const description =
	`Today's Brella Rate: ${(brellas / games).toPrecision(4)} (${brellas} / ${games})
	Total: ${stored.totalBrellas} / ${stored.totalGames} (${stored.ourBrellas} vs ${stored.otherBrellas})
	Specifics: [${spygadget}, ${spygadget_sorella}, ${parashelter}, ${parashelter_sorella}, ${order_shelter_replica}, ${campingshelter}, ${campingshelter_sorella}, ${brella24mk1}, ${brella24mk2}]
	(order: v/s under, v/s/order brella, v/s tent, recycled I/II)`
	return html.replace(/\{description\}/g, description);
}

export function renderData(html: string, seed: number) {
	return html.replace("{data}", JSON.stringify({ analytics: analytics(), today: { brellas: todayBrellas(), games: todayGames() }, seed }));
}

export function renderComponents(html: string, seed: number) {
	return html.replace("<!--app-html-->", renderToString(<App analytics={analytics()} today={{ brellas: todayBrellas(), games: todayGames() }} seed={seed} />));
}

export function render(html: string, seed: number) {
	return renderComponents(renderData(renderMeta(html), seed), seed);
}