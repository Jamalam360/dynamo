// deno-lint-ignore-file no-explicit-any
import { parseYaml } from "./deps.ts";

/**
 * An interface representing the base of a configuration file.
 */
export interface Config extends Record<string, any> {
	/**
	 * Reloads the configuration file from the filesystem.
	 */
	reload: () => Promise<void>;
}

/**
 * Options for the #create method.
 */
interface Options {
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

/**
 * Loads a configuration file.
 *
 * @remarks
 * You need not call `load` on the returned object, as this method does that for you.
 *
 * @param opts - Options for the #create method.
 * @returns The parsed configuation.
 */
export async function create<T extends Config>(opts: Options): Promise<T> {
	const { file, parser = yaml } = opts;

	const config: Config = {
		reload: async () => {
			const res = parser(await getConfigContents(file));

			for (const key of Object.keys(res)) {
				config[key] = res[key];
			}
		},
	};

	await config.reload();

	return config as T;
}
