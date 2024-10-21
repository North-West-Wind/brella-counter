import { State } from "../common";
import { state } from "../store";

export function safeOkState(original: State) {
	const current = state();
	if (current == original) state(State.OK);
}