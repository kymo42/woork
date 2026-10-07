/**
 * Removes protobufjs's `inquire()` eval prober from the OpenNext server bundle.
 *
 * WHY THIS EXISTS
 * ---------------
 * Next.js bundles protobufjs, which ships a small helper that tries to `require`
 * an optional module by building the callee at runtime:
 *
 *     function inquire(moduleName) {
 *       try { var mod = eval("quire".replace(/^/, "re"))(moduleName); ... }
 *       catch (e) {}
 *       return null
 *     }
 *
 * Cloudflare's Workers runtime forbids code generation from strings, so that
 * eval throws `EvalError: Code generation from strings disallowed for this
 * context`. The throw is nominally swallowed, but it surfaces as a worker
 * exception and breaks server rendering - every real route returns 500 while
 * static assets still serve, which makes it look like a partial success.
 *
 * The helper only ever probes for an OPTIONAL module and returns null when it
 * isn't found, so replacing the eval with a guarded lookup preserves behaviour
 * exactly while removing the forbidden construct. There is no other `eval`
 * anywhere in the bundle.
 *
 * Run automatically after `opennextjs-cloudflare build` (see package.json).
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const EVAL_PROBE = 'eval("quire".replace(/^/,"re"))';
const SAFE_PROBE =
    '((typeof require==="function")?require:function(){throw new Error("no require")})';

const candidates = [
    join(process.cwd(), ".open-next", "server-functions", "default", "handler.mjs"),
    join(process.cwd(), ".open-next", "worker.js"),
];

let patched = 0;
let inspected = 0;

for (const file of candidates) {
    if (!existsSync(file)) continue;
    inspected += 1;

    const source = readFileSync(file, "utf8");
    if (!source.includes(EVAL_PROBE)) {
        console.log(`[patch] no eval prober in ${file} (nothing to do)`);
        continue;
    }

    const occurrences = source.split(EVAL_PROBE).length - 1;
    writeFileSync(file, source.split(EVAL_PROBE).join(SAFE_PROBE), "utf8");
    patched += 1;
    console.log(`[patch] removed ${occurrences} eval prober(s) from ${file}`);
}

if (inspected === 0) {
    console.log("[patch] no OpenNext output found - did the build run first?");
} else if (patched === 0) {
    console.log("[patch] bundle already clean");
}
