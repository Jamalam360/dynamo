import { parse } from "https://deno.land/std@0.150.0/encoding/toml.ts";

export function toml(content: string): any {
	return parse(content);
}
