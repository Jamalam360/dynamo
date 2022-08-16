const parsers: Record<string, { url: string; extensions: string[] }> = {
    jsonc: {
        url: "./formats/jsonc.ts",
        extensions: ["jsonc"],
    },
    yaml: {
        url: "https://deno.land/std@v0.151.0/encoding/yaml.ts",
        extensions: ["yaml", "yml"],
    },
    properties: {
        url: "https://deno.land/x/properties@v1.0.0/mod.ts",
        extensions: ["properties"],
    },
    improperties: {
        url: "https://deno.land/x/improperties@v1.0.0/mod.ts",
        extensions: ["improperties", "imprpt"],
    },
    toml: {
        url: "https://deno.land/std@v0.151.0/encoding/toml.ts",
        extensions: ["toml"],
    },
    ini: { url: "https://deno.land/x/ini@v2.1.0/mod.ts", extensions: ["ini"] },
    xml: { url: "https://deno.land/x/xml@2.0.4/mod.ts", extensions: ["xml"] },
};

export interface Config {
    load: () => Promise<void>;
    format: string;
}

interface Options {
    file?: string;
    allowedFormats?: string[];
}

export async function create<T extends Config>(opts?: Options): Promise<T> {
    const { file = "./config" } = opts || {};

    let parser = "";
    let fullFile = "";

    for (const key of Object.keys(parsers)) {
        const { url, extensions } = parsers[key];

        if (
            (opts?.allowedFormats && opts.allowedFormats.includes(key)) ||
            !opts?.allowedFormats
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

    const lib = await import(
        new URL(parsers[parser].url, import.meta.url).href
    );

    // deno-lint-ignore no-explicit-any
    const decode = lib.decode as (data: string) => any;

    // deno-lint-ignore no-explicit-any
    const config: Record<string, any> = {
        load: async () => {
            const data = await Deno.readTextFile(fullFile);
            const res = decode(data);

            for (const key of Object.keys(res)) {
                config[key] = res[key];
            }
        },
        format: parser,
    };

    await config.load();

    return config as T;
}

interface TestConfig extends Config {
    beans: string[];
    foo: string;
    bar: number;
    baz: boolean;
    qux: {
        quux: string;
        corge: number;
        grault: boolean;
    };
    corge: string;
}

const config = await create<TestConfig>();

console.log(JSON.stringify(config, null, 2));
