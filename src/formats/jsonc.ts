import { parse } from "https://deno.land/std@v0.151.0/encoding/jsonc.ts";

export function decode(data: string): any {
    return parse(data);
}
