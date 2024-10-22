import prand from "pure-rand";
import tinycolor from "tinycolor2";

let rng = prand.xoroshiro128plus(Date.now() ^ (Math.random() * 0x100000000));

export function setSeed(seed: number) {
	rng = prand.xoroshiro128plus(seed);
}

export function partialRandomColor() {
	return tinycolor("#81f5ff").spin(prand.unsafeUniformIntDistribution(0, 360, rng)).toHexString();
}

export function multiPartialRandomColor(size: number) {
	return Array(size).fill(() => partialRandomColor()).map(fun => fun()) as string[];
}