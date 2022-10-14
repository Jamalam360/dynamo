import { assertEquals } from "https://deno.land/std@v0.150.0/testing/asserts.ts";
import * as Dynamo from "../mod.ts";
import { json } from "../parsers/json.ts";
import { jsonc } from "../parsers/jsonc.ts";
import { toml } from "../parsers/toml.ts";

interface Config extends Dynamo.Config {
	escapedVar: string;
	var: string;
	defaultedValue: string;
	notReplaced: string;
	object: {
		num: number;
		list: number[];
		defaultedValue: string;
	};
}

const defaults: Dynamo.RecursivePartial<Config> = {
	defaultedValue: "default",
	notReplaced: "shouldn't be seen!",
	object: {
		defaultedValue: "default",
	},
};

Deno.env.set("HI", "Value");

for (const format of [undefined, json, jsonc, toml]) {
	let file;

	switch (format) {
		case undefined:
			file = ".yml";
			break;
		case json:
			file = ".json";
			break;
		case jsonc:
			file = ".jsonc";
			break;
		case toml:
			file = ".toml";
			break;
	}

	const config = await Dynamo.create<Config>({
		file: `./test/config${file}`,
		defaults,
		parser: format,
	});

	Deno.test({
		name: `[${file}] - Escaped Environment Variable`,
		fn: () => {
			assertEquals(config.escapedVar, "${hi}");
		},
	});

	Deno.test({
		name: `[${file}] - Environment Variable`,
		fn: () => {
			assertEquals(config.var, "Value");
		},
	});

	Deno.test({
		name: `[${file}] - Defaulted Value`,
		fn: () => {
			assertEquals(config.defaultedValue, "default");
		},
	});

	Deno.test({
		name: `[${file}] - Not Replaced Value`,
		fn: () => {
			assertEquals(config.notReplaced, "hello");
		},
	});

	Deno.test({
		name: `[${file}] - Object Number`,
		fn: () => {
			assertEquals(config.object.num, 900);
		},
	});

	Deno.test({
		name: `[${file}] - Object List`,
		fn: () => {
			assertEquals(config.object.list, [1, 2, 3, 4, 5]);
		},
	});

	Deno.test({
		name: `[${file}] - Object Defaulted Value`,
		fn: () => {
			assertEquals(config.object.defaultedValue, "default");
		},
	});
}
