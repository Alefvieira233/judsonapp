// scripts/seed-demo-fix-items.mjs
// Regenera os workout_items pra todos os workouts atribuídos (44444444-*)
// que estão com items faltantes. Usa IDs únicos derivados de si+ti+idx em hex.
// Idempotente: ON CONFLICT (id) DO NOTHING.
import { readFileSync } from "node:fs";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const SUPABASE_URL = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim();
const SR = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim();

const STUDENTS = JSON.parse(readFileSync(new URL("./seed-demo-users.json", import.meta.url), "utf8"));

const TPL = {
  treino_a: "11111111-aaaa-4000-8000-000000000a01",
  treino_b: "11111111-aaaa-4000-8000-000000000a02",
  treino_c: "11111111-aaaa-4000-8000-000000000a03",
  gluteo_forte: "11111111-aaaa-4000-8000-000000000a04",
  cardio_core: "11111111-aaaa-4000-8000-000000000a05",
  forca_total: "11111111-aaaa-4000-8000-000000000a06",
};
const EX = {
  supino_reto: "9f10bf5b-7d81-4c85-ae25-36fbed40fdf0", supino_inclinado: "e87f5466-0540-4b2f-bda8-0e1a8d17811e",
  crucifixo_maquina: "f48dc039-fff8-4778-b95e-d00f48428c01", crossover: "0fb935f1-a3cb-4e5b-9189-19e8713afc1e",
  flexao: "490d6a0c-df8d-4835-bfac-e470978861d6",
  puxada_frente: "52346783-6f40-4812-9d49-8f66e4b63fa3", remada_baixa: "4e3db545-25f9-43e5-8a41-3b9564168a31",
  remada_curvada: "75ab605c-1ea9-4a3e-8096-65923cc81b70", remada_unilateral: "26eff26e-8084-4c54-a03d-50583044c7b9",
  pull_up: "c9940cba-ae26-4c92-ad77-591f2a240b67",
  agachamento: "126b3344-9db1-4d41-ad4a-31433a419742", leg_press: "c2fb7968-00ed-450d-b4c2-580181581c5b",
  cadeira_extensora: "8cfd7d5c-e008-4346-b195-109de4b90903", avanco: "396ecfb1-494c-42ef-a9ba-bfb432df3bb2",
  hip_thrust: "422337c9-777f-4724-ac1b-947551ecf837", elev_pelvica: "7698e261-7b25-424b-ad79-b13294f67572",
  cadeira_abdutora: "3155ff5f-f1e2-4c28-aa03-d710ea7d76ff", coice_polia: "18706e94-d76a-4589-bffa-1e555c051c2f",
  stiff: "0a864cbb-da5d-443c-9de6-acbad10b1ede", cadeira_flexora: "565ab11f-3c3b-4c0f-90f2-e23612a7b93b",
  terra_romeno: "138840d5-b1ce-4775-a796-d73c7e95ba7b",
  desenv_militar: "0877dedf-cb3e-47b2-919a-fd87c9201727",
  rosca_direta: "30a99ec7-0c7b-4e96-9989-cc0f17df5dba", rosca_martelo: "290e96ea-f6a4-488a-afc1-48c0c2e1c154",
  triceps_corda: "fdef2134-3740-40c0-bc71-dd64ebb3fa6e", triceps_testa: "03fdf02b-ea8f-401a-a8cd-7412f8991c0d",
  mergulho: "6931f666-f702-4a1b-8671-901347e0d8b0",
  prancha: "eea13713-483b-435f-a613-8344cf5a590a", prancha_lateral: "ce5335a5-ac62-454d-9e71-3c5729823ff8",
  abd_supra: "1090cf46-159c-48d4-9a0b-25cea6375bd6", abd_infra: "a820facc-f5cb-46bd-ab8d-143d63160c8a",
  russian_twist: "35c0fab1-cda6-48e9-b97b-0c5221c737a2",
  pant_em_pe: "488b2ab9-9631-468c-b271-d9ab7da081f3",
};
const TEMPLATES = {
  [TPL.treino_a]: [[EX.supino_reto, 4, "8-10", 90, "Aquecer 2 sets antes"], [EX.supino_inclinado, 3, "10-12", 75, null], [EX.crucifixo_maquina, 3, "12-15", 60, "Foco no estiramento"], [EX.crossover, 3, "15", 60, "Cabos altos pra meio do peito"], [EX.triceps_corda, 4, "12-15", 60, null], [EX.triceps_testa, 3, "10-12", 75, "Cuidado com cotovelos"], [EX.mergulho, 3, "AMRAP", 60, "Até a falha técnica"]],
  [TPL.treino_b]: [[EX.pull_up, 4, "AMRAP", 90, "Pode usar elástico"], [EX.puxada_frente, 3, "10-12", 75, null], [EX.remada_curvada, 4, "8-10", 90, "Apoio lombar firme"], [EX.remada_unilateral, 3, "10/10", 60, null], [EX.remada_baixa, 3, "12", 60, null], [EX.rosca_direta, 4, "10-12", 60, null], [EX.rosca_martelo, 3, "12", 45, "Antebraço grosso"]],
  [TPL.treino_c]: [[EX.agachamento, 5, "6-8", 120, "Aquecer escala 50/70/90% antes"], [EX.leg_press, 4, "10-12", 90, null], [EX.cadeira_extensora, 3, "12-15", 60, "Drop-set no último"], [EX.stiff, 4, "10", 90, "Sentir o posterior"], [EX.cadeira_flexora, 3, "12", 60, null], [EX.hip_thrust, 4, "10-12", 90, null], [EX.pant_em_pe, 4, "15-20", 45, "Pico de contração 1s"]],
  [TPL.gluteo_forte]: [[EX.hip_thrust, 5, "8-10", 90, "Carga pesada"], [EX.elev_pelvica, 4, "12", 75, null], [EX.coice_polia, 4, "12/12", 45, "Controle excêntrico"], [EX.cadeira_abdutora, 4, "15", 45, "Inclinar tronco à frente"], [EX.avanco, 3, "10/10", 75, "Passada longa"], [EX.terra_romeno, 3, "10", 90, null]],
  [TPL.cardio_core]: [[EX.prancha, 4, "45", 30, "Em segundos"], [EX.prancha_lateral, 3, "30/30", 30, "Cada lado"], [EX.abd_supra, 4, "20", 30, null], [EX.abd_infra, 4, "15", 30, null], [EX.russian_twist, 3, "20", 45, "Halter 5kg"]],
  [TPL.forca_total]: [[EX.agachamento, 4, "5-6", 120, "Carga pesada"], [EX.supino_reto, 4, "5-6", 120, null], [EX.remada_curvada, 4, "5-6", 120, null], [EX.desenv_militar, 4, "6-8", 90, null], [EX.terra_romeno, 3, "8", 120, "Foco na pegada"]],
};

function assignFor(slug) {
  if (/larissa|isabela|camila|gabriela/.test(slug)) return [TPL.treino_a, TPL.treino_b, TPL.treino_c];
  if (/julia|olivia|daniela|sofia/.test(slug)) return [TPL.cardio_core, TPL.forca_total];
  if (/ana|fernanda|nathalia|patricia/.test(slug)) return [TPL.gluteo_forte, TPL.cardio_core, TPL.treino_c];
  if (/beatriz|eduarda|raquel|karen/.test(slug)) return [TPL.cardio_core, TPL.gluteo_forte];
  return [TPL.forca_total, TPL.treino_c];
}

const WITH_WORKOUTS = STUDENTS.slice(0, 16);
const stmts = [];
const q = (s) => (s == null ? "NULL" : `'${String(s).replace(/'/g, "''")}'`);
const hex = (n, len) => n.toString(16).padStart(len, "0");

WITH_WORKOUTS.forEach((s, si) => {
  const templates = assignFor(s.slug);
  templates.forEach((tplId, ti) => {
    const newId = `44444444-dddd-4000-8000-${String(si).padStart(4, "0")}${String(ti).padStart(8, "0")}`;
    const items = TEMPLATES[tplId];
    items.forEach((it, idx) => {
      const [exId, sets, reps, rest, notes] = it;
      const itemId = `55555555-eeee-4000-8000-${hex(si, 4)}${hex(ti, 2)}${hex(idx, 6)}`;
      const mode = reps && /^\d+$/.test(String(reps)) && Number(reps) >= 30 ? "seconds" : "reps";
      stmts.push(`(${q(itemId)}, ${q(newId)}, ${q(exId)}, ${idx + 1}, ${sets}, ${q(reps)}, ${rest}, ${q(notes)}, ${q(mode)})`);
    });
  });
});

console.error(`Generated ${stmts.length} workout_items.`);
const sql = `INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode) VALUES\n${stmts.join(",\n")}\nON CONFLICT (id) DO NOTHING;`;

// Aplica via RPC
const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/_seed_run_sql`, {
  method: "POST",
  headers: { "Content-Type": "application/json", apikey: SR, Authorization: `Bearer ${SR}` },
  body: JSON.stringify({ p_sql: sql }),
});
if (!res.ok) {
  console.error(`FAIL ${res.status}: ${await res.text()}`);
  process.exit(1);
}
console.error("workout_items reapplied OK.");
