// scripts/seed-demo-build-sql.mjs
// Lê scripts/seed-demo-users.json (com 20 ids reais) e gera scripts/seed-demo.sql
// idempotente que popula profiles + anamneses + assessments + workouts +
// workout_logs + posts/reactions/comments + plans + referrals + PRs +
// strength_snapshots + push_subscriptions + badges + consents.
//
// Run: node scripts/seed-demo-build-sql.mjs
import { readFileSync, writeFileSync } from "node:fs";

const TENANT = "918ed85f-e58a-4edf-bb1b-761f032e0019";
const OWNER = "a7a1ed0a-937c-4de0-8071-e89a443930c5"; // Judson Lobato (primary owner)

const PLANS = {
  basico: "1b7c3ac0-8790-448d-8a95-78d6ca8c234c",
  premium: "18c5968d-3611-4cf9-9c16-e045d96a70f9",
  vip: "95cffeb6-45e5-4536-b12a-ff36c8350d51",
};

// 50 exercícios públicos (do banco real)
const EX = {
  // peito
  supino_reto: "9f10bf5b-7d81-4c85-ae25-36fbed40fdf0",
  supino_inclinado: "e87f5466-0540-4b2f-bda8-0e1a8d17811e",
  supino_declinado: "988737b6-26e0-44a4-b4c9-61cc2cfdf73b",
  crucifixo_maquina: "f48dc039-fff8-4778-b95e-d00f48428c01",
  crossover: "0fb935f1-a3cb-4e5b-9189-19e8713afc1e",
  flexao: "490d6a0c-df8d-4835-bfac-e470978861d6",
  // costas
  puxada_frente: "52346783-6f40-4812-9d49-8f66e4b63fa3",
  puxada_atras: "6ca17971-513e-4ac6-8eba-9c97821d2865",
  remada_baixa: "4e3db545-25f9-43e5-8a41-3b9564168a31",
  remada_curvada: "75ab605c-1ea9-4a3e-8096-65923cc81b70",
  remada_unilateral: "26eff26e-8084-4c54-a03d-50583044c7b9",
  remada_cavalinho: "eafe692e-523d-4a37-b00b-f7622a8b1a4c",
  pull_up: "c9940cba-ae26-4c92-ad77-591f2a240b67",
  // quadríceps
  agachamento: "126b3344-9db1-4d41-ad4a-31433a419742",
  leg_press: "c2fb7968-00ed-450d-b4c2-580181581c5b",
  hack_squat: "4d2899f0-4edb-4132-a7b3-855e07343d4b",
  cadeira_extensora: "8cfd7d5c-e008-4346-b195-109de4b90903",
  avanco: "396ecfb1-494c-42ef-a9ba-bfb432df3bb2",
  // glúteo
  hip_thrust: "422337c9-777f-4724-ac1b-947551ecf837",
  elev_pelvica: "7698e261-7b25-424b-ad79-b13294f67572",
  cadeira_abdutora: "3155ff5f-f1e2-4c28-aa03-d710ea7d76ff",
  coice_polia: "18706e94-d76a-4589-bffa-1e555c051c2f",
  // posterior
  stiff: "0a864cbb-da5d-443c-9de6-acbad10b1ede",
  cadeira_flexora: "565ab11f-3c3b-4c0f-90f2-e23612a7b93b",
  mesa_flexora: "cf07924d-5cfb-44e4-8a8c-566d3642a0f8",
  terra_romeno: "138840d5-b1ce-4775-a796-d73c7e95ba7b",
  // ombro
  desenv_halteres: "0f64bb8c-698f-47e0-8648-71f57e7f2d9d",
  desenv_militar: "0877dedf-cb3e-47b2-919a-fd87c9201727",
  elev_lateral: "79dec503-1a77-40d5-885c-8e6961a0e4d9",
  elev_frontal: "db19a13e-596b-4f88-b50e-5bd443bcca9d",
  rear_delt: "b00550fd-9886-4748-878b-2f78295f0269",
  // bíceps
  rosca_direta: "30a99ec7-0c7b-4e96-9989-cc0f17df5dba",
  rosca_alternada: "72697f59-c0e2-47ba-a8f0-21d9c8215974",
  rosca_martelo: "290e96ea-f6a4-488a-afc1-48c0c2e1c154",
  rosca_scott: "90f9fe51-64ef-4753-952f-2668b6d83ddd",
  rosca_concentrada: "0e264fd8-e022-4025-8079-cfed8ca5481c",
  // tríceps
  triceps_corda: "fdef2134-3740-40c0-bc71-dd64ebb3fa6e",
  triceps_testa: "03fdf02b-ea8f-401a-a8cd-7412f8991c0d",
  triceps_frances: "7e0dcb83-8975-4ff1-9cd5-acd853d81236",
  triceps_coice: "933e455e-7596-4ef5-9864-c6640a2fbc61",
  mergulho: "6931f666-f702-4a1b-8671-901347e0d8b0",
  // abdômen
  prancha: "eea13713-483b-435f-a613-8344cf5a590a",
  prancha_lateral: "ce5335a5-ac62-454d-9e71-3c5729823ff8",
  abd_supra: "1090cf46-159c-48d4-9a0b-25cea6375bd6",
  abd_infra: "a820facc-f5cb-46bd-ab8d-143d63160c8a",
  abd_polia: "9c6ba9bf-5475-4acf-9d6c-a81f9afdce6a",
  russian_twist: "35c0fab1-cda6-48e9-b97b-0c5221c737a2",
  // panturrilha
  pant_em_pe: "488b2ab9-9631-468c-b271-d9ab7da081f3",
  pant_sentado: "50a4d082-c63d-4712-a6a6-85b261eed2aa",
  pant_leg_press: "1d1915e0-ae80-44fd-bd1c-1d1f07ad3a0f",
};

// Templates fixos de treino (uuid v5-ish: deterministic via slug)
// Gero ids estáticos pra serem idempotentes
const TPL = {
  treino_a: "11111111-aaaa-4000-8000-000000000a01", // Treino A - Peito + Tríceps
  treino_b: "11111111-aaaa-4000-8000-000000000a02", // Treino B - Costas + Bíceps
  treino_c: "11111111-aaaa-4000-8000-000000000a03", // Treino C - Pernas Completo
  gluteo_forte: "11111111-aaaa-4000-8000-000000000a04",
  cardio_core: "11111111-aaaa-4000-8000-000000000a05",
  forca_total: "11111111-aaaa-4000-8000-000000000a06",
};

const STUDENTS = JSON.parse(
  readFileSync(new URL("./seed-demo-users.json", import.meta.url), "utf8")
);
// Garante 20
if (STUDENTS.length !== 20) throw new Error(`expected 20 students, got ${STUDENTS.length}`);

// PRNG determinística (mulberry32) pra dados reproduzíveis
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const r = rng(42);
const pick = (arr) => arr[Math.floor(r() * arr.length)];
const between = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
const betweenF = (lo, hi, dec = 1) =>
  Math.round((lo + r() * (hi - lo)) * 10 ** dec) / 10 ** dec;

// Datas
const now = new Date("2026-05-08T12:00:00Z");
function daysAgo(n) {
  const d = new Date(now.getTime() - n * 86400000);
  return d.toISOString();
}
function daysAgoAt(n, hour, min) {
  const d = new Date(now.getTime() - n * 86400000);
  d.setUTCHours(hour, min, 0, 0);
  return d.toISOString();
}

// SQL helpers
const q = (s) => (s == null ? "NULL" : `'${String(s).replace(/'/g, "''")}'`);
const ts = (iso) => (iso == null ? "NULL" : `'${iso}'::timestamptz`);
const b = (v) => (v == null ? "NULL" : v ? "TRUE" : "FALSE");

const lines = [];
lines.push("-- =====================================================================");
lines.push("-- seed-demo.sql — população demo do tenant Judson Lobato");
lines.push("-- Idempotente: roda 2x sem duplicar (ON CONFLICT DO NOTHING / WHERE NOT EXISTS).");
lines.push("-- Pré-requisito: 20 auth.users criados via scripts/seed-demo-create-users.mjs");
lines.push("-- Tenant: " + TENANT);
lines.push("-- Owner (Judson primary): " + OWNER);
lines.push("-- Gerado em " + now.toISOString());
lines.push("-- =====================================================================");
lines.push("");
lines.push("BEGIN;");
lines.push("");

// -------------------- profiles --------------------
lines.push("-- ============ PROFILES ============");
STUDENTS.forEach((s, i) => {
  const joinedDays = between(7, 180); // entre 1sem e 6 meses
  const phone = `+5598${String(91000000 + i * 13 + 7).padStart(8, "0")}`;
  const obs = pick([
    "Prefere treinar pela manhã.",
    "Treina 3x na semana, terça/quinta/sábado.",
    "Trabalha sentada, atenção pra postura.",
    "Acordada antes das 6h, melhor janela é cedo.",
    "Quer evoluir gradualmente, sem pressa.",
    "Histórico de sedentarismo, paciência no início.",
    "Atleta amadora, gosta de desafio.",
    "Mãe recente, agenda apertada.",
  ]);
  lines.push(
    `INSERT INTO profiles (id, tenant_id, role, full_name, email, phone, goal, observations, joined_at, active, share_in_leaderboard)
VALUES (${q(s.id)}, ${q(TENANT)}, 'student', ${q(s.full_name)}, ${q(s.email)}, ${q(phone)}, ${q(s.goal)}, ${q(obs)}, ${ts(daysAgo(joinedDays))}, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;`
  );
});
lines.push("");

// Set current_plan_id para 12 alunas (mix dos 3)
lines.push("-- 12 alunas com plano (mix), 8 sem plano");
const planAssign = [
  PLANS.basico, PLANS.basico, PLANS.basico, PLANS.basico,
  PLANS.premium, PLANS.premium, PLANS.premium, PLANS.premium,
  PLANS.vip, PLANS.vip, PLANS.vip, PLANS.vip,
];
for (let i = 0; i < 12; i++) {
  lines.push(
    `UPDATE profiles SET current_plan_id = ${q(planAssign[i])} WHERE id = ${q(STUDENTS[i].id)} AND current_plan_id IS NULL;`
  );
}
lines.push("");

// -------------------- consents (LGPD) --------------------
lines.push("-- ============ CONSENTS (LGPD) ============");
STUDENTS.forEach((s, i) => {
  lines.push(
    `INSERT INTO consents (user_id, tenant_id, policy_version, terms_version, accepted_at, ip, user_agent, context)
SELECT ${q(s.id)}, ${q(TENANT)}, '2025-01-15', '2025-01-15', ${ts(daysAgo(between(7, 180)))}, '203.0.113.${(i % 250) + 1}', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', 'invite'
WHERE NOT EXISTS (SELECT 1 FROM consents WHERE user_id = ${q(s.id)});`
  );
});
lines.push("");

// -------------------- anamneses --------------------
lines.push("-- ============ ANAMNESES (12 das 20) ============");
// Distribui: 4 com risco cardíaco, 2 grávidas, 6 normais (= 12)
const anamneseStudents = STUDENTS.slice(0, 12);
const anamneseConfigs = [
  { i: 0, has_chest_pain: true, has_heart_condition: true, injuries: "Histórico de palpitação. Cardiologista liberou em fev/2026.", goals: "Emagrecer com cardio leve, controlar PA." },
  { i: 1, is_pregnant: true, injuries: "Gestante, 22 semanas, autorização médica anexada.", goals: "Manter atividade leve no pré-parto." },
  { i: 2, has_bone_or_joint_problem: true, injuries: "Lesão antiga LCA joelho direito. Sem dor atualmente.", goals: "Hipertrofia priorizando técnica, sem alta carga unilateral." },
  { i: 3, takes_blood_pressure_meds: true, has_chest_pain: true, injuries: "Toma losartana. Atenção a esforço máximo.", goals: "Cardio progressivo + força moderada." },
  { i: 4, is_pregnant: false, injuries: "Diástase abdominal pós-parto.", goals: "Reativar core, voltar a treinar com segurança." },
  { i: 5, has_dizziness: true, injuries: "Crises de tontura ocasionais (labirintite).", goals: "Definir abdômen evitando exercícios em decúbito brusco." },
  { i: 6, smoker: true, injuries: "Fumante social. Pretende reduzir.", goals: "Força e condicionamento aeróbio." },
  { i: 7, has_heart_condition: true, injuries: "Sopro funcional, libreado por cardio.", goals: "Treino moderado, foco em saúde mental." },
  { i: 8, injuries: "Sem restrições.", goals: "Hipertrofia agressiva mirando palco em 2027." },
  { i: 9, has_bone_or_joint_problem: true, injuries: "Tendinite ombro esquerdo (3 meses atrás), recuperada.", goals: "Performance crossfit." },
  { i: 10, has_bone_or_joint_problem: true, injuries: "Pós-cirurgia menisco joelho esquerdo (2024). Treino sem impacto.", goals: "Voltar gradativamente, sem agachamento profundo." },
  { i: 11, injuries: "Sem queixas. Quer ganhar peso saudavelmente.", goals: "Hipertrofia + alimentação." },
];
anamneseConfigs.forEach((c, idx) => {
  const s = anamneseStudents[c.i];
  const reviewed = idx < 4; // primeiras 4 revisadas, restantes 8 só assinadas
  const signed = daysAgo(between(5, 60));
  const reviewedAt = reviewed ? daysAgo(between(1, 5)) : null;
  const activity = pick(["sedentário", "leve", "moderado", "ativo"]);
  lines.push(
    `INSERT INTO anamneses (tenant_id, student_id, has_heart_condition, has_chest_pain, has_dizziness, has_bone_or_joint_problem, takes_blood_pressure_meds, is_pregnant, smoker, injuries, goals, activity_level, signed_at, reviewed_at)
SELECT ${q(TENANT)}, ${q(s.id)}, ${b(c.has_heart_condition)}, ${b(c.has_chest_pain)}, ${b(c.has_dizziness)}, ${b(c.has_bone_or_joint_problem)}, ${b(c.takes_blood_pressure_meds)}, ${b(c.is_pregnant)}, ${b(c.smoker)}, ${q(c.injuries)}, ${q(c.goals)}, ${q(activity)}, ${ts(signed)}, ${ts(reviewedAt)}
WHERE NOT EXISTS (SELECT 1 FROM anamneses WHERE student_id = ${q(s.id)});`
  );
});
lines.push("");

// -------------------- assessments --------------------
lines.push("-- ============ ASSESSMENTS (12 alunas, 6 com timeline 3-pts) ============");
// IDs determinísticos pras 18 avaliações (12 alunas, 6 delas com 3)
const assessStudents = STUDENTS.slice(0, 12);
assessStudents.forEach((s, i) => {
  const baseWeight = betweenF(50, 90, 1);
  const baseBF = betweenF(20, 35, 1);
  const baseHeight = between(155, 175);
  const numAssess = i < 6 ? 3 : 1; // 6 com 3, 6 com 1
  for (let k = 0; k < numAssess; k++) {
    const offset = numAssess === 3 ? [85, 45, 7][k] : between(20, 60);
    const wDelta = numAssess === 3 ? -1.5 * k : 0;
    const bfDelta = numAssess === 3 ? -1.2 * k : 0;
    const id = `22222222-bbbb-4000-8000-${String(i).padStart(4, "0")}${String(k).padStart(8, "0")}`;
    lines.push(
      `INSERT INTO assessments (id, tenant_id, student_id, measured_at, measured_by, weight_kg, height_cm, body_fat_pct, muscle_pct, waist_cm, hip_cm, chest_cm, arm_cm, thigh_cm, calf_cm)
VALUES (${q(id)}, ${q(TENANT)}, ${q(s.id)}, ${ts(daysAgo(offset))}, ${q(OWNER)}, ${(baseWeight + wDelta).toFixed(1)}, ${baseHeight}, ${(baseBF + bfDelta).toFixed(1)}, ${(28 - bfDelta * 0.5).toFixed(1)}, ${between(64, 92)}, ${between(88, 108)}, ${between(82, 100)}, ${between(26, 34)}, ${between(50, 64)}, ${between(32, 40)})
ON CONFLICT (id) DO NOTHING;`
    );
  }
});
lines.push("");

// -------------------- workout templates --------------------
lines.push("-- ============ WORKOUT TEMPLATES (6) ============");
const TEMPLATES = [
  {
    id: TPL.treino_a, title: "Treino A — Peito + Tríceps", description: "Empurrar pesado, fechar com tríceps. 4-5 séries por exercício.",
    items: [
      [EX.supino_reto, 4, "8-10", 90, "Aquecer 2 sets antes"],
      [EX.supino_inclinado, 3, "10-12", 75, null],
      [EX.crucifixo_maquina, 3, "12-15", 60, "Foco no estiramento"],
      [EX.crossover, 3, "15", 60, "Cabos altos pra meio do peito"],
      [EX.triceps_corda, 4, "12-15", 60, null],
      [EX.triceps_testa, 3, "10-12", 75, "Cuidado com cotovelos"],
      [EX.mergulho, 3, "AMRAP", 60, "Até a falha técnica"],
    ],
  },
  {
    id: TPL.treino_b, title: "Treino B — Costas + Bíceps", description: "Largura, espessura, fechar com bíceps. Concentração na contração.",
    items: [
      [EX.pull_up, 4, "AMRAP", 90, "Pode usar elástico"],
      [EX.puxada_frente, 3, "10-12", 75, null],
      [EX.remada_curvada, 4, "8-10", 90, "Apoio lombar firme"],
      [EX.remada_unilateral, 3, "10/10", 60, null],
      [EX.remada_baixa, 3, "12", 60, null],
      [EX.rosca_direta, 4, "10-12", 60, null],
      [EX.rosca_martelo, 3, "12", 45, "Antebraço grosso"],
    ],
  },
  {
    id: TPL.treino_c, title: "Treino C — Pernas Completo", description: "Quadríceps + posterior + glúteo + panturrilha. O treino mais pesado da semana.",
    items: [
      [EX.agachamento, 5, "6-8", 120, "Aquecer escala 50/70/90% antes"],
      [EX.leg_press, 4, "10-12", 90, null],
      [EX.cadeira_extensora, 3, "12-15", 60, "Drop-set no último"],
      [EX.stiff, 4, "10", 90, "Sentir o posterior"],
      [EX.cadeira_flexora, 3, "12", 60, null],
      [EX.hip_thrust, 4, "10-12", 90, null],
      [EX.pant_em_pe, 4, "15-20", 45, "Pico de contração 1s"],
    ],
  },
  {
    id: TPL.gluteo_forte, title: "Glúteo Forte", description: "Treino dedicado pra hipertrofia de glúteo. Foco mental no músculo.",
    items: [
      [EX.hip_thrust, 5, "8-10", 90, "Carga pesada"],
      [EX.elev_pelvica, 4, "12", 75, null],
      [EX.coice_polia, 4, "12/12", 45, "Controle excêntrico"],
      [EX.cadeira_abdutora, 4, "15", 45, "Inclinar tronco à frente"],
      [EX.avanco, 3, "10/10", 75, "Passada longa"],
      [EX.terra_romeno, 3, "10", 90, null],
    ],
  },
  {
    id: TPL.cardio_core, title: "Cardio + Core", description: "30min de cardio + circuito de abdômen. Ideal pra dia entre treinos pesados.",
    items: [
      [EX.prancha, 4, "45", 30, "Em segundos"],
      [EX.prancha_lateral, 3, "30/30", 30, "Cada lado"],
      [EX.abd_supra, 4, "20", 30, null],
      [EX.abd_infra, 4, "15", 30, null],
      [EX.russian_twist, 3, "20", 45, "Halter 5kg"],
    ],
  },
  {
    id: TPL.forca_total, title: "Força Total", description: "Treino full-body 3x/semana. Padrões de movimento básicos com carga.",
    items: [
      [EX.agachamento, 4, "5-6", 120, "Carga pesada"],
      [EX.supino_reto, 4, "5-6", 120, null],
      [EX.remada_curvada, 4, "5-6", 120, null],
      [EX.desenv_militar, 4, "6-8", 90, null],
      [EX.terra_romeno, 3, "8", 120, "Foco na pegada"],
    ],
  },
];

TEMPLATES.forEach((tpl) => {
  lines.push(
    `INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES (${q(tpl.id)}, ${q(TENANT)}, NULL, ${q(tpl.title)}, ${q(tpl.description)}, ARRAY[1,3,5]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;`
  );
  tpl.items.forEach((it, idx) => {
    const [exId, sets, reps, rest, notes] = it;
    const itemId = `33333333-cccc-4000-8000-${tpl.id.slice(-4)}${String(idx).padStart(8, "0")}`;
    const mode = reps && /^\d+$/.test(String(reps)) && Number(reps) >= 30 ? "seconds" : "reps";
    lines.push(
      `INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES (${q(itemId)}, ${q(tpl.id)}, ${q(exId)}, ${idx + 1}, ${sets}, ${q(reps)}, ${rest}, ${q(notes)}, ${q(mode)})
ON CONFLICT (id) DO NOTHING;`
    );
  });
});
lines.push("");

// -------------------- workouts atribuídos --------------------
lines.push("-- ============ WORKOUTS ATRIBUÍDOS (16 alunas com 2-3 treinos cada) ============");
// 16 alunas com treino, últimas 4 sem
const WITH_WORKOUTS = STUDENTS.slice(0, 16);
const WITHOUT_WORKOUTS = STUDENTS.slice(16); // 4 esperando

// Cada aluna ganha cópia dos 2-3 templates apropriados
function assignFor(slug) {
  if (/larissa|isabela|camila|gabriela/.test(slug)) return [TPL.treino_a, TPL.treino_b, TPL.treino_c];
  if (/julia|olivia|daniela|sofia/.test(slug)) return [TPL.cardio_core, TPL.forca_total];
  if (/ana|fernanda|nathalia|patricia/.test(slug)) return [TPL.gluteo_forte, TPL.cardio_core, TPL.treino_c];
  if (/beatriz|eduarda|raquel|karen/.test(slug)) return [TPL.cardio_core, TPL.gluteo_forte];
  return [TPL.forca_total, TPL.treino_c];
}

const studentWorkouts = []; // { studentId, workoutId, templateId, itemIds[] }
WITH_WORKOUTS.forEach((s, si) => {
  const templates = assignFor(s.slug);
  templates.forEach((tplId, ti) => {
    const newId = `44444444-dddd-4000-8000-${String(si).padStart(4, "0")}${String(ti).padStart(8, "0")}`;
    const tpl = TEMPLATES.find((t) => t.id === tplId);
    lines.push(
      `INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES (${q(newId)}, ${q(TENANT)}, ${q(s.id)}, ${q(tpl.title)}, ${q(tpl.description)}, ARRAY[${[1, 3, 5].slice(0, 3 - ti).join(",")}]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;`
    );
    // copia items (ID único — uuid v4 manual derivado de si+ti+idx)
    const itemIds = [];
    tpl.items.forEach((it, idx) => {
      const [exId, sets, reps, rest, notes] = it;
      const hex = (n, len) => n.toString(16).padStart(len, "0");
      const itemId = `55555555-eeee-4000-8000-${hex(si, 4)}${hex(ti, 2)}${hex(idx, 6)}`;
      itemIds.push(itemId);
      const mode = reps && /^\d+$/.test(String(reps)) && Number(reps) >= 30 ? "seconds" : "reps";
      lines.push(
        `INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES (${q(itemId)}, ${q(newId)}, ${q(exId)}, ${idx + 1}, ${sets}, ${q(reps)}, ${rest}, ${q(notes)}, ${q(mode)})
ON CONFLICT (id) DO NOTHING;`
      );
    });
    studentWorkouts.push({ studentId: s.id, workoutId: newId, templateId: tplId, items: tpl.items, itemIds });
  });
});
lines.push("");

// -------------------- workout_logs + exercise_logs --------------------
lines.push("-- ============ WORKOUT_LOGS (~80) + EXERCISE_LOGS ============");
// Distribuição:
// - 5 alunas com streak ativo de 5+ dias consecutivos (treinaram dias -1, -2, -3, -4, -5)
// - 8 alunas treinaram nos últimos 7 dias (espalhado)
// - 4 alunas inativas há 10+ dias
// Total ~80 logs
const STREAK_STUDENTS = WITH_WORKOUTS.slice(0, 5); // primeiras 5
const RECENT_STUDENTS = WITH_WORKOUTS.slice(5, 13); // próximas 8
const INACTIVE_STUDENTS = WITH_WORKOUTS.slice(13, 16); // 3 inativas (4ª = inactive sem ter logs)

let logIdx = 0;
function makeLog(studentId, workoutInfo, daysOffset, hour, dur, rpe, completed = true) {
  logIdx++;
  const logId = `66666666-7777-4000-8000-${String(logIdx).padStart(12, "0")}`;
  const startedAt = daysAgoAt(daysOffset, hour, 0);
  const completedAt = completed ? daysAgoAt(daysOffset, hour, dur) : null;
  // exercise_logs: 60% dos sets de items aleatórios
  const items = workoutInfo.items;
  const numItemsToLog = Math.ceil(items.length * 0.7);
  const exLogStmts = [];
  for (let idx = 0; idx < numItemsToLog; idx++) {
    const it = items[idx];
    const [exId, sets, reps] = it;
    const itemId = workoutInfo.itemIds[idx];
    const numSets = Math.max(2, Math.ceil(sets * 0.7));
    for (let setN = 1; setN <= numSets; setN++) {
      const repsDone = /^\d+$/.test(String(reps)) ? Number(reps) : between(8, 12);
      const load = betweenF(5, 60, 1);
      exLogStmts.push(
        `(${q(logId)}, ${q(itemId)}, ${setN}, ${repsDone}, ${load})`
      );
    }
  }
  const exLogSql = exLogStmts.length
    ? `INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ${exLogStmts.join(", ")} ON CONFLICT DO NOTHING;`
    : "";
  return [
    `INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES (${q(logId)}, ${q(TENANT)}, ${q(workoutInfo.workoutId)}, ${q(studentId)}, ${ts(startedAt)}, ${ts(completedAt)}, ${dur}, ${rpe}, ${q(pick(["Treino completo!", "Pesado mas saiu.", "Foi top hoje.", null, "Cabeça boa, treino bom.", null]))})
ON CONFLICT (id) DO NOTHING;`,
    exLogSql,
  ].filter(Boolean);
}

// streak: 5 alunas, 6 logs cada (últimos 6 dias)
STREAK_STUDENTS.forEach((s) => {
  const sw = studentWorkouts.filter((x) => x.studentId === s.id);
  if (sw.length === 0) return;
  for (let d = 1; d <= 6; d++) {
    const w = sw[d % sw.length];
    lines.push(
      ...makeLog(s.id, w, d, 6 + (d % 12), between(45, 70), between(6, 8))
    );
  }
});

// recent (últimos 7 dias, espalhados): 8 alunas, 4-5 logs cada
RECENT_STUDENTS.forEach((s, idx) => {
  const sw = studentWorkouts.filter((x) => x.studentId === s.id);
  if (sw.length === 0) return;
  const offsets = [2, 5, 8, 12, 18];
  offsets.forEach((d, k) => {
    const w = sw[k % sw.length];
    lines.push(
      ...makeLog(s.id, w, d + idx, 7 + (k * 2 % 12), between(35, 75), between(4, 9))
    );
  });
});

// inactive: 3 alunas, último log há 12+ dias
INACTIVE_STUDENTS.forEach((s, idx) => {
  const sw = studentWorkouts.filter((x) => x.studentId === s.id);
  if (sw.length === 0) return;
  // 2 logs antigos
  [25 + idx * 3, 35 + idx * 3].forEach((d, k) => {
    const w = sw[k % sw.length];
    lines.push(
      ...makeLog(s.id, w, d, 8, between(30, 50), between(3, 6))
    );
  });
});

// + extra: distribuir mais ~30 logs aleatórios entre 30-60 dias atrás pra encher histórico
WITH_WORKOUTS.forEach((s, si) => {
  const sw = studentWorkouts.filter((x) => x.studentId === s.id);
  if (sw.length === 0) return;
  const extras = si < 12 ? 3 : 1;
  for (let k = 0; k < extras; k++) {
    const w = sw[k % sw.length];
    const d = between(30, 60);
    lines.push(
      ...makeLog(s.id, w, d, 7 + (k % 10), between(40, 70), between(4, 8))
    );
  }
});
lines.push("");

// -------------------- community posts --------------------
lines.push("-- ============ COMMUNITY POSTS (8 do owner) ============");
const POSTS = [
  { id: "77777777-1111-4000-8000-000000000001", content: "Bora começar a semana com pé direito 🔥 Quem treina hoje?", days: 0, pinned: true },
  { id: "77777777-1111-4000-8000-000000000002", content: "Lembrete: hidratação + descanso = resultado. Treinar bem é metade. Recuperar é a outra metade.", days: 2 },
  { id: "77777777-1111-4000-8000-000000000003", content: "Vídeo novo de agachamento livre subindo amanhã. Vou explicar tudo: pegada, profundidade, e o erro que 80% comete.", days: 4 },
  { id: "77777777-1111-4000-8000-000000000004", content: "Aula experimental aberta sábado pra quem quer testar antes de assinar. Chama na DM 💬", days: 7, pinned: true },
  { id: "77777777-1111-4000-8000-000000000005", content: "Foco no processo, resultado vem como consequência. Ninguém vira monstro em 30 dias — vira em 3 anos de consistência.", days: 11 },
  { id: "77777777-1111-4000-8000-000000000006", content: "Indica uma amiga e ganha 10% no próximo plano 🎯 Compartilha esse post e vamo crescer juntas!", days: 16 },
  { id: "77777777-1111-4000-8000-000000000007", content: "Quem completou treino hoje, comenta aí 💪 Vou puxar a orelha de quem tá sumido.", days: 22 },
  { id: "77777777-1111-4000-8000-000000000008", content: "Lesão é o pior atalho. Forma > carga sempre. Se a técnica tá feia, abaixa o peso.", days: 27 },
];
POSTS.forEach((p) => {
  lines.push(
    `INSERT INTO community_posts (id, tenant_id, author_id, content, pinned, published_at, created_at)
VALUES (${q(p.id)}, ${q(TENANT)}, ${q(OWNER)}, ${q(p.content)}, ${b(p.pinned || false)}, ${ts(daysAgo(p.days))}, ${ts(daysAgo(p.days))})
ON CONFLICT (id) DO NOTHING;`
  );
});
lines.push("");

// reactions
lines.push("-- reactions: 5-15 por post, mix dos 5 tipos");
const REACTIONS = ["like", "fire", "muscle", "clap", "heart"];
POSTS.forEach((p) => {
  const numR = between(5, 15);
  const used = new Set();
  for (let k = 0; k < numR; k++) {
    let s;
    do { s = pick(STUDENTS); } while (used.has(s.id));
    used.add(s.id);
    if (used.size >= STUDENTS.length) break;
    lines.push(
      `INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT ${q(p.id)}, ${q(s.id)}, ${q(pick(REACTIONS))}, ${ts(daysAgo(Math.max(0, p.days - between(0, 3))))}
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = ${q(p.id)} AND user_id = ${q(s.id)});`
    );
  }
});
lines.push("");

// comments
lines.push("-- comments: 2-6 por post, vindos das alunas");
const COMMENTS = [
  "tô dentro!", "amei a aula de ontem", "pode crer", "bora!", "treino marcado pra hoje à noite 💪",
  "obrigada pelo lembrete prof 🙏", "concordo demais!", "vou indicar minha irmã", "foi pesado mas saiu",
  "glúteo de aço hoje 🍑", "dia de descansar, amanhã volto com tudo", "completei sim, prof!",
  "meta da semana batida", "tô amando os resultados", "essa frase eu vou guardar",
];
POSTS.forEach((p) => {
  const numC = between(2, 6);
  for (let k = 0; k < numC; k++) {
    const s = pick(STUDENTS);
    const commentId = `88888888-2222-4000-8000-${p.id.slice(-4)}${String(k).padStart(8, "0")}`;
    lines.push(
      `INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES (${q(commentId)}, ${q(p.id)}, ${q(s.id)}, ${q(pick(COMMENTS))}, ${ts(daysAgo(Math.max(0, p.days - between(0, 2))))})
ON CONFLICT (id) DO NOTHING;`
    );
  }
});
lines.push("");

// -------------------- referrals --------------------
lines.push("-- ============ REFERRALS (5) ============");
const refPairs = [
  [STUDENTS[0].id, STUDENTS[3].id, "rewarded"],
  [STUDENTS[2].id, STUDENTS[7].id, "rewarded"],
  [STUDENTS[5].id, STUDENTS[10].id, "active"],
  [STUDENTS[1].id, STUDENTS[14].id, "active"],
  [STUDENTS[8].id, STUDENTS[12].id, "active"],
];
refPairs.forEach(([from, to, status], i) => {
  const refId = `99999999-3333-4000-8000-${String(i).padStart(12, "0")}`;
  const rewardedAt = status === "rewarded" ? ts(daysAgo(between(5, 20))) : "NULL";
  lines.push(
    `INSERT INTO referrals (id, tenant_id, referrer_id, referred_id, status, reward_label, rewarded_at, created_at)
VALUES (${q(refId)}, ${q(TENANT)}, ${q(from)}, ${q(to)}, ${q(status)}, '10% no próximo plano', ${rewardedAt}, ${ts(daysAgo(between(20, 60)))})
ON CONFLICT (id) DO NOTHING;`
  );
});
lines.push("");

// -------------------- personal records --------------------
lines.push("-- ============ PERSONAL RECORDS (~15) ============");
const PR_EX = [
  ["Agachamento livre", 30, 35], ["Agachamento livre", 40, 45], ["Supino reto", 20, 22.5],
  ["Hip thrust", 60, 70], ["Hip thrust", 50, 60], ["Leg press 45°", 100, 120],
  ["Stiff", 30, 35], ["Remada curvada", 25, 27.5], ["Desenvolvimento com halteres", 10, 12],
  ["Rosca direta", 12, 14], ["Tríceps na polia", 20, 22.5], ["Cadeira extensora", 35, 40],
  ["Mesa flexora", 30, 32.5], ["Crucifixo na máquina", 25, 27.5], ["Levantamento terra romeno", 40, 45],
];
PR_EX.forEach((pr, i) => {
  const [name, prev, max] = pr;
  const s = STUDENTS[i % 8]; // distribui entre 8 primeiras
  const prId = `aaaaaaaa-4444-4000-8000-${String(i).padStart(12, "0")}`;
  lines.push(
    `INSERT INTO personal_records (id, tenant_id, user_id, exercise_name, prev_max, new_max, achieved_at)
VALUES (${q(prId)}, ${q(TENANT)}, ${q(s.id)}, ${q(name)}, ${prev}, ${max}, ${ts(daysAgo(between(1, 30)))})
ON CONFLICT (id) DO NOTHING;`
  );
});
lines.push("");

// -------------------- strength_snapshots --------------------
lines.push("-- ============ STRENGTH SNAPSHOTS (6 alunas × 30 dias) ============");
// IDs determinísticos
WITH_WORKOUTS.slice(0, 6).forEach((s, si) => {
  // valores iniciais variam por aluna
  const startVals = {
    chest: 40 + si * 3,
    back: 38 + si * 4,
    legs: 50 + si * 3,
    shoulders: 35 + si * 3,
    arms: 32 + si * 4,
    core: 45 + si * 2,
  };
  for (let d = 30; d >= 1; d--) {
    const progress = (30 - d) / 30; // 0..1
    const noise = () => Math.round((r() - 0.5) * 4);
    const sChest = Math.min(99, Math.round(startVals.chest + progress * 18 + noise()));
    const sBack = Math.min(99, Math.round(startVals.back + progress * 17 + noise()));
    const sLegs = Math.min(99, Math.round(startVals.legs + progress * 22 + noise()));
    const sSh = Math.min(99, Math.round(startVals.shoulders + progress * 15 + noise()));
    const sArms = Math.min(99, Math.round(startVals.arms + progress * 16 + noise()));
    const sCore = Math.min(99, Math.round(startVals.core + progress * 12 + noise()));
    const date = new Date(now.getTime() - d * 86400000).toISOString().slice(0, 10);
    lines.push(
      `INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES (${q(TENANT)}, ${q(s.id)}, '${date}', ${sChest}, ${sBack}, ${sLegs}, ${sSh}, ${sArms}, ${sCore})
ON CONFLICT (user_id, snapshot_date) DO NOTHING;`
    );
  }
});
lines.push("");

// -------------------- push_subscriptions --------------------
lines.push("-- ============ PUSH SUBSCRIPTIONS (5 alunas) ============");
WITH_WORKOUTS.slice(0, 5).forEach((s, i) => {
  const endpoint = `https://fcm.googleapis.com/fcm/send/seed-${s.id.slice(0, 8)}-${i}`;
  lines.push(
    `INSERT INTO push_subscriptions (user_id, tenant_id, endpoint, p256dh, auth, user_agent)
VALUES (${q(s.id)}, ${q(TENANT)}, ${q(endpoint)}, ${q("BNc" + Buffer.from(s.id.slice(0, 8) + "p256").toString("base64").slice(0, 80))}, ${q(Buffer.from(s.id.slice(0, 8) + "auth").toString("base64").slice(0, 22))}, 'Mozilla/5.0 seed')
ON CONFLICT (endpoint) DO NOTHING;`
  );
});
lines.push("");

// -------------------- badges_earned --------------------
lines.push("-- ============ BADGES EARNED ============");
const badgeAssign = (slugs, key) => slugs.forEach((slug) => {
  const s = STUDENTS.find((x) => x.slug === slug);
  if (!s) return;
  lines.push(
    `INSERT INTO badges_earned (user_id, tenant_id, badge_key, earned_at)
SELECT ${q(s.id)}, ${q(TENANT)}, ${q(key)}, ${ts(daysAgo(between(1, 60)))}
WHERE NOT EXISTS (SELECT 1 FROM badges_earned WHERE user_id = ${q(s.id)} AND badge_key = ${q(key)});`
  );
});

// 12 com first-workout
badgeAssign(STUDENTS.slice(0, 12).map((s) => s.slug), "first-workout");
// 5 com streak-3
badgeAssign(STUDENTS.slice(0, 5).map((s) => s.slug), "streak-3");
// 3 com streak-7
badgeAssign(STUDENTS.slice(0, 3).map((s) => s.slug), "streak-7");
// 2 com 10-workouts
badgeAssign(STUDENTS.slice(0, 2).map((s) => s.slug), "10-workouts");
// 1 com streak-30
badgeAssign([STUDENTS[0].slug], "streak-30");
// 4 com pr-load
badgeAssign(STUDENTS.slice(0, 4).map((s) => s.slug), "pr-load");
lines.push("");

lines.push("COMMIT;");
lines.push("");
lines.push("-- =====================================================================");
lines.push("-- VALIDATION");
lines.push("-- =====================================================================");
lines.push(`-- select count(*) as alunas from profiles where tenant_id='${TENANT}' and role='student';`);
lines.push(`-- select count(*) as workouts from workouts where tenant_id='${TENANT}';`);
lines.push(`-- select count(*) as logs from workout_logs where tenant_id='${TENANT}' and completed_at is not null;`);
lines.push(`-- select count(*) as posts from community_posts where tenant_id='${TENANT}';`);
lines.push(`-- select count(*) as anamneses from anamneses where tenant_id='${TENANT}';`);

const sql = lines.join("\n");
writeFileSync(new URL("./seed-demo.sql", import.meta.url), sql, "utf8");
console.log(`Wrote ${lines.length} lines / ${sql.length} chars to scripts/seed-demo.sql`);
