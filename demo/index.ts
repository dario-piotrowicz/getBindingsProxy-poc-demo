import { getBindingsProxy } from "wrangler";
import type {
  DurableObjectNamespace,
  KVNamespace,
} from "@cloudflare/workers-types";

const { bindings, caches, dispose } = await getBindingsProxy<{
  MY_KV_FROM_TOML: KVNamespace;
  MY_DO: DurableObjectNamespace;
}>();

const myKv = bindings["MY_KV_FROM_TOML"];

const numOfKvEntries = (await myKv.list()).keys.length;

const myDo = bindings["MY_DO"];

const doId = myDo.idFromName("my-do-name");
const doObj = myDo.get(doId);
const resp = await doObj.fetch("https://0.0.0.0");
const txt = await resp.text();

caches.default.put(new Request("https://0.0.0.0"), new Response('hello'));

const myCache = await caches.open('my cache');
const myCacheMatch = await myCache.match(new Request("https://0.0.0.0"))

console.log(`

    MY_VARIABLE = ${bindings["MY_VARIABLE_FROM_TOML"]}

    # kv entries in MY_KV_FROM_TOML = ${numOfKvEntries}

    Message from do_worker = ${txt}

    value from cache = ${myCacheMatch}

`);

await dispose();
