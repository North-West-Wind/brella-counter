import cron from "npm:node-cron";
// @deno-types="npm:@types/express"
import express from "npm:express";
import { recalibrate, recalibrateWithFile, resetDay, updateMatches } from "./helper/observer.ts";
import { analytics, state } from "./store.ts";
import { ensureRuntimeDir } from "./helper/fs.ts";
import path from "node:path";

// initialize
ensureRuntimeDir();
if (Deno.env.get("RECALIBRATE_USE_FILE")) await recalibrateWithFile();
else await recalibrate();

// every 5 minutes
cron.schedule("*/5 * * * *", updateMatches);

// every day
cron.schedule("0 0 * * *", resetDay);

// every week
cron.schedule("0 0 1 * *", recalibrate);

// express server setup
const app = express();
app.use(express.static(path.join(import.meta.dirname!, "../public")));
app.get("/", (_req, res) => {
	res.send("index.html");
});

app.get("/api", (_req, res) => {
	res.send(state()?.toString());
});

app.get("/api/analytics", (_req, res) => {
	res.json(analytics());
});

app.listen(Deno.env.get("PORT") || 3000, () => console.log("Server is listening"));