// deno-lint-ignore-file no-explicit-any
import { parseYaml } from "./deps.ts";

/**
 * An interface representing the base of a configuration file.
 */
export type Config = Record<string, any> & {
	/**
	 * Reloads the configuration file from the filesystem.
	 */
	reload: () => Promise<void>;
};

export type RecursivePartial<T> = {
	[P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[]
		// deno-lint-ignore ban-types
		: T[P] extends object ? RecursivePartial<T[P]>
		: T[P];
};

/**
 * Options for the #create method.
 */
interface Options<T extends Config> {
	/**
	 * The path to the configuration file - remember the file extension!
	 */
	file: string;
	/**
	 * A method to parse the configuration file.
	 *
	 * There are lots of parsers provided by the library - check the docs.
	 * The default is YAML.
	 */
	parser?: (content: string) => any;
	defaults?: RecursivePartial<T>;
}

/**
 * The default YAML parser.
 */
function yaml(content: string): any {
	return parseYaml(content);
}

const ENV_VAR_PATTERN = /(?<!\\\$){(.+)}/gm;

async function getConfigContents(path: string): Promise<string> {
	let contents = "";

	try {
		contents = await Deno.readTextFile(path);
	} catch (e) {
		throw new Error(`Failed to read configuration file ${path}: ${e}`);
	}

	// Interpolate environment variables
	let match;
	while ((match = ENV_VAR_PATTERN.exec(contents)) !== null) {
		const envVar = match[1];
		const value = Deno.env.get(envVar);

		if (!value) {
			throw new Error(
				`The environment variable '${envVar}' needs to be interpolated into the config contents, but it cannot be found.`,
			);
		}

		contents = contents.replace(`$${match[0]}`, value);
	}

	return contents;
}

function fillDefaults(
	object: Record<string, unknown>,
	defaults: Record<string, unknown>,
): Record<string, unknown> {
	for (const key of Object.keys(defaults)) {
		if (typeof defaults[key] === "object") {
			object[key] = fillDefaults(
				object[key] as Record<string, unknown>,
				defaults[key] as Record<string, unknown>,
			);
		} else if (!object[key]) {
			object[key] = defaults[key];
		}
	}

	return object;
}

/**
 * Loads a configuration file.
 *
 * @remarks
 * You need not call `reload` on the returned object, as this method does that for you.
 *
 * @param opts - Options for the #create method.
 * @returns The parsed configuration.
 */
export async function create<T extends Config>(opts: Options<T>): Promise<T> {
	const { file, parser = yaml, defaults } = opts;

	let config: Config = {
		reload: async () => {
			const res = parser(await getConfigContents(file));
			config = { reload: config.reload };
			for (const key of Object.keys(res)) {
				if (typeof res[key] === "string") {
					res[key] = res[key].replace("\\$", "$");
				}

				config[key] = res[key];
			}

			if (defaults) {
				config = fillDefaults(config, defaults) as Config;
			}
		},
	};

	await config.reload();
	return config as T;
}
