import { parsers } from "./parsers.ts";
import { importModule } from "../deps.ts";

/**
 * An interface representing the base of a configuration file.
 */
export interface Config {
    /**
     * Reloads the configuration file from the filesystem.
     */
    load: () => Promise<void>;
    /**
     * The format of the configuration file.
     */
    format: string;
}

/**
 * Options for the #create method.
 */
interface Options {
    /**
     * The path to the configuration file, **WITHOUT** the extension.
     *
     * Defaults to `./config`.
     */
    file?: string;
    /**
     * Formats can be found in the `./parsers.ts` file.
     *
     * By default, all formats are allowed.
     */
    allowedFormats?: string[];
}

/**
 * Discovers and loads a configuration file.
 *
 * @remarks
 * You need not call `load` on the returned object, as this method does that for you.
 *
 * @param opts - Options for the #create method.
 * @returns The parsed configuation.
 */
export async function create<T extends Config>(opts?: Options): Promise<T> {
    const { file = "./config" } = opts || {};

    let parser = "";
    let fullFile = "";

    for (const key of Object.keys(parsers)) {
        const { extensions } = parsers[key];

        if (
            (opts?.allowedFormats && opts.allowedFormats.includes(key)) ||
            (!opts?.allowedFormats || opts.allowedFormats.length == 0)
        ) {
            for (const extension of extensions) {
                try {
                    await Deno.stat(
                        `${file}.${extension}`,
                    );
                    fullFile = `${file}.${extension}`;
                    parser = key;
                    break;
                } catch (e) {
                    if (e instanceof Deno.errors.NotFound) {
                        continue;
                    } else {
                        throw e;
                    }
                }
            }
        }
    }

    if (!parser) {
        throw new Error("No config with suitable format found");
    }

    const lib = await importModule(
        new URL(parsers[parser].url, import.meta.url).href,
    );

    const parse = lib[parsers[parser].symbol ?? "parse"] as (
        data: string,
    ) => Record<string, unknown>;

    // deno-lint-ignore no-explicit-any
    const config: Record<string, any> = {
        load: async () => {
            const data = await Deno.readTextFile(fullFile);
            const res = parse(data);

            for (const key of Object.keys(res)) {
                config[key] = res[key];
            }
        },
        format: parser,
    };

    await config.load();

    return config as T;
}
