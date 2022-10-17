import { walk } from "https://deno.land/std@0.143.0/fs/walk.ts";
import { build, emptyDir } from "https://deno.land/x/dnt@0.31.0/mod.ts";

await emptyDir("./npm");

await Deno.mkdir("./npm/test");
for await (const file of walk("./test")) {
	if (!file.path.includes(".ts") && !file.isDirectory) {
		Deno.copyFileSync(file.path, file.path.replace("test", "npm/test"));
	}
}

await build({
	entryPoints: ["./mod.ts"],
	outDir: "./npm",
	shims: {
		deno: true,
		custom: [{
			globalNames: ["TextEncoder", "TextDecoder"],
			module: "util",
		}],
	},
	package: {
		name: "dynamo-config",
		version: Deno.args[0],
		description: "A useful configuration library for Deno & Node applications",
		license: "MIT",
		repository: {
			type: "git",
			url: "git+https://github.com/Jamalam360/dynamo.git",
		},
		bugs: {
			url: "https://github.com/Jamalam360/dynamo/issues",
		},
	},
});

Deno.copyFileSync("./LICENSE", "./npm/LICENSE");
Deno.copyFileSync("./README.md", "./npm/README.md");
