import { create } from "../config.ts";

const config = await create({ file: "./test/config.yml" });

console.log(JSON.stringify(config, null, 2));
