import cron from "node-cron";
import express from "express";
import { recalibrate, resetDay, updateMatches } from "./helper/observer";
import { analytics, state, todayBrellas, todayGames } from "./store";
import { ensureRuntimeDir } from "./helper/fs";
import path from "node:path";
import "dotenv/config";
import { readdirSync, readFileSync } from "node:fs";
import sirv from "sirv";
import compression from "compression";
import { renderToString } from "react-dom/server";
import App from "../App";

// initialize
ensureRuntimeDir();
recalibrate();
const TEMPLATE_HTML = readFileSync("./dist/client/index.html", "utf8");

// env
const UPDATE_INTERVAL = parseInt(process.env.UPDATE_INTERVAL || "300000"); // in milliseconds

// every {UPDATE_INTERVAL} fetch matches
setInterval(updateMatches, UPDATE_INTERVAL);

// every day
cron.schedule("0 0 * * *", resetDay);

// every week
cron.schedule("0 0 1 * *", recalibrate);

// express server setup
const app = express();

app.use(compression());
app.use("/", sirv("./public", { extensions: [] }));
app.use("/", sirv("./dist/client", { extensions: [] }));
app.get("/", (_req, res) => {
	let template = TEMPLATE_HTML;
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
	template = template.replace(/\{description\}/g, description);
	template = template.replace("<!--app-html-->", renderToString(<App />));
	renderToString(<App />);
	res.send(template);
});

app.get("/api", (_req, res) => {
	res.send(state()?.toString());
});

app.get("/api/analytics", (_req, res) => {
	res.json(analytics());
});

app.get("/api/today", (_req, res) => {
	res.json({
		brellas: todayBrellas() || 0,
		games: todayGames() || 0
	})
});

app.get("/random-integrelle", (_req, res) => {
	const dir = path.join(__dirname, "../public/integrelle/emotes");
	const files = readdirSync(dir);
	res.sendFile(path.join(dir, files[Math.floor(Math.random() * files.length)]));
});

app.listen(process.env.PORT || 3000, () => console.log("Server is listening"));