# POC Demo for the new wrangler `getBindingsProxy` API

> [!note]
> This demo uses the wrangler prerelease generated in [workers-sdk#4523](https://github.com/cloudflare/workers-sdk/pull/4523)

## The `getBindingsProxy` function

The function is used to get a proxy for the workerd bindings that can be then passed to user code
running in Nodejs processes. It spins up Miniflare under the hood and implements various logic (or reuses wrangle logic) that developers (or framework authors) would have to instead implement themselves.

This utility allows anyone to easily get bindings that integrate well with wrangler without having to reinvent the wheel (such as reading the toml file and communicate with the wrangler local registry).

The function simply takes the bindings from a `wrangler.toml` file (for a current Workers setup), so in its simplest form, the function can be called without arguments:
```ts
const { bindings } = await getBindingsProxy();
```

The returned `bindings` are simply the Miniflare bindings proxy returned to the user.

## Demo

In the `/demo` directory there is a single file that showcase the use of the function, `index.ts` which shows how the utility can be used.

To run the above, in the root directory of this repo, simply install the dependencies via:
```sh
pnpm i
```

Then in a separate terminal start the do worker used to showcase local bindings:
```sh
pnpm start:do
```

Once the two wrangler dev processes are ready then you can run the demo in a separate terminal:
```sh
pnpm start:demo
```
its output should showcase the bindings the demo gets access to:
```
    MY_VARIABLE = production_value_from_toml

    # kv entries in MY_KV_FROM_TOML = 1

    Message from do_worker = Hello from DurableObject!
```