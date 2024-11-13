export async function wait(ms: number) {
	await new Promise(res => setTimeout(res, ms));
}