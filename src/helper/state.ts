import { State } from "../common.ts";
import { state } from "../store.ts";

export function safeOkState(original: State) {
	const current = state();
	if (current == original) state(State.OK);
}