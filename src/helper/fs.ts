import type { Buffer } from "node:buffer";
import * as fs from "node:fs";
import * as path from "node:path";

const RUNTIME_DIR = Deno.env.get("RUNTIME_DIR") || "work";

export function ensureRuntimeDir() {
	fs.mkdirSync("./work", { recursive: true });
}

export function saveToTextFile(name: string, buffer: Buffer) {
	fs.writeFileSync(path.join(RUNTIME_DIR, name), buffer, { encoding: "utf8" });
}

export function getRuntimePath(p: string) {
	return path.join(RUNTIME_DIR, p);
}