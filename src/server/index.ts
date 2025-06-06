import cron from "node-cron";
import express from "express";
import { recalibrate, resetDay, updateManual, updateMatches } from "./helper/observer";
import { analytics, state, today } from "./store";
import { ensureRuntimeDir } from "./helper/fs";
import "dotenv/config";
import { readdirSync, readFileSync } from "node:fs";
import sirv from "sirv";
import compression from "compression";
import { render } from "./ssr";
import { addClient, removeClient } from "./sse";
import { AddressInfo } from "node:net";
import { logger } from "./helper/logger";
import { ManualData, NAME_MAP, SplatlogLike } from "./common";
import bcrypt from "bcryptjs";

// initialize
ensureRuntimeDir();
recalibrate();
const TEMPLATE_HTML = readFileSync("./dist/client/index.html", "utf8");

// env
const UPDATE_INTERVAL = parseInt(process.env.UPDATE_INTERVAL || "300000"); // in milliseconds
const MANUAL_PASSWORD = process.env.MANUAL_PASSWORD;

// every {UPDATE_INTERVAL} fetch matches
setInterval(updateMatches, UPDATE_INTERVAL);

// every hour for every timezone
cron.schedule("0 * * * *", resetDay);

// every week
cron.schedule("0 0 1 * *", recalibrate);

// express server setup
const app = express();

app.use(compression());
app.use("/", sirv("./public", { extensions: [] }));
app.use("/", sirv("./dist/client", { extensions: [] }));
app.get("/", (_req, res) => {
	const seed = (Date.now() ^ (Math.random() * 0x100000000)) & 0xFFFF;
	res.send(render(TEMPLATE_HTML, seed));
});

app.get("/api", (_req, res) => {
	res.send(state()?.toString());
});

app.get("/api/analytics", (_req, res) => {
	res.json(analytics());
});

app.get("/api/today", (_req, res) => {
	res.json(today());
});

app.get("/api/events", (req, res) => {
	res.set({
		'Cache-Control': 'no-cache',
		'Content-Type': 'text/event-stream',
		'Connection': 'keep-alive'
	});
	res.flushHeaders();
	res.write(`data: ${JSON.stringify({ analytics: analytics(), today: today() })}\n\n`);

	const uuid = addClient(res);
	req.on("close", () => {
		removeClient(uuid);
	});
});

// manually add stats
app.post("/api/manual", express.json(), (req, res) => {
	if (!MANUAL_PASSWORD) {
		res.sendStatus(404);
		return;
	}
	const hashed = req.query.password as string;
	if (!hashed || !bcrypt.compareSync(MANUAL_PASSWORD, hashed)) {
		res.sendStatus(403);
		return;
	}
	if (!req.body || typeof req.body != "object") res.sendStatus(400);
	else {
		try {
			const data = req.body as ManualData;
			if (
				data.our && (!Array.isArray(data.our) || !data.our.every(entry => Object.keys(NAME_MAP).includes(entry))) ||
				data.other && (!Array.isArray(data.other) || !data.other.every(entry => Object.keys(NAME_MAP).includes(entry))) ||
				typeof data.time != "undefined" && typeof data.time != "number"
			) {
				res.sendStatus(400);
				return;
			}

			const splatlog: SplatlogLike = {
				id: "",
				start_at: { time: data.time || Date.now() },
				our_team_members: [],
				their_team_members: []
			};
			if (data.our) {
				splatlog.our_team_members = data.our.map(brella => ({
					me: false,
					weapon: {
						type: { key: "brella" },
						key: brella
					}
				}));
			}
			if (data.other) {
				splatlog.their_team_members = data.other.map(brella => ({
					me: false,
					weapon: {
						type: { key: "brella" },
						key: brella
					}
				}));
			}
			updateManual(splatlog);
			res.sendStatus(200);
		} catch (err) {
			logger.error(err);
			res.sendStatus(400);
		}
	}
});

app.get("/random-integrelle", (_req, res) => {
	const files = readdirSync("./public/integrelle/emotes");
	res.redirect(`/integrelle/emotes/${files[Math.floor(Math.random() * files.length)]}`);
});

const server = app.listen(process.env.PORT || 3000, () => logger.info(`Server listening to port ${(server.address() as AddressInfo).port}`));