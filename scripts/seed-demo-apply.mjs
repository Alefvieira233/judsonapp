// scripts/seed-demo-apply.mjs
// Imprime o SQL em chunks (~50 statements cada, separados por marcador)
// pra Claude aplicar via MCP execute_sql.
import { readFileSync, writeFileSync } from "node:fs";
const sql = readFileSync(new URL("./seed-demo.sql", import.meta.url), "utf8");

// Divide por bloco BEGIN/COMMIT mas pra aplicar via MCP precisamos rodar sem BEGIN (cada chamada é uma tx)
// Estratégia: extrai só o miolo (entre BEGIN; e COMMIT;), divide por linhas em blocos de N statements.
const startIdx = sql.indexOf("BEGIN;");
const endIdx = sql.indexOf("COMMIT;");
const inner = sql.slice(startIdx + "BEGIN;".length, endIdx).trim();

// Cada statement termina com `;` no fim de uma linha lógica multi-linha.
// Vamos detectar fronteiras procurando por linhas que terminam em `;` E
// a próxima linha não-vazia começa com palavra-chave SQL.
const stmts = [];
let buf = [];
const lines = inner.split("\n");
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();
  if (!trimmed) {
    if (buf.length) { stmts.push(buf.join("\n").trim()); buf = []; }
    continue;
  }
  if (trimmed.startsWith("--")) continue; // comentário
  buf.push(line);
  if (trimmed.endsWith(";")) {
    stmts.push(buf.join("\n").trim());
    buf = [];
  }
}
if (buf.length) stmts.push(buf.join("\n").trim());

console.error(`Total statements: ${stmts.length}`);

const CHUNK = 80;
const chunks = [];
for (let i = 0; i < stmts.length; i += CHUNK) {
  chunks.push(stmts.slice(i, i + CHUNK).join("\n"));
}

console.error(`Chunks of ${CHUNK}: ${chunks.length}`);
for (let i = 0; i < chunks.length; i++) {
  writeFileSync(new URL(`./seed-demo-chunk-${String(i).padStart(2, "0")}.sql`, import.meta.url), chunks[i], "utf8");
}
console.error(`Wrote ${chunks.length} chunk files.`);
