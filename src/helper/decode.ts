import { defaultAnalytics, defaultBrellas, defaultToday } from "../server/common";

export function decodeServerData(data: string) {
	let buf = base64ToUint8Array(data);
	const { analytics, offset } = decodeAnalytics(buf);
	buf = buf.slice(offset);
	const { today, offset: todayOffset } = decodeToday(buf);
	buf = buf.slice(todayOffset);
	const seed = readUInt16BE(buf);
	return { analytics, today, seed };
}

function base64ToUint8Array(base64: string) {
	const binaryString = atob(base64);
	const bytes = new Uint8Array(binaryString.length);
	for (let ii = 0; ii < binaryString.length; ii++) {
		bytes[ii] = binaryString.charCodeAt(ii);
	}
	return bytes;
}

function readUInt16BE(buf: Uint8Array, offset = 0) {
	return (buf[offset] << 8) + buf[offset + 1];
}

function decodeAnalytics(buf: Uint8Array) {
	let offset = 0;
	const analytics = defaultAnalytics();
	analytics.firstRecord = String.fromCharCode(...new Uint8Array(buf.slice(0, 19)));
	offset += 19;
	buf = buf.slice(19);
	analytics.totalGames = readUInt16BE(buf);
	analytics.totalBrellas = readUInt16BE(buf, 2);
	analytics.ourBrellas = readUInt16BE(buf, 4);
	analytics.otherBrellas = readUInt16BE(buf, 6);
	offset += 8;
	const { brellas, offset: moreOffset } = decodeBrellas(buf.slice(8));
	analytics.specifics = brellas;
	offset += moreOffset;
	return { analytics, offset };
}

function decodeBrellas(buf: Uint8Array) {
	const brellas = defaultBrellas();
	brellas.spygadget = readUInt16BE(buf);
	brellas.spygadget_sorella = readUInt16BE(buf, 2);
	brellas.spygadget_ryo = readUInt16BE(buf, 4);
	brellas.parashelter = readUInt16BE(buf, 6);
	brellas.parashelter_sorella = readUInt16BE(buf, 8);
	brellas.order_shelter_replica = readUInt16BE(buf, 10);
	brellas.campingshelter = readUInt16BE(buf, 12);
	brellas.campingshelter_sorella = readUInt16BE(buf, 14);
	brellas.campingshelter_crem = readUInt16BE(buf, 16);
	brellas.brella24mk1 = readUInt16BE(buf, 18);
	brellas.brella24mk2 = readUInt16BE(buf, 20);
	return { brellas, offset: 22 };
}

function decodeToday(buf: Uint8Array) {
	const today = defaultToday();
	for (let offset = -12; offset <= 14; offset++) {
		const ii = offset + 12;
		today.brellas[ii] = readUInt16BE(buf, ii * 3);
		today.games[ii] = buf[ii * 3 + 2];
	}
	return { today, offset: 3 * (12 + 1 + 14) };
}