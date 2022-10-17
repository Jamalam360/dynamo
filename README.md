# Dynamo

_Dynamo_ is a useful configuration library for Deno & Node applications, built
for use with TypeScript.

## Usage

Using Dynamo is very simple. It is available from both NPM (dynamo-config), and
deno.land/x (dynamo).

<details>
	<summary>Node</summary>

```ts
import { Dynamo } from "dynamo-config";

// You can also use a type alias union-ed with Dynamo.Config
// if you wish.
interface ApplicationConfig extends Dynamo.Config {
	verbose: boolean;
	port?: number;
	hostname?: string;
	credentials: {
		username: string;
		password: string;
	};
}

// We can pass defaults like so.
const defaults: Partial<ApplicationConfig> = {
	port: 8080,
	hostname: "localhost",
};

const config = await Dynamo.create<ApplicationConfig>({
	file: "./config.yml",
	defaults,
});

console.log(config.port);

// Reload can be called to reload the config from the filesystem.
await config.reload();
```

</details>

<details>
	<summary>Deno</summary>

```ts
import * as Dynamo from "https://deno.land/x/dynamo/mod.ts";

// You can also use a type alias union-ed with Dynamo.Config
// if you wish.
interface ApplicationConfig extends Dynamo.Config {
	verbose: boolean;
	port?: number;
	hostname?: string;
	credentials: {
		username: string;
		password: string;
	};
}

// We can pass defaults like so.
const defaults: Partial<ApplicationConfig> = {
	port: 8080,
	hostname: "localhost",
};

const config = await Dynamo.create<ApplicationConfig>({
	file: "./config.yml",
	defaults,
});

console.log(config.port);

// Reload can be called to reload the config from the filesystem.
await config.reload();
```

</details>

## Formats

By default, _Dynamo_ uses YAML for configuration, but it is designed to be
extendable. The `create` method takes an optional `parser` parameter with the
type `(content: string) => any`. This allows you to use any format you can
parse. _Dynamo_ includes extra parsers for different formats in the `parsers`
directory. For example, to use JSON:

```ts
import { json } from "https://deno.land/x/dynamo/parsers/json.ts";

const config = await Dynamo.create<ApplicationConfig>({
	file: "./config.json",
	parser: json,
});
```

To see the full list of parsers, see the `parsers` directory.

## Support

For support, open an [issue](https://github.com/Jamalam360/Dynamo/issues), or
contact me [on Discord](https://discord.jamalam.tech).

## License

_Dynamo_ is licensed under the MIT license.

```
```
