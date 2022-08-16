# Dynamo

_Dynamo_ is a configuration library for Deno applications that allows users to
decide what format they wish to use, with no extra work from developers.

## Supported Formats

- JSON
- JSONC
- YAML
- TOML
- INI*
- Properties
- Improperties

*: _Formats marked with an asterisk do not support arrays._

## Usage

Using Dynamo is very simple.

```ts
import * as Dynamo from "https://deno.land/x/dynamo/mod.ts";

interface ApplicationConfig extends Dynamo.Config {
    verbose: boolean;
    port: number;
    hostname: string;
    credentials: {
        username: string;
        password: string;
    };
}

const config = await Dynamo.create<ApplicationConfig>();
```

Users of your application can now configure it using any of the supported config
formats. By default, Dynamo searches for `./config.[extension]`, but this can be
configured (along with other options).
