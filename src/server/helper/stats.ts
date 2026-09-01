import * as fs from "fs";
import * as path from "path";
import { SplatlogLike } from "../common";
import { getRuntimePath } from "./fs";
import { logger } from "./logger";

export default class StatFileHolder {
	static readonly INSTANCE = new StatFileHolder(getRuntimePath("stats.json"));

	readonly filePath: string;
	private fd: number;

	private constructor(filePath: string) {
		this.filePath = filePath;
		this.fd = fs.openSync(filePath, "a+");
		logger.debug(`Opened stats.json file at ${filePath}`);
	}

	*iterator(): Generator<SplatlogLike> {
		const buf = Buffer.alloc(4096);
		let offset = 0, read = 0, count = 0;
		let strBuf = "", line = "";
		do {
			read = fs.readSync(this.fd, buf, 0, buf.byteLength, offset);
			strBuf += buf.subarray(0, read).toString("utf8");
			const splits = strBuf.split("\n", 2);
			if (splits.length == 2) {
				count++;
				[line, strBuf] = splits;
				try {
					const parsed = JSON.parse(line);
					yield parsed;
				} catch (err) {
					logger.error(`Parsing error at line ${count} of ${path.relative(process.cwd(), this.filePath)}`);
				}
			}
			offset += read;
		} while (read > 0);
	}

	append(...splatlogs: SplatlogLike[]) {
		fs.writeSync(this.fd, splatlogs.map(splatlog => JSON.stringify(splatlog)).join("\n") + "\n", undefined, "utf8");
	}
}