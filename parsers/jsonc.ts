import { parse } from "https://deno.land/std@0.150.0/encoding/jsonc.ts";

export function jsonc(content: string): any {
	return parse(content);
}
