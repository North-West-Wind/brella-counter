export function randomBoolean() {
	return Math.random() < 0.5;
}

export function multiRandomBoolean(size: number): boolean[] {
	return Array(size).fill(randomBoolean).map(f => f());
}

export function randomInt(min: number, max: number) {
	return Math.round(Math.random() * (max - min)) + min;
}