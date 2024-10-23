import { Brellas } from "../common";
import { analytics, todayBrellas, todayGames } from "../store";

export function serverDataToBuffer(seed: number) {
	const seedBuf = Buffer.alloc(2);
	seedBuf.writeUInt16BE(seed);
	return Buffer.concat([analyticsToBuffer(), todayToBuffer(), seedBuf]);
}

function analyticsToBuffer() {
	const stored = analytics();
	const buffers: Buffer[] = [];
	buffers.push(Buffer.from(stored.firstRecord, "ascii"));
	const numbers = Buffer.alloc(2 * 4);
	numbers.writeUInt16BE(stored.totalGames);
	numbers.writeUInt16BE(stored.totalBrellas, 2);
	numbers.writeUInt16BE(stored.ourBrellas, 4);
	numbers.writeUInt16BE(stored.otherBrellas, 6);
	buffers.push(numbers);
	buffers.push(brellasToBuffer(stored.specifics));
	return Buffer.concat(buffers);
}

function brellasToBuffer(brellas: Brellas) {
	const numbers = Buffer.alloc(2 * 9);
	numbers.writeUInt16BE(brellas.spygadget, 0);
	numbers.writeUInt16BE(brellas.spygadget_sorella, 2);
	numbers.writeUInt16BE(brellas.parashelter, 4);
	numbers.writeUInt16BE(brellas.parashelter_sorella, 6);
	numbers.writeUInt16BE(brellas.order_shelter_replica, 8);
	numbers.writeUInt16BE(brellas.campingshelter, 10);
	numbers.writeUInt16BE(brellas.campingshelter_sorella, 12);
	numbers.writeUInt16BE(brellas.brella24mk1, 14);
	numbers.writeUInt16BE(brellas.brella24mk2, 16);
	return numbers;
}

function todayToBuffer() {
	const numbers = Buffer.alloc(2);
	numbers.writeUInt8(todayBrellas());
	numbers.writeUInt8(todayGames(), 1);
	return numbers;
}