# POC Demo for the new wrangler `getBindingsProxy` API

> [!note]
> This demo uses the wrangler prerelease generated in [workers-sdk#4523](https://github.com/cloudflare/workers-sdk/pull/4523)

## The `getBindingsProxy` function

The function is used to get a proxy for the workerd bindings that can be then passed to user code
running in Nodejs processes. It spins up Miniflare under the hood and implements various logic (or reuses wrangle logic) that developers (or frameworks) would have to instead implement themselves.

This utility allows anyone to easily get bindings that integrate well with wrangler without having to reinvent the wheel (such as reading the toml file and communicate with the wrangler local registry).

The function can accept inline definitions for the bindings (for a current Pages setup), as in:
```ts
const { bindings } = await getBindingsProxy({
    bindings: {
        'MY_VARIABLE': {
            type: 'var',
            value: "production_value",
        },
        // ...
    }
});
```

> [!note]
> The Pages bindings options need to be converted to the format Miniflare expects them to, such conversion is not yet implemented in the main branch of wrangler so it is only partially implemented here as a POC, the final implementation should reuse the wrangler logic

or simply take the bindings from a `wrangler.toml` file (for a current Workers setup), such
behavior happens when no binding definition is provided, as in:
```ts
const { bindings } = await getBindingsProxy({});
```

The returned `bindings` are simply the Miniflare bindings proxy returned to the user.

## Demo

In the `/demo` directory there are two files that showcase the use of the function, `index.pages.ts` which shows how it could be used for integrating with a Pages project and an `index.worker.ts` which shows how it could be used for integrating with a Workers project.

To run the above, in the root directory of this repo, simply install the dependencies via:
```sh
pnpm i
```

and then to run the pages version run
```sh
pnpm start:pages
```
it should present the following output:
```
    MY_VARIABLE = production_value

    # kv entries in MY_KV_FROM_TOML = 0

    <<< DurableObjects Integration not implemented >>>
```
note that the durable objects integration is not currently implemented

to run the workers version instead run
```sh
pnpm start:worker
```
in this case the output should be:
```
    MY_VARIABLE = production_value_from_toml

    # kv entries in MY_KV_FROM_TOML = 0

    Message from do_worker = [wrangler] Couldn't find `wrangler dev` session for class "DurableObjectClass" to proxy to
```
note that in this case the durable objects integration is implemented but no durable object workers was found in the local registry.

To get a valid message from the do_worker, in a separate terminal run
```sh
pnpm start:do
```

then (while the above process is still running) running
```sh
pnpm start:worker
```
should generate the following output:
```
    MY_VARIABLE = production_value_from_toml

    # kv entries in MY_KV_FROM_TOML = 0

    Message from do_worker = Hello from DurableObject!
```
showcasing the fact that now the function has successfully found the worker in the local registry and created a proxy to its durableObject class.
