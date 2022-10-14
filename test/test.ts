import { create } from "../config.ts";

const config = await create({ file: "config.yml" });

console.log(JSON.stringify(config, null, 2));
