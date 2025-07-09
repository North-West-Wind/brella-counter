import { useEffect, useState } from "preact/hooks";
import { randomBetween } from "../helper/math";
import "./Background.css";
import BrellaTransition from "brella-transition";

function Background() {
	const [bg, setBg] = useState("");

	useEffect(() => {
		const hue = randomBetween(0, 360, true);
		const transition = new BrellaTransition({
			brellaMax: 50,
			brellaRetries: 10,
			brellaRibs: [6, 8],
			colorHue: [hue, hue + 60],
			colorSaturation: [20, 30],
			colorLightness: [45, 55],
			frameAttack: 0,
		});
		transition.activate();
		const canvas = document.createElement("canvas");
		canvas.width = 2048;
		canvas.height = 2048;
		const ctx = canvas.getContext("2d")!;
		transition.render(ctx);
		setBg(canvas.toDataURL());
	}, []);

	return <div className={"background" + (bg ? "" : " hidden")}>
		{bg && <img src={bg} />}
	</div>
}

export default Background;