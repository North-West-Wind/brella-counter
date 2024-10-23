// implementations of certain tinycolor2 functions so I don't have to send the whole thing to client
// mainly copying from https://github.com/bgrins/TinyColor/blob/master/npm/esm/tinycolor.js

// hsl here is always in set [0, 360], [0, 100], [0, 100]
type HSL = { h: number, s: number, l: number };
export class TinierColor {
	hsl: HSL;

	constructor(input: string | HSL) {
		if (typeof input === "string") {
			// try to parse hex
			if (input.startsWith("#")) input = input.slice(1);
			const r = parseInt(input.slice(0, 2), 16) / 255;
			const g = parseInt(input.slice(2, 4), 16) / 255;
			const b = parseInt(input.slice(4, 6), 16) / 255;
			let max = Math.max(r, g, b), min = Math.min(r, g, b);
			let h = 0, s: number,	l = (max + min) / 2;
			if (max == min) {
				h = s = 0; // achromatic
			} else {
				const d = max - min;
				s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
				switch (max) {
					case r:
						h = (g - b) / d + (g < b ? 6 : 0);
						break;
					case g:
						h = (b - r) / d + 2;
						break;
					case b:
						h = (r - g) / d + 4;
						break;
				}
				h /= 6;
			}
			h *= 360;
			s *= 100;
			l *= 100;
			this.hsl = { h, s, l };
		} else this.hsl = input;
	}

	clone() {
		return new TinierColor(this.hsl);
	}

	darken(amount = 0) {
		amount = amount === 0 ? 0 : amount || 10;
		this.hsl.l -= amount;
		this.hsl.l = Math.min(100, Math.max(0, this.hsl.l));
		return this;
	}

	spin(amount: number) {
		const hue = (this.hsl.h + amount) % 360;
		this.hsl.h = hue < 0 ? 360 + hue : hue;
		return this;
	}

	toRgb() {
		let { h, s, l } = this.hsl;
		h /= 360;
		s /= 100;
		l /= 100;
		let r: number, g: number, b: number;
		function hue2rgb(p: number, q: number, t: number) {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		}
		if (s === 0) {
			r = g = b = l; // achromatic
		} else {
			const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;
			r = hue2rgb(p, q, h + 1 / 3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1 / 3);
		}
		return {
			r: r * 255,
			g: g * 255,
			b: b * 255
		};
	}

	toHexString() {
		const { r, g, b } = this.toRgb();
		return "#" + Math.round(r).toString(16).padStart(2, "0") + Math.round(g).toString(16).padStart(2, "0") + Math.round(b).toString(16).padStart(2, "0");
	}
}