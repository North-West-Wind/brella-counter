import { defaultAnalytics, defaultBrellas } from "../server/common";

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
	var binaryString = atob(base64);
	var bytes = new Uint8Array(binaryString.length);
	for (var i = 0; i < binaryString.length; i++) {
		bytes[i] = binaryString.charCodeAt(i);
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
	brellas.parashelter = readUInt16BE(buf, 4);
	brellas.parashelter_sorella = readUInt16BE(buf, 6);
	brellas.order_shelter_replica = readUInt16BE(buf, 8);
	brellas.campingshelter = readUInt16BE(buf, 10);
	brellas.campingshelter_sorella = readUInt16BE(buf, 12);
	brellas.brella24mk1 = readUInt16BE(buf, 14);
	brellas.brella24mk2 = readUInt16BE(buf, 16);
	return { brellas, offset: 18 };
}

function decodeToday(buf: Uint8Array) {
	const today = { brellas: 0, games: 0 };
	today.brellas = buf[0];
	today.games = buf[1];
	return { today, offset: 2 };
}