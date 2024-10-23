import Rand, { PRNG } from "rand-seed";
import { TinierColor } from "./tinier-color";

let rng = new Rand();

export function setSeed(seed: number) {
	rng = new Rand(seed.toString(), PRNG.xoshiro128ss);
}

export function partialRandomColor() {
	return new TinierColor("#81f5ff").spin(rng.next() * 360).toHexString();
}

export function multiPartialRandomColor(size: number) {
	return Array(size).fill(() => partialRandomColor()).map(fun => fun()) as string[];
}