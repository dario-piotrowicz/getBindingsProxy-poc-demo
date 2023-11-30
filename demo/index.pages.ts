import { getBindingsProxy } from 'wrangler';
import type { DurableObjectNamespace, KVNamespace } from '@cloudflare/workers-types';

const {
    bindings,
    dispose
} = await getBindingsProxy({
    bindings: {
        'MY_VARIABLE': {
            type: 'var',
            value: "production_value",
        },
        'MY_KV': {
            type: 'kv',
            id: 'xxxxxxxxxx'
        },
        'MY_DO': {
            type: 'durable-object',
            service: {
                name: "do_worker"
            },
            className: "DurableObjectClass"
        }
    }
});

const myKv = bindings['MY_KV'] as KVNamespace;

const numOfKvEntries = (await myKv.list()).keys.length;

// DurableObjects aren't implemented yet
// const myDo = bindings['MY_DO'] as DurableObjectNamespace;

console.log(`

    MY_VARIABLE = ${bindings['MY_VARIABLE']}

    # kv entries in MY_KV_FROM_TOML = ${numOfKvEntries}

    <<< DurableObjects Integration not implemented >>>

`);

await dispose();
