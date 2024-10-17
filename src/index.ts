// @deno-types="npm:@types/node-cron"
import cron from "node-cron";
// @deno-types="npm:@types/express"
import express from "express";
import { recalibrate, resetDay, updateMatches } from "./helper/observer";
import { analytics, state, todayBrellas, todayGames } from "./store";
import { ensureRuntimeDir } from "./helper/fs";
import path from "node:path";
import "dotenv/config";
import { readdirSync } from "node:fs";

// initialize
ensureRuntimeDir();
recalibrate();

// every 5 minutes
cron.schedule("*/5 * * * *", updateMatches);

// every day
cron.schedule("0 0 * * *", resetDay);

// every week
cron.schedule("0 0 1 * *", recalibrate);

// express server setup
const app = express();
app.use(express.static(path.join(__dirname, "../public")));
app.get("/", (_req, res) => {
	res.send("index.html");
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