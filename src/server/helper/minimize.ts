import { Brellas } from "../common";
import { analytics, today } from "../store";

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
	const numbers = Buffer.alloc(2 * 11);
	numbers.writeUInt16BE(brellas.spygadget, 0);
	numbers.writeUInt16BE(brellas.spygadget_sorella, 2);
	numbers.writeUInt16BE(brellas.spygadget_ryo, 4);
	numbers.writeUInt16BE(brellas.parashelter, 6);
	numbers.writeUInt16BE(brellas.parashelter_sorella, 8);
	numbers.writeUInt16BE(brellas.order_shelter_replica, 10);
	numbers.writeUInt16BE(brellas.campingshelter, 12);
	numbers.writeUInt16BE(brellas.campingshelter_sorella, 14);
	numbers.writeUInt16BE(brellas.campingshelter_crem, 16);
	numbers.writeUInt16BE(brellas.brella24mk1, 18);
	numbers.writeUInt16BE(brellas.brella24mk2, 20);
	return numbers;
}

function todayToBuffer() {
	const numbers = Buffer.alloc(3 * (12 + 1 + 14));
	for (let offset = -12; offset <= 14; offset++) {
		let ii = offset + 12;
		numbers.writeUInt16BE(today().brellas[ii], ii * 3);
		if (today().games[ii] > 255) {
			console.log(`Timezone ${offset} is overflowing???`);
			numbers.writeUInt8(0, ii * 3 + 2);
		} else numbers.writeUInt8(today().games[ii], ii * 3 + 2);
	}
	return numbers;
}