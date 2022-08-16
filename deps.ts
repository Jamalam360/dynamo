/**
 * This allows the module to be used on Deno Deploy, where dynamic imports are not allowed.
 */
export { importModule } from "https://deno.land/x/dynamic_import_ponyfill@v0.1.3/mod.ts";
