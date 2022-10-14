import { create } from "../config.ts";
Deno.bench({
	name: "Creation Bench",
	async fn(): Promise<void> {
		await create({ file: "./test/config.yml" });
	},
});
