import { getBindingsProxy } from "wrangler";
import type {
  DurableObjectNamespace,
  KVNamespace,
} from "@cloudflare/workers-types";

const { bindings, dispose } = await getBindingsProxy<{
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

console.log(`

    MY_VARIABLE = ${bindings["MY_VARIABLE_FROM_TOML"]}

    # kv entries in MY_KV_FROM_TOML = ${numOfKvEntries}

    Message from do_worker = ${txt}

`);

await dispose();
