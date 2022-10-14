import * as Dynamo from "../mod.ts";

interface Config extends Dynamo.Config {
	envVar: string;
	escapedVar: string;
	notDefinedInConfig?: string;
}

const config = await Dynamo.create<Config>({
	file: "./test/config.yml",
	defaults: { notDefinedInConfig: "not defined! default!" },
});
console.log(JSON.stringify(config, null, 2));
await config.reload();
console.log(JSON.stringify(config, null, 2));
