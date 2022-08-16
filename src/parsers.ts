export const parsers: Record<
    string,
    { url: string; extensions: string[]; symbol?: string }
> = {
    json: {
        url: "./formats/json.ts",
        extensions: ["json"],
    },
    jsonc: {
        url: "https://deno.land/std@v0.151.0/encoding/jsonc.ts",
        extensions: ["jsonc"],
    },
    yaml: {
        url: "https://deno.land/std@v0.151.0/encoding/yaml.ts",
        extensions: ["yaml", "yml"],
    },
    toml: {
        url: "https://deno.land/std@v0.151.0/encoding/toml.ts",
        extensions: ["toml"],
    },
    ini: {
        url: "https://deno.land/x/ini@v2.1.0/mod.ts",
        extensions: ["ini"],
    },
    properties: {
        url: "https://deno.land/x/properties@v1.0.0/mod.ts",
        extensions: ["properties"],
    },
    improperties: {
        url: "https://deno.land/x/improperties@v1.0.0/mod.ts",
        extensions: ["improperties", "imprpt"],
    },
};
