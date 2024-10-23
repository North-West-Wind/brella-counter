import { useEffect, useState } from "react";
import { Brella } from "../helper/brella";
import { randomBetween, Vec2 } from "../helper/math";
import "./Background.css";

function Background() {
	const [bg, setBg] = useState("");

	useEffect(() => {
		const canvas = document.createElement("canvas");
		canvas.width = 2048;
		canvas.height = 2048;
		const ctx = canvas.getContext("2d")!;

		const brellas: Brella[] = [];
		const ribs = [6, 8];
		const hue = Array(2).fill(randomBetween(0, 360, true)).map((x, ii) => ii == 0 ? x : x + 60);
		const saturation = [20, 30];
		const lightness = [45, 55];

		for (let ii = 0; ii < 50; ii++) {
			let retries = 10;
			var pos: Vec2;
			// Keep retrying if overlapped
			do {
				pos = new Vec2(canvas.width * Math.random(), canvas.height * Math.random());
			} while (brellas.some(brella => brella.position.addVec(pos.inverse()).magnitudeSqr() < Math.pow(brella.size * 0.47, 2)) && retries--);
			brellas.push(new Brella(pos, randomBetween(canvas.height * 0.3, canvas.height * 0.4), ribs[Math.floor(Math.random() * ribs.length)], hue, saturation, lightness));
		}
		
		// Draw all the brellas
		for (const brella of brellas) brella.render(ctx);

		setBg(canvas.toDataURL());
	}, []);

	return <div className={"background" + (bg ? "" : " hidden")}>
		{bg && <img src={bg} />}
	</div>
}

export default Background;