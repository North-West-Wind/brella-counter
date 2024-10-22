import prand from "pure-rand";

let rng = prand.xoroshiro128plus(Date.now() ^ (Math.random() * 0x100000000));

export function setSeed(seed: number) {
	rng = prand.xoroshiro128plus(seed);
}

export function randomBoolean() {
	return prand.unsafeUniformIntDistribution(0, 1, rng) == 1;
}

export function multiRandomBoolean(size: number): boolean[] {
	return Array(size).fill(randomBoolean).map(f => f());
}

export function randomInt(min: number, max: number) {
	return prand.unsafeUniformIntDistribution(min, max, rng);
}

export function randomBetween(min: number, max: number, int = false) {
	return (int ? Math.round : (v: number) => v)(Math.random() * (max - min)) + min;
}

export class Vec2 {
	readonly x: number;
	readonly y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	add(x: number, y: number) {
		return new Vec2(this.x + x, this.y + y);
	}

	addVec(vec: Vec2) {
		return this.add(vec.x, vec.y);
	}

	addX(x: number) {
		return this.add(x, 0);
	}

	addY(y: number) {
		return this.add(0, y);
	}

	distanceTo(vec: Vec2) {
		return Math.sqrt(this.distanceToSqr(vec));
	}

	distanceToSqr(vec: Vec2) {
		return this.addVec(vec.inverse()).magnitudeSqr();
	}

	inverse() {
		return this.scaleAll(-1);
	}

	magnitude() {
		return Math.sqrt(this.magnitudeSqr());
	}

	magnitudeSqr() {
		return this.x * this.x + this.y * this.y;
	}

	rotate(radian: number) {
		return new Vec2(this.x * Math.cos(radian) - this.y * Math.sin(radian), this.x * Math.sin(radian) + this.y * Math.cos(radian));
	}

	scale(x: number, y: number) {
		return new Vec2(this.x * x, this.y * y);
	}

	scaleAll(k: number) {
		return this.scale(k, k);
	}

	scaleX(x: number) {
		return this.scale(x, 1);
	}

	scaleY(y: number) {
		return this.scale(1, y);
	}
}