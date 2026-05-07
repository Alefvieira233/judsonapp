-- ─────────────────────────────────────────────────────────────────────────────
-- 0002_seed.sql — Tenant Judson Lobato + biblioteca pública de 50 exercícios
-- Exercícios públicos têm tenant_id = NULL e ficam disponíveis a qualquer tenant
-- (incluindo futuros tenants do SaaS).
-- ─────────────────────────────────────────────────────────────────────────────

-- ── TENANT: Judson Lobato ───────────────────────────────────────────────────
insert into tenants (
  slug, name, bio, tagline,
  brand_color, brand_color_dark,
  whatsapp_number, instagram_handle, cref, city,
  consultation_price, consultation_pitch
) values (
  'judsonlobato',
  'Judson Lobato',
  'Personal trainer há 16 anos. CREF 002133-G/AP. Atleta e técnico de natação. Faz o teu que eu faço o meu.',
  'Faz o teu que eu faço o meu.',
  '#DC2626',
  '#991B1B',
  '+5596000000000',
  'judsonlobato',
  '002133-G/AP',
  'Macapá - AP',
  'A partir de R$ 300/mês',
  'Treino + acompanhamento via WhatsApp + comunidade exclusiva'
);

-- ── BIBLIOTECA PÚBLICA DE EXERCÍCIOS ────────────────────────────────────────
insert into exercises (tenant_id, name, muscle_group, equipment) values
  -- Peito (6)
  (null, 'Supino reto com barra',           'peito',        'barra'),
  (null, 'Supino inclinado com halteres',   'peito',        'halteres'),
  (null, 'Supino declinado com barra',      'peito',        'barra'),
  (null, 'Crucifixo na máquina (peck deck)','peito',        'máquina'),
  (null, 'Crossover na polia',              'peito',        'polia'),
  (null, 'Flexão de braço',                 'peito',        'peso corporal'),

  -- Costas (7)
  (null, 'Puxada frente na polia',          'costas',       'polia'),
  (null, 'Puxada atrás na polia',           'costas',       'polia'),
  (null, 'Remada curvada com barra',        'costas',       'barra'),
  (null, 'Remada cavalinho (T-bar)',        'costas',       'barra'),
  (null, 'Remada baixa na polia',           'costas',       'polia'),
  (null, 'Remada unilateral com halter',    'costas',       'halteres'),
  (null, 'Barra fixa (pull-up)',            'costas',       'peso corporal'),

  -- Ombro (5)
  (null, 'Desenvolvimento militar com barra','ombro',       'barra'),
  (null, 'Desenvolvimento com halteres',    'ombro',        'halteres'),
  (null, 'Elevação lateral com halteres',   'ombro',        'halteres'),
  (null, 'Elevação frontal com halteres',   'ombro',        'halteres'),
  (null, 'Crucifixo invertido (rear delt)', 'ombro',        'máquina'),

  -- Bíceps (5)
  (null, 'Rosca direta com barra',          'bíceps',       'barra'),
  (null, 'Rosca alternada com halteres',    'bíceps',       'halteres'),
  (null, 'Rosca martelo',                   'bíceps',       'halteres'),
  (null, 'Rosca scott',                     'bíceps',       'banco scott'),
  (null, 'Rosca concentrada',               'bíceps',       'halteres'),

  -- Tríceps (5)
  (null, 'Tríceps na polia (corda)',        'tríceps',      'polia'),
  (null, 'Tríceps testa com barra',         'tríceps',      'barra'),
  (null, 'Tríceps francês com halter',      'tríceps',      'halteres'),
  (null, 'Mergulho no banco',               'tríceps',      'peso corporal'),
  (null, 'Tríceps coice com halter',        'tríceps',      'halteres'),

  -- Quadríceps (5)
  (null, 'Agachamento livre com barra',     'quadríceps',   'barra'),
  (null, 'Leg press 45°',                   'quadríceps',   'máquina'),
  (null, 'Cadeira extensora',               'quadríceps',   'máquina'),
  (null, 'Hack squat',                      'quadríceps',   'máquina'),
  (null, 'Avanço (afundo) com halteres',    'quadríceps',   'halteres'),

  -- Posterior de coxa (4)
  (null, 'Stiff com barra',                 'posterior',    'barra'),
  (null, 'Mesa flexora',                    'posterior',    'máquina'),
  (null, 'Cadeira flexora',                 'posterior',    'máquina'),
  (null, 'Levantamento terra romeno',       'posterior',    'barra'),

  -- Glúteo (4)
  (null, 'Hip thrust com barra',            'glúteo',       'barra'),
  (null, 'Elevação pélvica na máquina',     'glúteo',       'máquina'),
  (null, 'Cadeira abdutora',                'glúteo',       'máquina'),
  (null, 'Coice na polia',                  'glúteo',       'polia'),

  -- Panturrilha (3)
  (null, 'Panturrilha em pé na máquina',    'panturrilha',  'máquina'),
  (null, 'Panturrilha sentado',             'panturrilha',  'máquina'),
  (null, 'Panturrilha no leg press',        'panturrilha',  'máquina'),

  -- Abdômen (6)
  (null, 'Abdominal supra (crunch)',        'abdômen',      'peso corporal'),
  (null, 'Abdominal infra (elevação de pernas)','abdômen',  'peso corporal'),
  (null, 'Prancha frontal',                 'abdômen',      'peso corporal'),
  (null, 'Prancha lateral',                 'abdômen',      'peso corporal'),
  (null, 'Abdominal na polia (rope crunch)','abdômen',      'polia'),
  (null, 'Russian twist com halter',        'abdômen',      'halteres');
