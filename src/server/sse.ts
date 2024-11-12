import { randomUUID } from "crypto";
import { Response } from "express";
import { analytics, today } from "./store";

const clients: { [key: string]: Response } = {};

export function addClient(res: Response) {
	const uuid = randomUUID();
	clients[uuid] = res;
	return uuid;
}

export function removeClient(uuid: string) {
	delete clients[uuid];
}

export function broadcast() {
	for (const client of Object.values(clients)) {
		client.write(`data: ${JSON.stringify({ analytics: analytics(), today: today() })}\n\n`);
	}
}