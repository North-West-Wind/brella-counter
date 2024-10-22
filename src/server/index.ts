import cron from "node-cron";
import express from "express";
import { recalibrate, resetDay, updateMatches } from "./helper/observer";
import { analytics, state, todayBrellas, todayGames } from "./store";
import { ensureRuntimeDir } from "./helper/fs";
import "dotenv/config";
import { readdirSync, readFileSync } from "node:fs";
import sirv from "sirv";
import compression from "compression";
import { render } from "./ssr";

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
	res.send(render(TEMPLATE_HTML));
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
	const files = readdirSync("./public/integrelle/emotes");
	res.redirect(`/integrelle/emotes/${files[Math.floor(Math.random() * files.length)]}`);
});

app.listen(process.env.PORT || 3000, () => console.log("Server is listening"));