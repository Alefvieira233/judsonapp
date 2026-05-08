// scripts/seed-demo-create-users.mjs
// Cria 20 auth.users "fantasma" para o seed populacional do demo Judson.
// Idempotente: se o email já existe, pula a criação e reaproveita o id.
// Uso: node scripts/seed-demo-create-users.mjs > scripts/seed-demo-users.json

import { readFileSync } from "node:fs";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const SUPABASE_URL = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim();
const SR = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim();

if (!SUPABASE_URL || !SR) {
  console.error("Missing SUPABASE_URL or SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const STUDENTS = [
  { slug: "ana-carolina-souza", full_name: "Ana Carolina Souza", goal: "Emagrecer e tonificar pernas e glúteos" },
  { slug: "beatriz-almeida", full_name: "Beatriz Almeida", goal: "Voltar a treinar pós-cesárea com segurança" },
  { slug: "camila-ribeiro", full_name: "Camila Ribeiro", goal: "Hipertrofia de membros inferiores" },
  { slug: "daniela-costa", full_name: "Daniela Costa", goal: "Correr 10k em 3 meses" },
  { slug: "eduarda-martins", full_name: "Eduarda Martins", goal: "Pós-parto, perda de peso saudável" },
  { slug: "fernanda-oliveira", full_name: "Fernanda Oliveira", goal: "Definir abdômen e melhorar postura" },
  { slug: "gabriela-pinheiro", full_name: "Gabriela Pinheiro", goal: "Ganho de força e condicionamento" },
  { slug: "helena-vasconcelos", full_name: "Helena Vasconcelos", goal: "Saúde geral e controle de ansiedade" },
  { slug: "isabela-carvalho", full_name: "Isabela Carvalho", goal: "Competição fisiculturismo iniciante" },
  { slug: "julia-mendes", full_name: "Júlia Mendes", goal: "Crossfit, melhorar performance e mobilidade" },
  { slug: "karen-lima", full_name: "Karen Lima", goal: "Voltar a treinar após lesão no joelho" },
  { slug: "larissa-santos", full_name: "Larissa Santos", goal: "Hipertrofia + ganho de peso" },
  { slug: "mariana-ferreira", full_name: "Mariana Ferreira", goal: "Flexibilidade e fortalecimento de core" },
  { slug: "nathalia-barros", full_name: "Nathália Barros", goal: "Emagrecimento sustentável" },
  { slug: "olivia-cardoso", full_name: "Olívia Cardoso", goal: "Corrida + musculação combinada" },
  { slug: "patricia-nunes", full_name: "Patrícia Nunes", goal: "Tonificação pós-50, qualidade de vida" },
  { slug: "raquel-tavares", full_name: "Raquel Tavares", goal: "Postura e alívio de dor lombar" },
  { slug: "sofia-andrade", full_name: "Sofia Andrade", goal: "Preparo físico para dança" },
  { slug: "tatiana-rezende", full_name: "Tatiana Rezende", goal: "Saúde cardiovascular" },
  { slug: "vanessa-moraes", full_name: "Vanessa Moraes", goal: "Força funcional e mobilidade" },
];

// O endpoint /admin/users não filtra por email via query string,
// então paginamos e fazemos match cliente.
let _cache = null;
async function loadAllUsers() {
  if (_cache) return _cache;
  const all = [];
  let page = 1;
  const perPage = 1000;
  while (true) {
    const url = `${SUPABASE_URL}/auth/v1/admin/users?page=${page}&per_page=${perPage}`;
    const res = await fetch(url, {
      headers: { apikey: SR, Authorization: `Bearer ${SR}` },
    });
    if (!res.ok) throw new Error(`list users failed ${res.status}`);
    const data = await res.json();
    const arr = data?.users || [];
    all.push(...arr);
    if (arr.length < perPage) break;
    page += 1;
    if (page > 20) break;
  }
  _cache = all;
  return all;
}

async function findExisting(email) {
  const all = await loadAllUsers();
  const u = all.find((x) => (x.email || "").toLowerCase() === email.toLowerCase());
  return u?.id || null;
}

async function createUser(email, fullName) {
  const url = `${SUPABASE_URL}/auth/v1/admin/users`;
  const password = `seed-${Math.random().toString(36).slice(2, 12)}-${Math.random().toString(36).slice(2, 8)}`;
  const body = {
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, seeded: true },
  };
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SR,
      Authorization: `Bearer ${SR}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    // Caso já exista por race, tenta achar
    if (res.status === 422 || /already.*registered|exists/i.test(txt)) {
      const id = await findExisting(email);
      if (id) return id;
    }
    throw new Error(`createUser failed (${res.status}): ${txt}`);
  }
  const data = await res.json();
  return data.id || data.user?.id;
}

const out = [];
for (const s of STUDENTS) {
  const email = `aluna+seed-${s.slug}@judsonlobato.local`;
  let id = await findExisting(email);
  if (!id) id = await createUser(email, s.full_name);
  out.push({ ...s, email, id });
  process.stderr.write(`. ${s.full_name} -> ${id}\n`);
}

process.stdout.write(JSON.stringify(out, null, 2));
