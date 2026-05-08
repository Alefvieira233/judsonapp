// scripts/seed-demo-apply-rpc.mjs
// Aplica os 13 chunks via RPC public._seed_run_sql.
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const SUPABASE_URL = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim();
const SR = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim();
if (!SUPABASE_URL || !SR) throw new Error("missing env");

const dir = path.dirname(fileURLToPath(import.meta.url));
const chunks = readdirSync(dir)
  .filter((f) => /^seed-demo-chunk-\d+\.sql$/.test(f))
  .sort();

async function runRpc(sql) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/_seed_run_sql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SR,
      Authorization: `Bearer ${SR}`,
    },
    body: JSON.stringify({ p_sql: sql }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`rpc failed ${res.status}: ${txt.slice(0, 800)}`);
  }
}

for (const f of chunks) {
  const sql = readFileSync(path.join(dir, f), "utf8");
  process.stderr.write(`[${f}] ${sql.length} chars... `);
  try {
    await runRpc(sql);
    process.stderr.write("OK\n");
  } catch (e) {
    process.stderr.write(`FAIL: ${e.message}\n`);
    process.exit(1);
  }
}

process.stderr.write("All chunks applied.\n");
