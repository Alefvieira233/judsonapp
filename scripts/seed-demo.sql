-- =====================================================================
-- seed-demo.sql — população demo do tenant Judson Lobato
-- Idempotente: roda 2x sem duplicar (ON CONFLICT DO NOTHING / WHERE NOT EXISTS).
-- Pré-requisito: 20 auth.users criados via scripts/seed-demo-create-users.mjs
-- Tenant: 918ed85f-e58a-4edf-bb1b-761f032e0019
-- Owner (Judson primary): a7a1ed0a-937c-4de0-8071-e89a443930c5
-- Gerado em 2026-05-08T12:00:00.000Z
-- =====================================================================

BEGIN;

-- ============ PROFILES ============
INSERT INTO profiles (id, tenant_id, role, full_name, email, phone, goal, observations, joined_at, active, share_in_leaderboard)
VALUES ('fa7f2a60-2a89-4db0-b23f-54998359ad57', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'student', 'Ana Carolina Souza', 'aluna+seed-ana-carolina-souza@judsonlobato.local', '+559891000007', 'Emagrecer e tonificar pernas e glúteos', 'Acordada antes das 6h, melhor janela é cedo.', '2026-01-17T12:00:00.000Z'::timestamptz, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO profiles (id, tenant_id, role, full_name, email, phone, goal, observations, joined_at, active, share_in_leaderboard)
VALUES ('72834f17-0e60-435f-9d40-05dd2e7d2dd4', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'student', 'Beatriz Almeida', 'aluna+seed-beatriz-almeida@judsonlobato.local', '+559891000020', 'Voltar a treinar pós-cesárea com segurança', 'Histórico de sedentarismo, paciência no início.', '2025-12-04T12:00:00.000Z'::timestamptz, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO profiles (id, tenant_id, role, full_name, email, phone, goal, observations, joined_at, active, share_in_leaderboard)
VALUES ('4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'student', 'Camila Ribeiro', 'aluna+seed-camila-ribeiro@judsonlobato.local', '+559891000033', 'Hipertrofia de membros inferiores', 'Quer evoluir gradualmente, sem pressa.', '2026-04-01T12:00:00.000Z'::timestamptz, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO profiles (id, tenant_id, role, full_name, email, phone, goal, observations, joined_at, active, share_in_leaderboard)
VALUES ('f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'student', 'Daniela Costa', 'aluna+seed-daniela-costa@judsonlobato.local', '+559891000046', 'Correr 10k em 3 meses', 'Quer evoluir gradualmente, sem pressa.', '2026-03-15T12:00:00.000Z'::timestamptz, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO profiles (id, tenant_id, role, full_name, email, phone, goal, observations, joined_at, active, share_in_leaderboard)
VALUES ('95d058d3-5dbd-43ff-ad74-91977c255d34', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'student', 'Eduarda Martins', 'aluna+seed-eduarda-martins@judsonlobato.local', '+559891000059', 'Pós-parto, perda de peso saudável', 'Acordada antes das 6h, melhor janela é cedo.', '2025-12-02T12:00:00.000Z'::timestamptz, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO profiles (id, tenant_id, role, full_name, email, phone, goal, observations, joined_at, active, share_in_leaderboard)
VALUES ('57e67adf-c0a6-427c-8240-002bd0ce2a11', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'student', 'Fernanda Oliveira', 'aluna+seed-fernanda-oliveira@judsonlobato.local', '+559891000072', 'Definir abdômen e melhorar postura', 'Mãe recente, agenda apertada.', '2026-03-19T12:00:00.000Z'::timestamptz, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO profiles (id, tenant_id, role, full_name, email, phone, goal, observations, joined_at, active, share_in_leaderboard)
VALUES ('ed29f6bd-a124-42b8-860f-8a48f4228b95', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'student', 'Gabriela Pinheiro', 'aluna+seed-gabriela-pinheiro@judsonlobato.local', '+559891000085', 'Ganho de força e condicionamento', 'Trabalha sentada, atenção pra postura.', '2025-12-23T12:00:00.000Z'::timestamptz, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO profiles (id, tenant_id, role, full_name, email, phone, goal, observations, joined_at, active, share_in_leaderboard)
VALUES ('ab9768a5-a3a4-4163-bb63-5e771cf173fe', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'student', 'Helena Vasconcelos', 'aluna+seed-helena-vasconcelos@judsonlobato.local', '+559891000098', 'Saúde geral e controle de ansiedade', 'Quer evoluir gradualmente, sem pressa.', '2026-03-28T12:00:00.000Z'::timestamptz, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO profiles (id, tenant_id, role, full_name, email, phone, goal, observations, joined_at, active, share_in_leaderboard)
VALUES ('02420861-f44e-4be0-9f2e-ffcf300add7d', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'student', 'Isabela Carvalho', 'aluna+seed-isabela-carvalho@judsonlobato.local', '+559891000111', 'Competição fisiculturismo iniciante', 'Quer evoluir gradualmente, sem pressa.', '2026-01-02T12:00:00.000Z'::timestamptz, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO profiles (id, tenant_id, role, full_name, email, phone, goal, observations, joined_at, active, share_in_leaderboard)
VALUES ('f08264bc-8c9b-4ae8-a25b-0ca1e0c603b2', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'student', 'Júlia Mendes', 'aluna+seed-julia-mendes@judsonlobato.local', '+559891000124', 'Crossfit, melhorar performance e mobilidade', 'Acordada antes das 6h, melhor janela é cedo.', '2026-05-01T12:00:00.000Z'::timestamptz, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO profiles (id, tenant_id, role, full_name, email, phone, goal, observations, joined_at, active, share_in_leaderboard)
VALUES ('cc659e82-dd94-4de4-9657-3166e7ad37ec', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'student', 'Karen Lima', 'aluna+seed-karen-lima@judsonlobato.local', '+559891000137', 'Voltar a treinar após lesão no joelho', 'Prefere treinar pela manhã.', '2025-12-07T12:00:00.000Z'::timestamptz, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO profiles (id, tenant_id, role, full_name, email, phone, goal, observations, joined_at, active, share_in_leaderboard)
VALUES ('73c55850-2352-4f24-9cd7-73c171d6a012', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'student', 'Larissa Santos', 'aluna+seed-larissa-santos@judsonlobato.local', '+559891000150', 'Hipertrofia + ganho de peso', 'Prefere treinar pela manhã.', '2026-01-18T12:00:00.000Z'::timestamptz, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO profiles (id, tenant_id, role, full_name, email, phone, goal, observations, joined_at, active, share_in_leaderboard)
VALUES ('22304a85-7ce5-4bbc-b9c6-420edb71203a', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'student', 'Mariana Ferreira', 'aluna+seed-mariana-ferreira@judsonlobato.local', '+559891000163', 'Flexibilidade e fortalecimento de core', 'Prefere treinar pela manhã.', '2026-03-16T12:00:00.000Z'::timestamptz, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO profiles (id, tenant_id, role, full_name, email, phone, goal, observations, joined_at, active, share_in_leaderboard)
VALUES ('95795cb4-e6c9-485b-8c07-656108993343', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'student', 'Nathália Barros', 'aluna+seed-nathalia-barros@judsonlobato.local', '+559891000176', 'Emagrecimento sustentável', 'Atleta amadora, gosta de desafio.', '2026-03-30T12:00:00.000Z'::timestamptz, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO profiles (id, tenant_id, role, full_name, email, phone, goal, observations, joined_at, active, share_in_leaderboard)
VALUES ('6fc4ba15-472a-46ef-8f33-98d933723437', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'student', 'Olívia Cardoso', 'aluna+seed-olivia-cardoso@judsonlobato.local', '+559891000189', 'Corrida + musculação combinada', 'Prefere treinar pela manhã.', '2026-01-29T12:00:00.000Z'::timestamptz, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO profiles (id, tenant_id, role, full_name, email, phone, goal, observations, joined_at, active, share_in_leaderboard)
VALUES ('111eca04-631d-4fbe-a9ef-0506487fc459', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'student', 'Patrícia Nunes', 'aluna+seed-patricia-nunes@judsonlobato.local', '+559891000202', 'Tonificação pós-50, qualidade de vida', 'Atleta amadora, gosta de desafio.', '2026-04-01T12:00:00.000Z'::timestamptz, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO profiles (id, tenant_id, role, full_name, email, phone, goal, observations, joined_at, active, share_in_leaderboard)
VALUES ('b2895e21-3ef6-494a-bce9-ab9af4e68234', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'student', 'Raquel Tavares', 'aluna+seed-raquel-tavares@judsonlobato.local', '+559891000215', 'Postura e alívio de dor lombar', 'Atleta amadora, gosta de desafio.', '2026-02-06T12:00:00.000Z'::timestamptz, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO profiles (id, tenant_id, role, full_name, email, phone, goal, observations, joined_at, active, share_in_leaderboard)
VALUES ('852695a0-6c02-457f-a958-045d11e66862', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'student', 'Sofia Andrade', 'aluna+seed-sofia-andrade@judsonlobato.local', '+559891000228', 'Preparo físico para dança', 'Acordada antes das 6h, melhor janela é cedo.', '2026-03-07T12:00:00.000Z'::timestamptz, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO profiles (id, tenant_id, role, full_name, email, phone, goal, observations, joined_at, active, share_in_leaderboard)
VALUES ('fedbf236-5041-40f4-bf20-266db8d5cfa8', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'student', 'Tatiana Rezende', 'aluna+seed-tatiana-rezende@judsonlobato.local', '+559891000241', 'Saúde cardiovascular', 'Prefere treinar pela manhã.', '2026-04-25T12:00:00.000Z'::timestamptz, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO profiles (id, tenant_id, role, full_name, email, phone, goal, observations, joined_at, active, share_in_leaderboard)
VALUES ('2abacf0a-9452-4120-81e1-0c3cd3bfffc3', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'student', 'Vanessa Moraes', 'aluna+seed-vanessa-moraes@judsonlobato.local', '+559891000254', 'Força funcional e mobilidade', 'Quer evoluir gradualmente, sem pressa.', '2026-01-25T12:00:00.000Z'::timestamptz, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 12 alunas com plano (mix), 8 sem plano
UPDATE profiles SET current_plan_id = '1b7c3ac0-8790-448d-8a95-78d6ca8c234c' WHERE id = 'fa7f2a60-2a89-4db0-b23f-54998359ad57' AND current_plan_id IS NULL;
UPDATE profiles SET current_plan_id = '1b7c3ac0-8790-448d-8a95-78d6ca8c234c' WHERE id = '72834f17-0e60-435f-9d40-05dd2e7d2dd4' AND current_plan_id IS NULL;
UPDATE profiles SET current_plan_id = '1b7c3ac0-8790-448d-8a95-78d6ca8c234c' WHERE id = '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4' AND current_plan_id IS NULL;
UPDATE profiles SET current_plan_id = '1b7c3ac0-8790-448d-8a95-78d6ca8c234c' WHERE id = 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc' AND current_plan_id IS NULL;
UPDATE profiles SET current_plan_id = '18c5968d-3611-4cf9-9c16-e045d96a70f9' WHERE id = '95d058d3-5dbd-43ff-ad74-91977c255d34' AND current_plan_id IS NULL;
UPDATE profiles SET current_plan_id = '18c5968d-3611-4cf9-9c16-e045d96a70f9' WHERE id = '57e67adf-c0a6-427c-8240-002bd0ce2a11' AND current_plan_id IS NULL;
UPDATE profiles SET current_plan_id = '18c5968d-3611-4cf9-9c16-e045d96a70f9' WHERE id = 'ed29f6bd-a124-42b8-860f-8a48f4228b95' AND current_plan_id IS NULL;
UPDATE profiles SET current_plan_id = '18c5968d-3611-4cf9-9c16-e045d96a70f9' WHERE id = 'ab9768a5-a3a4-4163-bb63-5e771cf173fe' AND current_plan_id IS NULL;
UPDATE profiles SET current_plan_id = '95cffeb6-45e5-4536-b12a-ff36c8350d51' WHERE id = '02420861-f44e-4be0-9f2e-ffcf300add7d' AND current_plan_id IS NULL;
UPDATE profiles SET current_plan_id = '95cffeb6-45e5-4536-b12a-ff36c8350d51' WHERE id = 'f08264bc-8c9b-4ae8-a25b-0ca1e0c603b2' AND current_plan_id IS NULL;
UPDATE profiles SET current_plan_id = '95cffeb6-45e5-4536-b12a-ff36c8350d51' WHERE id = 'cc659e82-dd94-4de4-9657-3166e7ad37ec' AND current_plan_id IS NULL;
UPDATE profiles SET current_plan_id = '95cffeb6-45e5-4536-b12a-ff36c8350d51' WHERE id = '73c55850-2352-4f24-9cd7-73c171d6a012' AND current_plan_id IS NULL;

-- ============ CONSENTS (LGPD) ============
INSERT INTO consents (user_id, tenant_id, policy_version, terms_version, accepted_at, ip, user_agent, context)
SELECT 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '918ed85f-e58a-4edf-bb1b-761f032e0019', '2025-01-15', '2025-01-15', '2026-03-20T12:00:00.000Z'::timestamptz, '203.0.113.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', 'invite'
WHERE NOT EXISTS (SELECT 1 FROM consents WHERE user_id = 'fa7f2a60-2a89-4db0-b23f-54998359ad57');
INSERT INTO consents (user_id, tenant_id, policy_version, terms_version, accepted_at, ip, user_agent, context)
SELECT '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '918ed85f-e58a-4edf-bb1b-761f032e0019', '2025-01-15', '2025-01-15', '2026-01-09T12:00:00.000Z'::timestamptz, '203.0.113.2', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', 'invite'
WHERE NOT EXISTS (SELECT 1 FROM consents WHERE user_id = '72834f17-0e60-435f-9d40-05dd2e7d2dd4');
INSERT INTO consents (user_id, tenant_id, policy_version, terms_version, accepted_at, ip, user_agent, context)
SELECT '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '918ed85f-e58a-4edf-bb1b-761f032e0019', '2025-01-15', '2025-01-15', '2026-03-26T12:00:00.000Z'::timestamptz, '203.0.113.3', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', 'invite'
WHERE NOT EXISTS (SELECT 1 FROM consents WHERE user_id = '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4');
INSERT INTO consents (user_id, tenant_id, policy_version, terms_version, accepted_at, ip, user_agent, context)
SELECT 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '918ed85f-e58a-4edf-bb1b-761f032e0019', '2025-01-15', '2025-01-15', '2026-03-10T12:00:00.000Z'::timestamptz, '203.0.113.4', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', 'invite'
WHERE NOT EXISTS (SELECT 1 FROM consents WHERE user_id = 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc');
INSERT INTO consents (user_id, tenant_id, policy_version, terms_version, accepted_at, ip, user_agent, context)
SELECT '95d058d3-5dbd-43ff-ad74-91977c255d34', '918ed85f-e58a-4edf-bb1b-761f032e0019', '2025-01-15', '2025-01-15', '2025-12-24T12:00:00.000Z'::timestamptz, '203.0.113.5', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', 'invite'
WHERE NOT EXISTS (SELECT 1 FROM consents WHERE user_id = '95d058d3-5dbd-43ff-ad74-91977c255d34');
INSERT INTO consents (user_id, tenant_id, policy_version, terms_version, accepted_at, ip, user_agent, context)
SELECT '57e67adf-c0a6-427c-8240-002bd0ce2a11', '918ed85f-e58a-4edf-bb1b-761f032e0019', '2025-01-15', '2025-01-15', '2025-12-03T12:00:00.000Z'::timestamptz, '203.0.113.6', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', 'invite'
WHERE NOT EXISTS (SELECT 1 FROM consents WHERE user_id = '57e67adf-c0a6-427c-8240-002bd0ce2a11');
INSERT INTO consents (user_id, tenant_id, policy_version, terms_version, accepted_at, ip, user_agent, context)
SELECT 'ed29f6bd-a124-42b8-860f-8a48f4228b95', '918ed85f-e58a-4edf-bb1b-761f032e0019', '2025-01-15', '2025-01-15', '2026-02-02T12:00:00.000Z'::timestamptz, '203.0.113.7', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', 'invite'
WHERE NOT EXISTS (SELECT 1 FROM consents WHERE user_id = 'ed29f6bd-a124-42b8-860f-8a48f4228b95');
INSERT INTO consents (user_id, tenant_id, policy_version, terms_version, accepted_at, ip, user_agent, context)
SELECT 'ab9768a5-a3a4-4163-bb63-5e771cf173fe', '918ed85f-e58a-4edf-bb1b-761f032e0019', '2025-01-15', '2025-01-15', '2026-03-27T12:00:00.000Z'::timestamptz, '203.0.113.8', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', 'invite'
WHERE NOT EXISTS (SELECT 1 FROM consents WHERE user_id = 'ab9768a5-a3a4-4163-bb63-5e771cf173fe');
INSERT INTO consents (user_id, tenant_id, policy_version, terms_version, accepted_at, ip, user_agent, context)
SELECT '02420861-f44e-4be0-9f2e-ffcf300add7d', '918ed85f-e58a-4edf-bb1b-761f032e0019', '2025-01-15', '2025-01-15', '2026-03-13T12:00:00.000Z'::timestamptz, '203.0.113.9', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', 'invite'
WHERE NOT EXISTS (SELECT 1 FROM consents WHERE user_id = '02420861-f44e-4be0-9f2e-ffcf300add7d');
INSERT INTO consents (user_id, tenant_id, policy_version, terms_version, accepted_at, ip, user_agent, context)
SELECT 'f08264bc-8c9b-4ae8-a25b-0ca1e0c603b2', '918ed85f-e58a-4edf-bb1b-761f032e0019', '2025-01-15', '2025-01-15', '2026-03-12T12:00:00.000Z'::timestamptz, '203.0.113.10', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', 'invite'
WHERE NOT EXISTS (SELECT 1 FROM consents WHERE user_id = 'f08264bc-8c9b-4ae8-a25b-0ca1e0c603b2');
INSERT INTO consents (user_id, tenant_id, policy_version, terms_version, accepted_at, ip, user_agent, context)
SELECT 'cc659e82-dd94-4de4-9657-3166e7ad37ec', '918ed85f-e58a-4edf-bb1b-761f032e0019', '2025-01-15', '2025-01-15', '2026-04-19T12:00:00.000Z'::timestamptz, '203.0.113.11', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', 'invite'
WHERE NOT EXISTS (SELECT 1 FROM consents WHERE user_id = 'cc659e82-dd94-4de4-9657-3166e7ad37ec');
INSERT INTO consents (user_id, tenant_id, policy_version, terms_version, accepted_at, ip, user_agent, context)
SELECT '73c55850-2352-4f24-9cd7-73c171d6a012', '918ed85f-e58a-4edf-bb1b-761f032e0019', '2025-01-15', '2025-01-15', '2026-01-07T12:00:00.000Z'::timestamptz, '203.0.113.12', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', 'invite'
WHERE NOT EXISTS (SELECT 1 FROM consents WHERE user_id = '73c55850-2352-4f24-9cd7-73c171d6a012');
INSERT INTO consents (user_id, tenant_id, policy_version, terms_version, accepted_at, ip, user_agent, context)
SELECT '22304a85-7ce5-4bbc-b9c6-420edb71203a', '918ed85f-e58a-4edf-bb1b-761f032e0019', '2025-01-15', '2025-01-15', '2026-01-03T12:00:00.000Z'::timestamptz, '203.0.113.13', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', 'invite'
WHERE NOT EXISTS (SELECT 1 FROM consents WHERE user_id = '22304a85-7ce5-4bbc-b9c6-420edb71203a');
INSERT INTO consents (user_id, tenant_id, policy_version, terms_version, accepted_at, ip, user_agent, context)
SELECT '95795cb4-e6c9-485b-8c07-656108993343', '918ed85f-e58a-4edf-bb1b-761f032e0019', '2025-01-15', '2025-01-15', '2026-01-01T12:00:00.000Z'::timestamptz, '203.0.113.14', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', 'invite'
WHERE NOT EXISTS (SELECT 1 FROM consents WHERE user_id = '95795cb4-e6c9-485b-8c07-656108993343');
INSERT INTO consents (user_id, tenant_id, policy_version, terms_version, accepted_at, ip, user_agent, context)
SELECT '6fc4ba15-472a-46ef-8f33-98d933723437', '918ed85f-e58a-4edf-bb1b-761f032e0019', '2025-01-15', '2025-01-15', '2025-11-21T12:00:00.000Z'::timestamptz, '203.0.113.15', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', 'invite'
WHERE NOT EXISTS (SELECT 1 FROM consents WHERE user_id = '6fc4ba15-472a-46ef-8f33-98d933723437');
INSERT INTO consents (user_id, tenant_id, policy_version, terms_version, accepted_at, ip, user_agent, context)
SELECT '111eca04-631d-4fbe-a9ef-0506487fc459', '918ed85f-e58a-4edf-bb1b-761f032e0019', '2025-01-15', '2025-01-15', '2026-04-16T12:00:00.000Z'::timestamptz, '203.0.113.16', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', 'invite'
WHERE NOT EXISTS (SELECT 1 FROM consents WHERE user_id = '111eca04-631d-4fbe-a9ef-0506487fc459');
INSERT INTO consents (user_id, tenant_id, policy_version, terms_version, accepted_at, ip, user_agent, context)
SELECT 'b2895e21-3ef6-494a-bce9-ab9af4e68234', '918ed85f-e58a-4edf-bb1b-761f032e0019', '2025-01-15', '2025-01-15', '2025-11-18T12:00:00.000Z'::timestamptz, '203.0.113.17', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', 'invite'
WHERE NOT EXISTS (SELECT 1 FROM consents WHERE user_id = 'b2895e21-3ef6-494a-bce9-ab9af4e68234');
INSERT INTO consents (user_id, tenant_id, policy_version, terms_version, accepted_at, ip, user_agent, context)
SELECT '852695a0-6c02-457f-a958-045d11e66862', '918ed85f-e58a-4edf-bb1b-761f032e0019', '2025-01-15', '2025-01-15', '2026-02-15T12:00:00.000Z'::timestamptz, '203.0.113.18', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', 'invite'
WHERE NOT EXISTS (SELECT 1 FROM consents WHERE user_id = '852695a0-6c02-457f-a958-045d11e66862');
INSERT INTO consents (user_id, tenant_id, policy_version, terms_version, accepted_at, ip, user_agent, context)
SELECT 'fedbf236-5041-40f4-bf20-266db8d5cfa8', '918ed85f-e58a-4edf-bb1b-761f032e0019', '2025-01-15', '2025-01-15', '2025-11-19T12:00:00.000Z'::timestamptz, '203.0.113.19', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', 'invite'
WHERE NOT EXISTS (SELECT 1 FROM consents WHERE user_id = 'fedbf236-5041-40f4-bf20-266db8d5cfa8');
INSERT INTO consents (user_id, tenant_id, policy_version, terms_version, accepted_at, ip, user_agent, context)
SELECT '2abacf0a-9452-4120-81e1-0c3cd3bfffc3', '918ed85f-e58a-4edf-bb1b-761f032e0019', '2025-01-15', '2025-01-15', '2026-04-08T12:00:00.000Z'::timestamptz, '203.0.113.20', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', 'invite'
WHERE NOT EXISTS (SELECT 1 FROM consents WHERE user_id = '2abacf0a-9452-4120-81e1-0c3cd3bfffc3');

-- ============ ANAMNESES (12 das 20) ============
INSERT INTO anamneses (tenant_id, student_id, has_heart_condition, has_chest_pain, has_dizziness, has_bone_or_joint_problem, takes_blood_pressure_meds, is_pregnant, smoker, injuries, goals, activity_level, signed_at, reviewed_at)
SELECT '918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', TRUE, TRUE, NULL, NULL, NULL, NULL, NULL, 'Histórico de palpitação. Cardiologista liberou em fev/2026.', 'Emagrecer com cardio leve, controlar PA.', 'leve', '2026-04-27T12:00:00.000Z'::timestamptz, '2026-05-07T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM anamneses WHERE student_id = 'fa7f2a60-2a89-4db0-b23f-54998359ad57');
INSERT INTO anamneses (tenant_id, student_id, has_heart_condition, has_chest_pain, has_dizziness, has_bone_or_joint_problem, takes_blood_pressure_meds, is_pregnant, smoker, injuries, goals, activity_level, signed_at, reviewed_at)
SELECT '918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', NULL, NULL, NULL, NULL, NULL, TRUE, NULL, 'Gestante, 22 semanas, autorização médica anexada.', 'Manter atividade leve no pré-parto.', 'ativo', '2026-04-07T12:00:00.000Z'::timestamptz, '2026-05-04T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM anamneses WHERE student_id = '72834f17-0e60-435f-9d40-05dd2e7d2dd4');
INSERT INTO anamneses (tenant_id, student_id, has_heart_condition, has_chest_pain, has_dizziness, has_bone_or_joint_problem, takes_blood_pressure_meds, is_pregnant, smoker, injuries, goals, activity_level, signed_at, reviewed_at)
SELECT '918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', NULL, NULL, NULL, TRUE, NULL, NULL, NULL, 'Lesão antiga LCA joelho direito. Sem dor atualmente.', 'Hipertrofia priorizando técnica, sem alta carga unilateral.', 'ativo', '2026-04-29T12:00:00.000Z'::timestamptz, '2026-05-04T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM anamneses WHERE student_id = '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4');
INSERT INTO anamneses (tenant_id, student_id, has_heart_condition, has_chest_pain, has_dizziness, has_bone_or_joint_problem, takes_blood_pressure_meds, is_pregnant, smoker, injuries, goals, activity_level, signed_at, reviewed_at)
SELECT '918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', NULL, TRUE, NULL, NULL, TRUE, NULL, NULL, 'Toma losartana. Atenção a esforço máximo.', 'Cardio progressivo + força moderada.', 'sedentário', '2026-04-18T12:00:00.000Z'::timestamptz, '2026-05-04T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM anamneses WHERE student_id = 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc');
INSERT INTO anamneses (tenant_id, student_id, has_heart_condition, has_chest_pain, has_dizziness, has_bone_or_joint_problem, takes_blood_pressure_meds, is_pregnant, smoker, injuries, goals, activity_level, signed_at, reviewed_at)
SELECT '918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', NULL, NULL, NULL, NULL, NULL, FALSE, NULL, 'Diástase abdominal pós-parto.', 'Reativar core, voltar a treinar com segurança.', 'ativo', '2026-04-04T12:00:00.000Z'::timestamptz, NULL
WHERE NOT EXISTS (SELECT 1 FROM anamneses WHERE student_id = '95d058d3-5dbd-43ff-ad74-91977c255d34');
INSERT INTO anamneses (tenant_id, student_id, has_heart_condition, has_chest_pain, has_dizziness, has_bone_or_joint_problem, takes_blood_pressure_meds, is_pregnant, smoker, injuries, goals, activity_level, signed_at, reviewed_at)
SELECT '918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', NULL, NULL, TRUE, NULL, NULL, NULL, NULL, 'Crises de tontura ocasionais (labirintite).', 'Definir abdômen evitando exercícios em decúbito brusco.', 'ativo', '2026-04-27T12:00:00.000Z'::timestamptz, NULL
WHERE NOT EXISTS (SELECT 1 FROM anamneses WHERE student_id = '57e67adf-c0a6-427c-8240-002bd0ce2a11');
INSERT INTO anamneses (tenant_id, student_id, has_heart_condition, has_chest_pain, has_dizziness, has_bone_or_joint_problem, takes_blood_pressure_meds, is_pregnant, smoker, injuries, goals, activity_level, signed_at, reviewed_at)
SELECT '918ed85f-e58a-4edf-bb1b-761f032e0019', 'ed29f6bd-a124-42b8-860f-8a48f4228b95', NULL, NULL, NULL, NULL, NULL, NULL, TRUE, 'Fumante social. Pretende reduzir.', 'Força e condicionamento aeróbio.', 'ativo', '2026-04-02T12:00:00.000Z'::timestamptz, NULL
WHERE NOT EXISTS (SELECT 1 FROM anamneses WHERE student_id = 'ed29f6bd-a124-42b8-860f-8a48f4228b95');
INSERT INTO anamneses (tenant_id, student_id, has_heart_condition, has_chest_pain, has_dizziness, has_bone_or_joint_problem, takes_blood_pressure_meds, is_pregnant, smoker, injuries, goals, activity_level, signed_at, reviewed_at)
SELECT '918ed85f-e58a-4edf-bb1b-761f032e0019', 'ab9768a5-a3a4-4163-bb63-5e771cf173fe', TRUE, NULL, NULL, NULL, NULL, NULL, NULL, 'Sopro funcional, libreado por cardio.', 'Treino moderado, foco em saúde mental.', 'moderado', '2026-04-09T12:00:00.000Z'::timestamptz, NULL
WHERE NOT EXISTS (SELECT 1 FROM anamneses WHERE student_id = 'ab9768a5-a3a4-4163-bb63-5e771cf173fe');
INSERT INTO anamneses (tenant_id, student_id, has_heart_condition, has_chest_pain, has_dizziness, has_bone_or_joint_problem, takes_blood_pressure_meds, is_pregnant, smoker, injuries, goals, activity_level, signed_at, reviewed_at)
SELECT '918ed85f-e58a-4edf-bb1b-761f032e0019', '02420861-f44e-4be0-9f2e-ffcf300add7d', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Sem restrições.', 'Hipertrofia agressiva mirando palco em 2027.', 'moderado', '2026-04-15T12:00:00.000Z'::timestamptz, NULL
WHERE NOT EXISTS (SELECT 1 FROM anamneses WHERE student_id = '02420861-f44e-4be0-9f2e-ffcf300add7d');
INSERT INTO anamneses (tenant_id, student_id, has_heart_condition, has_chest_pain, has_dizziness, has_bone_or_joint_problem, takes_blood_pressure_meds, is_pregnant, smoker, injuries, goals, activity_level, signed_at, reviewed_at)
SELECT '918ed85f-e58a-4edf-bb1b-761f032e0019', 'f08264bc-8c9b-4ae8-a25b-0ca1e0c603b2', NULL, NULL, NULL, TRUE, NULL, NULL, NULL, 'Tendinite ombro esquerdo (3 meses atrás), recuperada.', 'Performance crossfit.', 'moderado', '2026-04-15T12:00:00.000Z'::timestamptz, NULL
WHERE NOT EXISTS (SELECT 1 FROM anamneses WHERE student_id = 'f08264bc-8c9b-4ae8-a25b-0ca1e0c603b2');
INSERT INTO anamneses (tenant_id, student_id, has_heart_condition, has_chest_pain, has_dizziness, has_bone_or_joint_problem, takes_blood_pressure_meds, is_pregnant, smoker, injuries, goals, activity_level, signed_at, reviewed_at)
SELECT '918ed85f-e58a-4edf-bb1b-761f032e0019', 'cc659e82-dd94-4de4-9657-3166e7ad37ec', NULL, NULL, NULL, TRUE, NULL, NULL, NULL, 'Pós-cirurgia menisco joelho esquerdo (2024). Treino sem impacto.', 'Voltar gradativamente, sem agachamento profundo.', 'leve', '2026-04-17T12:00:00.000Z'::timestamptz, NULL
WHERE NOT EXISTS (SELECT 1 FROM anamneses WHERE student_id = 'cc659e82-dd94-4de4-9657-3166e7ad37ec');
INSERT INTO anamneses (tenant_id, student_id, has_heart_condition, has_chest_pain, has_dizziness, has_bone_or_joint_problem, takes_blood_pressure_meds, is_pregnant, smoker, injuries, goals, activity_level, signed_at, reviewed_at)
SELECT '918ed85f-e58a-4edf-bb1b-761f032e0019', '73c55850-2352-4f24-9cd7-73c171d6a012', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Sem queixas. Quer ganhar peso saudavelmente.', 'Hipertrofia + alimentação.', 'moderado', '2026-03-17T12:00:00.000Z'::timestamptz, NULL
WHERE NOT EXISTS (SELECT 1 FROM anamneses WHERE student_id = '73c55850-2352-4f24-9cd7-73c171d6a012');

-- ============ ASSESSMENTS (12 alunas, 6 com timeline 3-pts) ============
INSERT INTO assessments (id, tenant_id, student_id, measured_at, measured_by, weight_kg, height_cm, body_fat_pct, muscle_pct, waist_cm, hip_cm, chest_cm, arm_cm, thigh_cm, calf_cm)
VALUES ('22222222-bbbb-4000-8000-000000000000', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-02-12T12:00:00.000Z'::timestamptz, 'a7a1ed0a-937c-4de0-8071-e89a443930c5', 89.8, 164, 33.4, 28.0, 79, 94, 83, 32, 54, 39)
ON CONFLICT (id) DO NOTHING;
INSERT INTO assessments (id, tenant_id, student_id, measured_at, measured_by, weight_kg, height_cm, body_fat_pct, muscle_pct, waist_cm, hip_cm, chest_cm, arm_cm, thigh_cm, calf_cm)
VALUES ('22222222-bbbb-4000-8000-000000000001', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-03-24T12:00:00.000Z'::timestamptz, 'a7a1ed0a-937c-4de0-8071-e89a443930c5', 88.3, 164, 32.2, 28.6, 90, 89, 91, 33, 51, 40)
ON CONFLICT (id) DO NOTHING;
INSERT INTO assessments (id, tenant_id, student_id, measured_at, measured_by, weight_kg, height_cm, body_fat_pct, muscle_pct, waist_cm, hip_cm, chest_cm, arm_cm, thigh_cm, calf_cm)
VALUES ('22222222-bbbb-4000-8000-000000000002', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-05-01T12:00:00.000Z'::timestamptz, 'a7a1ed0a-937c-4de0-8071-e89a443930c5', 86.8, 164, 31.0, 29.2, 69, 102, 95, 28, 56, 33)
ON CONFLICT (id) DO NOTHING;
INSERT INTO assessments (id, tenant_id, student_id, measured_at, measured_by, weight_kg, height_cm, body_fat_pct, muscle_pct, waist_cm, hip_cm, chest_cm, arm_cm, thigh_cm, calf_cm)
VALUES ('22222222-bbbb-4000-8000-000100000000', '918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-02-12T12:00:00.000Z'::timestamptz, 'a7a1ed0a-937c-4de0-8071-e89a443930c5', 76.2, 159, 25.0, 28.0, 82, 106, 88, 33, 55, 33)
ON CONFLICT (id) DO NOTHING;
INSERT INTO assessments (id, tenant_id, student_id, measured_at, measured_by, weight_kg, height_cm, body_fat_pct, muscle_pct, waist_cm, hip_cm, chest_cm, arm_cm, thigh_cm, calf_cm)
VALUES ('22222222-bbbb-4000-8000-000100000001', '918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-03-24T12:00:00.000Z'::timestamptz, 'a7a1ed0a-937c-4de0-8071-e89a443930c5', 74.7, 159, 23.8, 28.6, 89, 95, 82, 32, 59, 39)
ON CONFLICT (id) DO NOTHING;
INSERT INTO assessments (id, tenant_id, student_id, measured_at, measured_by, weight_kg, height_cm, body_fat_pct, muscle_pct, waist_cm, hip_cm, chest_cm, arm_cm, thigh_cm, calf_cm)
VALUES ('22222222-bbbb-4000-8000-000100000002', '918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-05-01T12:00:00.000Z'::timestamptz, 'a7a1ed0a-937c-4de0-8071-e89a443930c5', 73.2, 159, 22.6, 29.2, 90, 92, 93, 30, 52, 32)
ON CONFLICT (id) DO NOTHING;
INSERT INTO assessments (id, tenant_id, student_id, measured_at, measured_by, weight_kg, height_cm, body_fat_pct, muscle_pct, waist_cm, hip_cm, chest_cm, arm_cm, thigh_cm, calf_cm)
VALUES ('22222222-bbbb-4000-8000-000200000000', '918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-02-12T12:00:00.000Z'::timestamptz, 'a7a1ed0a-937c-4de0-8071-e89a443930c5', 78.2, 161, 30.6, 28.0, 71, 95, 82, 27, 64, 37)
ON CONFLICT (id) DO NOTHING;
INSERT INTO assessments (id, tenant_id, student_id, measured_at, measured_by, weight_kg, height_cm, body_fat_pct, muscle_pct, waist_cm, hip_cm, chest_cm, arm_cm, thigh_cm, calf_cm)
VALUES ('22222222-bbbb-4000-8000-000200000001', '918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-03-24T12:00:00.000Z'::timestamptz, 'a7a1ed0a-937c-4de0-8071-e89a443930c5', 76.7, 161, 29.4, 28.6, 92, 91, 85, 31, 54, 35)
ON CONFLICT (id) DO NOTHING;
INSERT INTO assessments (id, tenant_id, student_id, measured_at, measured_by, weight_kg, height_cm, body_fat_pct, muscle_pct, waist_cm, hip_cm, chest_cm, arm_cm, thigh_cm, calf_cm)
VALUES ('22222222-bbbb-4000-8000-000200000002', '918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-05-01T12:00:00.000Z'::timestamptz, 'a7a1ed0a-937c-4de0-8071-e89a443930c5', 75.2, 161, 28.2, 29.2, 76, 96, 95, 29, 55, 40)
ON CONFLICT (id) DO NOTHING;
INSERT INTO assessments (id, tenant_id, student_id, measured_at, measured_by, weight_kg, height_cm, body_fat_pct, muscle_pct, waist_cm, hip_cm, chest_cm, arm_cm, thigh_cm, calf_cm)
VALUES ('22222222-bbbb-4000-8000-000300000000', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-02-12T12:00:00.000Z'::timestamptz, 'a7a1ed0a-937c-4de0-8071-e89a443930c5', 63.1, 167, 27.4, 28.0, 79, 100, 86, 28, 54, 34)
ON CONFLICT (id) DO NOTHING;
INSERT INTO assessments (id, tenant_id, student_id, measured_at, measured_by, weight_kg, height_cm, body_fat_pct, muscle_pct, waist_cm, hip_cm, chest_cm, arm_cm, thigh_cm, calf_cm)
VALUES ('22222222-bbbb-4000-8000-000300000001', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-03-24T12:00:00.000Z'::timestamptz, 'a7a1ed0a-937c-4de0-8071-e89a443930c5', 61.6, 167, 26.2, 28.6, 83, 92, 85, 32, 54, 33)
ON CONFLICT (id) DO NOTHING;
INSERT INTO assessments (id, tenant_id, student_id, measured_at, measured_by, weight_kg, height_cm, body_fat_pct, muscle_pct, waist_cm, hip_cm, chest_cm, arm_cm, thigh_cm, calf_cm)
VALUES ('22222222-bbbb-4000-8000-000300000002', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-05-01T12:00:00.000Z'::timestamptz, 'a7a1ed0a-937c-4de0-8071-e89a443930c5', 60.1, 167, 25.0, 29.2, 73, 88, 92, 27, 57, 35)
ON CONFLICT (id) DO NOTHING;
INSERT INTO assessments (id, tenant_id, student_id, measured_at, measured_by, weight_kg, height_cm, body_fat_pct, muscle_pct, waist_cm, hip_cm, chest_cm, arm_cm, thigh_cm, calf_cm)
VALUES ('22222222-bbbb-4000-8000-000400000000', '918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-02-12T12:00:00.000Z'::timestamptz, 'a7a1ed0a-937c-4de0-8071-e89a443930c5', 78.5, 172, 33.7, 28.0, 76, 91, 98, 30, 62, 40)
ON CONFLICT (id) DO NOTHING;
INSERT INTO assessments (id, tenant_id, student_id, measured_at, measured_by, weight_kg, height_cm, body_fat_pct, muscle_pct, waist_cm, hip_cm, chest_cm, arm_cm, thigh_cm, calf_cm)
VALUES ('22222222-bbbb-4000-8000-000400000001', '918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-03-24T12:00:00.000Z'::timestamptz, 'a7a1ed0a-937c-4de0-8071-e89a443930c5', 77.0, 172, 32.5, 28.6, 77, 91, 93, 33, 53, 35)
ON CONFLICT (id) DO NOTHING;
INSERT INTO assessments (id, tenant_id, student_id, measured_at, measured_by, weight_kg, height_cm, body_fat_pct, muscle_pct, waist_cm, hip_cm, chest_cm, arm_cm, thigh_cm, calf_cm)
VALUES ('22222222-bbbb-4000-8000-000400000002', '918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-05-01T12:00:00.000Z'::timestamptz, 'a7a1ed0a-937c-4de0-8071-e89a443930c5', 75.5, 172, 31.3, 29.2, 79, 108, 91, 33, 62, 38)
ON CONFLICT (id) DO NOTHING;
INSERT INTO assessments (id, tenant_id, student_id, measured_at, measured_by, weight_kg, height_cm, body_fat_pct, muscle_pct, waist_cm, hip_cm, chest_cm, arm_cm, thigh_cm, calf_cm)
VALUES ('22222222-bbbb-4000-8000-000500000000', '918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-02-12T12:00:00.000Z'::timestamptz, 'a7a1ed0a-937c-4de0-8071-e89a443930c5', 52.1, 158, 21.0, 28.0, 78, 102, 96, 34, 62, 37)
ON CONFLICT (id) DO NOTHING;
INSERT INTO assessments (id, tenant_id, student_id, measured_at, measured_by, weight_kg, height_cm, body_fat_pct, muscle_pct, waist_cm, hip_cm, chest_cm, arm_cm, thigh_cm, calf_cm)
VALUES ('22222222-bbbb-4000-8000-000500000001', '918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-03-24T12:00:00.000Z'::timestamptz, 'a7a1ed0a-937c-4de0-8071-e89a443930c5', 50.6, 158, 19.8, 28.6, 88, 105, 93, 29, 56, 39)
ON CONFLICT (id) DO NOTHING;
INSERT INTO assessments (id, tenant_id, student_id, measured_at, measured_by, weight_kg, height_cm, body_fat_pct, muscle_pct, waist_cm, hip_cm, chest_cm, arm_cm, thigh_cm, calf_cm)
VALUES ('22222222-bbbb-4000-8000-000500000002', '918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-05-01T12:00:00.000Z'::timestamptz, 'a7a1ed0a-937c-4de0-8071-e89a443930c5', 49.1, 158, 18.6, 29.2, 83, 95, 99, 31, 54, 39)
ON CONFLICT (id) DO NOTHING;
INSERT INTO assessments (id, tenant_id, student_id, measured_at, measured_by, weight_kg, height_cm, body_fat_pct, muscle_pct, waist_cm, hip_cm, chest_cm, arm_cm, thigh_cm, calf_cm)
VALUES ('22222222-bbbb-4000-8000-000600000000', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'ed29f6bd-a124-42b8-860f-8a48f4228b95', '2026-04-15T12:00:00.000Z'::timestamptz, 'a7a1ed0a-937c-4de0-8071-e89a443930c5', 56.1, 155, 25.5, 28.0, 82, 103, 100, 33, 56, 38)
ON CONFLICT (id) DO NOTHING;
INSERT INTO assessments (id, tenant_id, student_id, measured_at, measured_by, weight_kg, height_cm, body_fat_pct, muscle_pct, waist_cm, hip_cm, chest_cm, arm_cm, thigh_cm, calf_cm)
VALUES ('22222222-bbbb-4000-8000-000700000000', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'ab9768a5-a3a4-4163-bb63-5e771cf173fe', '2026-04-17T12:00:00.000Z'::timestamptz, 'a7a1ed0a-937c-4de0-8071-e89a443930c5', 55.8, 157, 24.1, 28.0, 72, 97, 92, 32, 61, 39)
ON CONFLICT (id) DO NOTHING;
INSERT INTO assessments (id, tenant_id, student_id, measured_at, measured_by, weight_kg, height_cm, body_fat_pct, muscle_pct, waist_cm, hip_cm, chest_cm, arm_cm, thigh_cm, calf_cm)
VALUES ('22222222-bbbb-4000-8000-000800000000', '918ed85f-e58a-4edf-bb1b-761f032e0019', '02420861-f44e-4be0-9f2e-ffcf300add7d', '2026-03-31T12:00:00.000Z'::timestamptz, 'a7a1ed0a-937c-4de0-8071-e89a443930c5', 57.8, 165, 30.0, 28.0, 77, 97, 90, 28, 54, 33)
ON CONFLICT (id) DO NOTHING;
INSERT INTO assessments (id, tenant_id, student_id, measured_at, measured_by, weight_kg, height_cm, body_fat_pct, muscle_pct, waist_cm, hip_cm, chest_cm, arm_cm, thigh_cm, calf_cm)
VALUES ('22222222-bbbb-4000-8000-000900000000', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'f08264bc-8c9b-4ae8-a25b-0ca1e0c603b2', '2026-03-27T12:00:00.000Z'::timestamptz, 'a7a1ed0a-937c-4de0-8071-e89a443930c5', 70.2, 166, 24.0, 28.0, 82, 97, 84, 26, 52, 40)
ON CONFLICT (id) DO NOTHING;
INSERT INTO assessments (id, tenant_id, student_id, measured_at, measured_by, weight_kg, height_cm, body_fat_pct, muscle_pct, waist_cm, hip_cm, chest_cm, arm_cm, thigh_cm, calf_cm)
VALUES ('22222222-bbbb-4000-8000-001000000000', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'cc659e82-dd94-4de4-9657-3166e7ad37ec', '2026-03-29T12:00:00.000Z'::timestamptz, 'a7a1ed0a-937c-4de0-8071-e89a443930c5', 52.8, 164, 33.1, 28.0, 66, 105, 83, 29, 53, 38)
ON CONFLICT (id) DO NOTHING;
INSERT INTO assessments (id, tenant_id, student_id, measured_at, measured_by, weight_kg, height_cm, body_fat_pct, muscle_pct, waist_cm, hip_cm, chest_cm, arm_cm, thigh_cm, calf_cm)
VALUES ('22222222-bbbb-4000-8000-001100000000', '918ed85f-e58a-4edf-bb1b-761f032e0019', '73c55850-2352-4f24-9cd7-73c171d6a012', '2026-03-19T12:00:00.000Z'::timestamptz, 'a7a1ed0a-937c-4de0-8071-e89a443930c5', 72.6, 175, 21.4, 28.0, 83, 104, 92, 33, 57, 33)
ON CONFLICT (id) DO NOTHING;

-- ============ WORKOUT TEMPLATES (6) ============
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('11111111-aaaa-4000-8000-000000000a01', '918ed85f-e58a-4edf-bb1b-761f032e0019', NULL, 'Treino A — Peito + Tríceps', 'Empurrar pesado, fechar com tríceps. 4-5 séries por exercício.', ARRAY[1,3,5]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0100000000', '11111111-aaaa-4000-8000-000000000a01', '9f10bf5b-7d81-4c85-ae25-36fbed40fdf0', 1, 4, '8-10', 90, 'Aquecer 2 sets antes', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0100000001', '11111111-aaaa-4000-8000-000000000a01', 'e87f5466-0540-4b2f-bda8-0e1a8d17811e', 2, 3, '10-12', 75, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0100000002', '11111111-aaaa-4000-8000-000000000a01', 'f48dc039-fff8-4778-b95e-d00f48428c01', 3, 3, '12-15', 60, 'Foco no estiramento', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0100000003', '11111111-aaaa-4000-8000-000000000a01', '0fb935f1-a3cb-4e5b-9189-19e8713afc1e', 4, 3, '15', 60, 'Cabos altos pra meio do peito', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0100000004', '11111111-aaaa-4000-8000-000000000a01', 'fdef2134-3740-40c0-bc71-dd64ebb3fa6e', 5, 4, '12-15', 60, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0100000005', '11111111-aaaa-4000-8000-000000000a01', '03fdf02b-ea8f-401a-a8cd-7412f8991c0d', 6, 3, '10-12', 75, 'Cuidado com cotovelos', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0100000006', '11111111-aaaa-4000-8000-000000000a01', '6931f666-f702-4a1b-8671-901347e0d8b0', 7, 3, 'AMRAP', 60, 'Até a falha técnica', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('11111111-aaaa-4000-8000-000000000a02', '918ed85f-e58a-4edf-bb1b-761f032e0019', NULL, 'Treino B — Costas + Bíceps', 'Largura, espessura, fechar com bíceps. Concentração na contração.', ARRAY[1,3,5]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0200000000', '11111111-aaaa-4000-8000-000000000a02', 'c9940cba-ae26-4c92-ad77-591f2a240b67', 1, 4, 'AMRAP', 90, 'Pode usar elástico', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0200000001', '11111111-aaaa-4000-8000-000000000a02', '52346783-6f40-4812-9d49-8f66e4b63fa3', 2, 3, '10-12', 75, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0200000002', '11111111-aaaa-4000-8000-000000000a02', '75ab605c-1ea9-4a3e-8096-65923cc81b70', 3, 4, '8-10', 90, 'Apoio lombar firme', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0200000003', '11111111-aaaa-4000-8000-000000000a02', '26eff26e-8084-4c54-a03d-50583044c7b9', 4, 3, '10/10', 60, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0200000004', '11111111-aaaa-4000-8000-000000000a02', '4e3db545-25f9-43e5-8a41-3b9564168a31', 5, 3, '12', 60, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0200000005', '11111111-aaaa-4000-8000-000000000a02', '30a99ec7-0c7b-4e96-9989-cc0f17df5dba', 6, 4, '10-12', 60, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0200000006', '11111111-aaaa-4000-8000-000000000a02', '290e96ea-f6a4-488a-afc1-48c0c2e1c154', 7, 3, '12', 45, 'Antebraço grosso', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('11111111-aaaa-4000-8000-000000000a03', '918ed85f-e58a-4edf-bb1b-761f032e0019', NULL, 'Treino C — Pernas Completo', 'Quadríceps + posterior + glúteo + panturrilha. O treino mais pesado da semana.', ARRAY[1,3,5]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0300000000', '11111111-aaaa-4000-8000-000000000a03', '126b3344-9db1-4d41-ad4a-31433a419742', 1, 5, '6-8', 120, 'Aquecer escala 50/70/90% antes', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0300000001', '11111111-aaaa-4000-8000-000000000a03', 'c2fb7968-00ed-450d-b4c2-580181581c5b', 2, 4, '10-12', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0300000002', '11111111-aaaa-4000-8000-000000000a03', '8cfd7d5c-e008-4346-b195-109de4b90903', 3, 3, '12-15', 60, 'Drop-set no último', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0300000003', '11111111-aaaa-4000-8000-000000000a03', '0a864cbb-da5d-443c-9de6-acbad10b1ede', 4, 4, '10', 90, 'Sentir o posterior', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0300000004', '11111111-aaaa-4000-8000-000000000a03', '565ab11f-3c3b-4c0f-90f2-e23612a7b93b', 5, 3, '12', 60, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0300000005', '11111111-aaaa-4000-8000-000000000a03', '422337c9-777f-4724-ac1b-947551ecf837', 6, 4, '10-12', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0300000006', '11111111-aaaa-4000-8000-000000000a03', '488b2ab9-9631-468c-b271-d9ab7da081f3', 7, 4, '15-20', 45, 'Pico de contração 1s', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('11111111-aaaa-4000-8000-000000000a04', '918ed85f-e58a-4edf-bb1b-761f032e0019', NULL, 'Glúteo Forte', 'Treino dedicado pra hipertrofia de glúteo. Foco mental no músculo.', ARRAY[1,3,5]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0400000000', '11111111-aaaa-4000-8000-000000000a04', '422337c9-777f-4724-ac1b-947551ecf837', 1, 5, '8-10', 90, 'Carga pesada', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0400000001', '11111111-aaaa-4000-8000-000000000a04', '7698e261-7b25-424b-ad79-b13294f67572', 2, 4, '12', 75, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0400000002', '11111111-aaaa-4000-8000-000000000a04', '18706e94-d76a-4589-bffa-1e555c051c2f', 3, 4, '12/12', 45, 'Controle excêntrico', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0400000003', '11111111-aaaa-4000-8000-000000000a04', '3155ff5f-f1e2-4c28-aa03-d710ea7d76ff', 4, 4, '15', 45, 'Inclinar tronco à frente', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0400000004', '11111111-aaaa-4000-8000-000000000a04', '396ecfb1-494c-42ef-a9ba-bfb432df3bb2', 5, 3, '10/10', 75, 'Passada longa', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0400000005', '11111111-aaaa-4000-8000-000000000a04', '138840d5-b1ce-4775-a796-d73c7e95ba7b', 6, 3, '10', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('11111111-aaaa-4000-8000-000000000a05', '918ed85f-e58a-4edf-bb1b-761f032e0019', NULL, 'Cardio + Core', '30min de cardio + circuito de abdômen. Ideal pra dia entre treinos pesados.', ARRAY[1,3,5]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0500000000', '11111111-aaaa-4000-8000-000000000a05', 'eea13713-483b-435f-a613-8344cf5a590a', 1, 4, '45', 30, 'Em segundos', 'seconds')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0500000001', '11111111-aaaa-4000-8000-000000000a05', 'ce5335a5-ac62-454d-9e71-3c5729823ff8', 2, 3, '30/30', 30, 'Cada lado', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0500000002', '11111111-aaaa-4000-8000-000000000a05', '1090cf46-159c-48d4-9a0b-25cea6375bd6', 3, 4, '20', 30, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0500000003', '11111111-aaaa-4000-8000-000000000a05', 'a820facc-f5cb-46bd-ab8d-143d63160c8a', 4, 4, '15', 30, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0500000004', '11111111-aaaa-4000-8000-000000000a05', '35c0fab1-cda6-48e9-b97b-0c5221c737a2', 5, 3, '20', 45, 'Halter 5kg', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('11111111-aaaa-4000-8000-000000000a06', '918ed85f-e58a-4edf-bb1b-761f032e0019', NULL, 'Força Total', 'Treino full-body 3x/semana. Padrões de movimento básicos com carga.', ARRAY[1,3,5]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0600000000', '11111111-aaaa-4000-8000-000000000a06', '126b3344-9db1-4d41-ad4a-31433a419742', 1, 4, '5-6', 120, 'Carga pesada', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0600000001', '11111111-aaaa-4000-8000-000000000a06', '9f10bf5b-7d81-4c85-ae25-36fbed40fdf0', 2, 4, '5-6', 120, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0600000002', '11111111-aaaa-4000-8000-000000000a06', '75ab605c-1ea9-4a3e-8096-65923cc81b70', 3, 4, '5-6', 120, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0600000003', '11111111-aaaa-4000-8000-000000000a06', '0877dedf-cb3e-47b2-919a-fd87c9201727', 4, 4, '6-8', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('33333333-cccc-4000-8000-0a0600000004', '11111111-aaaa-4000-8000-000000000a06', '138840d5-b1ce-4775-a796-d73c7e95ba7b', 5, 3, '8', 120, 'Foco na pegada', 'reps')
ON CONFLICT (id) DO NOTHING;

-- ============ WORKOUTS ATRIBUÍDOS (16 alunas com 2-3 treinos cada) ============
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-000000000000', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', 'Glúteo Forte', 'Treino dedicado pra hipertrofia de glúteo. Foco mental no músculo.', ARRAY[1,3,5]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000000000000', '44444444-dddd-4000-8000-000000000000', '422337c9-777f-4724-ac1b-947551ecf837', 1, 5, '8-10', 90, 'Carga pesada', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000000000001', '44444444-dddd-4000-8000-000000000000', '7698e261-7b25-424b-ad79-b13294f67572', 2, 4, '12', 75, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000000000002', '44444444-dddd-4000-8000-000000000000', '18706e94-d76a-4589-bffa-1e555c051c2f', 3, 4, '12/12', 45, 'Controle excêntrico', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000000000003', '44444444-dddd-4000-8000-000000000000', '3155ff5f-f1e2-4c28-aa03-d710ea7d76ff', 4, 4, '15', 45, 'Inclinar tronco à frente', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000000000004', '44444444-dddd-4000-8000-000000000000', '396ecfb1-494c-42ef-a9ba-bfb432df3bb2', 5, 3, '10/10', 75, 'Passada longa', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000000000005', '44444444-dddd-4000-8000-000000000000', '138840d5-b1ce-4775-a796-d73c7e95ba7b', 6, 3, '10', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-000000000001', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', 'Cardio + Core', '30min de cardio + circuito de abdômen. Ideal pra dia entre treinos pesados.', ARRAY[1,3]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000001000000', '44444444-dddd-4000-8000-000000000001', 'eea13713-483b-435f-a613-8344cf5a590a', 1, 4, '45', 30, 'Em segundos', 'seconds')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000001000001', '44444444-dddd-4000-8000-000000000001', 'ce5335a5-ac62-454d-9e71-3c5729823ff8', 2, 3, '30/30', 30, 'Cada lado', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000001000002', '44444444-dddd-4000-8000-000000000001', '1090cf46-159c-48d4-9a0b-25cea6375bd6', 3, 4, '20', 30, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000001000003', '44444444-dddd-4000-8000-000000000001', 'a820facc-f5cb-46bd-ab8d-143d63160c8a', 4, 4, '15', 30, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000001000004', '44444444-dddd-4000-8000-000000000001', '35c0fab1-cda6-48e9-b97b-0c5221c737a2', 5, 3, '20', 45, 'Halter 5kg', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-000000000002', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', 'Treino C — Pernas Completo', 'Quadríceps + posterior + glúteo + panturrilha. O treino mais pesado da semana.', ARRAY[1]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000002000000', '44444444-dddd-4000-8000-000000000002', '126b3344-9db1-4d41-ad4a-31433a419742', 1, 5, '6-8', 120, 'Aquecer escala 50/70/90% antes', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000002000001', '44444444-dddd-4000-8000-000000000002', 'c2fb7968-00ed-450d-b4c2-580181581c5b', 2, 4, '10-12', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000002000002', '44444444-dddd-4000-8000-000000000002', '8cfd7d5c-e008-4346-b195-109de4b90903', 3, 3, '12-15', 60, 'Drop-set no último', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000002000003', '44444444-dddd-4000-8000-000000000002', '0a864cbb-da5d-443c-9de6-acbad10b1ede', 4, 4, '10', 90, 'Sentir o posterior', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000002000004', '44444444-dddd-4000-8000-000000000002', '565ab11f-3c3b-4c0f-90f2-e23612a7b93b', 5, 3, '12', 60, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000002000005', '44444444-dddd-4000-8000-000000000002', '422337c9-777f-4724-ac1b-947551ecf837', 6, 4, '10-12', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000002000006', '44444444-dddd-4000-8000-000000000002', '488b2ab9-9631-468c-b271-d9ab7da081f3', 7, 4, '15-20', 45, 'Pico de contração 1s', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-000100000000', '918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', 'Cardio + Core', '30min de cardio + circuito de abdômen. Ideal pra dia entre treinos pesados.', ARRAY[1,3,5]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000100000000', '44444444-dddd-4000-8000-000100000000', 'eea13713-483b-435f-a613-8344cf5a590a', 1, 4, '45', 30, 'Em segundos', 'seconds')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000100000001', '44444444-dddd-4000-8000-000100000000', 'ce5335a5-ac62-454d-9e71-3c5729823ff8', 2, 3, '30/30', 30, 'Cada lado', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000100000002', '44444444-dddd-4000-8000-000100000000', '1090cf46-159c-48d4-9a0b-25cea6375bd6', 3, 4, '20', 30, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000100000003', '44444444-dddd-4000-8000-000100000000', 'a820facc-f5cb-46bd-ab8d-143d63160c8a', 4, 4, '15', 30, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000100000004', '44444444-dddd-4000-8000-000100000000', '35c0fab1-cda6-48e9-b97b-0c5221c737a2', 5, 3, '20', 45, 'Halter 5kg', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-000100000001', '918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', 'Glúteo Forte', 'Treino dedicado pra hipertrofia de glúteo. Foco mental no músculo.', ARRAY[1,3]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000101000000', '44444444-dddd-4000-8000-000100000001', '422337c9-777f-4724-ac1b-947551ecf837', 1, 5, '8-10', 90, 'Carga pesada', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000101000001', '44444444-dddd-4000-8000-000100000001', '7698e261-7b25-424b-ad79-b13294f67572', 2, 4, '12', 75, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000101000002', '44444444-dddd-4000-8000-000100000001', '18706e94-d76a-4589-bffa-1e555c051c2f', 3, 4, '12/12', 45, 'Controle excêntrico', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000101000003', '44444444-dddd-4000-8000-000100000001', '3155ff5f-f1e2-4c28-aa03-d710ea7d76ff', 4, 4, '15', 45, 'Inclinar tronco à frente', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000101000004', '44444444-dddd-4000-8000-000100000001', '396ecfb1-494c-42ef-a9ba-bfb432df3bb2', 5, 3, '10/10', 75, 'Passada longa', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000101000005', '44444444-dddd-4000-8000-000100000001', '138840d5-b1ce-4775-a796-d73c7e95ba7b', 6, 3, '10', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-000200000000', '918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', 'Treino A — Peito + Tríceps', 'Empurrar pesado, fechar com tríceps. 4-5 séries por exercício.', ARRAY[1,3,5]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000200000000', '44444444-dddd-4000-8000-000200000000', '9f10bf5b-7d81-4c85-ae25-36fbed40fdf0', 1, 4, '8-10', 90, 'Aquecer 2 sets antes', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000200000001', '44444444-dddd-4000-8000-000200000000', 'e87f5466-0540-4b2f-bda8-0e1a8d17811e', 2, 3, '10-12', 75, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000200000002', '44444444-dddd-4000-8000-000200000000', 'f48dc039-fff8-4778-b95e-d00f48428c01', 3, 3, '12-15', 60, 'Foco no estiramento', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000200000003', '44444444-dddd-4000-8000-000200000000', '0fb935f1-a3cb-4e5b-9189-19e8713afc1e', 4, 3, '15', 60, 'Cabos altos pra meio do peito', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000200000004', '44444444-dddd-4000-8000-000200000000', 'fdef2134-3740-40c0-bc71-dd64ebb3fa6e', 5, 4, '12-15', 60, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000200000005', '44444444-dddd-4000-8000-000200000000', '03fdf02b-ea8f-401a-a8cd-7412f8991c0d', 6, 3, '10-12', 75, 'Cuidado com cotovelos', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000200000006', '44444444-dddd-4000-8000-000200000000', '6931f666-f702-4a1b-8671-901347e0d8b0', 7, 3, 'AMRAP', 60, 'Até a falha técnica', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-000200000001', '918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', 'Treino B — Costas + Bíceps', 'Largura, espessura, fechar com bíceps. Concentração na contração.', ARRAY[1,3]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000201000000', '44444444-dddd-4000-8000-000200000001', 'c9940cba-ae26-4c92-ad77-591f2a240b67', 1, 4, 'AMRAP', 90, 'Pode usar elástico', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000201000001', '44444444-dddd-4000-8000-000200000001', '52346783-6f40-4812-9d49-8f66e4b63fa3', 2, 3, '10-12', 75, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000201000002', '44444444-dddd-4000-8000-000200000001', '75ab605c-1ea9-4a3e-8096-65923cc81b70', 3, 4, '8-10', 90, 'Apoio lombar firme', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000201000003', '44444444-dddd-4000-8000-000200000001', '26eff26e-8084-4c54-a03d-50583044c7b9', 4, 3, '10/10', 60, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000201000004', '44444444-dddd-4000-8000-000200000001', '4e3db545-25f9-43e5-8a41-3b9564168a31', 5, 3, '12', 60, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000201000005', '44444444-dddd-4000-8000-000200000001', '30a99ec7-0c7b-4e96-9989-cc0f17df5dba', 6, 4, '10-12', 60, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000201000006', '44444444-dddd-4000-8000-000200000001', '290e96ea-f6a4-488a-afc1-48c0c2e1c154', 7, 3, '12', 45, 'Antebraço grosso', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-000200000002', '918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', 'Treino C — Pernas Completo', 'Quadríceps + posterior + glúteo + panturrilha. O treino mais pesado da semana.', ARRAY[1]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000202000000', '44444444-dddd-4000-8000-000200000002', '126b3344-9db1-4d41-ad4a-31433a419742', 1, 5, '6-8', 120, 'Aquecer escala 50/70/90% antes', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000202000001', '44444444-dddd-4000-8000-000200000002', 'c2fb7968-00ed-450d-b4c2-580181581c5b', 2, 4, '10-12', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000202000002', '44444444-dddd-4000-8000-000200000002', '8cfd7d5c-e008-4346-b195-109de4b90903', 3, 3, '12-15', 60, 'Drop-set no último', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000202000003', '44444444-dddd-4000-8000-000200000002', '0a864cbb-da5d-443c-9de6-acbad10b1ede', 4, 4, '10', 90, 'Sentir o posterior', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000202000004', '44444444-dddd-4000-8000-000200000002', '565ab11f-3c3b-4c0f-90f2-e23612a7b93b', 5, 3, '12', 60, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000202000005', '44444444-dddd-4000-8000-000200000002', '422337c9-777f-4724-ac1b-947551ecf837', 6, 4, '10-12', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000202000006', '44444444-dddd-4000-8000-000200000002', '488b2ab9-9631-468c-b271-d9ab7da081f3', 7, 4, '15-20', 45, 'Pico de contração 1s', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-000300000000', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', 'Cardio + Core', '30min de cardio + circuito de abdômen. Ideal pra dia entre treinos pesados.', ARRAY[1,3,5]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000300000000', '44444444-dddd-4000-8000-000300000000', 'eea13713-483b-435f-a613-8344cf5a590a', 1, 4, '45', 30, 'Em segundos', 'seconds')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000300000001', '44444444-dddd-4000-8000-000300000000', 'ce5335a5-ac62-454d-9e71-3c5729823ff8', 2, 3, '30/30', 30, 'Cada lado', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000300000002', '44444444-dddd-4000-8000-000300000000', '1090cf46-159c-48d4-9a0b-25cea6375bd6', 3, 4, '20', 30, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000300000003', '44444444-dddd-4000-8000-000300000000', 'a820facc-f5cb-46bd-ab8d-143d63160c8a', 4, 4, '15', 30, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000300000004', '44444444-dddd-4000-8000-000300000000', '35c0fab1-cda6-48e9-b97b-0c5221c737a2', 5, 3, '20', 45, 'Halter 5kg', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-000300000001', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', 'Força Total', 'Treino full-body 3x/semana. Padrões de movimento básicos com carga.', ARRAY[1,3]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000301000000', '44444444-dddd-4000-8000-000300000001', '126b3344-9db1-4d41-ad4a-31433a419742', 1, 4, '5-6', 120, 'Carga pesada', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000301000001', '44444444-dddd-4000-8000-000300000001', '9f10bf5b-7d81-4c85-ae25-36fbed40fdf0', 2, 4, '5-6', 120, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000301000002', '44444444-dddd-4000-8000-000300000001', '75ab605c-1ea9-4a3e-8096-65923cc81b70', 3, 4, '5-6', 120, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000301000003', '44444444-dddd-4000-8000-000300000001', '0877dedf-cb3e-47b2-919a-fd87c9201727', 4, 4, '6-8', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000301000004', '44444444-dddd-4000-8000-000300000001', '138840d5-b1ce-4775-a796-d73c7e95ba7b', 5, 3, '8', 120, 'Foco na pegada', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-000400000000', '918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', 'Cardio + Core', '30min de cardio + circuito de abdômen. Ideal pra dia entre treinos pesados.', ARRAY[1,3,5]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000400000000', '44444444-dddd-4000-8000-000400000000', 'eea13713-483b-435f-a613-8344cf5a590a', 1, 4, '45', 30, 'Em segundos', 'seconds')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000400000001', '44444444-dddd-4000-8000-000400000000', 'ce5335a5-ac62-454d-9e71-3c5729823ff8', 2, 3, '30/30', 30, 'Cada lado', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000400000002', '44444444-dddd-4000-8000-000400000000', '1090cf46-159c-48d4-9a0b-25cea6375bd6', 3, 4, '20', 30, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000400000003', '44444444-dddd-4000-8000-000400000000', 'a820facc-f5cb-46bd-ab8d-143d63160c8a', 4, 4, '15', 30, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000400000004', '44444444-dddd-4000-8000-000400000000', '35c0fab1-cda6-48e9-b97b-0c5221c737a2', 5, 3, '20', 45, 'Halter 5kg', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-000400000001', '918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', 'Glúteo Forte', 'Treino dedicado pra hipertrofia de glúteo. Foco mental no músculo.', ARRAY[1,3]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000401000000', '44444444-dddd-4000-8000-000400000001', '422337c9-777f-4724-ac1b-947551ecf837', 1, 5, '8-10', 90, 'Carga pesada', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000401000001', '44444444-dddd-4000-8000-000400000001', '7698e261-7b25-424b-ad79-b13294f67572', 2, 4, '12', 75, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000401000002', '44444444-dddd-4000-8000-000400000001', '18706e94-d76a-4589-bffa-1e555c051c2f', 3, 4, '12/12', 45, 'Controle excêntrico', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000401000003', '44444444-dddd-4000-8000-000400000001', '3155ff5f-f1e2-4c28-aa03-d710ea7d76ff', 4, 4, '15', 45, 'Inclinar tronco à frente', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000401000004', '44444444-dddd-4000-8000-000400000001', '396ecfb1-494c-42ef-a9ba-bfb432df3bb2', 5, 3, '10/10', 75, 'Passada longa', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000401000005', '44444444-dddd-4000-8000-000400000001', '138840d5-b1ce-4775-a796-d73c7e95ba7b', 6, 3, '10', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-000500000000', '918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', 'Glúteo Forte', 'Treino dedicado pra hipertrofia de glúteo. Foco mental no músculo.', ARRAY[1,3,5]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000500000000', '44444444-dddd-4000-8000-000500000000', '422337c9-777f-4724-ac1b-947551ecf837', 1, 5, '8-10', 90, 'Carga pesada', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000500000001', '44444444-dddd-4000-8000-000500000000', '7698e261-7b25-424b-ad79-b13294f67572', 2, 4, '12', 75, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000500000002', '44444444-dddd-4000-8000-000500000000', '18706e94-d76a-4589-bffa-1e555c051c2f', 3, 4, '12/12', 45, 'Controle excêntrico', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000500000003', '44444444-dddd-4000-8000-000500000000', '3155ff5f-f1e2-4c28-aa03-d710ea7d76ff', 4, 4, '15', 45, 'Inclinar tronco à frente', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000500000004', '44444444-dddd-4000-8000-000500000000', '396ecfb1-494c-42ef-a9ba-bfb432df3bb2', 5, 3, '10/10', 75, 'Passada longa', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000500000005', '44444444-dddd-4000-8000-000500000000', '138840d5-b1ce-4775-a796-d73c7e95ba7b', 6, 3, '10', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-000500000001', '918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', 'Cardio + Core', '30min de cardio + circuito de abdômen. Ideal pra dia entre treinos pesados.', ARRAY[1,3]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000501000000', '44444444-dddd-4000-8000-000500000001', 'eea13713-483b-435f-a613-8344cf5a590a', 1, 4, '45', 30, 'Em segundos', 'seconds')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000501000001', '44444444-dddd-4000-8000-000500000001', 'ce5335a5-ac62-454d-9e71-3c5729823ff8', 2, 3, '30/30', 30, 'Cada lado', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000501000002', '44444444-dddd-4000-8000-000500000001', '1090cf46-159c-48d4-9a0b-25cea6375bd6', 3, 4, '20', 30, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000501000003', '44444444-dddd-4000-8000-000500000001', 'a820facc-f5cb-46bd-ab8d-143d63160c8a', 4, 4, '15', 30, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000501000004', '44444444-dddd-4000-8000-000500000001', '35c0fab1-cda6-48e9-b97b-0c5221c737a2', 5, 3, '20', 45, 'Halter 5kg', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-000500000002', '918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', 'Treino C — Pernas Completo', 'Quadríceps + posterior + glúteo + panturrilha. O treino mais pesado da semana.', ARRAY[1]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000502000000', '44444444-dddd-4000-8000-000500000002', '126b3344-9db1-4d41-ad4a-31433a419742', 1, 5, '6-8', 120, 'Aquecer escala 50/70/90% antes', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000502000001', '44444444-dddd-4000-8000-000500000002', 'c2fb7968-00ed-450d-b4c2-580181581c5b', 2, 4, '10-12', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000502000002', '44444444-dddd-4000-8000-000500000002', '8cfd7d5c-e008-4346-b195-109de4b90903', 3, 3, '12-15', 60, 'Drop-set no último', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000502000003', '44444444-dddd-4000-8000-000500000002', '0a864cbb-da5d-443c-9de6-acbad10b1ede', 4, 4, '10', 90, 'Sentir o posterior', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000502000004', '44444444-dddd-4000-8000-000500000002', '565ab11f-3c3b-4c0f-90f2-e23612a7b93b', 5, 3, '12', 60, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000502000005', '44444444-dddd-4000-8000-000500000002', '422337c9-777f-4724-ac1b-947551ecf837', 6, 4, '10-12', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000502000006', '44444444-dddd-4000-8000-000500000002', '488b2ab9-9631-468c-b271-d9ab7da081f3', 7, 4, '15-20', 45, 'Pico de contração 1s', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-000600000000', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'ed29f6bd-a124-42b8-860f-8a48f4228b95', 'Treino A — Peito + Tríceps', 'Empurrar pesado, fechar com tríceps. 4-5 séries por exercício.', ARRAY[1,3,5]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000600000000', '44444444-dddd-4000-8000-000600000000', '9f10bf5b-7d81-4c85-ae25-36fbed40fdf0', 1, 4, '8-10', 90, 'Aquecer 2 sets antes', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000600000001', '44444444-dddd-4000-8000-000600000000', 'e87f5466-0540-4b2f-bda8-0e1a8d17811e', 2, 3, '10-12', 75, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000600000002', '44444444-dddd-4000-8000-000600000000', 'f48dc039-fff8-4778-b95e-d00f48428c01', 3, 3, '12-15', 60, 'Foco no estiramento', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000600000003', '44444444-dddd-4000-8000-000600000000', '0fb935f1-a3cb-4e5b-9189-19e8713afc1e', 4, 3, '15', 60, 'Cabos altos pra meio do peito', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000600000004', '44444444-dddd-4000-8000-000600000000', 'fdef2134-3740-40c0-bc71-dd64ebb3fa6e', 5, 4, '12-15', 60, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000600000005', '44444444-dddd-4000-8000-000600000000', '03fdf02b-ea8f-401a-a8cd-7412f8991c0d', 6, 3, '10-12', 75, 'Cuidado com cotovelos', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000600000006', '44444444-dddd-4000-8000-000600000000', '6931f666-f702-4a1b-8671-901347e0d8b0', 7, 3, 'AMRAP', 60, 'Até a falha técnica', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-000600000001', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'ed29f6bd-a124-42b8-860f-8a48f4228b95', 'Treino B — Costas + Bíceps', 'Largura, espessura, fechar com bíceps. Concentração na contração.', ARRAY[1,3]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000601000000', '44444444-dddd-4000-8000-000600000001', 'c9940cba-ae26-4c92-ad77-591f2a240b67', 1, 4, 'AMRAP', 90, 'Pode usar elástico', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000601000001', '44444444-dddd-4000-8000-000600000001', '52346783-6f40-4812-9d49-8f66e4b63fa3', 2, 3, '10-12', 75, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000601000002', '44444444-dddd-4000-8000-000600000001', '75ab605c-1ea9-4a3e-8096-65923cc81b70', 3, 4, '8-10', 90, 'Apoio lombar firme', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000601000003', '44444444-dddd-4000-8000-000600000001', '26eff26e-8084-4c54-a03d-50583044c7b9', 4, 3, '10/10', 60, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000601000004', '44444444-dddd-4000-8000-000600000001', '4e3db545-25f9-43e5-8a41-3b9564168a31', 5, 3, '12', 60, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000601000005', '44444444-dddd-4000-8000-000600000001', '30a99ec7-0c7b-4e96-9989-cc0f17df5dba', 6, 4, '10-12', 60, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000601000006', '44444444-dddd-4000-8000-000600000001', '290e96ea-f6a4-488a-afc1-48c0c2e1c154', 7, 3, '12', 45, 'Antebraço grosso', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-000600000002', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'ed29f6bd-a124-42b8-860f-8a48f4228b95', 'Treino C — Pernas Completo', 'Quadríceps + posterior + glúteo + panturrilha. O treino mais pesado da semana.', ARRAY[1]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000602000000', '44444444-dddd-4000-8000-000600000002', '126b3344-9db1-4d41-ad4a-31433a419742', 1, 5, '6-8', 120, 'Aquecer escala 50/70/90% antes', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000602000001', '44444444-dddd-4000-8000-000600000002', 'c2fb7968-00ed-450d-b4c2-580181581c5b', 2, 4, '10-12', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000602000002', '44444444-dddd-4000-8000-000600000002', '8cfd7d5c-e008-4346-b195-109de4b90903', 3, 3, '12-15', 60, 'Drop-set no último', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000602000003', '44444444-dddd-4000-8000-000600000002', '0a864cbb-da5d-443c-9de6-acbad10b1ede', 4, 4, '10', 90, 'Sentir o posterior', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000602000004', '44444444-dddd-4000-8000-000600000002', '565ab11f-3c3b-4c0f-90f2-e23612a7b93b', 5, 3, '12', 60, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000602000005', '44444444-dddd-4000-8000-000600000002', '422337c9-777f-4724-ac1b-947551ecf837', 6, 4, '10-12', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000602000006', '44444444-dddd-4000-8000-000600000002', '488b2ab9-9631-468c-b271-d9ab7da081f3', 7, 4, '15-20', 45, 'Pico de contração 1s', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-000700000000', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'ab9768a5-a3a4-4163-bb63-5e771cf173fe', 'Força Total', 'Treino full-body 3x/semana. Padrões de movimento básicos com carga.', ARRAY[1,3,5]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000700000000', '44444444-dddd-4000-8000-000700000000', '126b3344-9db1-4d41-ad4a-31433a419742', 1, 4, '5-6', 120, 'Carga pesada', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000700000001', '44444444-dddd-4000-8000-000700000000', '9f10bf5b-7d81-4c85-ae25-36fbed40fdf0', 2, 4, '5-6', 120, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000700000002', '44444444-dddd-4000-8000-000700000000', '75ab605c-1ea9-4a3e-8096-65923cc81b70', 3, 4, '5-6', 120, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000700000003', '44444444-dddd-4000-8000-000700000000', '0877dedf-cb3e-47b2-919a-fd87c9201727', 4, 4, '6-8', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000700000004', '44444444-dddd-4000-8000-000700000000', '138840d5-b1ce-4775-a796-d73c7e95ba7b', 5, 3, '8', 120, 'Foco na pegada', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-000700000001', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'ab9768a5-a3a4-4163-bb63-5e771cf173fe', 'Treino C — Pernas Completo', 'Quadríceps + posterior + glúteo + panturrilha. O treino mais pesado da semana.', ARRAY[1,3]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000701000000', '44444444-dddd-4000-8000-000700000001', '126b3344-9db1-4d41-ad4a-31433a419742', 1, 5, '6-8', 120, 'Aquecer escala 50/70/90% antes', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000701000001', '44444444-dddd-4000-8000-000700000001', 'c2fb7968-00ed-450d-b4c2-580181581c5b', 2, 4, '10-12', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000701000002', '44444444-dddd-4000-8000-000700000001', '8cfd7d5c-e008-4346-b195-109de4b90903', 3, 3, '12-15', 60, 'Drop-set no último', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000701000003', '44444444-dddd-4000-8000-000700000001', '0a864cbb-da5d-443c-9de6-acbad10b1ede', 4, 4, '10', 90, 'Sentir o posterior', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000701000004', '44444444-dddd-4000-8000-000700000001', '565ab11f-3c3b-4c0f-90f2-e23612a7b93b', 5, 3, '12', 60, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000701000005', '44444444-dddd-4000-8000-000700000001', '422337c9-777f-4724-ac1b-947551ecf837', 6, 4, '10-12', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000701000006', '44444444-dddd-4000-8000-000700000001', '488b2ab9-9631-468c-b271-d9ab7da081f3', 7, 4, '15-20', 45, 'Pico de contração 1s', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-000800000000', '918ed85f-e58a-4edf-bb1b-761f032e0019', '02420861-f44e-4be0-9f2e-ffcf300add7d', 'Treino A — Peito + Tríceps', 'Empurrar pesado, fechar com tríceps. 4-5 séries por exercício.', ARRAY[1,3,5]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000800000000', '44444444-dddd-4000-8000-000800000000', '9f10bf5b-7d81-4c85-ae25-36fbed40fdf0', 1, 4, '8-10', 90, 'Aquecer 2 sets antes', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000800000001', '44444444-dddd-4000-8000-000800000000', 'e87f5466-0540-4b2f-bda8-0e1a8d17811e', 2, 3, '10-12', 75, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000800000002', '44444444-dddd-4000-8000-000800000000', 'f48dc039-fff8-4778-b95e-d00f48428c01', 3, 3, '12-15', 60, 'Foco no estiramento', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000800000003', '44444444-dddd-4000-8000-000800000000', '0fb935f1-a3cb-4e5b-9189-19e8713afc1e', 4, 3, '15', 60, 'Cabos altos pra meio do peito', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000800000004', '44444444-dddd-4000-8000-000800000000', 'fdef2134-3740-40c0-bc71-dd64ebb3fa6e', 5, 4, '12-15', 60, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000800000005', '44444444-dddd-4000-8000-000800000000', '03fdf02b-ea8f-401a-a8cd-7412f8991c0d', 6, 3, '10-12', 75, 'Cuidado com cotovelos', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000800000006', '44444444-dddd-4000-8000-000800000000', '6931f666-f702-4a1b-8671-901347e0d8b0', 7, 3, 'AMRAP', 60, 'Até a falha técnica', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-000800000001', '918ed85f-e58a-4edf-bb1b-761f032e0019', '02420861-f44e-4be0-9f2e-ffcf300add7d', 'Treino B — Costas + Bíceps', 'Largura, espessura, fechar com bíceps. Concentração na contração.', ARRAY[1,3]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000801000000', '44444444-dddd-4000-8000-000800000001', 'c9940cba-ae26-4c92-ad77-591f2a240b67', 1, 4, 'AMRAP', 90, 'Pode usar elástico', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000801000001', '44444444-dddd-4000-8000-000800000001', '52346783-6f40-4812-9d49-8f66e4b63fa3', 2, 3, '10-12', 75, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000801000002', '44444444-dddd-4000-8000-000800000001', '75ab605c-1ea9-4a3e-8096-65923cc81b70', 3, 4, '8-10', 90, 'Apoio lombar firme', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000801000003', '44444444-dddd-4000-8000-000800000001', '26eff26e-8084-4c54-a03d-50583044c7b9', 4, 3, '10/10', 60, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000801000004', '44444444-dddd-4000-8000-000800000001', '4e3db545-25f9-43e5-8a41-3b9564168a31', 5, 3, '12', 60, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000801000005', '44444444-dddd-4000-8000-000800000001', '30a99ec7-0c7b-4e96-9989-cc0f17df5dba', 6, 4, '10-12', 60, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000801000006', '44444444-dddd-4000-8000-000800000001', '290e96ea-f6a4-488a-afc1-48c0c2e1c154', 7, 3, '12', 45, 'Antebraço grosso', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-000800000002', '918ed85f-e58a-4edf-bb1b-761f032e0019', '02420861-f44e-4be0-9f2e-ffcf300add7d', 'Treino C — Pernas Completo', 'Quadríceps + posterior + glúteo + panturrilha. O treino mais pesado da semana.', ARRAY[1]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000802000000', '44444444-dddd-4000-8000-000800000002', '126b3344-9db1-4d41-ad4a-31433a419742', 1, 5, '6-8', 120, 'Aquecer escala 50/70/90% antes', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000802000001', '44444444-dddd-4000-8000-000800000002', 'c2fb7968-00ed-450d-b4c2-580181581c5b', 2, 4, '10-12', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000802000002', '44444444-dddd-4000-8000-000800000002', '8cfd7d5c-e008-4346-b195-109de4b90903', 3, 3, '12-15', 60, 'Drop-set no último', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000802000003', '44444444-dddd-4000-8000-000800000002', '0a864cbb-da5d-443c-9de6-acbad10b1ede', 4, 4, '10', 90, 'Sentir o posterior', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000802000004', '44444444-dddd-4000-8000-000800000002', '565ab11f-3c3b-4c0f-90f2-e23612a7b93b', 5, 3, '12', 60, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000802000005', '44444444-dddd-4000-8000-000800000002', '422337c9-777f-4724-ac1b-947551ecf837', 6, 4, '10-12', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000802000006', '44444444-dddd-4000-8000-000800000002', '488b2ab9-9631-468c-b271-d9ab7da081f3', 7, 4, '15-20', 45, 'Pico de contração 1s', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-000900000000', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'f08264bc-8c9b-4ae8-a25b-0ca1e0c603b2', 'Cardio + Core', '30min de cardio + circuito de abdômen. Ideal pra dia entre treinos pesados.', ARRAY[1,3,5]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000900000000', '44444444-dddd-4000-8000-000900000000', 'eea13713-483b-435f-a613-8344cf5a590a', 1, 4, '45', 30, 'Em segundos', 'seconds')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000900000001', '44444444-dddd-4000-8000-000900000000', 'ce5335a5-ac62-454d-9e71-3c5729823ff8', 2, 3, '30/30', 30, 'Cada lado', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000900000002', '44444444-dddd-4000-8000-000900000000', '1090cf46-159c-48d4-9a0b-25cea6375bd6', 3, 4, '20', 30, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000900000003', '44444444-dddd-4000-8000-000900000000', 'a820facc-f5cb-46bd-ab8d-143d63160c8a', 4, 4, '15', 30, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000900000004', '44444444-dddd-4000-8000-000900000000', '35c0fab1-cda6-48e9-b97b-0c5221c737a2', 5, 3, '20', 45, 'Halter 5kg', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-000900000001', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'f08264bc-8c9b-4ae8-a25b-0ca1e0c603b2', 'Força Total', 'Treino full-body 3x/semana. Padrões de movimento básicos com carga.', ARRAY[1,3]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000901000000', '44444444-dddd-4000-8000-000900000001', '126b3344-9db1-4d41-ad4a-31433a419742', 1, 4, '5-6', 120, 'Carga pesada', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000901000001', '44444444-dddd-4000-8000-000900000001', '9f10bf5b-7d81-4c85-ae25-36fbed40fdf0', 2, 4, '5-6', 120, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000901000002', '44444444-dddd-4000-8000-000900000001', '75ab605c-1ea9-4a3e-8096-65923cc81b70', 3, 4, '5-6', 120, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000901000003', '44444444-dddd-4000-8000-000900000001', '0877dedf-cb3e-47b2-919a-fd87c9201727', 4, 4, '6-8', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000901000004', '44444444-dddd-4000-8000-000900000001', '138840d5-b1ce-4775-a796-d73c7e95ba7b', 5, 3, '8', 120, 'Foco na pegada', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-001000000000', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'cc659e82-dd94-4de4-9657-3166e7ad37ec', 'Cardio + Core', '30min de cardio + circuito de abdômen. Ideal pra dia entre treinos pesados.', ARRAY[1,3,5]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000a00000000', '44444444-dddd-4000-8000-001000000000', 'eea13713-483b-435f-a613-8344cf5a590a', 1, 4, '45', 30, 'Em segundos', 'seconds')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000a00000001', '44444444-dddd-4000-8000-001000000000', 'ce5335a5-ac62-454d-9e71-3c5729823ff8', 2, 3, '30/30', 30, 'Cada lado', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000a00000002', '44444444-dddd-4000-8000-001000000000', '1090cf46-159c-48d4-9a0b-25cea6375bd6', 3, 4, '20', 30, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000a00000003', '44444444-dddd-4000-8000-001000000000', 'a820facc-f5cb-46bd-ab8d-143d63160c8a', 4, 4, '15', 30, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000a00000004', '44444444-dddd-4000-8000-001000000000', '35c0fab1-cda6-48e9-b97b-0c5221c737a2', 5, 3, '20', 45, 'Halter 5kg', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-001000000001', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'cc659e82-dd94-4de4-9657-3166e7ad37ec', 'Glúteo Forte', 'Treino dedicado pra hipertrofia de glúteo. Foco mental no músculo.', ARRAY[1,3]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000a01000000', '44444444-dddd-4000-8000-001000000001', '422337c9-777f-4724-ac1b-947551ecf837', 1, 5, '8-10', 90, 'Carga pesada', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000a01000001', '44444444-dddd-4000-8000-001000000001', '7698e261-7b25-424b-ad79-b13294f67572', 2, 4, '12', 75, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000a01000002', '44444444-dddd-4000-8000-001000000001', '18706e94-d76a-4589-bffa-1e555c051c2f', 3, 4, '12/12', 45, 'Controle excêntrico', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000a01000003', '44444444-dddd-4000-8000-001000000001', '3155ff5f-f1e2-4c28-aa03-d710ea7d76ff', 4, 4, '15', 45, 'Inclinar tronco à frente', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000a01000004', '44444444-dddd-4000-8000-001000000001', '396ecfb1-494c-42ef-a9ba-bfb432df3bb2', 5, 3, '10/10', 75, 'Passada longa', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000a01000005', '44444444-dddd-4000-8000-001000000001', '138840d5-b1ce-4775-a796-d73c7e95ba7b', 6, 3, '10', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-001100000000', '918ed85f-e58a-4edf-bb1b-761f032e0019', '73c55850-2352-4f24-9cd7-73c171d6a012', 'Treino A — Peito + Tríceps', 'Empurrar pesado, fechar com tríceps. 4-5 séries por exercício.', ARRAY[1,3,5]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000b00000000', '44444444-dddd-4000-8000-001100000000', '9f10bf5b-7d81-4c85-ae25-36fbed40fdf0', 1, 4, '8-10', 90, 'Aquecer 2 sets antes', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000b00000001', '44444444-dddd-4000-8000-001100000000', 'e87f5466-0540-4b2f-bda8-0e1a8d17811e', 2, 3, '10-12', 75, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000b00000002', '44444444-dddd-4000-8000-001100000000', 'f48dc039-fff8-4778-b95e-d00f48428c01', 3, 3, '12-15', 60, 'Foco no estiramento', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000b00000003', '44444444-dddd-4000-8000-001100000000', '0fb935f1-a3cb-4e5b-9189-19e8713afc1e', 4, 3, '15', 60, 'Cabos altos pra meio do peito', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000b00000004', '44444444-dddd-4000-8000-001100000000', 'fdef2134-3740-40c0-bc71-dd64ebb3fa6e', 5, 4, '12-15', 60, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000b00000005', '44444444-dddd-4000-8000-001100000000', '03fdf02b-ea8f-401a-a8cd-7412f8991c0d', 6, 3, '10-12', 75, 'Cuidado com cotovelos', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000b00000006', '44444444-dddd-4000-8000-001100000000', '6931f666-f702-4a1b-8671-901347e0d8b0', 7, 3, 'AMRAP', 60, 'Até a falha técnica', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-001100000001', '918ed85f-e58a-4edf-bb1b-761f032e0019', '73c55850-2352-4f24-9cd7-73c171d6a012', 'Treino B — Costas + Bíceps', 'Largura, espessura, fechar com bíceps. Concentração na contração.', ARRAY[1,3]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000b01000000', '44444444-dddd-4000-8000-001100000001', 'c9940cba-ae26-4c92-ad77-591f2a240b67', 1, 4, 'AMRAP', 90, 'Pode usar elástico', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000b01000001', '44444444-dddd-4000-8000-001100000001', '52346783-6f40-4812-9d49-8f66e4b63fa3', 2, 3, '10-12', 75, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000b01000002', '44444444-dddd-4000-8000-001100000001', '75ab605c-1ea9-4a3e-8096-65923cc81b70', 3, 4, '8-10', 90, 'Apoio lombar firme', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000b01000003', '44444444-dddd-4000-8000-001100000001', '26eff26e-8084-4c54-a03d-50583044c7b9', 4, 3, '10/10', 60, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000b01000004', '44444444-dddd-4000-8000-001100000001', '4e3db545-25f9-43e5-8a41-3b9564168a31', 5, 3, '12', 60, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000b01000005', '44444444-dddd-4000-8000-001100000001', '30a99ec7-0c7b-4e96-9989-cc0f17df5dba', 6, 4, '10-12', 60, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000b01000006', '44444444-dddd-4000-8000-001100000001', '290e96ea-f6a4-488a-afc1-48c0c2e1c154', 7, 3, '12', 45, 'Antebraço grosso', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-001100000002', '918ed85f-e58a-4edf-bb1b-761f032e0019', '73c55850-2352-4f24-9cd7-73c171d6a012', 'Treino C — Pernas Completo', 'Quadríceps + posterior + glúteo + panturrilha. O treino mais pesado da semana.', ARRAY[1]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000b02000000', '44444444-dddd-4000-8000-001100000002', '126b3344-9db1-4d41-ad4a-31433a419742', 1, 5, '6-8', 120, 'Aquecer escala 50/70/90% antes', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000b02000001', '44444444-dddd-4000-8000-001100000002', 'c2fb7968-00ed-450d-b4c2-580181581c5b', 2, 4, '10-12', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000b02000002', '44444444-dddd-4000-8000-001100000002', '8cfd7d5c-e008-4346-b195-109de4b90903', 3, 3, '12-15', 60, 'Drop-set no último', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000b02000003', '44444444-dddd-4000-8000-001100000002', '0a864cbb-da5d-443c-9de6-acbad10b1ede', 4, 4, '10', 90, 'Sentir o posterior', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000b02000004', '44444444-dddd-4000-8000-001100000002', '565ab11f-3c3b-4c0f-90f2-e23612a7b93b', 5, 3, '12', 60, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000b02000005', '44444444-dddd-4000-8000-001100000002', '422337c9-777f-4724-ac1b-947551ecf837', 6, 4, '10-12', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000b02000006', '44444444-dddd-4000-8000-001100000002', '488b2ab9-9631-468c-b271-d9ab7da081f3', 7, 4, '15-20', 45, 'Pico de contração 1s', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-001200000000', '918ed85f-e58a-4edf-bb1b-761f032e0019', '22304a85-7ce5-4bbc-b9c6-420edb71203a', 'Glúteo Forte', 'Treino dedicado pra hipertrofia de glúteo. Foco mental no músculo.', ARRAY[1,3,5]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000c00000000', '44444444-dddd-4000-8000-001200000000', '422337c9-777f-4724-ac1b-947551ecf837', 1, 5, '8-10', 90, 'Carga pesada', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000c00000001', '44444444-dddd-4000-8000-001200000000', '7698e261-7b25-424b-ad79-b13294f67572', 2, 4, '12', 75, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000c00000002', '44444444-dddd-4000-8000-001200000000', '18706e94-d76a-4589-bffa-1e555c051c2f', 3, 4, '12/12', 45, 'Controle excêntrico', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000c00000003', '44444444-dddd-4000-8000-001200000000', '3155ff5f-f1e2-4c28-aa03-d710ea7d76ff', 4, 4, '15', 45, 'Inclinar tronco à frente', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000c00000004', '44444444-dddd-4000-8000-001200000000', '396ecfb1-494c-42ef-a9ba-bfb432df3bb2', 5, 3, '10/10', 75, 'Passada longa', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000c00000005', '44444444-dddd-4000-8000-001200000000', '138840d5-b1ce-4775-a796-d73c7e95ba7b', 6, 3, '10', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-001200000001', '918ed85f-e58a-4edf-bb1b-761f032e0019', '22304a85-7ce5-4bbc-b9c6-420edb71203a', 'Cardio + Core', '30min de cardio + circuito de abdômen. Ideal pra dia entre treinos pesados.', ARRAY[1,3]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000c01000000', '44444444-dddd-4000-8000-001200000001', 'eea13713-483b-435f-a613-8344cf5a590a', 1, 4, '45', 30, 'Em segundos', 'seconds')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000c01000001', '44444444-dddd-4000-8000-001200000001', 'ce5335a5-ac62-454d-9e71-3c5729823ff8', 2, 3, '30/30', 30, 'Cada lado', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000c01000002', '44444444-dddd-4000-8000-001200000001', '1090cf46-159c-48d4-9a0b-25cea6375bd6', 3, 4, '20', 30, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000c01000003', '44444444-dddd-4000-8000-001200000001', 'a820facc-f5cb-46bd-ab8d-143d63160c8a', 4, 4, '15', 30, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000c01000004', '44444444-dddd-4000-8000-001200000001', '35c0fab1-cda6-48e9-b97b-0c5221c737a2', 5, 3, '20', 45, 'Halter 5kg', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-001200000002', '918ed85f-e58a-4edf-bb1b-761f032e0019', '22304a85-7ce5-4bbc-b9c6-420edb71203a', 'Treino C — Pernas Completo', 'Quadríceps + posterior + glúteo + panturrilha. O treino mais pesado da semana.', ARRAY[1]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000c02000000', '44444444-dddd-4000-8000-001200000002', '126b3344-9db1-4d41-ad4a-31433a419742', 1, 5, '6-8', 120, 'Aquecer escala 50/70/90% antes', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000c02000001', '44444444-dddd-4000-8000-001200000002', 'c2fb7968-00ed-450d-b4c2-580181581c5b', 2, 4, '10-12', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000c02000002', '44444444-dddd-4000-8000-001200000002', '8cfd7d5c-e008-4346-b195-109de4b90903', 3, 3, '12-15', 60, 'Drop-set no último', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000c02000003', '44444444-dddd-4000-8000-001200000002', '0a864cbb-da5d-443c-9de6-acbad10b1ede', 4, 4, '10', 90, 'Sentir o posterior', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000c02000004', '44444444-dddd-4000-8000-001200000002', '565ab11f-3c3b-4c0f-90f2-e23612a7b93b', 5, 3, '12', 60, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000c02000005', '44444444-dddd-4000-8000-001200000002', '422337c9-777f-4724-ac1b-947551ecf837', 6, 4, '10-12', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000c02000006', '44444444-dddd-4000-8000-001200000002', '488b2ab9-9631-468c-b271-d9ab7da081f3', 7, 4, '15-20', 45, 'Pico de contração 1s', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-001300000000', '918ed85f-e58a-4edf-bb1b-761f032e0019', '95795cb4-e6c9-485b-8c07-656108993343', 'Glúteo Forte', 'Treino dedicado pra hipertrofia de glúteo. Foco mental no músculo.', ARRAY[1,3,5]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000d00000000', '44444444-dddd-4000-8000-001300000000', '422337c9-777f-4724-ac1b-947551ecf837', 1, 5, '8-10', 90, 'Carga pesada', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000d00000001', '44444444-dddd-4000-8000-001300000000', '7698e261-7b25-424b-ad79-b13294f67572', 2, 4, '12', 75, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000d00000002', '44444444-dddd-4000-8000-001300000000', '18706e94-d76a-4589-bffa-1e555c051c2f', 3, 4, '12/12', 45, 'Controle excêntrico', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000d00000003', '44444444-dddd-4000-8000-001300000000', '3155ff5f-f1e2-4c28-aa03-d710ea7d76ff', 4, 4, '15', 45, 'Inclinar tronco à frente', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000d00000004', '44444444-dddd-4000-8000-001300000000', '396ecfb1-494c-42ef-a9ba-bfb432df3bb2', 5, 3, '10/10', 75, 'Passada longa', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000d00000005', '44444444-dddd-4000-8000-001300000000', '138840d5-b1ce-4775-a796-d73c7e95ba7b', 6, 3, '10', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-001300000001', '918ed85f-e58a-4edf-bb1b-761f032e0019', '95795cb4-e6c9-485b-8c07-656108993343', 'Cardio + Core', '30min de cardio + circuito de abdômen. Ideal pra dia entre treinos pesados.', ARRAY[1,3]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000d01000000', '44444444-dddd-4000-8000-001300000001', 'eea13713-483b-435f-a613-8344cf5a590a', 1, 4, '45', 30, 'Em segundos', 'seconds')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000d01000001', '44444444-dddd-4000-8000-001300000001', 'ce5335a5-ac62-454d-9e71-3c5729823ff8', 2, 3, '30/30', 30, 'Cada lado', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000d01000002', '44444444-dddd-4000-8000-001300000001', '1090cf46-159c-48d4-9a0b-25cea6375bd6', 3, 4, '20', 30, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000d01000003', '44444444-dddd-4000-8000-001300000001', 'a820facc-f5cb-46bd-ab8d-143d63160c8a', 4, 4, '15', 30, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000d01000004', '44444444-dddd-4000-8000-001300000001', '35c0fab1-cda6-48e9-b97b-0c5221c737a2', 5, 3, '20', 45, 'Halter 5kg', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-001300000002', '918ed85f-e58a-4edf-bb1b-761f032e0019', '95795cb4-e6c9-485b-8c07-656108993343', 'Treino C — Pernas Completo', 'Quadríceps + posterior + glúteo + panturrilha. O treino mais pesado da semana.', ARRAY[1]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000d02000000', '44444444-dddd-4000-8000-001300000002', '126b3344-9db1-4d41-ad4a-31433a419742', 1, 5, '6-8', 120, 'Aquecer escala 50/70/90% antes', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000d02000001', '44444444-dddd-4000-8000-001300000002', 'c2fb7968-00ed-450d-b4c2-580181581c5b', 2, 4, '10-12', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000d02000002', '44444444-dddd-4000-8000-001300000002', '8cfd7d5c-e008-4346-b195-109de4b90903', 3, 3, '12-15', 60, 'Drop-set no último', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000d02000003', '44444444-dddd-4000-8000-001300000002', '0a864cbb-da5d-443c-9de6-acbad10b1ede', 4, 4, '10', 90, 'Sentir o posterior', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000d02000004', '44444444-dddd-4000-8000-001300000002', '565ab11f-3c3b-4c0f-90f2-e23612a7b93b', 5, 3, '12', 60, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000d02000005', '44444444-dddd-4000-8000-001300000002', '422337c9-777f-4724-ac1b-947551ecf837', 6, 4, '10-12', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000d02000006', '44444444-dddd-4000-8000-001300000002', '488b2ab9-9631-468c-b271-d9ab7da081f3', 7, 4, '15-20', 45, 'Pico de contração 1s', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-001400000000', '918ed85f-e58a-4edf-bb1b-761f032e0019', '6fc4ba15-472a-46ef-8f33-98d933723437', 'Cardio + Core', '30min de cardio + circuito de abdômen. Ideal pra dia entre treinos pesados.', ARRAY[1,3,5]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000e00000000', '44444444-dddd-4000-8000-001400000000', 'eea13713-483b-435f-a613-8344cf5a590a', 1, 4, '45', 30, 'Em segundos', 'seconds')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000e00000001', '44444444-dddd-4000-8000-001400000000', 'ce5335a5-ac62-454d-9e71-3c5729823ff8', 2, 3, '30/30', 30, 'Cada lado', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000e00000002', '44444444-dddd-4000-8000-001400000000', '1090cf46-159c-48d4-9a0b-25cea6375bd6', 3, 4, '20', 30, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000e00000003', '44444444-dddd-4000-8000-001400000000', 'a820facc-f5cb-46bd-ab8d-143d63160c8a', 4, 4, '15', 30, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000e00000004', '44444444-dddd-4000-8000-001400000000', '35c0fab1-cda6-48e9-b97b-0c5221c737a2', 5, 3, '20', 45, 'Halter 5kg', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-001400000001', '918ed85f-e58a-4edf-bb1b-761f032e0019', '6fc4ba15-472a-46ef-8f33-98d933723437', 'Força Total', 'Treino full-body 3x/semana. Padrões de movimento básicos com carga.', ARRAY[1,3]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000e01000000', '44444444-dddd-4000-8000-001400000001', '126b3344-9db1-4d41-ad4a-31433a419742', 1, 4, '5-6', 120, 'Carga pesada', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000e01000001', '44444444-dddd-4000-8000-001400000001', '9f10bf5b-7d81-4c85-ae25-36fbed40fdf0', 2, 4, '5-6', 120, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000e01000002', '44444444-dddd-4000-8000-001400000001', '75ab605c-1ea9-4a3e-8096-65923cc81b70', 3, 4, '5-6', 120, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000e01000003', '44444444-dddd-4000-8000-001400000001', '0877dedf-cb3e-47b2-919a-fd87c9201727', 4, 4, '6-8', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000e01000004', '44444444-dddd-4000-8000-001400000001', '138840d5-b1ce-4775-a796-d73c7e95ba7b', 5, 3, '8', 120, 'Foco na pegada', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-001500000000', '918ed85f-e58a-4edf-bb1b-761f032e0019', '111eca04-631d-4fbe-a9ef-0506487fc459', 'Glúteo Forte', 'Treino dedicado pra hipertrofia de glúteo. Foco mental no músculo.', ARRAY[1,3,5]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000f00000000', '44444444-dddd-4000-8000-001500000000', '422337c9-777f-4724-ac1b-947551ecf837', 1, 5, '8-10', 90, 'Carga pesada', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000f00000001', '44444444-dddd-4000-8000-001500000000', '7698e261-7b25-424b-ad79-b13294f67572', 2, 4, '12', 75, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000f00000002', '44444444-dddd-4000-8000-001500000000', '18706e94-d76a-4589-bffa-1e555c051c2f', 3, 4, '12/12', 45, 'Controle excêntrico', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000f00000003', '44444444-dddd-4000-8000-001500000000', '3155ff5f-f1e2-4c28-aa03-d710ea7d76ff', 4, 4, '15', 45, 'Inclinar tronco à frente', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000f00000004', '44444444-dddd-4000-8000-001500000000', '396ecfb1-494c-42ef-a9ba-bfb432df3bb2', 5, 3, '10/10', 75, 'Passada longa', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000f00000005', '44444444-dddd-4000-8000-001500000000', '138840d5-b1ce-4775-a796-d73c7e95ba7b', 6, 3, '10', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-001500000001', '918ed85f-e58a-4edf-bb1b-761f032e0019', '111eca04-631d-4fbe-a9ef-0506487fc459', 'Cardio + Core', '30min de cardio + circuito de abdômen. Ideal pra dia entre treinos pesados.', ARRAY[1,3]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000f01000000', '44444444-dddd-4000-8000-001500000001', 'eea13713-483b-435f-a613-8344cf5a590a', 1, 4, '45', 30, 'Em segundos', 'seconds')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000f01000001', '44444444-dddd-4000-8000-001500000001', 'ce5335a5-ac62-454d-9e71-3c5729823ff8', 2, 3, '30/30', 30, 'Cada lado', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000f01000002', '44444444-dddd-4000-8000-001500000001', '1090cf46-159c-48d4-9a0b-25cea6375bd6', 3, 4, '20', 30, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000f01000003', '44444444-dddd-4000-8000-001500000001', 'a820facc-f5cb-46bd-ab8d-143d63160c8a', 4, 4, '15', 30, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000f01000004', '44444444-dddd-4000-8000-001500000001', '35c0fab1-cda6-48e9-b97b-0c5221c737a2', 5, 3, '20', 45, 'Halter 5kg', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workouts (id, tenant_id, student_id, title, description, scheduled_days, active)
VALUES ('44444444-dddd-4000-8000-001500000002', '918ed85f-e58a-4edf-bb1b-761f032e0019', '111eca04-631d-4fbe-a9ef-0506487fc459', 'Treino C — Pernas Completo', 'Quadríceps + posterior + glúteo + panturrilha. O treino mais pesado da semana.', ARRAY[1]::int[], TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000f02000000', '44444444-dddd-4000-8000-001500000002', '126b3344-9db1-4d41-ad4a-31433a419742', 1, 5, '6-8', 120, 'Aquecer escala 50/70/90% antes', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000f02000001', '44444444-dddd-4000-8000-001500000002', 'c2fb7968-00ed-450d-b4c2-580181581c5b', 2, 4, '10-12', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000f02000002', '44444444-dddd-4000-8000-001500000002', '8cfd7d5c-e008-4346-b195-109de4b90903', 3, 3, '12-15', 60, 'Drop-set no último', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000f02000003', '44444444-dddd-4000-8000-001500000002', '0a864cbb-da5d-443c-9de6-acbad10b1ede', 4, 4, '10', 90, 'Sentir o posterior', 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000f02000004', '44444444-dddd-4000-8000-001500000002', '565ab11f-3c3b-4c0f-90f2-e23612a7b93b', 5, 3, '12', 60, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000f02000005', '44444444-dddd-4000-8000-001500000002', '422337c9-777f-4724-ac1b-947551ecf837', 6, 4, '10-12', 90, NULL, 'reps')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workout_items (id, workout_id, exercise_id, position, sets, reps, rest_seconds, notes, mode)
VALUES ('55555555-eeee-4000-8000-000f02000006', '44444444-dddd-4000-8000-001500000002', '488b2ab9-9631-468c-b271-d9ab7da081f3', 7, 4, '15-20', 45, 'Pico de contração 1s', 'reps')
ON CONFLICT (id) DO NOTHING;

-- ============ WORKOUT_LOGS (~80) + EXERCISE_LOGS ============
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000001', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000000000001', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-05-07T07:00:00.000Z'::timestamptz, '2026-05-07T07:47:00.000Z'::timestamptz, 47, 6, 'Pesado mas saiu.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000001', '55555555-eeee-4000-8000-000001000000', 1, 45, 8.3), ('66666666-7777-4000-8000-000000000001', '55555555-eeee-4000-8000-000001000000', 2, 45, 19.5), ('66666666-7777-4000-8000-000000000001', '55555555-eeee-4000-8000-000001000000', 3, 45, 42), ('66666666-7777-4000-8000-000000000001', '55555555-eeee-4000-8000-000001000001', 1, 11, 35.9), ('66666666-7777-4000-8000-000000000001', '55555555-eeee-4000-8000-000001000001', 2, 12, 6.2), ('66666666-7777-4000-8000-000000000001', '55555555-eeee-4000-8000-000001000001', 3, 9, 23.6), ('66666666-7777-4000-8000-000000000001', '55555555-eeee-4000-8000-000001000002', 1, 20, 20.6), ('66666666-7777-4000-8000-000000000001', '55555555-eeee-4000-8000-000001000002', 2, 20, 50.8), ('66666666-7777-4000-8000-000000000001', '55555555-eeee-4000-8000-000001000002', 3, 20, 34.5), ('66666666-7777-4000-8000-000000000001', '55555555-eeee-4000-8000-000001000003', 1, 15, 16.3), ('66666666-7777-4000-8000-000000000001', '55555555-eeee-4000-8000-000001000003', 2, 15, 56.9), ('66666666-7777-4000-8000-000000000001', '55555555-eeee-4000-8000-000001000003', 3, 15, 57.4) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000002', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000000000002', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-05-06T08:00:00.000Z'::timestamptz, '2026-05-06T08:58:00.000Z'::timestamptz, 58, 8, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000002', '55555555-eeee-4000-8000-000002000000', 1, 12, 42.7), ('66666666-7777-4000-8000-000000000002', '55555555-eeee-4000-8000-000002000000', 2, 10, 49.5), ('66666666-7777-4000-8000-000000000002', '55555555-eeee-4000-8000-000002000000', 3, 9, 32.2), ('66666666-7777-4000-8000-000000000002', '55555555-eeee-4000-8000-000002000000', 4, 11, 35.2), ('66666666-7777-4000-8000-000000000002', '55555555-eeee-4000-8000-000002000001', 1, 11, 35.5), ('66666666-7777-4000-8000-000000000002', '55555555-eeee-4000-8000-000002000001', 2, 10, 58.2), ('66666666-7777-4000-8000-000000000002', '55555555-eeee-4000-8000-000002000001', 3, 12, 47.2), ('66666666-7777-4000-8000-000000000002', '55555555-eeee-4000-8000-000002000002', 1, 9, 39.7), ('66666666-7777-4000-8000-000000000002', '55555555-eeee-4000-8000-000002000002', 2, 11, 52.6), ('66666666-7777-4000-8000-000000000002', '55555555-eeee-4000-8000-000002000002', 3, 9, 53.3), ('66666666-7777-4000-8000-000000000002', '55555555-eeee-4000-8000-000002000003', 1, 10, 22.4), ('66666666-7777-4000-8000-000000000002', '55555555-eeee-4000-8000-000002000003', 2, 10, 53.4), ('66666666-7777-4000-8000-000000000002', '55555555-eeee-4000-8000-000002000003', 3, 10, 27.7), ('66666666-7777-4000-8000-000000000002', '55555555-eeee-4000-8000-000002000004', 1, 12, 23.7), ('66666666-7777-4000-8000-000000000002', '55555555-eeee-4000-8000-000002000004', 2, 12, 34.3), ('66666666-7777-4000-8000-000000000002', '55555555-eeee-4000-8000-000002000004', 3, 12, 51) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000003', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000000000000', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-05-05T09:00:00.000Z'::timestamptz, '2026-05-05T10:07:00.000Z'::timestamptz, 67, 8, 'Treino completo!')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000003', '55555555-eeee-4000-8000-000000000000', 1, 8, 20.8), ('66666666-7777-4000-8000-000000000003', '55555555-eeee-4000-8000-000000000000', 2, 12, 31.8), ('66666666-7777-4000-8000-000000000003', '55555555-eeee-4000-8000-000000000000', 3, 9, 39.7), ('66666666-7777-4000-8000-000000000003', '55555555-eeee-4000-8000-000000000000', 4, 11, 45.6), ('66666666-7777-4000-8000-000000000003', '55555555-eeee-4000-8000-000000000001', 1, 12, 44.3), ('66666666-7777-4000-8000-000000000003', '55555555-eeee-4000-8000-000000000001', 2, 12, 15.2), ('66666666-7777-4000-8000-000000000003', '55555555-eeee-4000-8000-000000000001', 3, 12, 51.6), ('66666666-7777-4000-8000-000000000003', '55555555-eeee-4000-8000-000000000002', 1, 12, 35), ('66666666-7777-4000-8000-000000000003', '55555555-eeee-4000-8000-000000000002', 2, 10, 9), ('66666666-7777-4000-8000-000000000003', '55555555-eeee-4000-8000-000000000002', 3, 10, 54.1), ('66666666-7777-4000-8000-000000000003', '55555555-eeee-4000-8000-000000000003', 1, 15, 42.1), ('66666666-7777-4000-8000-000000000003', '55555555-eeee-4000-8000-000000000003', 2, 15, 28.2), ('66666666-7777-4000-8000-000000000003', '55555555-eeee-4000-8000-000000000003', 3, 15, 29.4), ('66666666-7777-4000-8000-000000000003', '55555555-eeee-4000-8000-000000000004', 1, 11, 44.5), ('66666666-7777-4000-8000-000000000003', '55555555-eeee-4000-8000-000000000004', 2, 10, 7.4), ('66666666-7777-4000-8000-000000000003', '55555555-eeee-4000-8000-000000000004', 3, 8, 10.4) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000004', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000000000001', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-05-04T10:00:00.000Z'::timestamptz, '2026-05-04T10:54:00.000Z'::timestamptz, 54, 8, 'Foi top hoje.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000004', '55555555-eeee-4000-8000-000001000000', 1, 45, 51.1), ('66666666-7777-4000-8000-000000000004', '55555555-eeee-4000-8000-000001000000', 2, 45, 42.6), ('66666666-7777-4000-8000-000000000004', '55555555-eeee-4000-8000-000001000000', 3, 45, 9.7), ('66666666-7777-4000-8000-000000000004', '55555555-eeee-4000-8000-000001000001', 1, 8, 19.9), ('66666666-7777-4000-8000-000000000004', '55555555-eeee-4000-8000-000001000001', 2, 11, 19.8), ('66666666-7777-4000-8000-000000000004', '55555555-eeee-4000-8000-000001000001', 3, 12, 39.4), ('66666666-7777-4000-8000-000000000004', '55555555-eeee-4000-8000-000001000002', 1, 20, 55), ('66666666-7777-4000-8000-000000000004', '55555555-eeee-4000-8000-000001000002', 2, 20, 53.8), ('66666666-7777-4000-8000-000000000004', '55555555-eeee-4000-8000-000001000002', 3, 20, 24), ('66666666-7777-4000-8000-000000000004', '55555555-eeee-4000-8000-000001000003', 1, 15, 10.5), ('66666666-7777-4000-8000-000000000004', '55555555-eeee-4000-8000-000001000003', 2, 15, 39.5), ('66666666-7777-4000-8000-000000000004', '55555555-eeee-4000-8000-000001000003', 3, 15, 18.2) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000005', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000000000002', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-05-03T11:00:00.000Z'::timestamptz, '2026-05-03T11:52:00.000Z'::timestamptz, 52, 6, 'Treino completo!')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000005', '55555555-eeee-4000-8000-000002000000', 1, 11, 33.5), ('66666666-7777-4000-8000-000000000005', '55555555-eeee-4000-8000-000002000000', 2, 10, 37.6), ('66666666-7777-4000-8000-000000000005', '55555555-eeee-4000-8000-000002000000', 3, 8, 48), ('66666666-7777-4000-8000-000000000005', '55555555-eeee-4000-8000-000002000000', 4, 11, 55.5), ('66666666-7777-4000-8000-000000000005', '55555555-eeee-4000-8000-000002000001', 1, 8, 8.2), ('66666666-7777-4000-8000-000000000005', '55555555-eeee-4000-8000-000002000001', 2, 8, 23.7), ('66666666-7777-4000-8000-000000000005', '55555555-eeee-4000-8000-000002000001', 3, 9, 17.6), ('66666666-7777-4000-8000-000000000005', '55555555-eeee-4000-8000-000002000002', 1, 12, 37), ('66666666-7777-4000-8000-000000000005', '55555555-eeee-4000-8000-000002000002', 2, 12, 23.8), ('66666666-7777-4000-8000-000000000005', '55555555-eeee-4000-8000-000002000002', 3, 11, 6.8), ('66666666-7777-4000-8000-000000000005', '55555555-eeee-4000-8000-000002000003', 1, 10, 45.4), ('66666666-7777-4000-8000-000000000005', '55555555-eeee-4000-8000-000002000003', 2, 10, 48.9), ('66666666-7777-4000-8000-000000000005', '55555555-eeee-4000-8000-000002000003', 3, 10, 25.7), ('66666666-7777-4000-8000-000000000005', '55555555-eeee-4000-8000-000002000004', 1, 12, 16.2), ('66666666-7777-4000-8000-000000000005', '55555555-eeee-4000-8000-000002000004', 2, 12, 48.2), ('66666666-7777-4000-8000-000000000005', '55555555-eeee-4000-8000-000002000004', 3, 12, 32.8) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000006', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000000000000', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-05-02T12:00:00.000Z'::timestamptz, '2026-05-02T12:47:00.000Z'::timestamptz, 47, 8, 'Cabeça boa, treino bom.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000006', '55555555-eeee-4000-8000-000000000000', 1, 10, 52.9), ('66666666-7777-4000-8000-000000000006', '55555555-eeee-4000-8000-000000000000', 2, 11, 32.1), ('66666666-7777-4000-8000-000000000006', '55555555-eeee-4000-8000-000000000000', 3, 12, 14.6), ('66666666-7777-4000-8000-000000000006', '55555555-eeee-4000-8000-000000000000', 4, 8, 35.4), ('66666666-7777-4000-8000-000000000006', '55555555-eeee-4000-8000-000000000001', 1, 12, 42.1), ('66666666-7777-4000-8000-000000000006', '55555555-eeee-4000-8000-000000000001', 2, 12, 16.4), ('66666666-7777-4000-8000-000000000006', '55555555-eeee-4000-8000-000000000001', 3, 12, 47.4), ('66666666-7777-4000-8000-000000000006', '55555555-eeee-4000-8000-000000000002', 1, 9, 12.4), ('66666666-7777-4000-8000-000000000006', '55555555-eeee-4000-8000-000000000002', 2, 11, 38.2), ('66666666-7777-4000-8000-000000000006', '55555555-eeee-4000-8000-000000000002', 3, 10, 16.3), ('66666666-7777-4000-8000-000000000006', '55555555-eeee-4000-8000-000000000003', 1, 15, 55.7), ('66666666-7777-4000-8000-000000000006', '55555555-eeee-4000-8000-000000000003', 2, 15, 33.7), ('66666666-7777-4000-8000-000000000006', '55555555-eeee-4000-8000-000000000003', 3, 15, 46), ('66666666-7777-4000-8000-000000000006', '55555555-eeee-4000-8000-000000000004', 1, 8, 57.7), ('66666666-7777-4000-8000-000000000006', '55555555-eeee-4000-8000-000000000004', 2, 10, 20.6), ('66666666-7777-4000-8000-000000000006', '55555555-eeee-4000-8000-000000000004', 3, 8, 22.9) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000007', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000100000001', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-05-07T07:00:00.000Z'::timestamptz, '2026-05-07T08:04:00.000Z'::timestamptz, 64, 6, 'Foi top hoje.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000007', '55555555-eeee-4000-8000-000101000000', 1, 12, 30.1), ('66666666-7777-4000-8000-000000000007', '55555555-eeee-4000-8000-000101000000', 2, 8, 40.3), ('66666666-7777-4000-8000-000000000007', '55555555-eeee-4000-8000-000101000000', 3, 10, 15.4), ('66666666-7777-4000-8000-000000000007', '55555555-eeee-4000-8000-000101000000', 4, 12, 9.8), ('66666666-7777-4000-8000-000000000007', '55555555-eeee-4000-8000-000101000001', 1, 12, 12.5), ('66666666-7777-4000-8000-000000000007', '55555555-eeee-4000-8000-000101000001', 2, 12, 59.7), ('66666666-7777-4000-8000-000000000007', '55555555-eeee-4000-8000-000101000001', 3, 12, 16.6), ('66666666-7777-4000-8000-000000000007', '55555555-eeee-4000-8000-000101000002', 1, 10, 33), ('66666666-7777-4000-8000-000000000007', '55555555-eeee-4000-8000-000101000002', 2, 11, 31.6), ('66666666-7777-4000-8000-000000000007', '55555555-eeee-4000-8000-000101000002', 3, 11, 13.7), ('66666666-7777-4000-8000-000000000007', '55555555-eeee-4000-8000-000101000003', 1, 15, 58.8), ('66666666-7777-4000-8000-000000000007', '55555555-eeee-4000-8000-000101000003', 2, 15, 50.6), ('66666666-7777-4000-8000-000000000007', '55555555-eeee-4000-8000-000101000003', 3, 15, 24), ('66666666-7777-4000-8000-000000000007', '55555555-eeee-4000-8000-000101000004', 1, 9, 33.5), ('66666666-7777-4000-8000-000000000007', '55555555-eeee-4000-8000-000101000004', 2, 11, 29.5), ('66666666-7777-4000-8000-000000000007', '55555555-eeee-4000-8000-000101000004', 3, 10, 18.9) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000008', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000100000000', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-05-06T08:00:00.000Z'::timestamptz, '2026-05-06T08:45:00.000Z'::timestamptz, 45, 8, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000008', '55555555-eeee-4000-8000-000100000000', 1, 45, 25), ('66666666-7777-4000-8000-000000000008', '55555555-eeee-4000-8000-000100000000', 2, 45, 28.4), ('66666666-7777-4000-8000-000000000008', '55555555-eeee-4000-8000-000100000000', 3, 45, 18.8), ('66666666-7777-4000-8000-000000000008', '55555555-eeee-4000-8000-000100000001', 1, 10, 7.3), ('66666666-7777-4000-8000-000000000008', '55555555-eeee-4000-8000-000100000001', 2, 11, 8.6), ('66666666-7777-4000-8000-000000000008', '55555555-eeee-4000-8000-000100000001', 3, 12, 47), ('66666666-7777-4000-8000-000000000008', '55555555-eeee-4000-8000-000100000002', 1, 20, 41.2), ('66666666-7777-4000-8000-000000000008', '55555555-eeee-4000-8000-000100000002', 2, 20, 49.6), ('66666666-7777-4000-8000-000000000008', '55555555-eeee-4000-8000-000100000002', 3, 20, 8), ('66666666-7777-4000-8000-000000000008', '55555555-eeee-4000-8000-000100000003', 1, 15, 37.3), ('66666666-7777-4000-8000-000000000008', '55555555-eeee-4000-8000-000100000003', 2, 15, 35.2), ('66666666-7777-4000-8000-000000000008', '55555555-eeee-4000-8000-000100000003', 3, 15, 31.5) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000009', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000100000001', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-05-05T09:00:00.000Z'::timestamptz, '2026-05-05T09:57:00.000Z'::timestamptz, 57, 7, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000009', '55555555-eeee-4000-8000-000101000000', 1, 10, 5.9), ('66666666-7777-4000-8000-000000000009', '55555555-eeee-4000-8000-000101000000', 2, 11, 5.2), ('66666666-7777-4000-8000-000000000009', '55555555-eeee-4000-8000-000101000000', 3, 11, 15.1), ('66666666-7777-4000-8000-000000000009', '55555555-eeee-4000-8000-000101000000', 4, 9, 44.9), ('66666666-7777-4000-8000-000000000009', '55555555-eeee-4000-8000-000101000001', 1, 12, 56.2), ('66666666-7777-4000-8000-000000000009', '55555555-eeee-4000-8000-000101000001', 2, 12, 20.3), ('66666666-7777-4000-8000-000000000009', '55555555-eeee-4000-8000-000101000001', 3, 12, 39), ('66666666-7777-4000-8000-000000000009', '55555555-eeee-4000-8000-000101000002', 1, 12, 30.4), ('66666666-7777-4000-8000-000000000009', '55555555-eeee-4000-8000-000101000002', 2, 8, 36.2), ('66666666-7777-4000-8000-000000000009', '55555555-eeee-4000-8000-000101000002', 3, 10, 29.3), ('66666666-7777-4000-8000-000000000009', '55555555-eeee-4000-8000-000101000003', 1, 15, 30.8), ('66666666-7777-4000-8000-000000000009', '55555555-eeee-4000-8000-000101000003', 2, 15, 46.5), ('66666666-7777-4000-8000-000000000009', '55555555-eeee-4000-8000-000101000003', 3, 15, 11.7), ('66666666-7777-4000-8000-000000000009', '55555555-eeee-4000-8000-000101000004', 1, 11, 37.7), ('66666666-7777-4000-8000-000000000009', '55555555-eeee-4000-8000-000101000004', 2, 12, 50.8), ('66666666-7777-4000-8000-000000000009', '55555555-eeee-4000-8000-000101000004', 3, 10, 5.5) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000010', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000100000000', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-05-04T10:00:00.000Z'::timestamptz, '2026-05-04T10:46:00.000Z'::timestamptz, 46, 7, 'Treino completo!')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000010', '55555555-eeee-4000-8000-000100000000', 1, 45, 31.8), ('66666666-7777-4000-8000-000000000010', '55555555-eeee-4000-8000-000100000000', 2, 45, 42.5), ('66666666-7777-4000-8000-000000000010', '55555555-eeee-4000-8000-000100000000', 3, 45, 35.5), ('66666666-7777-4000-8000-000000000010', '55555555-eeee-4000-8000-000100000001', 1, 11, 51.9), ('66666666-7777-4000-8000-000000000010', '55555555-eeee-4000-8000-000100000001', 2, 11, 59.1), ('66666666-7777-4000-8000-000000000010', '55555555-eeee-4000-8000-000100000001', 3, 12, 58.2), ('66666666-7777-4000-8000-000000000010', '55555555-eeee-4000-8000-000100000002', 1, 20, 49.6), ('66666666-7777-4000-8000-000000000010', '55555555-eeee-4000-8000-000100000002', 2, 20, 57.7), ('66666666-7777-4000-8000-000000000010', '55555555-eeee-4000-8000-000100000002', 3, 20, 49.6), ('66666666-7777-4000-8000-000000000010', '55555555-eeee-4000-8000-000100000003', 1, 15, 13.8), ('66666666-7777-4000-8000-000000000010', '55555555-eeee-4000-8000-000100000003', 2, 15, 9.9), ('66666666-7777-4000-8000-000000000010', '55555555-eeee-4000-8000-000100000003', 3, 15, 59.6) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000011', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000100000001', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-05-03T11:00:00.000Z'::timestamptz, '2026-05-03T11:57:00.000Z'::timestamptz, 57, 8, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000011', '55555555-eeee-4000-8000-000101000000', 1, 11, 47.7), ('66666666-7777-4000-8000-000000000011', '55555555-eeee-4000-8000-000101000000', 2, 9, 51.2), ('66666666-7777-4000-8000-000000000011', '55555555-eeee-4000-8000-000101000000', 3, 10, 55.8), ('66666666-7777-4000-8000-000000000011', '55555555-eeee-4000-8000-000101000000', 4, 11, 18.8), ('66666666-7777-4000-8000-000000000011', '55555555-eeee-4000-8000-000101000001', 1, 12, 13.6), ('66666666-7777-4000-8000-000000000011', '55555555-eeee-4000-8000-000101000001', 2, 12, 25.6), ('66666666-7777-4000-8000-000000000011', '55555555-eeee-4000-8000-000101000001', 3, 12, 44.9), ('66666666-7777-4000-8000-000000000011', '55555555-eeee-4000-8000-000101000002', 1, 8, 12.6), ('66666666-7777-4000-8000-000000000011', '55555555-eeee-4000-8000-000101000002', 2, 9, 39.1), ('66666666-7777-4000-8000-000000000011', '55555555-eeee-4000-8000-000101000002', 3, 9, 39.9), ('66666666-7777-4000-8000-000000000011', '55555555-eeee-4000-8000-000101000003', 1, 15, 58.6), ('66666666-7777-4000-8000-000000000011', '55555555-eeee-4000-8000-000101000003', 2, 15, 27.5), ('66666666-7777-4000-8000-000000000011', '55555555-eeee-4000-8000-000101000003', 3, 15, 48.6), ('66666666-7777-4000-8000-000000000011', '55555555-eeee-4000-8000-000101000004', 1, 11, 5.9), ('66666666-7777-4000-8000-000000000011', '55555555-eeee-4000-8000-000101000004', 2, 11, 53.1), ('66666666-7777-4000-8000-000000000011', '55555555-eeee-4000-8000-000101000004', 3, 9, 37.6) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000012', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000100000000', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-05-02T12:00:00.000Z'::timestamptz, '2026-05-02T12:57:00.000Z'::timestamptz, 57, 7, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000012', '55555555-eeee-4000-8000-000100000000', 1, 45, 51.3), ('66666666-7777-4000-8000-000000000012', '55555555-eeee-4000-8000-000100000000', 2, 45, 39.7), ('66666666-7777-4000-8000-000000000012', '55555555-eeee-4000-8000-000100000000', 3, 45, 22.3), ('66666666-7777-4000-8000-000000000012', '55555555-eeee-4000-8000-000100000001', 1, 10, 34.1), ('66666666-7777-4000-8000-000000000012', '55555555-eeee-4000-8000-000100000001', 2, 12, 14.5), ('66666666-7777-4000-8000-000000000012', '55555555-eeee-4000-8000-000100000001', 3, 10, 9.1), ('66666666-7777-4000-8000-000000000012', '55555555-eeee-4000-8000-000100000002', 1, 20, 40.4), ('66666666-7777-4000-8000-000000000012', '55555555-eeee-4000-8000-000100000002', 2, 20, 48.8), ('66666666-7777-4000-8000-000000000012', '55555555-eeee-4000-8000-000100000002', 3, 20, 28.9), ('66666666-7777-4000-8000-000000000012', '55555555-eeee-4000-8000-000100000003', 1, 15, 37.8), ('66666666-7777-4000-8000-000000000012', '55555555-eeee-4000-8000-000100000003', 2, 15, 50.9), ('66666666-7777-4000-8000-000000000012', '55555555-eeee-4000-8000-000100000003', 3, 15, 26.6) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000013', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000200000001', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-05-07T07:00:00.000Z'::timestamptz, '2026-05-07T07:49:00.000Z'::timestamptz, 49, 8, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000013', '55555555-eeee-4000-8000-000201000000', 1, 8, 42.4), ('66666666-7777-4000-8000-000000000013', '55555555-eeee-4000-8000-000201000000', 2, 11, 36.2), ('66666666-7777-4000-8000-000000000013', '55555555-eeee-4000-8000-000201000000', 3, 10, 39.7), ('66666666-7777-4000-8000-000000000013', '55555555-eeee-4000-8000-000201000001', 1, 12, 47.4), ('66666666-7777-4000-8000-000000000013', '55555555-eeee-4000-8000-000201000001', 2, 8, 8.3), ('66666666-7777-4000-8000-000000000013', '55555555-eeee-4000-8000-000201000001', 3, 8, 55), ('66666666-7777-4000-8000-000000000013', '55555555-eeee-4000-8000-000201000002', 1, 8, 6.9), ('66666666-7777-4000-8000-000000000013', '55555555-eeee-4000-8000-000201000002', 2, 10, 8.2), ('66666666-7777-4000-8000-000000000013', '55555555-eeee-4000-8000-000201000002', 3, 11, 39.9), ('66666666-7777-4000-8000-000000000013', '55555555-eeee-4000-8000-000201000003', 1, 8, 27.3), ('66666666-7777-4000-8000-000000000013', '55555555-eeee-4000-8000-000201000003', 2, 12, 24), ('66666666-7777-4000-8000-000000000013', '55555555-eeee-4000-8000-000201000003', 3, 8, 45.8), ('66666666-7777-4000-8000-000000000013', '55555555-eeee-4000-8000-000201000004', 1, 12, 40.9), ('66666666-7777-4000-8000-000000000013', '55555555-eeee-4000-8000-000201000004', 2, 12, 7.7), ('66666666-7777-4000-8000-000000000013', '55555555-eeee-4000-8000-000201000004', 3, 12, 39.4) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000014', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000200000002', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-05-06T08:00:00.000Z'::timestamptz, '2026-05-06T09:07:00.000Z'::timestamptz, 67, 7, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000014', '55555555-eeee-4000-8000-000202000000', 1, 10, 37.3), ('66666666-7777-4000-8000-000000000014', '55555555-eeee-4000-8000-000202000000', 2, 10, 37.5), ('66666666-7777-4000-8000-000000000014', '55555555-eeee-4000-8000-000202000000', 3, 8, 12.4), ('66666666-7777-4000-8000-000000000014', '55555555-eeee-4000-8000-000202000000', 4, 11, 45.3), ('66666666-7777-4000-8000-000000000014', '55555555-eeee-4000-8000-000202000001', 1, 9, 55.8), ('66666666-7777-4000-8000-000000000014', '55555555-eeee-4000-8000-000202000001', 2, 12, 28.7), ('66666666-7777-4000-8000-000000000014', '55555555-eeee-4000-8000-000202000001', 3, 10, 23.6), ('66666666-7777-4000-8000-000000000014', '55555555-eeee-4000-8000-000202000002', 1, 11, 58.8), ('66666666-7777-4000-8000-000000000014', '55555555-eeee-4000-8000-000202000002', 2, 12, 43.1), ('66666666-7777-4000-8000-000000000014', '55555555-eeee-4000-8000-000202000002', 3, 9, 55), ('66666666-7777-4000-8000-000000000014', '55555555-eeee-4000-8000-000202000003', 1, 10, 33), ('66666666-7777-4000-8000-000000000014', '55555555-eeee-4000-8000-000202000003', 2, 10, 55.5), ('66666666-7777-4000-8000-000000000014', '55555555-eeee-4000-8000-000202000003', 3, 10, 17.8), ('66666666-7777-4000-8000-000000000014', '55555555-eeee-4000-8000-000202000004', 1, 12, 13.3), ('66666666-7777-4000-8000-000000000014', '55555555-eeee-4000-8000-000202000004', 2, 12, 22.6), ('66666666-7777-4000-8000-000000000014', '55555555-eeee-4000-8000-000202000004', 3, 12, 59) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000015', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000200000000', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-05-05T09:00:00.000Z'::timestamptz, '2026-05-05T10:10:00.000Z'::timestamptz, 70, 6, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000015', '55555555-eeee-4000-8000-000200000000', 1, 11, 38.2), ('66666666-7777-4000-8000-000000000015', '55555555-eeee-4000-8000-000200000000', 2, 12, 18.8), ('66666666-7777-4000-8000-000000000015', '55555555-eeee-4000-8000-000200000000', 3, 12, 17.3), ('66666666-7777-4000-8000-000000000015', '55555555-eeee-4000-8000-000200000001', 1, 12, 21.8), ('66666666-7777-4000-8000-000000000015', '55555555-eeee-4000-8000-000200000001', 2, 10, 26.4), ('66666666-7777-4000-8000-000000000015', '55555555-eeee-4000-8000-000200000001', 3, 9, 20.8), ('66666666-7777-4000-8000-000000000015', '55555555-eeee-4000-8000-000200000002', 1, 12, 39.5), ('66666666-7777-4000-8000-000000000015', '55555555-eeee-4000-8000-000200000002', 2, 9, 33.1), ('66666666-7777-4000-8000-000000000015', '55555555-eeee-4000-8000-000200000002', 3, 9, 29.5), ('66666666-7777-4000-8000-000000000015', '55555555-eeee-4000-8000-000200000003', 1, 15, 14.7), ('66666666-7777-4000-8000-000000000015', '55555555-eeee-4000-8000-000200000003', 2, 15, 36.4), ('66666666-7777-4000-8000-000000000015', '55555555-eeee-4000-8000-000200000003', 3, 15, 54.5), ('66666666-7777-4000-8000-000000000015', '55555555-eeee-4000-8000-000200000004', 1, 11, 34.7), ('66666666-7777-4000-8000-000000000015', '55555555-eeee-4000-8000-000200000004', 2, 12, 37.3), ('66666666-7777-4000-8000-000000000015', '55555555-eeee-4000-8000-000200000004', 3, 12, 29.4) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000016', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000200000001', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-05-04T10:00:00.000Z'::timestamptz, '2026-05-04T10:56:00.000Z'::timestamptz, 56, 7, 'Foi top hoje.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000016', '55555555-eeee-4000-8000-000201000000', 1, 11, 39.4), ('66666666-7777-4000-8000-000000000016', '55555555-eeee-4000-8000-000201000000', 2, 10, 14.5), ('66666666-7777-4000-8000-000000000016', '55555555-eeee-4000-8000-000201000000', 3, 8, 44.1), ('66666666-7777-4000-8000-000000000016', '55555555-eeee-4000-8000-000201000001', 1, 9, 23), ('66666666-7777-4000-8000-000000000016', '55555555-eeee-4000-8000-000201000001', 2, 8, 11.9), ('66666666-7777-4000-8000-000000000016', '55555555-eeee-4000-8000-000201000001', 3, 11, 20.5), ('66666666-7777-4000-8000-000000000016', '55555555-eeee-4000-8000-000201000002', 1, 8, 30.3), ('66666666-7777-4000-8000-000000000016', '55555555-eeee-4000-8000-000201000002', 2, 11, 12.5), ('66666666-7777-4000-8000-000000000016', '55555555-eeee-4000-8000-000201000002', 3, 11, 16.8), ('66666666-7777-4000-8000-000000000016', '55555555-eeee-4000-8000-000201000003', 1, 9, 39.1), ('66666666-7777-4000-8000-000000000016', '55555555-eeee-4000-8000-000201000003', 2, 9, 24.2), ('66666666-7777-4000-8000-000000000016', '55555555-eeee-4000-8000-000201000003', 3, 11, 30.7), ('66666666-7777-4000-8000-000000000016', '55555555-eeee-4000-8000-000201000004', 1, 12, 49.9), ('66666666-7777-4000-8000-000000000016', '55555555-eeee-4000-8000-000201000004', 2, 12, 9.6), ('66666666-7777-4000-8000-000000000016', '55555555-eeee-4000-8000-000201000004', 3, 12, 16) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000017', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000200000002', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-05-03T11:00:00.000Z'::timestamptz, '2026-05-03T12:08:00.000Z'::timestamptz, 68, 8, 'Pesado mas saiu.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000017', '55555555-eeee-4000-8000-000202000000', 1, 12, 30.6), ('66666666-7777-4000-8000-000000000017', '55555555-eeee-4000-8000-000202000000', 2, 8, 41.4), ('66666666-7777-4000-8000-000000000017', '55555555-eeee-4000-8000-000202000000', 3, 11, 46.4), ('66666666-7777-4000-8000-000000000017', '55555555-eeee-4000-8000-000202000000', 4, 12, 27.3), ('66666666-7777-4000-8000-000000000017', '55555555-eeee-4000-8000-000202000001', 1, 9, 13.9), ('66666666-7777-4000-8000-000000000017', '55555555-eeee-4000-8000-000202000001', 2, 12, 36.5), ('66666666-7777-4000-8000-000000000017', '55555555-eeee-4000-8000-000202000001', 3, 8, 6.9), ('66666666-7777-4000-8000-000000000017', '55555555-eeee-4000-8000-000202000002', 1, 12, 10.2), ('66666666-7777-4000-8000-000000000017', '55555555-eeee-4000-8000-000202000002', 2, 10, 33.8), ('66666666-7777-4000-8000-000000000017', '55555555-eeee-4000-8000-000202000002', 3, 10, 58.7), ('66666666-7777-4000-8000-000000000017', '55555555-eeee-4000-8000-000202000003', 1, 10, 33.9), ('66666666-7777-4000-8000-000000000017', '55555555-eeee-4000-8000-000202000003', 2, 10, 42.1), ('66666666-7777-4000-8000-000000000017', '55555555-eeee-4000-8000-000202000003', 3, 10, 33.8), ('66666666-7777-4000-8000-000000000017', '55555555-eeee-4000-8000-000202000004', 1, 12, 54.5), ('66666666-7777-4000-8000-000000000017', '55555555-eeee-4000-8000-000202000004', 2, 12, 53.6), ('66666666-7777-4000-8000-000000000017', '55555555-eeee-4000-8000-000202000004', 3, 12, 9.8) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000018', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000200000000', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-05-02T12:00:00.000Z'::timestamptz, '2026-05-02T13:08:00.000Z'::timestamptz, 68, 7, 'Foi top hoje.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000018', '55555555-eeee-4000-8000-000200000000', 1, 11, 34.5), ('66666666-7777-4000-8000-000000000018', '55555555-eeee-4000-8000-000200000000', 2, 10, 22.8), ('66666666-7777-4000-8000-000000000018', '55555555-eeee-4000-8000-000200000000', 3, 9, 23.5), ('66666666-7777-4000-8000-000000000018', '55555555-eeee-4000-8000-000200000001', 1, 11, 52.9), ('66666666-7777-4000-8000-000000000018', '55555555-eeee-4000-8000-000200000001', 2, 12, 18.1), ('66666666-7777-4000-8000-000000000018', '55555555-eeee-4000-8000-000200000001', 3, 10, 32.1), ('66666666-7777-4000-8000-000000000018', '55555555-eeee-4000-8000-000200000002', 1, 10, 45.1), ('66666666-7777-4000-8000-000000000018', '55555555-eeee-4000-8000-000200000002', 2, 10, 27.5), ('66666666-7777-4000-8000-000000000018', '55555555-eeee-4000-8000-000200000002', 3, 12, 17.2), ('66666666-7777-4000-8000-000000000018', '55555555-eeee-4000-8000-000200000003', 1, 15, 28.6), ('66666666-7777-4000-8000-000000000018', '55555555-eeee-4000-8000-000200000003', 2, 15, 7.3), ('66666666-7777-4000-8000-000000000018', '55555555-eeee-4000-8000-000200000003', 3, 15, 13.5), ('66666666-7777-4000-8000-000000000018', '55555555-eeee-4000-8000-000200000004', 1, 8, 11.7), ('66666666-7777-4000-8000-000000000018', '55555555-eeee-4000-8000-000200000004', 2, 9, 47.1), ('66666666-7777-4000-8000-000000000018', '55555555-eeee-4000-8000-000200000004', 3, 10, 29.8) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000019', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000300000001', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-05-07T07:00:00.000Z'::timestamptz, '2026-05-07T08:10:00.000Z'::timestamptz, 70, 8, 'Foi top hoje.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000019', '55555555-eeee-4000-8000-000301000000', 1, 10, 24.2), ('66666666-7777-4000-8000-000000000019', '55555555-eeee-4000-8000-000301000000', 2, 11, 21), ('66666666-7777-4000-8000-000000000019', '55555555-eeee-4000-8000-000301000000', 3, 10, 19.5), ('66666666-7777-4000-8000-000000000019', '55555555-eeee-4000-8000-000301000001', 1, 8, 51.4), ('66666666-7777-4000-8000-000000000019', '55555555-eeee-4000-8000-000301000001', 2, 9, 11.5), ('66666666-7777-4000-8000-000000000019', '55555555-eeee-4000-8000-000301000001', 3, 12, 7.4), ('66666666-7777-4000-8000-000000000019', '55555555-eeee-4000-8000-000301000002', 1, 11, 36.6), ('66666666-7777-4000-8000-000000000019', '55555555-eeee-4000-8000-000301000002', 2, 8, 39.1), ('66666666-7777-4000-8000-000000000019', '55555555-eeee-4000-8000-000301000002', 3, 12, 15.4), ('66666666-7777-4000-8000-000000000019', '55555555-eeee-4000-8000-000301000003', 1, 12, 17.1), ('66666666-7777-4000-8000-000000000019', '55555555-eeee-4000-8000-000301000003', 2, 12, 29.8), ('66666666-7777-4000-8000-000000000019', '55555555-eeee-4000-8000-000301000003', 3, 10, 6.2) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000020', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000300000000', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-05-06T08:00:00.000Z'::timestamptz, '2026-05-06T08:46:00.000Z'::timestamptz, 46, 7, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000020', '55555555-eeee-4000-8000-000300000000', 1, 45, 31.5), ('66666666-7777-4000-8000-000000000020', '55555555-eeee-4000-8000-000300000000', 2, 45, 27), ('66666666-7777-4000-8000-000000000020', '55555555-eeee-4000-8000-000300000000', 3, 45, 5.9), ('66666666-7777-4000-8000-000000000020', '55555555-eeee-4000-8000-000300000001', 1, 12, 47.1), ('66666666-7777-4000-8000-000000000020', '55555555-eeee-4000-8000-000300000001', 2, 9, 11.8), ('66666666-7777-4000-8000-000000000020', '55555555-eeee-4000-8000-000300000001', 3, 8, 42.9), ('66666666-7777-4000-8000-000000000020', '55555555-eeee-4000-8000-000300000002', 1, 20, 48.6), ('66666666-7777-4000-8000-000000000020', '55555555-eeee-4000-8000-000300000002', 2, 20, 58.7), ('66666666-7777-4000-8000-000000000020', '55555555-eeee-4000-8000-000300000002', 3, 20, 51.9), ('66666666-7777-4000-8000-000000000020', '55555555-eeee-4000-8000-000300000003', 1, 15, 53.8), ('66666666-7777-4000-8000-000000000020', '55555555-eeee-4000-8000-000300000003', 2, 15, 18.5), ('66666666-7777-4000-8000-000000000020', '55555555-eeee-4000-8000-000300000003', 3, 15, 43.9) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000021', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000300000001', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-05-05T09:00:00.000Z'::timestamptz, '2026-05-05T10:06:00.000Z'::timestamptz, 66, 6, 'Pesado mas saiu.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000021', '55555555-eeee-4000-8000-000301000000', 1, 8, 51.3), ('66666666-7777-4000-8000-000000000021', '55555555-eeee-4000-8000-000301000000', 2, 12, 56.3), ('66666666-7777-4000-8000-000000000021', '55555555-eeee-4000-8000-000301000000', 3, 9, 12.4), ('66666666-7777-4000-8000-000000000021', '55555555-eeee-4000-8000-000301000001', 1, 8, 57.5), ('66666666-7777-4000-8000-000000000021', '55555555-eeee-4000-8000-000301000001', 2, 11, 39.8), ('66666666-7777-4000-8000-000000000021', '55555555-eeee-4000-8000-000301000001', 3, 8, 39.9), ('66666666-7777-4000-8000-000000000021', '55555555-eeee-4000-8000-000301000002', 1, 11, 48.7), ('66666666-7777-4000-8000-000000000021', '55555555-eeee-4000-8000-000301000002', 2, 8, 51.6), ('66666666-7777-4000-8000-000000000021', '55555555-eeee-4000-8000-000301000002', 3, 9, 33.9), ('66666666-7777-4000-8000-000000000021', '55555555-eeee-4000-8000-000301000003', 1, 9, 9.3), ('66666666-7777-4000-8000-000000000021', '55555555-eeee-4000-8000-000301000003', 2, 9, 54.5), ('66666666-7777-4000-8000-000000000021', '55555555-eeee-4000-8000-000301000003', 3, 12, 35.6) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000022', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000300000000', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-05-04T10:00:00.000Z'::timestamptz, '2026-05-04T10:45:00.000Z'::timestamptz, 45, 8, 'Treino completo!')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000022', '55555555-eeee-4000-8000-000300000000', 1, 45, 7.2), ('66666666-7777-4000-8000-000000000022', '55555555-eeee-4000-8000-000300000000', 2, 45, 55.9), ('66666666-7777-4000-8000-000000000022', '55555555-eeee-4000-8000-000300000000', 3, 45, 23.5), ('66666666-7777-4000-8000-000000000022', '55555555-eeee-4000-8000-000300000001', 1, 12, 57.2), ('66666666-7777-4000-8000-000000000022', '55555555-eeee-4000-8000-000300000001', 2, 11, 13.1), ('66666666-7777-4000-8000-000000000022', '55555555-eeee-4000-8000-000300000001', 3, 9, 20.5), ('66666666-7777-4000-8000-000000000022', '55555555-eeee-4000-8000-000300000002', 1, 20, 8.8), ('66666666-7777-4000-8000-000000000022', '55555555-eeee-4000-8000-000300000002', 2, 20, 40.1), ('66666666-7777-4000-8000-000000000022', '55555555-eeee-4000-8000-000300000002', 3, 20, 34.9), ('66666666-7777-4000-8000-000000000022', '55555555-eeee-4000-8000-000300000003', 1, 15, 38), ('66666666-7777-4000-8000-000000000022', '55555555-eeee-4000-8000-000300000003', 2, 15, 41.2), ('66666666-7777-4000-8000-000000000022', '55555555-eeee-4000-8000-000300000003', 3, 15, 37.5) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000023', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000300000001', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-05-03T11:00:00.000Z'::timestamptz, '2026-05-03T12:07:00.000Z'::timestamptz, 67, 8, 'Cabeça boa, treino bom.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000023', '55555555-eeee-4000-8000-000301000000', 1, 11, 28), ('66666666-7777-4000-8000-000000000023', '55555555-eeee-4000-8000-000301000000', 2, 12, 17.3), ('66666666-7777-4000-8000-000000000023', '55555555-eeee-4000-8000-000301000000', 3, 10, 10.6), ('66666666-7777-4000-8000-000000000023', '55555555-eeee-4000-8000-000301000001', 1, 12, 16), ('66666666-7777-4000-8000-000000000023', '55555555-eeee-4000-8000-000301000001', 2, 9, 38.4), ('66666666-7777-4000-8000-000000000023', '55555555-eeee-4000-8000-000301000001', 3, 11, 35.7), ('66666666-7777-4000-8000-000000000023', '55555555-eeee-4000-8000-000301000002', 1, 10, 27.3), ('66666666-7777-4000-8000-000000000023', '55555555-eeee-4000-8000-000301000002', 2, 9, 28.6), ('66666666-7777-4000-8000-000000000023', '55555555-eeee-4000-8000-000301000002', 3, 11, 9.4), ('66666666-7777-4000-8000-000000000023', '55555555-eeee-4000-8000-000301000003', 1, 11, 40.7), ('66666666-7777-4000-8000-000000000023', '55555555-eeee-4000-8000-000301000003', 2, 11, 53.3), ('66666666-7777-4000-8000-000000000023', '55555555-eeee-4000-8000-000301000003', 3, 12, 31.7) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000024', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000300000000', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-05-02T12:00:00.000Z'::timestamptz, '2026-05-02T12:48:00.000Z'::timestamptz, 48, 7, 'Cabeça boa, treino bom.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000024', '55555555-eeee-4000-8000-000300000000', 1, 45, 40.9), ('66666666-7777-4000-8000-000000000024', '55555555-eeee-4000-8000-000300000000', 2, 45, 27), ('66666666-7777-4000-8000-000000000024', '55555555-eeee-4000-8000-000300000000', 3, 45, 15.7), ('66666666-7777-4000-8000-000000000024', '55555555-eeee-4000-8000-000300000001', 1, 12, 55.7), ('66666666-7777-4000-8000-000000000024', '55555555-eeee-4000-8000-000300000001', 2, 10, 55.8), ('66666666-7777-4000-8000-000000000024', '55555555-eeee-4000-8000-000300000001', 3, 12, 10.3), ('66666666-7777-4000-8000-000000000024', '55555555-eeee-4000-8000-000300000002', 1, 20, 32.3), ('66666666-7777-4000-8000-000000000024', '55555555-eeee-4000-8000-000300000002', 2, 20, 52.6), ('66666666-7777-4000-8000-000000000024', '55555555-eeee-4000-8000-000300000002', 3, 20, 19.9), ('66666666-7777-4000-8000-000000000024', '55555555-eeee-4000-8000-000300000003', 1, 15, 32.1), ('66666666-7777-4000-8000-000000000024', '55555555-eeee-4000-8000-000300000003', 2, 15, 48.9), ('66666666-7777-4000-8000-000000000024', '55555555-eeee-4000-8000-000300000003', 3, 15, 23.9) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000025', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000400000001', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-05-07T07:00:00.000Z'::timestamptz, '2026-05-07T07:54:00.000Z'::timestamptz, 54, 8, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000025', '55555555-eeee-4000-8000-000401000000', 1, 8, 57.2), ('66666666-7777-4000-8000-000000000025', '55555555-eeee-4000-8000-000401000000', 2, 11, 30.3), ('66666666-7777-4000-8000-000000000025', '55555555-eeee-4000-8000-000401000000', 3, 9, 19.7), ('66666666-7777-4000-8000-000000000025', '55555555-eeee-4000-8000-000401000000', 4, 9, 19.8), ('66666666-7777-4000-8000-000000000025', '55555555-eeee-4000-8000-000401000001', 1, 12, 16.4), ('66666666-7777-4000-8000-000000000025', '55555555-eeee-4000-8000-000401000001', 2, 12, 6.6), ('66666666-7777-4000-8000-000000000025', '55555555-eeee-4000-8000-000401000001', 3, 12, 44), ('66666666-7777-4000-8000-000000000025', '55555555-eeee-4000-8000-000401000002', 1, 8, 19.2), ('66666666-7777-4000-8000-000000000025', '55555555-eeee-4000-8000-000401000002', 2, 8, 48.9), ('66666666-7777-4000-8000-000000000025', '55555555-eeee-4000-8000-000401000002', 3, 8, 45.3), ('66666666-7777-4000-8000-000000000025', '55555555-eeee-4000-8000-000401000003', 1, 15, 35.2), ('66666666-7777-4000-8000-000000000025', '55555555-eeee-4000-8000-000401000003', 2, 15, 29.9), ('66666666-7777-4000-8000-000000000025', '55555555-eeee-4000-8000-000401000003', 3, 15, 23.4), ('66666666-7777-4000-8000-000000000025', '55555555-eeee-4000-8000-000401000004', 1, 11, 37.5), ('66666666-7777-4000-8000-000000000025', '55555555-eeee-4000-8000-000401000004', 2, 9, 48), ('66666666-7777-4000-8000-000000000025', '55555555-eeee-4000-8000-000401000004', 3, 12, 45.7) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000026', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000400000000', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-05-06T08:00:00.000Z'::timestamptz, '2026-05-06T08:57:00.000Z'::timestamptz, 57, 7, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000026', '55555555-eeee-4000-8000-000400000000', 1, 45, 37.9), ('66666666-7777-4000-8000-000000000026', '55555555-eeee-4000-8000-000400000000', 2, 45, 59), ('66666666-7777-4000-8000-000000000026', '55555555-eeee-4000-8000-000400000000', 3, 45, 21.4), ('66666666-7777-4000-8000-000000000026', '55555555-eeee-4000-8000-000400000001', 1, 10, 27.6), ('66666666-7777-4000-8000-000000000026', '55555555-eeee-4000-8000-000400000001', 2, 9, 42.4), ('66666666-7777-4000-8000-000000000026', '55555555-eeee-4000-8000-000400000001', 3, 9, 15.4), ('66666666-7777-4000-8000-000000000026', '55555555-eeee-4000-8000-000400000002', 1, 20, 40.4), ('66666666-7777-4000-8000-000000000026', '55555555-eeee-4000-8000-000400000002', 2, 20, 48.5), ('66666666-7777-4000-8000-000000000026', '55555555-eeee-4000-8000-000400000002', 3, 20, 35.8), ('66666666-7777-4000-8000-000000000026', '55555555-eeee-4000-8000-000400000003', 1, 15, 59.4), ('66666666-7777-4000-8000-000000000026', '55555555-eeee-4000-8000-000400000003', 2, 15, 52.9), ('66666666-7777-4000-8000-000000000026', '55555555-eeee-4000-8000-000400000003', 3, 15, 54.8) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000027', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000400000001', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-05-05T09:00:00.000Z'::timestamptz, '2026-05-05T09:58:00.000Z'::timestamptz, 58, 7, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000027', '55555555-eeee-4000-8000-000401000000', 1, 12, 18.9), ('66666666-7777-4000-8000-000000000027', '55555555-eeee-4000-8000-000401000000', 2, 8, 38.3), ('66666666-7777-4000-8000-000000000027', '55555555-eeee-4000-8000-000401000000', 3, 8, 12.1), ('66666666-7777-4000-8000-000000000027', '55555555-eeee-4000-8000-000401000000', 4, 11, 14.3), ('66666666-7777-4000-8000-000000000027', '55555555-eeee-4000-8000-000401000001', 1, 12, 18.1), ('66666666-7777-4000-8000-000000000027', '55555555-eeee-4000-8000-000401000001', 2, 12, 14.5), ('66666666-7777-4000-8000-000000000027', '55555555-eeee-4000-8000-000401000001', 3, 12, 26.1), ('66666666-7777-4000-8000-000000000027', '55555555-eeee-4000-8000-000401000002', 1, 12, 31.5), ('66666666-7777-4000-8000-000000000027', '55555555-eeee-4000-8000-000401000002', 2, 11, 52.2), ('66666666-7777-4000-8000-000000000027', '55555555-eeee-4000-8000-000401000002', 3, 12, 19.6), ('66666666-7777-4000-8000-000000000027', '55555555-eeee-4000-8000-000401000003', 1, 15, 50.4), ('66666666-7777-4000-8000-000000000027', '55555555-eeee-4000-8000-000401000003', 2, 15, 25.1), ('66666666-7777-4000-8000-000000000027', '55555555-eeee-4000-8000-000401000003', 3, 15, 19.1), ('66666666-7777-4000-8000-000000000027', '55555555-eeee-4000-8000-000401000004', 1, 8, 44.8), ('66666666-7777-4000-8000-000000000027', '55555555-eeee-4000-8000-000401000004', 2, 11, 54), ('66666666-7777-4000-8000-000000000027', '55555555-eeee-4000-8000-000401000004', 3, 10, 18.9) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000028', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000400000000', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-05-04T10:00:00.000Z'::timestamptz, '2026-05-04T11:01:00.000Z'::timestamptz, 61, 6, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000028', '55555555-eeee-4000-8000-000400000000', 1, 45, 54.1), ('66666666-7777-4000-8000-000000000028', '55555555-eeee-4000-8000-000400000000', 2, 45, 48.8), ('66666666-7777-4000-8000-000000000028', '55555555-eeee-4000-8000-000400000000', 3, 45, 39.5), ('66666666-7777-4000-8000-000000000028', '55555555-eeee-4000-8000-000400000001', 1, 11, 33.2), ('66666666-7777-4000-8000-000000000028', '55555555-eeee-4000-8000-000400000001', 2, 12, 27.4), ('66666666-7777-4000-8000-000000000028', '55555555-eeee-4000-8000-000400000001', 3, 12, 50.1), ('66666666-7777-4000-8000-000000000028', '55555555-eeee-4000-8000-000400000002', 1, 20, 9.7), ('66666666-7777-4000-8000-000000000028', '55555555-eeee-4000-8000-000400000002', 2, 20, 53.2), ('66666666-7777-4000-8000-000000000028', '55555555-eeee-4000-8000-000400000002', 3, 20, 44.5), ('66666666-7777-4000-8000-000000000028', '55555555-eeee-4000-8000-000400000003', 1, 15, 50.9), ('66666666-7777-4000-8000-000000000028', '55555555-eeee-4000-8000-000400000003', 2, 15, 18.4), ('66666666-7777-4000-8000-000000000028', '55555555-eeee-4000-8000-000400000003', 3, 15, 11.5) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000029', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000400000001', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-05-03T11:00:00.000Z'::timestamptz, '2026-05-03T11:55:00.000Z'::timestamptz, 55, 7, 'Pesado mas saiu.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000029', '55555555-eeee-4000-8000-000401000000', 1, 12, 27.5), ('66666666-7777-4000-8000-000000000029', '55555555-eeee-4000-8000-000401000000', 2, 9, 34.4), ('66666666-7777-4000-8000-000000000029', '55555555-eeee-4000-8000-000401000000', 3, 8, 20.8), ('66666666-7777-4000-8000-000000000029', '55555555-eeee-4000-8000-000401000000', 4, 12, 57.8), ('66666666-7777-4000-8000-000000000029', '55555555-eeee-4000-8000-000401000001', 1, 12, 36.2), ('66666666-7777-4000-8000-000000000029', '55555555-eeee-4000-8000-000401000001', 2, 12, 34.2), ('66666666-7777-4000-8000-000000000029', '55555555-eeee-4000-8000-000401000001', 3, 12, 15.8), ('66666666-7777-4000-8000-000000000029', '55555555-eeee-4000-8000-000401000002', 1, 8, 53.3), ('66666666-7777-4000-8000-000000000029', '55555555-eeee-4000-8000-000401000002', 2, 9, 20.8), ('66666666-7777-4000-8000-000000000029', '55555555-eeee-4000-8000-000401000002', 3, 12, 41.4), ('66666666-7777-4000-8000-000000000029', '55555555-eeee-4000-8000-000401000003', 1, 15, 18.6), ('66666666-7777-4000-8000-000000000029', '55555555-eeee-4000-8000-000401000003', 2, 15, 21.8), ('66666666-7777-4000-8000-000000000029', '55555555-eeee-4000-8000-000401000003', 3, 15, 16.4), ('66666666-7777-4000-8000-000000000029', '55555555-eeee-4000-8000-000401000004', 1, 9, 54.3), ('66666666-7777-4000-8000-000000000029', '55555555-eeee-4000-8000-000401000004', 2, 12, 40.3), ('66666666-7777-4000-8000-000000000029', '55555555-eeee-4000-8000-000401000004', 3, 9, 46.5) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000030', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000400000000', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-05-02T12:00:00.000Z'::timestamptz, '2026-05-02T13:00:00.000Z'::timestamptz, 60, 7, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000030', '55555555-eeee-4000-8000-000400000000', 1, 45, 37.6), ('66666666-7777-4000-8000-000000000030', '55555555-eeee-4000-8000-000400000000', 2, 45, 24.4), ('66666666-7777-4000-8000-000000000030', '55555555-eeee-4000-8000-000400000000', 3, 45, 31.9), ('66666666-7777-4000-8000-000000000030', '55555555-eeee-4000-8000-000400000001', 1, 10, 31.9), ('66666666-7777-4000-8000-000000000030', '55555555-eeee-4000-8000-000400000001', 2, 11, 16.9), ('66666666-7777-4000-8000-000000000030', '55555555-eeee-4000-8000-000400000001', 3, 11, 49.6), ('66666666-7777-4000-8000-000000000030', '55555555-eeee-4000-8000-000400000002', 1, 20, 39), ('66666666-7777-4000-8000-000000000030', '55555555-eeee-4000-8000-000400000002', 2, 20, 12.5), ('66666666-7777-4000-8000-000000000030', '55555555-eeee-4000-8000-000400000002', 3, 20, 23.2), ('66666666-7777-4000-8000-000000000030', '55555555-eeee-4000-8000-000400000003', 1, 15, 14.6), ('66666666-7777-4000-8000-000000000030', '55555555-eeee-4000-8000-000400000003', 2, 15, 53), ('66666666-7777-4000-8000-000000000030', '55555555-eeee-4000-8000-000400000003', 3, 15, 10.5) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000031', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000500000000', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-05-06T07:00:00.000Z'::timestamptz, '2026-05-06T08:05:00.000Z'::timestamptz, 65, 5, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000031', '55555555-eeee-4000-8000-000500000000', 1, 8, 32.4), ('66666666-7777-4000-8000-000000000031', '55555555-eeee-4000-8000-000500000000', 2, 8, 48.6), ('66666666-7777-4000-8000-000000000031', '55555555-eeee-4000-8000-000500000000', 3, 10, 18), ('66666666-7777-4000-8000-000000000031', '55555555-eeee-4000-8000-000500000000', 4, 11, 35.8), ('66666666-7777-4000-8000-000000000031', '55555555-eeee-4000-8000-000500000001', 1, 12, 33.9), ('66666666-7777-4000-8000-000000000031', '55555555-eeee-4000-8000-000500000001', 2, 12, 51.2), ('66666666-7777-4000-8000-000000000031', '55555555-eeee-4000-8000-000500000001', 3, 12, 58.8), ('66666666-7777-4000-8000-000000000031', '55555555-eeee-4000-8000-000500000002', 1, 8, 5.1), ('66666666-7777-4000-8000-000000000031', '55555555-eeee-4000-8000-000500000002', 2, 12, 48.3), ('66666666-7777-4000-8000-000000000031', '55555555-eeee-4000-8000-000500000002', 3, 10, 9.4), ('66666666-7777-4000-8000-000000000031', '55555555-eeee-4000-8000-000500000003', 1, 15, 20), ('66666666-7777-4000-8000-000000000031', '55555555-eeee-4000-8000-000500000003', 2, 15, 18.1), ('66666666-7777-4000-8000-000000000031', '55555555-eeee-4000-8000-000500000003', 3, 15, 49.4), ('66666666-7777-4000-8000-000000000031', '55555555-eeee-4000-8000-000500000004', 1, 10, 12.2), ('66666666-7777-4000-8000-000000000031', '55555555-eeee-4000-8000-000500000004', 2, 9, 39.3), ('66666666-7777-4000-8000-000000000031', '55555555-eeee-4000-8000-000500000004', 3, 11, 45.3) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000032', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000500000001', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-05-03T09:00:00.000Z'::timestamptz, '2026-05-03T09:55:00.000Z'::timestamptz, 55, 9, 'Treino completo!')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000032', '55555555-eeee-4000-8000-000501000000', 1, 45, 55.2), ('66666666-7777-4000-8000-000000000032', '55555555-eeee-4000-8000-000501000000', 2, 45, 43.7), ('66666666-7777-4000-8000-000000000032', '55555555-eeee-4000-8000-000501000000', 3, 45, 52), ('66666666-7777-4000-8000-000000000032', '55555555-eeee-4000-8000-000501000001', 1, 9, 15.7), ('66666666-7777-4000-8000-000000000032', '55555555-eeee-4000-8000-000501000001', 2, 8, 32.9), ('66666666-7777-4000-8000-000000000032', '55555555-eeee-4000-8000-000501000001', 3, 11, 20.3), ('66666666-7777-4000-8000-000000000032', '55555555-eeee-4000-8000-000501000002', 1, 20, 58.3), ('66666666-7777-4000-8000-000000000032', '55555555-eeee-4000-8000-000501000002', 2, 20, 58.3), ('66666666-7777-4000-8000-000000000032', '55555555-eeee-4000-8000-000501000002', 3, 20, 44.8), ('66666666-7777-4000-8000-000000000032', '55555555-eeee-4000-8000-000501000003', 1, 15, 58.8), ('66666666-7777-4000-8000-000000000032', '55555555-eeee-4000-8000-000501000003', 2, 15, 18.3), ('66666666-7777-4000-8000-000000000032', '55555555-eeee-4000-8000-000501000003', 3, 15, 48.8) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000033', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000500000002', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-04-30T11:00:00.000Z'::timestamptz, '2026-04-30T11:47:00.000Z'::timestamptz, 47, 7, 'Foi top hoje.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000033', '55555555-eeee-4000-8000-000502000000', 1, 11, 60), ('66666666-7777-4000-8000-000000000033', '55555555-eeee-4000-8000-000502000000', 2, 11, 46.2), ('66666666-7777-4000-8000-000000000033', '55555555-eeee-4000-8000-000502000000', 3, 12, 59.7), ('66666666-7777-4000-8000-000000000033', '55555555-eeee-4000-8000-000502000000', 4, 12, 52.3), ('66666666-7777-4000-8000-000000000033', '55555555-eeee-4000-8000-000502000001', 1, 11, 54.8), ('66666666-7777-4000-8000-000000000033', '55555555-eeee-4000-8000-000502000001', 2, 9, 35.6), ('66666666-7777-4000-8000-000000000033', '55555555-eeee-4000-8000-000502000001', 3, 8, 25.3), ('66666666-7777-4000-8000-000000000033', '55555555-eeee-4000-8000-000502000002', 1, 9, 45.7), ('66666666-7777-4000-8000-000000000033', '55555555-eeee-4000-8000-000502000002', 2, 9, 42.2), ('66666666-7777-4000-8000-000000000033', '55555555-eeee-4000-8000-000502000002', 3, 9, 47.8), ('66666666-7777-4000-8000-000000000033', '55555555-eeee-4000-8000-000502000003', 1, 10, 21.4), ('66666666-7777-4000-8000-000000000033', '55555555-eeee-4000-8000-000502000003', 2, 10, 6.1), ('66666666-7777-4000-8000-000000000033', '55555555-eeee-4000-8000-000502000003', 3, 10, 13.1), ('66666666-7777-4000-8000-000000000033', '55555555-eeee-4000-8000-000502000004', 1, 12, 15.4), ('66666666-7777-4000-8000-000000000033', '55555555-eeee-4000-8000-000502000004', 2, 12, 56.9), ('66666666-7777-4000-8000-000000000033', '55555555-eeee-4000-8000-000502000004', 3, 12, 58.3) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000034', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000500000000', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-04-26T13:00:00.000Z'::timestamptz, '2026-04-26T13:48:00.000Z'::timestamptz, 48, 9, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000034', '55555555-eeee-4000-8000-000500000000', 1, 11, 17.4), ('66666666-7777-4000-8000-000000000034', '55555555-eeee-4000-8000-000500000000', 2, 9, 14.4), ('66666666-7777-4000-8000-000000000034', '55555555-eeee-4000-8000-000500000000', 3, 10, 54.4), ('66666666-7777-4000-8000-000000000034', '55555555-eeee-4000-8000-000500000000', 4, 11, 49.1), ('66666666-7777-4000-8000-000000000034', '55555555-eeee-4000-8000-000500000001', 1, 12, 51.1), ('66666666-7777-4000-8000-000000000034', '55555555-eeee-4000-8000-000500000001', 2, 12, 43.2), ('66666666-7777-4000-8000-000000000034', '55555555-eeee-4000-8000-000500000001', 3, 12, 44.6), ('66666666-7777-4000-8000-000000000034', '55555555-eeee-4000-8000-000500000002', 1, 9, 19.3), ('66666666-7777-4000-8000-000000000034', '55555555-eeee-4000-8000-000500000002', 2, 10, 17.5), ('66666666-7777-4000-8000-000000000034', '55555555-eeee-4000-8000-000500000002', 3, 12, 13.7), ('66666666-7777-4000-8000-000000000034', '55555555-eeee-4000-8000-000500000003', 1, 15, 35.9), ('66666666-7777-4000-8000-000000000034', '55555555-eeee-4000-8000-000500000003', 2, 15, 50.2), ('66666666-7777-4000-8000-000000000034', '55555555-eeee-4000-8000-000500000003', 3, 15, 23.5), ('66666666-7777-4000-8000-000000000034', '55555555-eeee-4000-8000-000500000004', 1, 12, 57.1), ('66666666-7777-4000-8000-000000000034', '55555555-eeee-4000-8000-000500000004', 2, 11, 15.1), ('66666666-7777-4000-8000-000000000034', '55555555-eeee-4000-8000-000500000004', 3, 8, 32.9) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000035', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000500000001', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-04-20T15:00:00.000Z'::timestamptz, '2026-04-20T15:51:00.000Z'::timestamptz, 51, 8, 'Foi top hoje.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000035', '55555555-eeee-4000-8000-000501000000', 1, 45, 8.5), ('66666666-7777-4000-8000-000000000035', '55555555-eeee-4000-8000-000501000000', 2, 45, 7.2), ('66666666-7777-4000-8000-000000000035', '55555555-eeee-4000-8000-000501000000', 3, 45, 38.9), ('66666666-7777-4000-8000-000000000035', '55555555-eeee-4000-8000-000501000001', 1, 9, 12.2), ('66666666-7777-4000-8000-000000000035', '55555555-eeee-4000-8000-000501000001', 2, 11, 53.1), ('66666666-7777-4000-8000-000000000035', '55555555-eeee-4000-8000-000501000001', 3, 9, 9.2), ('66666666-7777-4000-8000-000000000035', '55555555-eeee-4000-8000-000501000002', 1, 20, 6.9), ('66666666-7777-4000-8000-000000000035', '55555555-eeee-4000-8000-000501000002', 2, 20, 15.7), ('66666666-7777-4000-8000-000000000035', '55555555-eeee-4000-8000-000501000002', 3, 20, 18.4), ('66666666-7777-4000-8000-000000000035', '55555555-eeee-4000-8000-000501000003', 1, 15, 56.6), ('66666666-7777-4000-8000-000000000035', '55555555-eeee-4000-8000-000501000003', 2, 15, 54.5), ('66666666-7777-4000-8000-000000000035', '55555555-eeee-4000-8000-000501000003', 3, 15, 26.8) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000036', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000600000000', 'ed29f6bd-a124-42b8-860f-8a48f4228b95', '2026-05-05T07:00:00.000Z'::timestamptz, '2026-05-05T07:48:00.000Z'::timestamptz, 48, 7, 'Treino completo!')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000036', '55555555-eeee-4000-8000-000600000000', 1, 9, 19.4), ('66666666-7777-4000-8000-000000000036', '55555555-eeee-4000-8000-000600000000', 2, 11, 31), ('66666666-7777-4000-8000-000000000036', '55555555-eeee-4000-8000-000600000000', 3, 10, 58.6), ('66666666-7777-4000-8000-000000000036', '55555555-eeee-4000-8000-000600000001', 1, 10, 8.5), ('66666666-7777-4000-8000-000000000036', '55555555-eeee-4000-8000-000600000001', 2, 12, 33.1), ('66666666-7777-4000-8000-000000000036', '55555555-eeee-4000-8000-000600000001', 3, 11, 11.4), ('66666666-7777-4000-8000-000000000036', '55555555-eeee-4000-8000-000600000002', 1, 8, 35.2), ('66666666-7777-4000-8000-000000000036', '55555555-eeee-4000-8000-000600000002', 2, 12, 22.9), ('66666666-7777-4000-8000-000000000036', '55555555-eeee-4000-8000-000600000002', 3, 9, 17.1), ('66666666-7777-4000-8000-000000000036', '55555555-eeee-4000-8000-000600000003', 1, 15, 31.4), ('66666666-7777-4000-8000-000000000036', '55555555-eeee-4000-8000-000600000003', 2, 15, 27.2), ('66666666-7777-4000-8000-000000000036', '55555555-eeee-4000-8000-000600000003', 3, 15, 23.7), ('66666666-7777-4000-8000-000000000036', '55555555-eeee-4000-8000-000600000004', 1, 10, 29.6), ('66666666-7777-4000-8000-000000000036', '55555555-eeee-4000-8000-000600000004', 2, 8, 32.2), ('66666666-7777-4000-8000-000000000036', '55555555-eeee-4000-8000-000600000004', 3, 11, 12.3) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000037', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000600000001', 'ed29f6bd-a124-42b8-860f-8a48f4228b95', '2026-05-02T09:00:00.000Z'::timestamptz, '2026-05-02T09:46:00.000Z'::timestamptz, 46, 5, 'Pesado mas saiu.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000037', '55555555-eeee-4000-8000-000601000000', 1, 10, 55.6), ('66666666-7777-4000-8000-000000000037', '55555555-eeee-4000-8000-000601000000', 2, 12, 39.7), ('66666666-7777-4000-8000-000000000037', '55555555-eeee-4000-8000-000601000000', 3, 10, 39.9), ('66666666-7777-4000-8000-000000000037', '55555555-eeee-4000-8000-000601000001', 1, 9, 55.4), ('66666666-7777-4000-8000-000000000037', '55555555-eeee-4000-8000-000601000001', 2, 8, 43.3), ('66666666-7777-4000-8000-000000000037', '55555555-eeee-4000-8000-000601000001', 3, 12, 33.3), ('66666666-7777-4000-8000-000000000037', '55555555-eeee-4000-8000-000601000002', 1, 11, 23.8), ('66666666-7777-4000-8000-000000000037', '55555555-eeee-4000-8000-000601000002', 2, 11, 36.4), ('66666666-7777-4000-8000-000000000037', '55555555-eeee-4000-8000-000601000002', 3, 9, 32), ('66666666-7777-4000-8000-000000000037', '55555555-eeee-4000-8000-000601000003', 1, 9, 25.4), ('66666666-7777-4000-8000-000000000037', '55555555-eeee-4000-8000-000601000003', 2, 10, 12.5), ('66666666-7777-4000-8000-000000000037', '55555555-eeee-4000-8000-000601000003', 3, 10, 23.5), ('66666666-7777-4000-8000-000000000037', '55555555-eeee-4000-8000-000601000004', 1, 12, 18.1), ('66666666-7777-4000-8000-000000000037', '55555555-eeee-4000-8000-000601000004', 2, 12, 25.1), ('66666666-7777-4000-8000-000000000037', '55555555-eeee-4000-8000-000601000004', 3, 12, 22.6) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000038', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000600000002', 'ed29f6bd-a124-42b8-860f-8a48f4228b95', '2026-04-29T11:00:00.000Z'::timestamptz, '2026-04-29T12:07:00.000Z'::timestamptz, 67, 4, 'Pesado mas saiu.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000038', '55555555-eeee-4000-8000-000602000000', 1, 10, 50.3), ('66666666-7777-4000-8000-000000000038', '55555555-eeee-4000-8000-000602000000', 2, 11, 30.2), ('66666666-7777-4000-8000-000000000038', '55555555-eeee-4000-8000-000602000000', 3, 8, 36), ('66666666-7777-4000-8000-000000000038', '55555555-eeee-4000-8000-000602000000', 4, 8, 15.2), ('66666666-7777-4000-8000-000000000038', '55555555-eeee-4000-8000-000602000001', 1, 12, 17.3), ('66666666-7777-4000-8000-000000000038', '55555555-eeee-4000-8000-000602000001', 2, 10, 27.4), ('66666666-7777-4000-8000-000000000038', '55555555-eeee-4000-8000-000602000001', 3, 11, 36.4), ('66666666-7777-4000-8000-000000000038', '55555555-eeee-4000-8000-000602000002', 1, 10, 50.4), ('66666666-7777-4000-8000-000000000038', '55555555-eeee-4000-8000-000602000002', 2, 11, 26.4), ('66666666-7777-4000-8000-000000000038', '55555555-eeee-4000-8000-000602000002', 3, 9, 42.8), ('66666666-7777-4000-8000-000000000038', '55555555-eeee-4000-8000-000602000003', 1, 10, 56.1), ('66666666-7777-4000-8000-000000000038', '55555555-eeee-4000-8000-000602000003', 2, 10, 56.4), ('66666666-7777-4000-8000-000000000038', '55555555-eeee-4000-8000-000602000003', 3, 10, 47.3), ('66666666-7777-4000-8000-000000000038', '55555555-eeee-4000-8000-000602000004', 1, 12, 49.1), ('66666666-7777-4000-8000-000000000038', '55555555-eeee-4000-8000-000602000004', 2, 12, 40.3), ('66666666-7777-4000-8000-000000000038', '55555555-eeee-4000-8000-000602000004', 3, 12, 15.3) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000039', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000600000000', 'ed29f6bd-a124-42b8-860f-8a48f4228b95', '2026-04-25T13:00:00.000Z'::timestamptz, '2026-04-25T13:40:00.000Z'::timestamptz, 40, 9, 'Foi top hoje.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000039', '55555555-eeee-4000-8000-000600000000', 1, 11, 31.6), ('66666666-7777-4000-8000-000000000039', '55555555-eeee-4000-8000-000600000000', 2, 10, 21), ('66666666-7777-4000-8000-000000000039', '55555555-eeee-4000-8000-000600000000', 3, 11, 53.1), ('66666666-7777-4000-8000-000000000039', '55555555-eeee-4000-8000-000600000001', 1, 9, 27.9), ('66666666-7777-4000-8000-000000000039', '55555555-eeee-4000-8000-000600000001', 2, 12, 53.2), ('66666666-7777-4000-8000-000000000039', '55555555-eeee-4000-8000-000600000001', 3, 11, 5.7), ('66666666-7777-4000-8000-000000000039', '55555555-eeee-4000-8000-000600000002', 1, 10, 55.5), ('66666666-7777-4000-8000-000000000039', '55555555-eeee-4000-8000-000600000002', 2, 9, 10.9), ('66666666-7777-4000-8000-000000000039', '55555555-eeee-4000-8000-000600000002', 3, 8, 28.4), ('66666666-7777-4000-8000-000000000039', '55555555-eeee-4000-8000-000600000003', 1, 15, 20.4), ('66666666-7777-4000-8000-000000000039', '55555555-eeee-4000-8000-000600000003', 2, 15, 51), ('66666666-7777-4000-8000-000000000039', '55555555-eeee-4000-8000-000600000003', 3, 15, 52.1), ('66666666-7777-4000-8000-000000000039', '55555555-eeee-4000-8000-000600000004', 1, 11, 8.1), ('66666666-7777-4000-8000-000000000039', '55555555-eeee-4000-8000-000600000004', 2, 12, 23.5), ('66666666-7777-4000-8000-000000000039', '55555555-eeee-4000-8000-000600000004', 3, 11, 23.2) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000040', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000600000001', 'ed29f6bd-a124-42b8-860f-8a48f4228b95', '2026-04-19T15:00:00.000Z'::timestamptz, '2026-04-19T16:07:00.000Z'::timestamptz, 67, 8, 'Foi top hoje.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000040', '55555555-eeee-4000-8000-000601000000', 1, 12, 22.4), ('66666666-7777-4000-8000-000000000040', '55555555-eeee-4000-8000-000601000000', 2, 8, 10.6), ('66666666-7777-4000-8000-000000000040', '55555555-eeee-4000-8000-000601000000', 3, 10, 16.8), ('66666666-7777-4000-8000-000000000040', '55555555-eeee-4000-8000-000601000001', 1, 11, 35.4), ('66666666-7777-4000-8000-000000000040', '55555555-eeee-4000-8000-000601000001', 2, 11, 56.1), ('66666666-7777-4000-8000-000000000040', '55555555-eeee-4000-8000-000601000001', 3, 11, 45.7), ('66666666-7777-4000-8000-000000000040', '55555555-eeee-4000-8000-000601000002', 1, 9, 13.7), ('66666666-7777-4000-8000-000000000040', '55555555-eeee-4000-8000-000601000002', 2, 8, 6.1), ('66666666-7777-4000-8000-000000000040', '55555555-eeee-4000-8000-000601000002', 3, 11, 8.5), ('66666666-7777-4000-8000-000000000040', '55555555-eeee-4000-8000-000601000003', 1, 8, 9.2), ('66666666-7777-4000-8000-000000000040', '55555555-eeee-4000-8000-000601000003', 2, 9, 32), ('66666666-7777-4000-8000-000000000040', '55555555-eeee-4000-8000-000601000003', 3, 10, 10.3), ('66666666-7777-4000-8000-000000000040', '55555555-eeee-4000-8000-000601000004', 1, 12, 45.7), ('66666666-7777-4000-8000-000000000040', '55555555-eeee-4000-8000-000601000004', 2, 12, 58), ('66666666-7777-4000-8000-000000000040', '55555555-eeee-4000-8000-000601000004', 3, 12, 31.4) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000041', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000700000000', 'ab9768a5-a3a4-4163-bb63-5e771cf173fe', '2026-05-04T07:00:00.000Z'::timestamptz, '2026-05-04T07:50:00.000Z'::timestamptz, 50, 4, 'Foi top hoje.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000041', '55555555-eeee-4000-8000-000700000000', 1, 12, 36.6), ('66666666-7777-4000-8000-000000000041', '55555555-eeee-4000-8000-000700000000', 2, 8, 13.9), ('66666666-7777-4000-8000-000000000041', '55555555-eeee-4000-8000-000700000000', 3, 8, 6.9), ('66666666-7777-4000-8000-000000000041', '55555555-eeee-4000-8000-000700000001', 1, 8, 45.1), ('66666666-7777-4000-8000-000000000041', '55555555-eeee-4000-8000-000700000001', 2, 11, 26.1), ('66666666-7777-4000-8000-000000000041', '55555555-eeee-4000-8000-000700000001', 3, 9, 27.3), ('66666666-7777-4000-8000-000000000041', '55555555-eeee-4000-8000-000700000002', 1, 11, 11.4), ('66666666-7777-4000-8000-000000000041', '55555555-eeee-4000-8000-000700000002', 2, 8, 29.4), ('66666666-7777-4000-8000-000000000041', '55555555-eeee-4000-8000-000700000002', 3, 12, 27.2), ('66666666-7777-4000-8000-000000000041', '55555555-eeee-4000-8000-000700000003', 1, 8, 10.6), ('66666666-7777-4000-8000-000000000041', '55555555-eeee-4000-8000-000700000003', 2, 12, 37.1), ('66666666-7777-4000-8000-000000000041', '55555555-eeee-4000-8000-000700000003', 3, 12, 30.4) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000042', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000700000001', 'ab9768a5-a3a4-4163-bb63-5e771cf173fe', '2026-05-01T09:00:00.000Z'::timestamptz, '2026-05-01T09:51:00.000Z'::timestamptz, 51, 4, 'Treino completo!')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000042', '55555555-eeee-4000-8000-000701000000', 1, 11, 41.9), ('66666666-7777-4000-8000-000000000042', '55555555-eeee-4000-8000-000701000000', 2, 8, 55.3), ('66666666-7777-4000-8000-000000000042', '55555555-eeee-4000-8000-000701000000', 3, 12, 38.4), ('66666666-7777-4000-8000-000000000042', '55555555-eeee-4000-8000-000701000000', 4, 10, 20.3), ('66666666-7777-4000-8000-000000000042', '55555555-eeee-4000-8000-000701000001', 1, 11, 16.7), ('66666666-7777-4000-8000-000000000042', '55555555-eeee-4000-8000-000701000001', 2, 8, 41.5), ('66666666-7777-4000-8000-000000000042', '55555555-eeee-4000-8000-000701000001', 3, 12, 25.9), ('66666666-7777-4000-8000-000000000042', '55555555-eeee-4000-8000-000701000002', 1, 12, 14.8), ('66666666-7777-4000-8000-000000000042', '55555555-eeee-4000-8000-000701000002', 2, 12, 24.9), ('66666666-7777-4000-8000-000000000042', '55555555-eeee-4000-8000-000701000002', 3, 9, 26.9), ('66666666-7777-4000-8000-000000000042', '55555555-eeee-4000-8000-000701000003', 1, 10, 25), ('66666666-7777-4000-8000-000000000042', '55555555-eeee-4000-8000-000701000003', 2, 10, 33.1), ('66666666-7777-4000-8000-000000000042', '55555555-eeee-4000-8000-000701000003', 3, 10, 58.6), ('66666666-7777-4000-8000-000000000042', '55555555-eeee-4000-8000-000701000004', 1, 12, 47), ('66666666-7777-4000-8000-000000000042', '55555555-eeee-4000-8000-000701000004', 2, 12, 29.9), ('66666666-7777-4000-8000-000000000042', '55555555-eeee-4000-8000-000701000004', 3, 12, 7.4) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000043', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000700000000', 'ab9768a5-a3a4-4163-bb63-5e771cf173fe', '2026-04-28T11:00:00.000Z'::timestamptz, '2026-04-28T11:38:00.000Z'::timestamptz, 38, 8, 'Pesado mas saiu.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000043', '55555555-eeee-4000-8000-000700000000', 1, 10, 6.6), ('66666666-7777-4000-8000-000000000043', '55555555-eeee-4000-8000-000700000000', 2, 11, 46.1), ('66666666-7777-4000-8000-000000000043', '55555555-eeee-4000-8000-000700000000', 3, 11, 30.8), ('66666666-7777-4000-8000-000000000043', '55555555-eeee-4000-8000-000700000001', 1, 11, 45.2), ('66666666-7777-4000-8000-000000000043', '55555555-eeee-4000-8000-000700000001', 2, 12, 14.5), ('66666666-7777-4000-8000-000000000043', '55555555-eeee-4000-8000-000700000001', 3, 11, 28.7), ('66666666-7777-4000-8000-000000000043', '55555555-eeee-4000-8000-000700000002', 1, 10, 58.3), ('66666666-7777-4000-8000-000000000043', '55555555-eeee-4000-8000-000700000002', 2, 11, 36), ('66666666-7777-4000-8000-000000000043', '55555555-eeee-4000-8000-000700000002', 3, 8, 29.8), ('66666666-7777-4000-8000-000000000043', '55555555-eeee-4000-8000-000700000003', 1, 8, 53.6), ('66666666-7777-4000-8000-000000000043', '55555555-eeee-4000-8000-000700000003', 2, 12, 36.3), ('66666666-7777-4000-8000-000000000043', '55555555-eeee-4000-8000-000700000003', 3, 12, 20) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000044', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000700000001', 'ab9768a5-a3a4-4163-bb63-5e771cf173fe', '2026-04-24T13:00:00.000Z'::timestamptz, '2026-04-24T14:04:00.000Z'::timestamptz, 64, 7, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000044', '55555555-eeee-4000-8000-000701000000', 1, 8, 13.7), ('66666666-7777-4000-8000-000000000044', '55555555-eeee-4000-8000-000701000000', 2, 10, 13), ('66666666-7777-4000-8000-000000000044', '55555555-eeee-4000-8000-000701000000', 3, 12, 57.9), ('66666666-7777-4000-8000-000000000044', '55555555-eeee-4000-8000-000701000000', 4, 10, 21.6), ('66666666-7777-4000-8000-000000000044', '55555555-eeee-4000-8000-000701000001', 1, 10, 29.9), ('66666666-7777-4000-8000-000000000044', '55555555-eeee-4000-8000-000701000001', 2, 9, 20.4), ('66666666-7777-4000-8000-000000000044', '55555555-eeee-4000-8000-000701000001', 3, 9, 10.9), ('66666666-7777-4000-8000-000000000044', '55555555-eeee-4000-8000-000701000002', 1, 12, 12.5), ('66666666-7777-4000-8000-000000000044', '55555555-eeee-4000-8000-000701000002', 2, 10, 9), ('66666666-7777-4000-8000-000000000044', '55555555-eeee-4000-8000-000701000002', 3, 8, 56), ('66666666-7777-4000-8000-000000000044', '55555555-eeee-4000-8000-000701000003', 1, 10, 28.6), ('66666666-7777-4000-8000-000000000044', '55555555-eeee-4000-8000-000701000003', 2, 10, 34.5), ('66666666-7777-4000-8000-000000000044', '55555555-eeee-4000-8000-000701000003', 3, 10, 41.4), ('66666666-7777-4000-8000-000000000044', '55555555-eeee-4000-8000-000701000004', 1, 12, 56.6), ('66666666-7777-4000-8000-000000000044', '55555555-eeee-4000-8000-000701000004', 2, 12, 27.3), ('66666666-7777-4000-8000-000000000044', '55555555-eeee-4000-8000-000701000004', 3, 12, 45.9) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000045', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000700000000', 'ab9768a5-a3a4-4163-bb63-5e771cf173fe', '2026-04-18T15:00:00.000Z'::timestamptz, '2026-04-18T15:53:00.000Z'::timestamptz, 53, 4, 'Pesado mas saiu.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000045', '55555555-eeee-4000-8000-000700000000', 1, 9, 11.5), ('66666666-7777-4000-8000-000000000045', '55555555-eeee-4000-8000-000700000000', 2, 12, 47.8), ('66666666-7777-4000-8000-000000000045', '55555555-eeee-4000-8000-000700000000', 3, 11, 32.9), ('66666666-7777-4000-8000-000000000045', '55555555-eeee-4000-8000-000700000001', 1, 9, 21.8), ('66666666-7777-4000-8000-000000000045', '55555555-eeee-4000-8000-000700000001', 2, 10, 46.2), ('66666666-7777-4000-8000-000000000045', '55555555-eeee-4000-8000-000700000001', 3, 8, 56.9), ('66666666-7777-4000-8000-000000000045', '55555555-eeee-4000-8000-000700000002', 1, 12, 7.6), ('66666666-7777-4000-8000-000000000045', '55555555-eeee-4000-8000-000700000002', 2, 9, 53.1), ('66666666-7777-4000-8000-000000000045', '55555555-eeee-4000-8000-000700000002', 3, 10, 17.5), ('66666666-7777-4000-8000-000000000045', '55555555-eeee-4000-8000-000700000003', 1, 8, 49.6), ('66666666-7777-4000-8000-000000000045', '55555555-eeee-4000-8000-000700000003', 2, 12, 46.8), ('66666666-7777-4000-8000-000000000045', '55555555-eeee-4000-8000-000700000003', 3, 8, 21.7) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000046', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000800000000', '02420861-f44e-4be0-9f2e-ffcf300add7d', '2026-05-03T07:00:00.000Z'::timestamptz, '2026-05-03T07:43:00.000Z'::timestamptz, 43, 5, 'Cabeça boa, treino bom.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000046', '55555555-eeee-4000-8000-000800000000', 1, 12, 10.3), ('66666666-7777-4000-8000-000000000046', '55555555-eeee-4000-8000-000800000000', 2, 9, 12.2), ('66666666-7777-4000-8000-000000000046', '55555555-eeee-4000-8000-000800000000', 3, 8, 15.9), ('66666666-7777-4000-8000-000000000046', '55555555-eeee-4000-8000-000800000001', 1, 9, 58.2), ('66666666-7777-4000-8000-000000000046', '55555555-eeee-4000-8000-000800000001', 2, 9, 22.6), ('66666666-7777-4000-8000-000000000046', '55555555-eeee-4000-8000-000800000001', 3, 11, 16.5), ('66666666-7777-4000-8000-000000000046', '55555555-eeee-4000-8000-000800000002', 1, 12, 34), ('66666666-7777-4000-8000-000000000046', '55555555-eeee-4000-8000-000800000002', 2, 11, 12.2), ('66666666-7777-4000-8000-000000000046', '55555555-eeee-4000-8000-000800000002', 3, 12, 32.9), ('66666666-7777-4000-8000-000000000046', '55555555-eeee-4000-8000-000800000003', 1, 15, 13.4), ('66666666-7777-4000-8000-000000000046', '55555555-eeee-4000-8000-000800000003', 2, 15, 48.6), ('66666666-7777-4000-8000-000000000046', '55555555-eeee-4000-8000-000800000003', 3, 15, 40.9), ('66666666-7777-4000-8000-000000000046', '55555555-eeee-4000-8000-000800000004', 1, 8, 9.7), ('66666666-7777-4000-8000-000000000046', '55555555-eeee-4000-8000-000800000004', 2, 8, 59.7), ('66666666-7777-4000-8000-000000000046', '55555555-eeee-4000-8000-000800000004', 3, 11, 25.4) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000047', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000800000001', '02420861-f44e-4be0-9f2e-ffcf300add7d', '2026-04-30T09:00:00.000Z'::timestamptz, '2026-04-30T09:41:00.000Z'::timestamptz, 41, 5, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000047', '55555555-eeee-4000-8000-000801000000', 1, 8, 50.9), ('66666666-7777-4000-8000-000000000047', '55555555-eeee-4000-8000-000801000000', 2, 9, 21.7), ('66666666-7777-4000-8000-000000000047', '55555555-eeee-4000-8000-000801000000', 3, 11, 30.2), ('66666666-7777-4000-8000-000000000047', '55555555-eeee-4000-8000-000801000001', 1, 9, 12.3), ('66666666-7777-4000-8000-000000000047', '55555555-eeee-4000-8000-000801000001', 2, 11, 38.1), ('66666666-7777-4000-8000-000000000047', '55555555-eeee-4000-8000-000801000001', 3, 11, 44.2), ('66666666-7777-4000-8000-000000000047', '55555555-eeee-4000-8000-000801000002', 1, 8, 22.6), ('66666666-7777-4000-8000-000000000047', '55555555-eeee-4000-8000-000801000002', 2, 10, 43.1), ('66666666-7777-4000-8000-000000000047', '55555555-eeee-4000-8000-000801000002', 3, 8, 53.1), ('66666666-7777-4000-8000-000000000047', '55555555-eeee-4000-8000-000801000003', 1, 11, 47.5), ('66666666-7777-4000-8000-000000000047', '55555555-eeee-4000-8000-000801000003', 2, 10, 34.7), ('66666666-7777-4000-8000-000000000047', '55555555-eeee-4000-8000-000801000003', 3, 12, 15.4), ('66666666-7777-4000-8000-000000000047', '55555555-eeee-4000-8000-000801000004', 1, 12, 5.4), ('66666666-7777-4000-8000-000000000047', '55555555-eeee-4000-8000-000801000004', 2, 12, 45.1), ('66666666-7777-4000-8000-000000000047', '55555555-eeee-4000-8000-000801000004', 3, 12, 11.2) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000048', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000800000002', '02420861-f44e-4be0-9f2e-ffcf300add7d', '2026-04-27T11:00:00.000Z'::timestamptz, '2026-04-27T12:10:00.000Z'::timestamptz, 70, 7, 'Pesado mas saiu.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000048', '55555555-eeee-4000-8000-000802000000', 1, 8, 54.3), ('66666666-7777-4000-8000-000000000048', '55555555-eeee-4000-8000-000802000000', 2, 12, 16.2), ('66666666-7777-4000-8000-000000000048', '55555555-eeee-4000-8000-000802000000', 3, 8, 56.7), ('66666666-7777-4000-8000-000000000048', '55555555-eeee-4000-8000-000802000000', 4, 10, 13.5), ('66666666-7777-4000-8000-000000000048', '55555555-eeee-4000-8000-000802000001', 1, 11, 26.5), ('66666666-7777-4000-8000-000000000048', '55555555-eeee-4000-8000-000802000001', 2, 9, 15), ('66666666-7777-4000-8000-000000000048', '55555555-eeee-4000-8000-000802000001', 3, 12, 54.3), ('66666666-7777-4000-8000-000000000048', '55555555-eeee-4000-8000-000802000002', 1, 8, 53.4), ('66666666-7777-4000-8000-000000000048', '55555555-eeee-4000-8000-000802000002', 2, 9, 21.5), ('66666666-7777-4000-8000-000000000048', '55555555-eeee-4000-8000-000802000002', 3, 11, 56.5), ('66666666-7777-4000-8000-000000000048', '55555555-eeee-4000-8000-000802000003', 1, 10, 32.6), ('66666666-7777-4000-8000-000000000048', '55555555-eeee-4000-8000-000802000003', 2, 10, 55.7), ('66666666-7777-4000-8000-000000000048', '55555555-eeee-4000-8000-000802000003', 3, 10, 14.7), ('66666666-7777-4000-8000-000000000048', '55555555-eeee-4000-8000-000802000004', 1, 12, 51), ('66666666-7777-4000-8000-000000000048', '55555555-eeee-4000-8000-000802000004', 2, 12, 58.7), ('66666666-7777-4000-8000-000000000048', '55555555-eeee-4000-8000-000802000004', 3, 12, 44.9) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000049', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000800000000', '02420861-f44e-4be0-9f2e-ffcf300add7d', '2026-04-23T13:00:00.000Z'::timestamptz, '2026-04-23T14:08:00.000Z'::timestamptz, 68, 9, 'Treino completo!')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000049', '55555555-eeee-4000-8000-000800000000', 1, 10, 35.6), ('66666666-7777-4000-8000-000000000049', '55555555-eeee-4000-8000-000800000000', 2, 9, 10.2), ('66666666-7777-4000-8000-000000000049', '55555555-eeee-4000-8000-000800000000', 3, 12, 58), ('66666666-7777-4000-8000-000000000049', '55555555-eeee-4000-8000-000800000001', 1, 8, 45.4), ('66666666-7777-4000-8000-000000000049', '55555555-eeee-4000-8000-000800000001', 2, 11, 33.3), ('66666666-7777-4000-8000-000000000049', '55555555-eeee-4000-8000-000800000001', 3, 11, 12.7), ('66666666-7777-4000-8000-000000000049', '55555555-eeee-4000-8000-000800000002', 1, 11, 24.9), ('66666666-7777-4000-8000-000000000049', '55555555-eeee-4000-8000-000800000002', 2, 11, 14.3), ('66666666-7777-4000-8000-000000000049', '55555555-eeee-4000-8000-000800000002', 3, 8, 9.7), ('66666666-7777-4000-8000-000000000049', '55555555-eeee-4000-8000-000800000003', 1, 15, 30), ('66666666-7777-4000-8000-000000000049', '55555555-eeee-4000-8000-000800000003', 2, 15, 12.9), ('66666666-7777-4000-8000-000000000049', '55555555-eeee-4000-8000-000800000003', 3, 15, 24.2), ('66666666-7777-4000-8000-000000000049', '55555555-eeee-4000-8000-000800000004', 1, 12, 11.4), ('66666666-7777-4000-8000-000000000049', '55555555-eeee-4000-8000-000800000004', 2, 11, 6.5), ('66666666-7777-4000-8000-000000000049', '55555555-eeee-4000-8000-000800000004', 3, 8, 56) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000050', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000800000001', '02420861-f44e-4be0-9f2e-ffcf300add7d', '2026-04-17T15:00:00.000Z'::timestamptz, '2026-04-17T16:07:00.000Z'::timestamptz, 67, 5, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000050', '55555555-eeee-4000-8000-000801000000', 1, 9, 19), ('66666666-7777-4000-8000-000000000050', '55555555-eeee-4000-8000-000801000000', 2, 10, 35.2), ('66666666-7777-4000-8000-000000000050', '55555555-eeee-4000-8000-000801000000', 3, 12, 41.9), ('66666666-7777-4000-8000-000000000050', '55555555-eeee-4000-8000-000801000001', 1, 11, 26.1), ('66666666-7777-4000-8000-000000000050', '55555555-eeee-4000-8000-000801000001', 2, 11, 30.8), ('66666666-7777-4000-8000-000000000050', '55555555-eeee-4000-8000-000801000001', 3, 8, 39.7), ('66666666-7777-4000-8000-000000000050', '55555555-eeee-4000-8000-000801000002', 1, 12, 14.5), ('66666666-7777-4000-8000-000000000050', '55555555-eeee-4000-8000-000801000002', 2, 8, 55.6), ('66666666-7777-4000-8000-000000000050', '55555555-eeee-4000-8000-000801000002', 3, 12, 17.8), ('66666666-7777-4000-8000-000000000050', '55555555-eeee-4000-8000-000801000003', 1, 8, 35.3), ('66666666-7777-4000-8000-000000000050', '55555555-eeee-4000-8000-000801000003', 2, 11, 31.8), ('66666666-7777-4000-8000-000000000050', '55555555-eeee-4000-8000-000801000003', 3, 11, 8.7), ('66666666-7777-4000-8000-000000000050', '55555555-eeee-4000-8000-000801000004', 1, 12, 50.8), ('66666666-7777-4000-8000-000000000050', '55555555-eeee-4000-8000-000801000004', 2, 12, 29), ('66666666-7777-4000-8000-000000000050', '55555555-eeee-4000-8000-000801000004', 3, 12, 12.5) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000051', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000900000000', 'f08264bc-8c9b-4ae8-a25b-0ca1e0c603b2', '2026-05-02T07:00:00.000Z'::timestamptz, '2026-05-02T08:15:00.000Z'::timestamptz, 75, 8, 'Pesado mas saiu.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000051', '55555555-eeee-4000-8000-000900000000', 1, 45, 44.5), ('66666666-7777-4000-8000-000000000051', '55555555-eeee-4000-8000-000900000000', 2, 45, 39.7), ('66666666-7777-4000-8000-000000000051', '55555555-eeee-4000-8000-000900000000', 3, 45, 28.1), ('66666666-7777-4000-8000-000000000051', '55555555-eeee-4000-8000-000900000001', 1, 8, 20.5), ('66666666-7777-4000-8000-000000000051', '55555555-eeee-4000-8000-000900000001', 2, 12, 18.3), ('66666666-7777-4000-8000-000000000051', '55555555-eeee-4000-8000-000900000001', 3, 11, 44.9), ('66666666-7777-4000-8000-000000000051', '55555555-eeee-4000-8000-000900000002', 1, 20, 41.5), ('66666666-7777-4000-8000-000000000051', '55555555-eeee-4000-8000-000900000002', 2, 20, 14.1), ('66666666-7777-4000-8000-000000000051', '55555555-eeee-4000-8000-000900000002', 3, 20, 54.1), ('66666666-7777-4000-8000-000000000051', '55555555-eeee-4000-8000-000900000003', 1, 15, 32.7), ('66666666-7777-4000-8000-000000000051', '55555555-eeee-4000-8000-000900000003', 2, 15, 49.8), ('66666666-7777-4000-8000-000000000051', '55555555-eeee-4000-8000-000900000003', 3, 15, 46.8) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000052', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000900000001', 'f08264bc-8c9b-4ae8-a25b-0ca1e0c603b2', '2026-04-29T09:00:00.000Z'::timestamptz, '2026-04-29T10:10:00.000Z'::timestamptz, 70, 7, 'Treino completo!')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000052', '55555555-eeee-4000-8000-000901000000', 1, 8, 15.7), ('66666666-7777-4000-8000-000000000052', '55555555-eeee-4000-8000-000901000000', 2, 11, 54.5), ('66666666-7777-4000-8000-000000000052', '55555555-eeee-4000-8000-000901000000', 3, 9, 35.6), ('66666666-7777-4000-8000-000000000052', '55555555-eeee-4000-8000-000901000001', 1, 9, 39.5), ('66666666-7777-4000-8000-000000000052', '55555555-eeee-4000-8000-000901000001', 2, 8, 20.3), ('66666666-7777-4000-8000-000000000052', '55555555-eeee-4000-8000-000901000001', 3, 10, 10.3), ('66666666-7777-4000-8000-000000000052', '55555555-eeee-4000-8000-000901000002', 1, 8, 15.5), ('66666666-7777-4000-8000-000000000052', '55555555-eeee-4000-8000-000901000002', 2, 12, 13.7), ('66666666-7777-4000-8000-000000000052', '55555555-eeee-4000-8000-000901000002', 3, 8, 46.1), ('66666666-7777-4000-8000-000000000052', '55555555-eeee-4000-8000-000901000003', 1, 10, 22.6), ('66666666-7777-4000-8000-000000000052', '55555555-eeee-4000-8000-000901000003', 2, 8, 38.1), ('66666666-7777-4000-8000-000000000052', '55555555-eeee-4000-8000-000901000003', 3, 11, 44.7) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000053', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000900000000', 'f08264bc-8c9b-4ae8-a25b-0ca1e0c603b2', '2026-04-26T11:00:00.000Z'::timestamptz, '2026-04-26T12:00:00.000Z'::timestamptz, 60, 8, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000053', '55555555-eeee-4000-8000-000900000000', 1, 45, 12.4), ('66666666-7777-4000-8000-000000000053', '55555555-eeee-4000-8000-000900000000', 2, 45, 48.6), ('66666666-7777-4000-8000-000000000053', '55555555-eeee-4000-8000-000900000000', 3, 45, 7.6), ('66666666-7777-4000-8000-000000000053', '55555555-eeee-4000-8000-000900000001', 1, 10, 25.1), ('66666666-7777-4000-8000-000000000053', '55555555-eeee-4000-8000-000900000001', 2, 11, 22.5), ('66666666-7777-4000-8000-000000000053', '55555555-eeee-4000-8000-000900000001', 3, 8, 31.6), ('66666666-7777-4000-8000-000000000053', '55555555-eeee-4000-8000-000900000002', 1, 20, 27.6), ('66666666-7777-4000-8000-000000000053', '55555555-eeee-4000-8000-000900000002', 2, 20, 44.8), ('66666666-7777-4000-8000-000000000053', '55555555-eeee-4000-8000-000900000002', 3, 20, 31), ('66666666-7777-4000-8000-000000000053', '55555555-eeee-4000-8000-000900000003', 1, 15, 59.2), ('66666666-7777-4000-8000-000000000053', '55555555-eeee-4000-8000-000900000003', 2, 15, 38.1), ('66666666-7777-4000-8000-000000000053', '55555555-eeee-4000-8000-000900000003', 3, 15, 48.6) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000054', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000900000001', 'f08264bc-8c9b-4ae8-a25b-0ca1e0c603b2', '2026-04-22T13:00:00.000Z'::timestamptz, '2026-04-22T14:13:00.000Z'::timestamptz, 73, 7, 'Pesado mas saiu.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000054', '55555555-eeee-4000-8000-000901000000', 1, 8, 53.5), ('66666666-7777-4000-8000-000000000054', '55555555-eeee-4000-8000-000901000000', 2, 12, 7), ('66666666-7777-4000-8000-000000000054', '55555555-eeee-4000-8000-000901000000', 3, 9, 57), ('66666666-7777-4000-8000-000000000054', '55555555-eeee-4000-8000-000901000001', 1, 10, 35.1), ('66666666-7777-4000-8000-000000000054', '55555555-eeee-4000-8000-000901000001', 2, 10, 20.2), ('66666666-7777-4000-8000-000000000054', '55555555-eeee-4000-8000-000901000001', 3, 10, 23.8), ('66666666-7777-4000-8000-000000000054', '55555555-eeee-4000-8000-000901000002', 1, 12, 20.1), ('66666666-7777-4000-8000-000000000054', '55555555-eeee-4000-8000-000901000002', 2, 9, 49.6), ('66666666-7777-4000-8000-000000000054', '55555555-eeee-4000-8000-000901000002', 3, 10, 15.3), ('66666666-7777-4000-8000-000000000054', '55555555-eeee-4000-8000-000901000003', 1, 11, 22.9), ('66666666-7777-4000-8000-000000000054', '55555555-eeee-4000-8000-000901000003', 2, 11, 39), ('66666666-7777-4000-8000-000000000054', '55555555-eeee-4000-8000-000901000003', 3, 12, 27.9) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000055', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000900000000', 'f08264bc-8c9b-4ae8-a25b-0ca1e0c603b2', '2026-04-16T15:00:00.000Z'::timestamptz, '2026-04-16T15:49:00.000Z'::timestamptz, 49, 5, 'Pesado mas saiu.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000055', '55555555-eeee-4000-8000-000900000000', 1, 45, 46.2), ('66666666-7777-4000-8000-000000000055', '55555555-eeee-4000-8000-000900000000', 2, 45, 48.8), ('66666666-7777-4000-8000-000000000055', '55555555-eeee-4000-8000-000900000000', 3, 45, 32), ('66666666-7777-4000-8000-000000000055', '55555555-eeee-4000-8000-000900000001', 1, 12, 19), ('66666666-7777-4000-8000-000000000055', '55555555-eeee-4000-8000-000900000001', 2, 8, 36.5), ('66666666-7777-4000-8000-000000000055', '55555555-eeee-4000-8000-000900000001', 3, 12, 34), ('66666666-7777-4000-8000-000000000055', '55555555-eeee-4000-8000-000900000002', 1, 20, 41.5), ('66666666-7777-4000-8000-000000000055', '55555555-eeee-4000-8000-000900000002', 2, 20, 50.1), ('66666666-7777-4000-8000-000000000055', '55555555-eeee-4000-8000-000900000002', 3, 20, 40.9), ('66666666-7777-4000-8000-000000000055', '55555555-eeee-4000-8000-000900000003', 1, 15, 43), ('66666666-7777-4000-8000-000000000055', '55555555-eeee-4000-8000-000900000003', 2, 15, 30.3), ('66666666-7777-4000-8000-000000000055', '55555555-eeee-4000-8000-000900000003', 3, 15, 26.4) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000056', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-001000000000', 'cc659e82-dd94-4de4-9657-3166e7ad37ec', '2026-05-01T07:00:00.000Z'::timestamptz, '2026-05-01T08:10:00.000Z'::timestamptz, 70, 4, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000056', '55555555-eeee-4000-8000-000a00000000', 1, 45, 26.6), ('66666666-7777-4000-8000-000000000056', '55555555-eeee-4000-8000-000a00000000', 2, 45, 44.9), ('66666666-7777-4000-8000-000000000056', '55555555-eeee-4000-8000-000a00000000', 3, 45, 7.7), ('66666666-7777-4000-8000-000000000056', '55555555-eeee-4000-8000-000a00000001', 1, 11, 41.9), ('66666666-7777-4000-8000-000000000056', '55555555-eeee-4000-8000-000a00000001', 2, 10, 32.3), ('66666666-7777-4000-8000-000000000056', '55555555-eeee-4000-8000-000a00000001', 3, 8, 26.9), ('66666666-7777-4000-8000-000000000056', '55555555-eeee-4000-8000-000a00000002', 1, 20, 22.9), ('66666666-7777-4000-8000-000000000056', '55555555-eeee-4000-8000-000a00000002', 2, 20, 56.4), ('66666666-7777-4000-8000-000000000056', '55555555-eeee-4000-8000-000a00000002', 3, 20, 59.6), ('66666666-7777-4000-8000-000000000056', '55555555-eeee-4000-8000-000a00000003', 1, 15, 19.4), ('66666666-7777-4000-8000-000000000056', '55555555-eeee-4000-8000-000a00000003', 2, 15, 49.9), ('66666666-7777-4000-8000-000000000056', '55555555-eeee-4000-8000-000a00000003', 3, 15, 7.3) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000057', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-001000000001', 'cc659e82-dd94-4de4-9657-3166e7ad37ec', '2026-04-28T09:00:00.000Z'::timestamptz, '2026-04-28T10:04:00.000Z'::timestamptz, 64, 7, 'Pesado mas saiu.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000057', '55555555-eeee-4000-8000-000a01000000', 1, 8, 58), ('66666666-7777-4000-8000-000000000057', '55555555-eeee-4000-8000-000a01000000', 2, 8, 8.3), ('66666666-7777-4000-8000-000000000057', '55555555-eeee-4000-8000-000a01000000', 3, 8, 16.2), ('66666666-7777-4000-8000-000000000057', '55555555-eeee-4000-8000-000a01000000', 4, 12, 52), ('66666666-7777-4000-8000-000000000057', '55555555-eeee-4000-8000-000a01000001', 1, 12, 18.8), ('66666666-7777-4000-8000-000000000057', '55555555-eeee-4000-8000-000a01000001', 2, 12, 7.6), ('66666666-7777-4000-8000-000000000057', '55555555-eeee-4000-8000-000a01000001', 3, 12, 5.9), ('66666666-7777-4000-8000-000000000057', '55555555-eeee-4000-8000-000a01000002', 1, 12, 45.7), ('66666666-7777-4000-8000-000000000057', '55555555-eeee-4000-8000-000a01000002', 2, 12, 56.8), ('66666666-7777-4000-8000-000000000057', '55555555-eeee-4000-8000-000a01000002', 3, 9, 52.6), ('66666666-7777-4000-8000-000000000057', '55555555-eeee-4000-8000-000a01000003', 1, 15, 57.4), ('66666666-7777-4000-8000-000000000057', '55555555-eeee-4000-8000-000a01000003', 2, 15, 41.9), ('66666666-7777-4000-8000-000000000057', '55555555-eeee-4000-8000-000a01000003', 3, 15, 15.1), ('66666666-7777-4000-8000-000000000057', '55555555-eeee-4000-8000-000a01000004', 1, 11, 8.8), ('66666666-7777-4000-8000-000000000057', '55555555-eeee-4000-8000-000a01000004', 2, 10, 35.4), ('66666666-7777-4000-8000-000000000057', '55555555-eeee-4000-8000-000a01000004', 3, 9, 35.1) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000058', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-001000000000', 'cc659e82-dd94-4de4-9657-3166e7ad37ec', '2026-04-25T11:00:00.000Z'::timestamptz, '2026-04-25T11:51:00.000Z'::timestamptz, 51, 5, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000058', '55555555-eeee-4000-8000-000a00000000', 1, 45, 45.7), ('66666666-7777-4000-8000-000000000058', '55555555-eeee-4000-8000-000a00000000', 2, 45, 50.3), ('66666666-7777-4000-8000-000000000058', '55555555-eeee-4000-8000-000a00000000', 3, 45, 41.8), ('66666666-7777-4000-8000-000000000058', '55555555-eeee-4000-8000-000a00000001', 1, 11, 33.9), ('66666666-7777-4000-8000-000000000058', '55555555-eeee-4000-8000-000a00000001', 2, 11, 35.5), ('66666666-7777-4000-8000-000000000058', '55555555-eeee-4000-8000-000a00000001', 3, 10, 10.3), ('66666666-7777-4000-8000-000000000058', '55555555-eeee-4000-8000-000a00000002', 1, 20, 16.4), ('66666666-7777-4000-8000-000000000058', '55555555-eeee-4000-8000-000a00000002', 2, 20, 11.8), ('66666666-7777-4000-8000-000000000058', '55555555-eeee-4000-8000-000a00000002', 3, 20, 22.4), ('66666666-7777-4000-8000-000000000058', '55555555-eeee-4000-8000-000a00000003', 1, 15, 14.7), ('66666666-7777-4000-8000-000000000058', '55555555-eeee-4000-8000-000a00000003', 2, 15, 17.9), ('66666666-7777-4000-8000-000000000058', '55555555-eeee-4000-8000-000a00000003', 3, 15, 10.9) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000059', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-001000000001', 'cc659e82-dd94-4de4-9657-3166e7ad37ec', '2026-04-21T13:00:00.000Z'::timestamptz, '2026-04-21T13:51:00.000Z'::timestamptz, 51, 7, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000059', '55555555-eeee-4000-8000-000a01000000', 1, 11, 30.8), ('66666666-7777-4000-8000-000000000059', '55555555-eeee-4000-8000-000a01000000', 2, 12, 52.9), ('66666666-7777-4000-8000-000000000059', '55555555-eeee-4000-8000-000a01000000', 3, 8, 56.7), ('66666666-7777-4000-8000-000000000059', '55555555-eeee-4000-8000-000a01000000', 4, 12, 51.5), ('66666666-7777-4000-8000-000000000059', '55555555-eeee-4000-8000-000a01000001', 1, 12, 15.7), ('66666666-7777-4000-8000-000000000059', '55555555-eeee-4000-8000-000a01000001', 2, 12, 31.9), ('66666666-7777-4000-8000-000000000059', '55555555-eeee-4000-8000-000a01000001', 3, 12, 23.3), ('66666666-7777-4000-8000-000000000059', '55555555-eeee-4000-8000-000a01000002', 1, 10, 41.7), ('66666666-7777-4000-8000-000000000059', '55555555-eeee-4000-8000-000a01000002', 2, 10, 20.3), ('66666666-7777-4000-8000-000000000059', '55555555-eeee-4000-8000-000a01000002', 3, 11, 26.3), ('66666666-7777-4000-8000-000000000059', '55555555-eeee-4000-8000-000a01000003', 1, 15, 29.7), ('66666666-7777-4000-8000-000000000059', '55555555-eeee-4000-8000-000a01000003', 2, 15, 12.5), ('66666666-7777-4000-8000-000000000059', '55555555-eeee-4000-8000-000a01000003', 3, 15, 8.2), ('66666666-7777-4000-8000-000000000059', '55555555-eeee-4000-8000-000a01000004', 1, 8, 29.2), ('66666666-7777-4000-8000-000000000059', '55555555-eeee-4000-8000-000a01000004', 2, 8, 58.6), ('66666666-7777-4000-8000-000000000059', '55555555-eeee-4000-8000-000a01000004', 3, 9, 18.3) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000060', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-001000000000', 'cc659e82-dd94-4de4-9657-3166e7ad37ec', '2026-04-15T15:00:00.000Z'::timestamptz, '2026-04-15T15:37:00.000Z'::timestamptz, 37, 8, 'Pesado mas saiu.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000060', '55555555-eeee-4000-8000-000a00000000', 1, 45, 13.1), ('66666666-7777-4000-8000-000000000060', '55555555-eeee-4000-8000-000a00000000', 2, 45, 12.2), ('66666666-7777-4000-8000-000000000060', '55555555-eeee-4000-8000-000a00000000', 3, 45, 18.9), ('66666666-7777-4000-8000-000000000060', '55555555-eeee-4000-8000-000a00000001', 1, 11, 41), ('66666666-7777-4000-8000-000000000060', '55555555-eeee-4000-8000-000a00000001', 2, 12, 24.6), ('66666666-7777-4000-8000-000000000060', '55555555-eeee-4000-8000-000a00000001', 3, 9, 32.2), ('66666666-7777-4000-8000-000000000060', '55555555-eeee-4000-8000-000a00000002', 1, 20, 12.4), ('66666666-7777-4000-8000-000000000060', '55555555-eeee-4000-8000-000a00000002', 2, 20, 50.2), ('66666666-7777-4000-8000-000000000060', '55555555-eeee-4000-8000-000a00000002', 3, 20, 17.6), ('66666666-7777-4000-8000-000000000060', '55555555-eeee-4000-8000-000a00000003', 1, 15, 10.7), ('66666666-7777-4000-8000-000000000060', '55555555-eeee-4000-8000-000a00000003', 2, 15, 12), ('66666666-7777-4000-8000-000000000060', '55555555-eeee-4000-8000-000a00000003', 3, 15, 21.1) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000061', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-001100000000', '73c55850-2352-4f24-9cd7-73c171d6a012', '2026-04-30T07:00:00.000Z'::timestamptz, '2026-04-30T07:58:00.000Z'::timestamptz, 58, 8, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000061', '55555555-eeee-4000-8000-000b00000000', 1, 9, 17.4), ('66666666-7777-4000-8000-000000000061', '55555555-eeee-4000-8000-000b00000000', 2, 9, 19.8), ('66666666-7777-4000-8000-000000000061', '55555555-eeee-4000-8000-000b00000000', 3, 12, 25.2), ('66666666-7777-4000-8000-000000000061', '55555555-eeee-4000-8000-000b00000001', 1, 8, 15), ('66666666-7777-4000-8000-000000000061', '55555555-eeee-4000-8000-000b00000001', 2, 9, 46.5), ('66666666-7777-4000-8000-000000000061', '55555555-eeee-4000-8000-000b00000001', 3, 9, 59.4), ('66666666-7777-4000-8000-000000000061', '55555555-eeee-4000-8000-000b00000002', 1, 8, 29.2), ('66666666-7777-4000-8000-000000000061', '55555555-eeee-4000-8000-000b00000002', 2, 12, 42.5), ('66666666-7777-4000-8000-000000000061', '55555555-eeee-4000-8000-000b00000002', 3, 11, 28.6), ('66666666-7777-4000-8000-000000000061', '55555555-eeee-4000-8000-000b00000003', 1, 15, 54.5), ('66666666-7777-4000-8000-000000000061', '55555555-eeee-4000-8000-000b00000003', 2, 15, 6.7), ('66666666-7777-4000-8000-000000000061', '55555555-eeee-4000-8000-000b00000003', 3, 15, 40.5), ('66666666-7777-4000-8000-000000000061', '55555555-eeee-4000-8000-000b00000004', 1, 11, 43), ('66666666-7777-4000-8000-000000000061', '55555555-eeee-4000-8000-000b00000004', 2, 12, 54.7), ('66666666-7777-4000-8000-000000000061', '55555555-eeee-4000-8000-000b00000004', 3, 12, 17.4) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000062', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-001100000001', '73c55850-2352-4f24-9cd7-73c171d6a012', '2026-04-27T09:00:00.000Z'::timestamptz, '2026-04-27T09:48:00.000Z'::timestamptz, 48, 5, 'Treino completo!')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000062', '55555555-eeee-4000-8000-000b01000000', 1, 9, 9.5), ('66666666-7777-4000-8000-000000000062', '55555555-eeee-4000-8000-000b01000000', 2, 12, 31.2), ('66666666-7777-4000-8000-000000000062', '55555555-eeee-4000-8000-000b01000000', 3, 8, 42.9), ('66666666-7777-4000-8000-000000000062', '55555555-eeee-4000-8000-000b01000001', 1, 10, 16.2), ('66666666-7777-4000-8000-000000000062', '55555555-eeee-4000-8000-000b01000001', 2, 12, 38.4), ('66666666-7777-4000-8000-000000000062', '55555555-eeee-4000-8000-000b01000001', 3, 8, 50.3), ('66666666-7777-4000-8000-000000000062', '55555555-eeee-4000-8000-000b01000002', 1, 12, 31.4), ('66666666-7777-4000-8000-000000000062', '55555555-eeee-4000-8000-000b01000002', 2, 10, 28.8), ('66666666-7777-4000-8000-000000000062', '55555555-eeee-4000-8000-000b01000002', 3, 8, 13.6), ('66666666-7777-4000-8000-000000000062', '55555555-eeee-4000-8000-000b01000003', 1, 10, 9.7), ('66666666-7777-4000-8000-000000000062', '55555555-eeee-4000-8000-000b01000003', 2, 10, 35.9), ('66666666-7777-4000-8000-000000000062', '55555555-eeee-4000-8000-000b01000003', 3, 8, 42.6), ('66666666-7777-4000-8000-000000000062', '55555555-eeee-4000-8000-000b01000004', 1, 12, 22.4), ('66666666-7777-4000-8000-000000000062', '55555555-eeee-4000-8000-000b01000004', 2, 12, 11.9), ('66666666-7777-4000-8000-000000000062', '55555555-eeee-4000-8000-000b01000004', 3, 12, 56.2) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000063', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-001100000002', '73c55850-2352-4f24-9cd7-73c171d6a012', '2026-04-24T11:00:00.000Z'::timestamptz, '2026-04-24T11:44:00.000Z'::timestamptz, 44, 4, 'Foi top hoje.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000063', '55555555-eeee-4000-8000-000b02000000', 1, 9, 47.6), ('66666666-7777-4000-8000-000000000063', '55555555-eeee-4000-8000-000b02000000', 2, 8, 40.6), ('66666666-7777-4000-8000-000000000063', '55555555-eeee-4000-8000-000b02000000', 3, 12, 57.4), ('66666666-7777-4000-8000-000000000063', '55555555-eeee-4000-8000-000b02000000', 4, 10, 16.8), ('66666666-7777-4000-8000-000000000063', '55555555-eeee-4000-8000-000b02000001', 1, 11, 18), ('66666666-7777-4000-8000-000000000063', '55555555-eeee-4000-8000-000b02000001', 2, 10, 5.7), ('66666666-7777-4000-8000-000000000063', '55555555-eeee-4000-8000-000b02000001', 3, 9, 27.1), ('66666666-7777-4000-8000-000000000063', '55555555-eeee-4000-8000-000b02000002', 1, 11, 57.8), ('66666666-7777-4000-8000-000000000063', '55555555-eeee-4000-8000-000b02000002', 2, 8, 39.5), ('66666666-7777-4000-8000-000000000063', '55555555-eeee-4000-8000-000b02000002', 3, 8, 10.4), ('66666666-7777-4000-8000-000000000063', '55555555-eeee-4000-8000-000b02000003', 1, 10, 40.7), ('66666666-7777-4000-8000-000000000063', '55555555-eeee-4000-8000-000b02000003', 2, 10, 10.6), ('66666666-7777-4000-8000-000000000063', '55555555-eeee-4000-8000-000b02000003', 3, 10, 35.4), ('66666666-7777-4000-8000-000000000063', '55555555-eeee-4000-8000-000b02000004', 1, 12, 5.3), ('66666666-7777-4000-8000-000000000063', '55555555-eeee-4000-8000-000b02000004', 2, 12, 43.7), ('66666666-7777-4000-8000-000000000063', '55555555-eeee-4000-8000-000b02000004', 3, 12, 30.4) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000064', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-001100000000', '73c55850-2352-4f24-9cd7-73c171d6a012', '2026-04-20T13:00:00.000Z'::timestamptz, '2026-04-20T14:14:00.000Z'::timestamptz, 74, 9, 'Foi top hoje.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000064', '55555555-eeee-4000-8000-000b00000000', 1, 11, 35.7), ('66666666-7777-4000-8000-000000000064', '55555555-eeee-4000-8000-000b00000000', 2, 8, 53.3), ('66666666-7777-4000-8000-000000000064', '55555555-eeee-4000-8000-000b00000000', 3, 12, 26.8), ('66666666-7777-4000-8000-000000000064', '55555555-eeee-4000-8000-000b00000001', 1, 11, 35.3), ('66666666-7777-4000-8000-000000000064', '55555555-eeee-4000-8000-000b00000001', 2, 9, 19.7), ('66666666-7777-4000-8000-000000000064', '55555555-eeee-4000-8000-000b00000001', 3, 10, 59.4), ('66666666-7777-4000-8000-000000000064', '55555555-eeee-4000-8000-000b00000002', 1, 12, 31.6), ('66666666-7777-4000-8000-000000000064', '55555555-eeee-4000-8000-000b00000002', 2, 10, 45.3), ('66666666-7777-4000-8000-000000000064', '55555555-eeee-4000-8000-000b00000002', 3, 8, 10.1), ('66666666-7777-4000-8000-000000000064', '55555555-eeee-4000-8000-000b00000003', 1, 15, 6.5), ('66666666-7777-4000-8000-000000000064', '55555555-eeee-4000-8000-000b00000003', 2, 15, 12.9), ('66666666-7777-4000-8000-000000000064', '55555555-eeee-4000-8000-000b00000003', 3, 15, 53.2), ('66666666-7777-4000-8000-000000000064', '55555555-eeee-4000-8000-000b00000004', 1, 10, 54.2), ('66666666-7777-4000-8000-000000000064', '55555555-eeee-4000-8000-000b00000004', 2, 9, 17.5), ('66666666-7777-4000-8000-000000000064', '55555555-eeee-4000-8000-000b00000004', 3, 11, 5.7) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000065', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-001100000001', '73c55850-2352-4f24-9cd7-73c171d6a012', '2026-04-14T15:00:00.000Z'::timestamptz, '2026-04-14T15:46:00.000Z'::timestamptz, 46, 8, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000065', '55555555-eeee-4000-8000-000b01000000', 1, 10, 6.2), ('66666666-7777-4000-8000-000000000065', '55555555-eeee-4000-8000-000b01000000', 2, 11, 31.1), ('66666666-7777-4000-8000-000000000065', '55555555-eeee-4000-8000-000b01000000', 3, 9, 12.4), ('66666666-7777-4000-8000-000000000065', '55555555-eeee-4000-8000-000b01000001', 1, 12, 34), ('66666666-7777-4000-8000-000000000065', '55555555-eeee-4000-8000-000b01000001', 2, 11, 59.5), ('66666666-7777-4000-8000-000000000065', '55555555-eeee-4000-8000-000b01000001', 3, 9, 50.6), ('66666666-7777-4000-8000-000000000065', '55555555-eeee-4000-8000-000b01000002', 1, 8, 46), ('66666666-7777-4000-8000-000000000065', '55555555-eeee-4000-8000-000b01000002', 2, 8, 55.7), ('66666666-7777-4000-8000-000000000065', '55555555-eeee-4000-8000-000b01000002', 3, 9, 13.4), ('66666666-7777-4000-8000-000000000065', '55555555-eeee-4000-8000-000b01000003', 1, 11, 35.5), ('66666666-7777-4000-8000-000000000065', '55555555-eeee-4000-8000-000b01000003', 2, 9, 53.7), ('66666666-7777-4000-8000-000000000065', '55555555-eeee-4000-8000-000b01000003', 3, 12, 37.7), ('66666666-7777-4000-8000-000000000065', '55555555-eeee-4000-8000-000b01000004', 1, 12, 47.9), ('66666666-7777-4000-8000-000000000065', '55555555-eeee-4000-8000-000b01000004', 2, 12, 33.5), ('66666666-7777-4000-8000-000000000065', '55555555-eeee-4000-8000-000b01000004', 3, 12, 39.8) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000066', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-001200000000', '22304a85-7ce5-4bbc-b9c6-420edb71203a', '2026-04-29T07:00:00.000Z'::timestamptz, '2026-04-29T07:41:00.000Z'::timestamptz, 41, 6, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000066', '55555555-eeee-4000-8000-000c00000000', 1, 9, 9.3), ('66666666-7777-4000-8000-000000000066', '55555555-eeee-4000-8000-000c00000000', 2, 11, 58.2), ('66666666-7777-4000-8000-000000000066', '55555555-eeee-4000-8000-000c00000000', 3, 8, 17.5), ('66666666-7777-4000-8000-000000000066', '55555555-eeee-4000-8000-000c00000000', 4, 11, 12.7), ('66666666-7777-4000-8000-000000000066', '55555555-eeee-4000-8000-000c00000001', 1, 12, 56.2), ('66666666-7777-4000-8000-000000000066', '55555555-eeee-4000-8000-000c00000001', 2, 12, 50.3), ('66666666-7777-4000-8000-000000000066', '55555555-eeee-4000-8000-000c00000001', 3, 12, 25.9), ('66666666-7777-4000-8000-000000000066', '55555555-eeee-4000-8000-000c00000002', 1, 9, 59), ('66666666-7777-4000-8000-000000000066', '55555555-eeee-4000-8000-000c00000002', 2, 9, 59.1), ('66666666-7777-4000-8000-000000000066', '55555555-eeee-4000-8000-000c00000002', 3, 8, 23.2), ('66666666-7777-4000-8000-000000000066', '55555555-eeee-4000-8000-000c00000003', 1, 15, 15.2), ('66666666-7777-4000-8000-000000000066', '55555555-eeee-4000-8000-000c00000003', 2, 15, 38.6), ('66666666-7777-4000-8000-000000000066', '55555555-eeee-4000-8000-000c00000003', 3, 15, 7.2), ('66666666-7777-4000-8000-000000000066', '55555555-eeee-4000-8000-000c00000004', 1, 12, 35.6), ('66666666-7777-4000-8000-000000000066', '55555555-eeee-4000-8000-000c00000004', 2, 10, 23.6), ('66666666-7777-4000-8000-000000000066', '55555555-eeee-4000-8000-000c00000004', 3, 11, 34.7) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000067', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-001200000001', '22304a85-7ce5-4bbc-b9c6-420edb71203a', '2026-04-26T09:00:00.000Z'::timestamptz, '2026-04-26T10:03:00.000Z'::timestamptz, 63, 7, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000067', '55555555-eeee-4000-8000-000c01000000', 1, 45, 31.3), ('66666666-7777-4000-8000-000000000067', '55555555-eeee-4000-8000-000c01000000', 2, 45, 27), ('66666666-7777-4000-8000-000000000067', '55555555-eeee-4000-8000-000c01000000', 3, 45, 9), ('66666666-7777-4000-8000-000000000067', '55555555-eeee-4000-8000-000c01000001', 1, 10, 44.3), ('66666666-7777-4000-8000-000000000067', '55555555-eeee-4000-8000-000c01000001', 2, 10, 58.5), ('66666666-7777-4000-8000-000000000067', '55555555-eeee-4000-8000-000c01000001', 3, 12, 35.1), ('66666666-7777-4000-8000-000000000067', '55555555-eeee-4000-8000-000c01000002', 1, 20, 54.9), ('66666666-7777-4000-8000-000000000067', '55555555-eeee-4000-8000-000c01000002', 2, 20, 45), ('66666666-7777-4000-8000-000000000067', '55555555-eeee-4000-8000-000c01000002', 3, 20, 51.5), ('66666666-7777-4000-8000-000000000067', '55555555-eeee-4000-8000-000c01000003', 1, 15, 8.6), ('66666666-7777-4000-8000-000000000067', '55555555-eeee-4000-8000-000c01000003', 2, 15, 19), ('66666666-7777-4000-8000-000000000067', '55555555-eeee-4000-8000-000c01000003', 3, 15, 41) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000068', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-001200000002', '22304a85-7ce5-4bbc-b9c6-420edb71203a', '2026-04-23T11:00:00.000Z'::timestamptz, '2026-04-23T12:03:00.000Z'::timestamptz, 63, 6, 'Treino completo!')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000068', '55555555-eeee-4000-8000-000c02000000', 1, 12, 29.9), ('66666666-7777-4000-8000-000000000068', '55555555-eeee-4000-8000-000c02000000', 2, 8, 29), ('66666666-7777-4000-8000-000000000068', '55555555-eeee-4000-8000-000c02000000', 3, 8, 58.9), ('66666666-7777-4000-8000-000000000068', '55555555-eeee-4000-8000-000c02000000', 4, 8, 39.9), ('66666666-7777-4000-8000-000000000068', '55555555-eeee-4000-8000-000c02000001', 1, 11, 42.7), ('66666666-7777-4000-8000-000000000068', '55555555-eeee-4000-8000-000c02000001', 2, 12, 31.2), ('66666666-7777-4000-8000-000000000068', '55555555-eeee-4000-8000-000c02000001', 3, 9, 16.5), ('66666666-7777-4000-8000-000000000068', '55555555-eeee-4000-8000-000c02000002', 1, 8, 34.7), ('66666666-7777-4000-8000-000000000068', '55555555-eeee-4000-8000-000c02000002', 2, 9, 7.2), ('66666666-7777-4000-8000-000000000068', '55555555-eeee-4000-8000-000c02000002', 3, 12, 38.6), ('66666666-7777-4000-8000-000000000068', '55555555-eeee-4000-8000-000c02000003', 1, 10, 25.3), ('66666666-7777-4000-8000-000000000068', '55555555-eeee-4000-8000-000c02000003', 2, 10, 31.1), ('66666666-7777-4000-8000-000000000068', '55555555-eeee-4000-8000-000c02000003', 3, 10, 13.3), ('66666666-7777-4000-8000-000000000068', '55555555-eeee-4000-8000-000c02000004', 1, 12, 10.8), ('66666666-7777-4000-8000-000000000068', '55555555-eeee-4000-8000-000c02000004', 2, 12, 39.8), ('66666666-7777-4000-8000-000000000068', '55555555-eeee-4000-8000-000c02000004', 3, 12, 11.5) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000069', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-001200000000', '22304a85-7ce5-4bbc-b9c6-420edb71203a', '2026-04-19T13:00:00.000Z'::timestamptz, '2026-04-19T13:36:00.000Z'::timestamptz, 36, 4, 'Pesado mas saiu.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000069', '55555555-eeee-4000-8000-000c00000000', 1, 9, 13.4), ('66666666-7777-4000-8000-000000000069', '55555555-eeee-4000-8000-000c00000000', 2, 11, 6.9), ('66666666-7777-4000-8000-000000000069', '55555555-eeee-4000-8000-000c00000000', 3, 12, 26), ('66666666-7777-4000-8000-000000000069', '55555555-eeee-4000-8000-000c00000000', 4, 12, 10), ('66666666-7777-4000-8000-000000000069', '55555555-eeee-4000-8000-000c00000001', 1, 12, 6.4), ('66666666-7777-4000-8000-000000000069', '55555555-eeee-4000-8000-000c00000001', 2, 12, 35.8), ('66666666-7777-4000-8000-000000000069', '55555555-eeee-4000-8000-000c00000001', 3, 12, 28.2), ('66666666-7777-4000-8000-000000000069', '55555555-eeee-4000-8000-000c00000002', 1, 12, 17.7), ('66666666-7777-4000-8000-000000000069', '55555555-eeee-4000-8000-000c00000002', 2, 12, 53.9), ('66666666-7777-4000-8000-000000000069', '55555555-eeee-4000-8000-000c00000002', 3, 9, 7.4), ('66666666-7777-4000-8000-000000000069', '55555555-eeee-4000-8000-000c00000003', 1, 15, 31.5), ('66666666-7777-4000-8000-000000000069', '55555555-eeee-4000-8000-000c00000003', 2, 15, 12.5), ('66666666-7777-4000-8000-000000000069', '55555555-eeee-4000-8000-000c00000003', 3, 15, 59), ('66666666-7777-4000-8000-000000000069', '55555555-eeee-4000-8000-000c00000004', 1, 8, 20.3), ('66666666-7777-4000-8000-000000000069', '55555555-eeee-4000-8000-000c00000004', 2, 10, 34.5), ('66666666-7777-4000-8000-000000000069', '55555555-eeee-4000-8000-000c00000004', 3, 12, 59.1) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000070', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-001200000001', '22304a85-7ce5-4bbc-b9c6-420edb71203a', '2026-04-13T15:00:00.000Z'::timestamptz, '2026-04-13T15:57:00.000Z'::timestamptz, 57, 4, 'Foi top hoje.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000070', '55555555-eeee-4000-8000-000c01000000', 1, 45, 55.9), ('66666666-7777-4000-8000-000000000070', '55555555-eeee-4000-8000-000c01000000', 2, 45, 5.7), ('66666666-7777-4000-8000-000000000070', '55555555-eeee-4000-8000-000c01000000', 3, 45, 43), ('66666666-7777-4000-8000-000000000070', '55555555-eeee-4000-8000-000c01000001', 1, 11, 38.1), ('66666666-7777-4000-8000-000000000070', '55555555-eeee-4000-8000-000c01000001', 2, 12, 35.9), ('66666666-7777-4000-8000-000000000070', '55555555-eeee-4000-8000-000c01000001', 3, 8, 49.9), ('66666666-7777-4000-8000-000000000070', '55555555-eeee-4000-8000-000c01000002', 1, 20, 36.6), ('66666666-7777-4000-8000-000000000070', '55555555-eeee-4000-8000-000c01000002', 2, 20, 8.2), ('66666666-7777-4000-8000-000000000070', '55555555-eeee-4000-8000-000c01000002', 3, 20, 13.3), ('66666666-7777-4000-8000-000000000070', '55555555-eeee-4000-8000-000c01000003', 1, 15, 24.8), ('66666666-7777-4000-8000-000000000070', '55555555-eeee-4000-8000-000c01000003', 2, 15, 15.9), ('66666666-7777-4000-8000-000000000070', '55555555-eeee-4000-8000-000c01000003', 3, 15, 26) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000071', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-001300000000', '95795cb4-e6c9-485b-8c07-656108993343', '2026-04-13T08:00:00.000Z'::timestamptz, '2026-04-13T08:43:00.000Z'::timestamptz, 43, 3, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000071', '55555555-eeee-4000-8000-000d00000000', 1, 9, 13.2), ('66666666-7777-4000-8000-000000000071', '55555555-eeee-4000-8000-000d00000000', 2, 9, 52.5), ('66666666-7777-4000-8000-000000000071', '55555555-eeee-4000-8000-000d00000000', 3, 10, 46.2), ('66666666-7777-4000-8000-000000000071', '55555555-eeee-4000-8000-000d00000000', 4, 11, 54), ('66666666-7777-4000-8000-000000000071', '55555555-eeee-4000-8000-000d00000001', 1, 12, 30.7), ('66666666-7777-4000-8000-000000000071', '55555555-eeee-4000-8000-000d00000001', 2, 12, 39.7), ('66666666-7777-4000-8000-000000000071', '55555555-eeee-4000-8000-000d00000001', 3, 12, 16), ('66666666-7777-4000-8000-000000000071', '55555555-eeee-4000-8000-000d00000002', 1, 10, 17), ('66666666-7777-4000-8000-000000000071', '55555555-eeee-4000-8000-000d00000002', 2, 8, 50.5), ('66666666-7777-4000-8000-000000000071', '55555555-eeee-4000-8000-000d00000002', 3, 9, 38.6), ('66666666-7777-4000-8000-000000000071', '55555555-eeee-4000-8000-000d00000003', 1, 15, 38), ('66666666-7777-4000-8000-000000000071', '55555555-eeee-4000-8000-000d00000003', 2, 15, 58.2), ('66666666-7777-4000-8000-000000000071', '55555555-eeee-4000-8000-000d00000003', 3, 15, 42.6), ('66666666-7777-4000-8000-000000000071', '55555555-eeee-4000-8000-000d00000004', 1, 8, 56.3), ('66666666-7777-4000-8000-000000000071', '55555555-eeee-4000-8000-000d00000004', 2, 12, 36.2), ('66666666-7777-4000-8000-000000000071', '55555555-eeee-4000-8000-000d00000004', 3, 12, 29.5) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000072', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-001300000001', '95795cb4-e6c9-485b-8c07-656108993343', '2026-04-03T08:00:00.000Z'::timestamptz, '2026-04-03T08:41:00.000Z'::timestamptz, 41, 3, 'Foi top hoje.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000072', '55555555-eeee-4000-8000-000d01000000', 1, 45, 55.2), ('66666666-7777-4000-8000-000000000072', '55555555-eeee-4000-8000-000d01000000', 2, 45, 26.7), ('66666666-7777-4000-8000-000000000072', '55555555-eeee-4000-8000-000d01000000', 3, 45, 58), ('66666666-7777-4000-8000-000000000072', '55555555-eeee-4000-8000-000d01000001', 1, 12, 48.5), ('66666666-7777-4000-8000-000000000072', '55555555-eeee-4000-8000-000d01000001', 2, 12, 8.9), ('66666666-7777-4000-8000-000000000072', '55555555-eeee-4000-8000-000d01000001', 3, 10, 15.7), ('66666666-7777-4000-8000-000000000072', '55555555-eeee-4000-8000-000d01000002', 1, 20, 49.1), ('66666666-7777-4000-8000-000000000072', '55555555-eeee-4000-8000-000d01000002', 2, 20, 48.6), ('66666666-7777-4000-8000-000000000072', '55555555-eeee-4000-8000-000d01000002', 3, 20, 20.9), ('66666666-7777-4000-8000-000000000072', '55555555-eeee-4000-8000-000d01000003', 1, 15, 50.4), ('66666666-7777-4000-8000-000000000072', '55555555-eeee-4000-8000-000d01000003', 2, 15, 21.4), ('66666666-7777-4000-8000-000000000072', '55555555-eeee-4000-8000-000d01000003', 3, 15, 38.6) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000073', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-001400000000', '6fc4ba15-472a-46ef-8f33-98d933723437', '2026-04-10T08:00:00.000Z'::timestamptz, '2026-04-10T08:44:00.000Z'::timestamptz, 44, 6, 'Treino completo!')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000073', '55555555-eeee-4000-8000-000e00000000', 1, 45, 52.1), ('66666666-7777-4000-8000-000000000073', '55555555-eeee-4000-8000-000e00000000', 2, 45, 40.2), ('66666666-7777-4000-8000-000000000073', '55555555-eeee-4000-8000-000e00000000', 3, 45, 43.1), ('66666666-7777-4000-8000-000000000073', '55555555-eeee-4000-8000-000e00000001', 1, 11, 16.2), ('66666666-7777-4000-8000-000000000073', '55555555-eeee-4000-8000-000e00000001', 2, 11, 42.7), ('66666666-7777-4000-8000-000000000073', '55555555-eeee-4000-8000-000e00000001', 3, 12, 10.4), ('66666666-7777-4000-8000-000000000073', '55555555-eeee-4000-8000-000e00000002', 1, 20, 21.7), ('66666666-7777-4000-8000-000000000073', '55555555-eeee-4000-8000-000e00000002', 2, 20, 43.1), ('66666666-7777-4000-8000-000000000073', '55555555-eeee-4000-8000-000e00000002', 3, 20, 40.9), ('66666666-7777-4000-8000-000000000073', '55555555-eeee-4000-8000-000e00000003', 1, 15, 26.4), ('66666666-7777-4000-8000-000000000073', '55555555-eeee-4000-8000-000e00000003', 2, 15, 43.4), ('66666666-7777-4000-8000-000000000073', '55555555-eeee-4000-8000-000e00000003', 3, 15, 47.9) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000074', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-001400000001', '6fc4ba15-472a-46ef-8f33-98d933723437', '2026-03-31T08:00:00.000Z'::timestamptz, '2026-03-31T08:37:00.000Z'::timestamptz, 37, 6, 'Cabeça boa, treino bom.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000074', '55555555-eeee-4000-8000-000e01000000', 1, 9, 11.2), ('66666666-7777-4000-8000-000000000074', '55555555-eeee-4000-8000-000e01000000', 2, 8, 43.3), ('66666666-7777-4000-8000-000000000074', '55555555-eeee-4000-8000-000e01000000', 3, 12, 34.3), ('66666666-7777-4000-8000-000000000074', '55555555-eeee-4000-8000-000e01000001', 1, 9, 36.7), ('66666666-7777-4000-8000-000000000074', '55555555-eeee-4000-8000-000e01000001', 2, 8, 42.1), ('66666666-7777-4000-8000-000000000074', '55555555-eeee-4000-8000-000e01000001', 3, 11, 52.5), ('66666666-7777-4000-8000-000000000074', '55555555-eeee-4000-8000-000e01000002', 1, 12, 54.3), ('66666666-7777-4000-8000-000000000074', '55555555-eeee-4000-8000-000e01000002', 2, 11, 12), ('66666666-7777-4000-8000-000000000074', '55555555-eeee-4000-8000-000e01000002', 3, 10, 49.4), ('66666666-7777-4000-8000-000000000074', '55555555-eeee-4000-8000-000e01000003', 1, 10, 10.9), ('66666666-7777-4000-8000-000000000074', '55555555-eeee-4000-8000-000e01000003', 2, 12, 25.2), ('66666666-7777-4000-8000-000000000074', '55555555-eeee-4000-8000-000e01000003', 3, 10, 19.2) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000075', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-001500000000', '111eca04-631d-4fbe-a9ef-0506487fc459', '2026-04-07T08:00:00.000Z'::timestamptz, '2026-04-07T08:31:00.000Z'::timestamptz, 31, 3, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000075', '55555555-eeee-4000-8000-000f00000000', 1, 11, 37.8), ('66666666-7777-4000-8000-000000000075', '55555555-eeee-4000-8000-000f00000000', 2, 9, 5.9), ('66666666-7777-4000-8000-000000000075', '55555555-eeee-4000-8000-000f00000000', 3, 12, 45.2), ('66666666-7777-4000-8000-000000000075', '55555555-eeee-4000-8000-000f00000000', 4, 11, 43.3), ('66666666-7777-4000-8000-000000000075', '55555555-eeee-4000-8000-000f00000001', 1, 12, 22.6), ('66666666-7777-4000-8000-000000000075', '55555555-eeee-4000-8000-000f00000001', 2, 12, 18.9), ('66666666-7777-4000-8000-000000000075', '55555555-eeee-4000-8000-000f00000001', 3, 12, 23), ('66666666-7777-4000-8000-000000000075', '55555555-eeee-4000-8000-000f00000002', 1, 8, 51), ('66666666-7777-4000-8000-000000000075', '55555555-eeee-4000-8000-000f00000002', 2, 10, 12), ('66666666-7777-4000-8000-000000000075', '55555555-eeee-4000-8000-000f00000002', 3, 12, 28.6), ('66666666-7777-4000-8000-000000000075', '55555555-eeee-4000-8000-000f00000003', 1, 15, 6.5), ('66666666-7777-4000-8000-000000000075', '55555555-eeee-4000-8000-000f00000003', 2, 15, 24.1), ('66666666-7777-4000-8000-000000000075', '55555555-eeee-4000-8000-000f00000003', 3, 15, 9.7), ('66666666-7777-4000-8000-000000000075', '55555555-eeee-4000-8000-000f00000004', 1, 10, 13.4), ('66666666-7777-4000-8000-000000000075', '55555555-eeee-4000-8000-000f00000004', 2, 8, 27.9), ('66666666-7777-4000-8000-000000000075', '55555555-eeee-4000-8000-000f00000004', 3, 11, 9.6) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000076', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-001500000001', '111eca04-631d-4fbe-a9ef-0506487fc459', '2026-03-28T08:00:00.000Z'::timestamptz, '2026-03-28T08:48:00.000Z'::timestamptz, 48, 5, 'Cabeça boa, treino bom.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000076', '55555555-eeee-4000-8000-000f01000000', 1, 45, 9.6), ('66666666-7777-4000-8000-000000000076', '55555555-eeee-4000-8000-000f01000000', 2, 45, 6.7), ('66666666-7777-4000-8000-000000000076', '55555555-eeee-4000-8000-000f01000000', 3, 45, 21.1), ('66666666-7777-4000-8000-000000000076', '55555555-eeee-4000-8000-000f01000001', 1, 12, 46.1), ('66666666-7777-4000-8000-000000000076', '55555555-eeee-4000-8000-000f01000001', 2, 10, 22.7), ('66666666-7777-4000-8000-000000000076', '55555555-eeee-4000-8000-000f01000001', 3, 10, 44.4), ('66666666-7777-4000-8000-000000000076', '55555555-eeee-4000-8000-000f01000002', 1, 20, 36.4), ('66666666-7777-4000-8000-000000000076', '55555555-eeee-4000-8000-000f01000002', 2, 20, 51), ('66666666-7777-4000-8000-000000000076', '55555555-eeee-4000-8000-000f01000002', 3, 20, 25.4), ('66666666-7777-4000-8000-000000000076', '55555555-eeee-4000-8000-000f01000003', 1, 15, 43.2), ('66666666-7777-4000-8000-000000000076', '55555555-eeee-4000-8000-000f01000003', 2, 15, 22.2), ('66666666-7777-4000-8000-000000000076', '55555555-eeee-4000-8000-000f01000003', 3, 15, 59.3) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000077', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000000000000', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-03-11T07:00:00.000Z'::timestamptz, '2026-03-11T07:59:00.000Z'::timestamptz, 59, 8, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000077', '55555555-eeee-4000-8000-000000000000', 1, 8, 6.6), ('66666666-7777-4000-8000-000000000077', '55555555-eeee-4000-8000-000000000000', 2, 11, 58), ('66666666-7777-4000-8000-000000000077', '55555555-eeee-4000-8000-000000000000', 3, 8, 38.2), ('66666666-7777-4000-8000-000000000077', '55555555-eeee-4000-8000-000000000000', 4, 8, 58), ('66666666-7777-4000-8000-000000000077', '55555555-eeee-4000-8000-000000000001', 1, 12, 43.1), ('66666666-7777-4000-8000-000000000077', '55555555-eeee-4000-8000-000000000001', 2, 12, 28.2), ('66666666-7777-4000-8000-000000000077', '55555555-eeee-4000-8000-000000000001', 3, 12, 21.3), ('66666666-7777-4000-8000-000000000077', '55555555-eeee-4000-8000-000000000002', 1, 11, 52.6), ('66666666-7777-4000-8000-000000000077', '55555555-eeee-4000-8000-000000000002', 2, 10, 57), ('66666666-7777-4000-8000-000000000077', '55555555-eeee-4000-8000-000000000002', 3, 8, 27.1), ('66666666-7777-4000-8000-000000000077', '55555555-eeee-4000-8000-000000000003', 1, 15, 19.4), ('66666666-7777-4000-8000-000000000077', '55555555-eeee-4000-8000-000000000003', 2, 15, 48.7), ('66666666-7777-4000-8000-000000000077', '55555555-eeee-4000-8000-000000000003', 3, 15, 32.7), ('66666666-7777-4000-8000-000000000077', '55555555-eeee-4000-8000-000000000004', 1, 11, 42), ('66666666-7777-4000-8000-000000000077', '55555555-eeee-4000-8000-000000000004', 2, 8, 47.3), ('66666666-7777-4000-8000-000000000077', '55555555-eeee-4000-8000-000000000004', 3, 12, 40.4) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000078', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000000000001', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-04-05T08:00:00.000Z'::timestamptz, '2026-04-05T08:44:00.000Z'::timestamptz, 44, 5, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000078', '55555555-eeee-4000-8000-000001000000', 1, 45, 40.5), ('66666666-7777-4000-8000-000000000078', '55555555-eeee-4000-8000-000001000000', 2, 45, 14.5), ('66666666-7777-4000-8000-000000000078', '55555555-eeee-4000-8000-000001000000', 3, 45, 31.5), ('66666666-7777-4000-8000-000000000078', '55555555-eeee-4000-8000-000001000001', 1, 8, 58.8), ('66666666-7777-4000-8000-000000000078', '55555555-eeee-4000-8000-000001000001', 2, 10, 44.5), ('66666666-7777-4000-8000-000000000078', '55555555-eeee-4000-8000-000001000001', 3, 9, 5.4), ('66666666-7777-4000-8000-000000000078', '55555555-eeee-4000-8000-000001000002', 1, 20, 52.5), ('66666666-7777-4000-8000-000000000078', '55555555-eeee-4000-8000-000001000002', 2, 20, 34.6), ('66666666-7777-4000-8000-000000000078', '55555555-eeee-4000-8000-000001000002', 3, 20, 16.8), ('66666666-7777-4000-8000-000000000078', '55555555-eeee-4000-8000-000001000003', 1, 15, 7), ('66666666-7777-4000-8000-000000000078', '55555555-eeee-4000-8000-000001000003', 2, 15, 9), ('66666666-7777-4000-8000-000000000078', '55555555-eeee-4000-8000-000001000003', 3, 15, 52.3) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000079', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000000000002', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-03-26T09:00:00.000Z'::timestamptz, '2026-03-26T09:53:00.000Z'::timestamptz, 53, 5, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000079', '55555555-eeee-4000-8000-000002000000', 1, 10, 37.1), ('66666666-7777-4000-8000-000000000079', '55555555-eeee-4000-8000-000002000000', 2, 8, 34.2), ('66666666-7777-4000-8000-000000000079', '55555555-eeee-4000-8000-000002000000', 3, 8, 12), ('66666666-7777-4000-8000-000000000079', '55555555-eeee-4000-8000-000002000000', 4, 9, 21.2), ('66666666-7777-4000-8000-000000000079', '55555555-eeee-4000-8000-000002000001', 1, 8, 26.4), ('66666666-7777-4000-8000-000000000079', '55555555-eeee-4000-8000-000002000001', 2, 11, 14.6), ('66666666-7777-4000-8000-000000000079', '55555555-eeee-4000-8000-000002000001', 3, 9, 20.7), ('66666666-7777-4000-8000-000000000079', '55555555-eeee-4000-8000-000002000002', 1, 9, 59.2), ('66666666-7777-4000-8000-000000000079', '55555555-eeee-4000-8000-000002000002', 2, 8, 50.1), ('66666666-7777-4000-8000-000000000079', '55555555-eeee-4000-8000-000002000002', 3, 8, 31.4), ('66666666-7777-4000-8000-000000000079', '55555555-eeee-4000-8000-000002000003', 1, 10, 18.9), ('66666666-7777-4000-8000-000000000079', '55555555-eeee-4000-8000-000002000003', 2, 10, 19.9), ('66666666-7777-4000-8000-000000000079', '55555555-eeee-4000-8000-000002000003', 3, 10, 37.2), ('66666666-7777-4000-8000-000000000079', '55555555-eeee-4000-8000-000002000004', 1, 12, 28.2), ('66666666-7777-4000-8000-000000000079', '55555555-eeee-4000-8000-000002000004', 2, 12, 50.3), ('66666666-7777-4000-8000-000000000079', '55555555-eeee-4000-8000-000002000004', 3, 12, 37.4) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000080', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000100000000', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-04-07T07:00:00.000Z'::timestamptz, '2026-04-07T07:47:00.000Z'::timestamptz, 47, 8, 'Pesado mas saiu.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000080', '55555555-eeee-4000-8000-000100000000', 1, 45, 44), ('66666666-7777-4000-8000-000000000080', '55555555-eeee-4000-8000-000100000000', 2, 45, 44.5), ('66666666-7777-4000-8000-000000000080', '55555555-eeee-4000-8000-000100000000', 3, 45, 16.6), ('66666666-7777-4000-8000-000000000080', '55555555-eeee-4000-8000-000100000001', 1, 11, 54), ('66666666-7777-4000-8000-000000000080', '55555555-eeee-4000-8000-000100000001', 2, 10, 52.6), ('66666666-7777-4000-8000-000000000080', '55555555-eeee-4000-8000-000100000001', 3, 9, 15), ('66666666-7777-4000-8000-000000000080', '55555555-eeee-4000-8000-000100000002', 1, 20, 43.9), ('66666666-7777-4000-8000-000000000080', '55555555-eeee-4000-8000-000100000002', 2, 20, 33.9), ('66666666-7777-4000-8000-000000000080', '55555555-eeee-4000-8000-000100000002', 3, 20, 8.5), ('66666666-7777-4000-8000-000000000080', '55555555-eeee-4000-8000-000100000003', 1, 15, 22.1), ('66666666-7777-4000-8000-000000000080', '55555555-eeee-4000-8000-000100000003', 2, 15, 52.4), ('66666666-7777-4000-8000-000000000080', '55555555-eeee-4000-8000-000100000003', 3, 15, 49.1) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000081', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000100000001', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-03-21T08:00:00.000Z'::timestamptz, '2026-03-21T09:09:00.000Z'::timestamptz, 69, 5, 'Cabeça boa, treino bom.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000081', '55555555-eeee-4000-8000-000101000000', 1, 10, 32.7), ('66666666-7777-4000-8000-000000000081', '55555555-eeee-4000-8000-000101000000', 2, 10, 51.1), ('66666666-7777-4000-8000-000000000081', '55555555-eeee-4000-8000-000101000000', 3, 11, 49.4), ('66666666-7777-4000-8000-000000000081', '55555555-eeee-4000-8000-000101000000', 4, 8, 7.7), ('66666666-7777-4000-8000-000000000081', '55555555-eeee-4000-8000-000101000001', 1, 12, 45.6), ('66666666-7777-4000-8000-000000000081', '55555555-eeee-4000-8000-000101000001', 2, 12, 46.3), ('66666666-7777-4000-8000-000000000081', '55555555-eeee-4000-8000-000101000001', 3, 12, 59.1), ('66666666-7777-4000-8000-000000000081', '55555555-eeee-4000-8000-000101000002', 1, 11, 13.9), ('66666666-7777-4000-8000-000000000081', '55555555-eeee-4000-8000-000101000002', 2, 9, 49.3), ('66666666-7777-4000-8000-000000000081', '55555555-eeee-4000-8000-000101000002', 3, 9, 44.3), ('66666666-7777-4000-8000-000000000081', '55555555-eeee-4000-8000-000101000003', 1, 15, 11.1), ('66666666-7777-4000-8000-000000000081', '55555555-eeee-4000-8000-000101000003', 2, 15, 26.4), ('66666666-7777-4000-8000-000000000081', '55555555-eeee-4000-8000-000101000003', 3, 15, 31.3), ('66666666-7777-4000-8000-000000000081', '55555555-eeee-4000-8000-000101000004', 1, 8, 7.9), ('66666666-7777-4000-8000-000000000081', '55555555-eeee-4000-8000-000101000004', 2, 11, 27.2), ('66666666-7777-4000-8000-000000000081', '55555555-eeee-4000-8000-000101000004', 3, 11, 8) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000082', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000100000000', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-03-28T09:00:00.000Z'::timestamptz, '2026-03-28T09:57:00.000Z'::timestamptz, 57, 4, 'Foi top hoje.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000082', '55555555-eeee-4000-8000-000100000000', 1, 45, 32.9), ('66666666-7777-4000-8000-000000000082', '55555555-eeee-4000-8000-000100000000', 2, 45, 18.3), ('66666666-7777-4000-8000-000000000082', '55555555-eeee-4000-8000-000100000000', 3, 45, 55.2), ('66666666-7777-4000-8000-000000000082', '55555555-eeee-4000-8000-000100000001', 1, 10, 11.5), ('66666666-7777-4000-8000-000000000082', '55555555-eeee-4000-8000-000100000001', 2, 11, 22.6), ('66666666-7777-4000-8000-000000000082', '55555555-eeee-4000-8000-000100000001', 3, 10, 49.9), ('66666666-7777-4000-8000-000000000082', '55555555-eeee-4000-8000-000100000002', 1, 20, 7.4), ('66666666-7777-4000-8000-000000000082', '55555555-eeee-4000-8000-000100000002', 2, 20, 24.7), ('66666666-7777-4000-8000-000000000082', '55555555-eeee-4000-8000-000100000002', 3, 20, 40.7), ('66666666-7777-4000-8000-000000000082', '55555555-eeee-4000-8000-000100000003', 1, 15, 8), ('66666666-7777-4000-8000-000000000082', '55555555-eeee-4000-8000-000100000003', 2, 15, 54.9), ('66666666-7777-4000-8000-000000000082', '55555555-eeee-4000-8000-000100000003', 3, 15, 44) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000083', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000200000000', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-04-01T07:00:00.000Z'::timestamptz, '2026-04-01T08:09:00.000Z'::timestamptz, 69, 4, 'Treino completo!')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000083', '55555555-eeee-4000-8000-000200000000', 1, 9, 21.8), ('66666666-7777-4000-8000-000000000083', '55555555-eeee-4000-8000-000200000000', 2, 8, 41.8), ('66666666-7777-4000-8000-000000000083', '55555555-eeee-4000-8000-000200000000', 3, 9, 43.7), ('66666666-7777-4000-8000-000000000083', '55555555-eeee-4000-8000-000200000001', 1, 10, 33.9), ('66666666-7777-4000-8000-000000000083', '55555555-eeee-4000-8000-000200000001', 2, 8, 50), ('66666666-7777-4000-8000-000000000083', '55555555-eeee-4000-8000-000200000001', 3, 11, 52.4), ('66666666-7777-4000-8000-000000000083', '55555555-eeee-4000-8000-000200000002', 1, 12, 53.4), ('66666666-7777-4000-8000-000000000083', '55555555-eeee-4000-8000-000200000002', 2, 8, 20.6), ('66666666-7777-4000-8000-000000000083', '55555555-eeee-4000-8000-000200000002', 3, 10, 33.6), ('66666666-7777-4000-8000-000000000083', '55555555-eeee-4000-8000-000200000003', 1, 15, 15.2), ('66666666-7777-4000-8000-000000000083', '55555555-eeee-4000-8000-000200000003', 2, 15, 9.5), ('66666666-7777-4000-8000-000000000083', '55555555-eeee-4000-8000-000200000003', 3, 15, 30.1), ('66666666-7777-4000-8000-000000000083', '55555555-eeee-4000-8000-000200000004', 1, 12, 36.4), ('66666666-7777-4000-8000-000000000083', '55555555-eeee-4000-8000-000200000004', 2, 12, 12), ('66666666-7777-4000-8000-000000000083', '55555555-eeee-4000-8000-000200000004', 3, 12, 37.8) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000084', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000200000001', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-03-28T08:00:00.000Z'::timestamptz, '2026-03-28T08:49:00.000Z'::timestamptz, 49, 5, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000084', '55555555-eeee-4000-8000-000201000000', 1, 10, 39.8), ('66666666-7777-4000-8000-000000000084', '55555555-eeee-4000-8000-000201000000', 2, 8, 59.3), ('66666666-7777-4000-8000-000000000084', '55555555-eeee-4000-8000-000201000000', 3, 9, 21.5), ('66666666-7777-4000-8000-000000000084', '55555555-eeee-4000-8000-000201000001', 1, 8, 43.2), ('66666666-7777-4000-8000-000000000084', '55555555-eeee-4000-8000-000201000001', 2, 12, 23.1), ('66666666-7777-4000-8000-000000000084', '55555555-eeee-4000-8000-000201000001', 3, 9, 45.6), ('66666666-7777-4000-8000-000000000084', '55555555-eeee-4000-8000-000201000002', 1, 8, 55), ('66666666-7777-4000-8000-000000000084', '55555555-eeee-4000-8000-000201000002', 2, 9, 26.4), ('66666666-7777-4000-8000-000000000084', '55555555-eeee-4000-8000-000201000002', 3, 8, 35.3), ('66666666-7777-4000-8000-000000000084', '55555555-eeee-4000-8000-000201000003', 1, 11, 25.4), ('66666666-7777-4000-8000-000000000084', '55555555-eeee-4000-8000-000201000003', 2, 12, 21.4), ('66666666-7777-4000-8000-000000000084', '55555555-eeee-4000-8000-000201000003', 3, 10, 54.2), ('66666666-7777-4000-8000-000000000084', '55555555-eeee-4000-8000-000201000004', 1, 12, 44.2), ('66666666-7777-4000-8000-000000000084', '55555555-eeee-4000-8000-000201000004', 2, 12, 21.2), ('66666666-7777-4000-8000-000000000084', '55555555-eeee-4000-8000-000201000004', 3, 12, 48.4) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000085', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000200000002', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-03-11T09:00:00.000Z'::timestamptz, '2026-03-11T10:07:00.000Z'::timestamptz, 67, 7, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000085', '55555555-eeee-4000-8000-000202000000', 1, 9, 17.8), ('66666666-7777-4000-8000-000000000085', '55555555-eeee-4000-8000-000202000000', 2, 12, 24.5), ('66666666-7777-4000-8000-000000000085', '55555555-eeee-4000-8000-000202000000', 3, 9, 7.9), ('66666666-7777-4000-8000-000000000085', '55555555-eeee-4000-8000-000202000000', 4, 12, 19.5), ('66666666-7777-4000-8000-000000000085', '55555555-eeee-4000-8000-000202000001', 1, 10, 15.7), ('66666666-7777-4000-8000-000000000085', '55555555-eeee-4000-8000-000202000001', 2, 9, 21), ('66666666-7777-4000-8000-000000000085', '55555555-eeee-4000-8000-000202000001', 3, 11, 41.1), ('66666666-7777-4000-8000-000000000085', '55555555-eeee-4000-8000-000202000002', 1, 9, 39.9), ('66666666-7777-4000-8000-000000000085', '55555555-eeee-4000-8000-000202000002', 2, 11, 52.6), ('66666666-7777-4000-8000-000000000085', '55555555-eeee-4000-8000-000202000002', 3, 11, 46.3), ('66666666-7777-4000-8000-000000000085', '55555555-eeee-4000-8000-000202000003', 1, 10, 5.6), ('66666666-7777-4000-8000-000000000085', '55555555-eeee-4000-8000-000202000003', 2, 10, 50.6), ('66666666-7777-4000-8000-000000000085', '55555555-eeee-4000-8000-000202000003', 3, 10, 33), ('66666666-7777-4000-8000-000000000085', '55555555-eeee-4000-8000-000202000004', 1, 12, 19.3), ('66666666-7777-4000-8000-000000000085', '55555555-eeee-4000-8000-000202000004', 2, 12, 50.8), ('66666666-7777-4000-8000-000000000085', '55555555-eeee-4000-8000-000202000004', 3, 12, 46.3) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000086', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000300000000', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-04-08T07:00:00.000Z'::timestamptz, '2026-04-08T07:47:00.000Z'::timestamptz, 47, 7, 'Pesado mas saiu.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000086', '55555555-eeee-4000-8000-000300000000', 1, 45, 24.3), ('66666666-7777-4000-8000-000000000086', '55555555-eeee-4000-8000-000300000000', 2, 45, 36.8), ('66666666-7777-4000-8000-000000000086', '55555555-eeee-4000-8000-000300000000', 3, 45, 57.1), ('66666666-7777-4000-8000-000000000086', '55555555-eeee-4000-8000-000300000001', 1, 10, 32.2), ('66666666-7777-4000-8000-000000000086', '55555555-eeee-4000-8000-000300000001', 2, 12, 27.7), ('66666666-7777-4000-8000-000000000086', '55555555-eeee-4000-8000-000300000001', 3, 9, 33.3), ('66666666-7777-4000-8000-000000000086', '55555555-eeee-4000-8000-000300000002', 1, 20, 20.6), ('66666666-7777-4000-8000-000000000086', '55555555-eeee-4000-8000-000300000002', 2, 20, 49.6), ('66666666-7777-4000-8000-000000000086', '55555555-eeee-4000-8000-000300000002', 3, 20, 9.3), ('66666666-7777-4000-8000-000000000086', '55555555-eeee-4000-8000-000300000003', 1, 15, 9.6), ('66666666-7777-4000-8000-000000000086', '55555555-eeee-4000-8000-000300000003', 2, 15, 33.9), ('66666666-7777-4000-8000-000000000086', '55555555-eeee-4000-8000-000300000003', 3, 15, 50.8) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000087', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000300000001', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-03-18T08:00:00.000Z'::timestamptz, '2026-03-18T09:04:00.000Z'::timestamptz, 64, 4, 'Foi top hoje.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000087', '55555555-eeee-4000-8000-000301000000', 1, 10, 59), ('66666666-7777-4000-8000-000000000087', '55555555-eeee-4000-8000-000301000000', 2, 8, 20.1), ('66666666-7777-4000-8000-000000000087', '55555555-eeee-4000-8000-000301000000', 3, 8, 17.7), ('66666666-7777-4000-8000-000000000087', '55555555-eeee-4000-8000-000301000001', 1, 11, 54.7), ('66666666-7777-4000-8000-000000000087', '55555555-eeee-4000-8000-000301000001', 2, 12, 34.3), ('66666666-7777-4000-8000-000000000087', '55555555-eeee-4000-8000-000301000001', 3, 11, 8.4), ('66666666-7777-4000-8000-000000000087', '55555555-eeee-4000-8000-000301000002', 1, 8, 26), ('66666666-7777-4000-8000-000000000087', '55555555-eeee-4000-8000-000301000002', 2, 9, 53.2), ('66666666-7777-4000-8000-000000000087', '55555555-eeee-4000-8000-000301000002', 3, 11, 5.4), ('66666666-7777-4000-8000-000000000087', '55555555-eeee-4000-8000-000301000003', 1, 10, 34.2), ('66666666-7777-4000-8000-000000000087', '55555555-eeee-4000-8000-000301000003', 2, 9, 15.2), ('66666666-7777-4000-8000-000000000087', '55555555-eeee-4000-8000-000301000003', 3, 8, 47.2) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000088', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000300000000', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-03-27T09:00:00.000Z'::timestamptz, '2026-03-27T10:10:00.000Z'::timestamptz, 70, 4, 'Foi top hoje.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000088', '55555555-eeee-4000-8000-000300000000', 1, 45, 15.7), ('66666666-7777-4000-8000-000000000088', '55555555-eeee-4000-8000-000300000000', 2, 45, 40.8), ('66666666-7777-4000-8000-000000000088', '55555555-eeee-4000-8000-000300000000', 3, 45, 13.7), ('66666666-7777-4000-8000-000000000088', '55555555-eeee-4000-8000-000300000001', 1, 12, 53.2), ('66666666-7777-4000-8000-000000000088', '55555555-eeee-4000-8000-000300000001', 2, 12, 5), ('66666666-7777-4000-8000-000000000088', '55555555-eeee-4000-8000-000300000001', 3, 8, 40.7), ('66666666-7777-4000-8000-000000000088', '55555555-eeee-4000-8000-000300000002', 1, 20, 51), ('66666666-7777-4000-8000-000000000088', '55555555-eeee-4000-8000-000300000002', 2, 20, 56.4), ('66666666-7777-4000-8000-000000000088', '55555555-eeee-4000-8000-000300000002', 3, 20, 11), ('66666666-7777-4000-8000-000000000088', '55555555-eeee-4000-8000-000300000003', 1, 15, 22.5), ('66666666-7777-4000-8000-000000000088', '55555555-eeee-4000-8000-000300000003', 2, 15, 46.4), ('66666666-7777-4000-8000-000000000088', '55555555-eeee-4000-8000-000300000003', 3, 15, 14.3) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000089', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000400000000', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-04-06T07:00:00.000Z'::timestamptz, '2026-04-06T07:55:00.000Z'::timestamptz, 55, 5, 'Cabeça boa, treino bom.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000089', '55555555-eeee-4000-8000-000400000000', 1, 45, 41.8), ('66666666-7777-4000-8000-000000000089', '55555555-eeee-4000-8000-000400000000', 2, 45, 15), ('66666666-7777-4000-8000-000000000089', '55555555-eeee-4000-8000-000400000000', 3, 45, 53.3), ('66666666-7777-4000-8000-000000000089', '55555555-eeee-4000-8000-000400000001', 1, 8, 23.4), ('66666666-7777-4000-8000-000000000089', '55555555-eeee-4000-8000-000400000001', 2, 12, 35), ('66666666-7777-4000-8000-000000000089', '55555555-eeee-4000-8000-000400000001', 3, 10, 13.1), ('66666666-7777-4000-8000-000000000089', '55555555-eeee-4000-8000-000400000002', 1, 20, 41.9), ('66666666-7777-4000-8000-000000000089', '55555555-eeee-4000-8000-000400000002', 2, 20, 49.3), ('66666666-7777-4000-8000-000000000089', '55555555-eeee-4000-8000-000400000002', 3, 20, 12.7), ('66666666-7777-4000-8000-000000000089', '55555555-eeee-4000-8000-000400000003', 1, 15, 13.8), ('66666666-7777-4000-8000-000000000089', '55555555-eeee-4000-8000-000400000003', 2, 15, 39.9), ('66666666-7777-4000-8000-000000000089', '55555555-eeee-4000-8000-000400000003', 3, 15, 22.8) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000090', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000400000001', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-03-14T08:00:00.000Z'::timestamptz, '2026-03-14T08:47:00.000Z'::timestamptz, 47, 5, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000090', '55555555-eeee-4000-8000-000401000000', 1, 12, 16.4), ('66666666-7777-4000-8000-000000000090', '55555555-eeee-4000-8000-000401000000', 2, 12, 56.1), ('66666666-7777-4000-8000-000000000090', '55555555-eeee-4000-8000-000401000000', 3, 9, 59.7), ('66666666-7777-4000-8000-000000000090', '55555555-eeee-4000-8000-000401000000', 4, 11, 17.8), ('66666666-7777-4000-8000-000000000090', '55555555-eeee-4000-8000-000401000001', 1, 12, 21.2), ('66666666-7777-4000-8000-000000000090', '55555555-eeee-4000-8000-000401000001', 2, 12, 15.8), ('66666666-7777-4000-8000-000000000090', '55555555-eeee-4000-8000-000401000001', 3, 12, 10.1), ('66666666-7777-4000-8000-000000000090', '55555555-eeee-4000-8000-000401000002', 1, 8, 10.4), ('66666666-7777-4000-8000-000000000090', '55555555-eeee-4000-8000-000401000002', 2, 12, 11.7), ('66666666-7777-4000-8000-000000000090', '55555555-eeee-4000-8000-000401000002', 3, 9, 51.2), ('66666666-7777-4000-8000-000000000090', '55555555-eeee-4000-8000-000401000003', 1, 15, 48), ('66666666-7777-4000-8000-000000000090', '55555555-eeee-4000-8000-000401000003', 2, 15, 55.7), ('66666666-7777-4000-8000-000000000090', '55555555-eeee-4000-8000-000401000003', 3, 15, 34.2), ('66666666-7777-4000-8000-000000000090', '55555555-eeee-4000-8000-000401000004', 1, 8, 40.8), ('66666666-7777-4000-8000-000000000090', '55555555-eeee-4000-8000-000401000004', 2, 11, 54.3), ('66666666-7777-4000-8000-000000000090', '55555555-eeee-4000-8000-000401000004', 3, 10, 24.1) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000091', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000400000000', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-04-06T09:00:00.000Z'::timestamptz, '2026-04-06T09:57:00.000Z'::timestamptz, 57, 4, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000091', '55555555-eeee-4000-8000-000400000000', 1, 45, 23), ('66666666-7777-4000-8000-000000000091', '55555555-eeee-4000-8000-000400000000', 2, 45, 43.6), ('66666666-7777-4000-8000-000000000091', '55555555-eeee-4000-8000-000400000000', 3, 45, 26.1), ('66666666-7777-4000-8000-000000000091', '55555555-eeee-4000-8000-000400000001', 1, 8, 52.2), ('66666666-7777-4000-8000-000000000091', '55555555-eeee-4000-8000-000400000001', 2, 9, 58.4), ('66666666-7777-4000-8000-000000000091', '55555555-eeee-4000-8000-000400000001', 3, 8, 38.2), ('66666666-7777-4000-8000-000000000091', '55555555-eeee-4000-8000-000400000002', 1, 20, 9.9), ('66666666-7777-4000-8000-000000000091', '55555555-eeee-4000-8000-000400000002', 2, 20, 6.5), ('66666666-7777-4000-8000-000000000091', '55555555-eeee-4000-8000-000400000002', 3, 20, 7.9), ('66666666-7777-4000-8000-000000000091', '55555555-eeee-4000-8000-000400000003', 1, 15, 49.1), ('66666666-7777-4000-8000-000000000091', '55555555-eeee-4000-8000-000400000003', 2, 15, 21.6), ('66666666-7777-4000-8000-000000000091', '55555555-eeee-4000-8000-000400000003', 3, 15, 5.5) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000092', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000500000000', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-03-17T07:00:00.000Z'::timestamptz, '2026-03-17T07:59:00.000Z'::timestamptz, 59, 7, 'Treino completo!')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000092', '55555555-eeee-4000-8000-000500000000', 1, 11, 15.9), ('66666666-7777-4000-8000-000000000092', '55555555-eeee-4000-8000-000500000000', 2, 8, 17.8), ('66666666-7777-4000-8000-000000000092', '55555555-eeee-4000-8000-000500000000', 3, 11, 50.3), ('66666666-7777-4000-8000-000000000092', '55555555-eeee-4000-8000-000500000000', 4, 12, 58.5), ('66666666-7777-4000-8000-000000000092', '55555555-eeee-4000-8000-000500000001', 1, 12, 23.6), ('66666666-7777-4000-8000-000000000092', '55555555-eeee-4000-8000-000500000001', 2, 12, 16.9), ('66666666-7777-4000-8000-000000000092', '55555555-eeee-4000-8000-000500000001', 3, 12, 41.9), ('66666666-7777-4000-8000-000000000092', '55555555-eeee-4000-8000-000500000002', 1, 10, 44.4), ('66666666-7777-4000-8000-000000000092', '55555555-eeee-4000-8000-000500000002', 2, 10, 48.2), ('66666666-7777-4000-8000-000000000092', '55555555-eeee-4000-8000-000500000002', 3, 12, 10.5), ('66666666-7777-4000-8000-000000000092', '55555555-eeee-4000-8000-000500000003', 1, 15, 13.4), ('66666666-7777-4000-8000-000000000092', '55555555-eeee-4000-8000-000500000003', 2, 15, 38.9), ('66666666-7777-4000-8000-000000000092', '55555555-eeee-4000-8000-000500000003', 3, 15, 59.8), ('66666666-7777-4000-8000-000000000092', '55555555-eeee-4000-8000-000500000004', 1, 9, 11.3), ('66666666-7777-4000-8000-000000000092', '55555555-eeee-4000-8000-000500000004', 2, 11, 12.5), ('66666666-7777-4000-8000-000000000092', '55555555-eeee-4000-8000-000500000004', 3, 8, 16.5) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000093', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000500000001', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-03-20T08:00:00.000Z'::timestamptz, '2026-03-20T08:46:00.000Z'::timestamptz, 46, 5, 'Pesado mas saiu.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000093', '55555555-eeee-4000-8000-000501000000', 1, 45, 32.9), ('66666666-7777-4000-8000-000000000093', '55555555-eeee-4000-8000-000501000000', 2, 45, 44.5), ('66666666-7777-4000-8000-000000000093', '55555555-eeee-4000-8000-000501000000', 3, 45, 34.9), ('66666666-7777-4000-8000-000000000093', '55555555-eeee-4000-8000-000501000001', 1, 11, 29.5), ('66666666-7777-4000-8000-000000000093', '55555555-eeee-4000-8000-000501000001', 2, 11, 58.8), ('66666666-7777-4000-8000-000000000093', '55555555-eeee-4000-8000-000501000001', 3, 9, 46.9), ('66666666-7777-4000-8000-000000000093', '55555555-eeee-4000-8000-000501000002', 1, 20, 35.4), ('66666666-7777-4000-8000-000000000093', '55555555-eeee-4000-8000-000501000002', 2, 20, 25.3), ('66666666-7777-4000-8000-000000000093', '55555555-eeee-4000-8000-000501000002', 3, 20, 43.7), ('66666666-7777-4000-8000-000000000093', '55555555-eeee-4000-8000-000501000003', 1, 15, 40), ('66666666-7777-4000-8000-000000000093', '55555555-eeee-4000-8000-000501000003', 2, 15, 10.7), ('66666666-7777-4000-8000-000000000093', '55555555-eeee-4000-8000-000501000003', 3, 15, 53.2) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000094', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000500000002', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-03-17T09:00:00.000Z'::timestamptz, '2026-03-17T10:08:00.000Z'::timestamptz, 68, 6, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000094', '55555555-eeee-4000-8000-000502000000', 1, 10, 48.3), ('66666666-7777-4000-8000-000000000094', '55555555-eeee-4000-8000-000502000000', 2, 12, 23.4), ('66666666-7777-4000-8000-000000000094', '55555555-eeee-4000-8000-000502000000', 3, 9, 42.2), ('66666666-7777-4000-8000-000000000094', '55555555-eeee-4000-8000-000502000000', 4, 10, 26), ('66666666-7777-4000-8000-000000000094', '55555555-eeee-4000-8000-000502000001', 1, 12, 44.7), ('66666666-7777-4000-8000-000000000094', '55555555-eeee-4000-8000-000502000001', 2, 9, 57.2), ('66666666-7777-4000-8000-000000000094', '55555555-eeee-4000-8000-000502000001', 3, 11, 45.8), ('66666666-7777-4000-8000-000000000094', '55555555-eeee-4000-8000-000502000002', 1, 11, 35.1), ('66666666-7777-4000-8000-000000000094', '55555555-eeee-4000-8000-000502000002', 2, 8, 25.6), ('66666666-7777-4000-8000-000000000094', '55555555-eeee-4000-8000-000502000002', 3, 9, 7.5), ('66666666-7777-4000-8000-000000000094', '55555555-eeee-4000-8000-000502000003', 1, 10, 42.3), ('66666666-7777-4000-8000-000000000094', '55555555-eeee-4000-8000-000502000003', 2, 10, 23.1), ('66666666-7777-4000-8000-000000000094', '55555555-eeee-4000-8000-000502000003', 3, 10, 57), ('66666666-7777-4000-8000-000000000094', '55555555-eeee-4000-8000-000502000004', 1, 12, 29), ('66666666-7777-4000-8000-000000000094', '55555555-eeee-4000-8000-000502000004', 2, 12, 17.4), ('66666666-7777-4000-8000-000000000094', '55555555-eeee-4000-8000-000502000004', 3, 12, 46.7) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000095', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000600000000', 'ed29f6bd-a124-42b8-860f-8a48f4228b95', '2026-03-12T07:00:00.000Z'::timestamptz, '2026-03-12T07:46:00.000Z'::timestamptz, 46, 5, 'Cabeça boa, treino bom.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000095', '55555555-eeee-4000-8000-000600000000', 1, 12, 24.6), ('66666666-7777-4000-8000-000000000095', '55555555-eeee-4000-8000-000600000000', 2, 11, 18.3), ('66666666-7777-4000-8000-000000000095', '55555555-eeee-4000-8000-000600000000', 3, 12, 59.5), ('66666666-7777-4000-8000-000000000095', '55555555-eeee-4000-8000-000600000001', 1, 10, 39.2), ('66666666-7777-4000-8000-000000000095', '55555555-eeee-4000-8000-000600000001', 2, 12, 16.2), ('66666666-7777-4000-8000-000000000095', '55555555-eeee-4000-8000-000600000001', 3, 10, 37.4), ('66666666-7777-4000-8000-000000000095', '55555555-eeee-4000-8000-000600000002', 1, 12, 5.1), ('66666666-7777-4000-8000-000000000095', '55555555-eeee-4000-8000-000600000002', 2, 8, 39.2), ('66666666-7777-4000-8000-000000000095', '55555555-eeee-4000-8000-000600000002', 3, 10, 38.2), ('66666666-7777-4000-8000-000000000095', '55555555-eeee-4000-8000-000600000003', 1, 15, 22.9), ('66666666-7777-4000-8000-000000000095', '55555555-eeee-4000-8000-000600000003', 2, 15, 20.4), ('66666666-7777-4000-8000-000000000095', '55555555-eeee-4000-8000-000600000003', 3, 15, 46.4), ('66666666-7777-4000-8000-000000000095', '55555555-eeee-4000-8000-000600000004', 1, 8, 16), ('66666666-7777-4000-8000-000000000095', '55555555-eeee-4000-8000-000600000004', 2, 9, 31.5), ('66666666-7777-4000-8000-000000000095', '55555555-eeee-4000-8000-000600000004', 3, 12, 5.1) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000096', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000600000001', 'ed29f6bd-a124-42b8-860f-8a48f4228b95', '2026-03-30T08:00:00.000Z'::timestamptz, '2026-03-30T08:47:00.000Z'::timestamptz, 47, 6, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000096', '55555555-eeee-4000-8000-000601000000', 1, 10, 36.7), ('66666666-7777-4000-8000-000000000096', '55555555-eeee-4000-8000-000601000000', 2, 12, 5.6), ('66666666-7777-4000-8000-000000000096', '55555555-eeee-4000-8000-000601000000', 3, 12, 23.2), ('66666666-7777-4000-8000-000000000096', '55555555-eeee-4000-8000-000601000001', 1, 8, 20), ('66666666-7777-4000-8000-000000000096', '55555555-eeee-4000-8000-000601000001', 2, 11, 18.9), ('66666666-7777-4000-8000-000000000096', '55555555-eeee-4000-8000-000601000001', 3, 12, 18.2), ('66666666-7777-4000-8000-000000000096', '55555555-eeee-4000-8000-000601000002', 1, 10, 54.3), ('66666666-7777-4000-8000-000000000096', '55555555-eeee-4000-8000-000601000002', 2, 11, 55.1), ('66666666-7777-4000-8000-000000000096', '55555555-eeee-4000-8000-000601000002', 3, 10, 30.9), ('66666666-7777-4000-8000-000000000096', '55555555-eeee-4000-8000-000601000003', 1, 12, 38.2), ('66666666-7777-4000-8000-000000000096', '55555555-eeee-4000-8000-000601000003', 2, 12, 12.4), ('66666666-7777-4000-8000-000000000096', '55555555-eeee-4000-8000-000601000003', 3, 8, 9.2), ('66666666-7777-4000-8000-000000000096', '55555555-eeee-4000-8000-000601000004', 1, 12, 33.3), ('66666666-7777-4000-8000-000000000096', '55555555-eeee-4000-8000-000601000004', 2, 12, 46), ('66666666-7777-4000-8000-000000000096', '55555555-eeee-4000-8000-000601000004', 3, 12, 25.4) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000097', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000600000002', 'ed29f6bd-a124-42b8-860f-8a48f4228b95', '2026-03-12T09:00:00.000Z'::timestamptz, '2026-03-12T09:40:00.000Z'::timestamptz, 40, 7, 'Foi top hoje.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000097', '55555555-eeee-4000-8000-000602000000', 1, 8, 21.7), ('66666666-7777-4000-8000-000000000097', '55555555-eeee-4000-8000-000602000000', 2, 9, 8.9), ('66666666-7777-4000-8000-000000000097', '55555555-eeee-4000-8000-000602000000', 3, 10, 32.9), ('66666666-7777-4000-8000-000000000097', '55555555-eeee-4000-8000-000602000000', 4, 12, 38.4), ('66666666-7777-4000-8000-000000000097', '55555555-eeee-4000-8000-000602000001', 1, 9, 24.2), ('66666666-7777-4000-8000-000000000097', '55555555-eeee-4000-8000-000602000001', 2, 12, 49.7), ('66666666-7777-4000-8000-000000000097', '55555555-eeee-4000-8000-000602000001', 3, 11, 48.8), ('66666666-7777-4000-8000-000000000097', '55555555-eeee-4000-8000-000602000002', 1, 11, 42), ('66666666-7777-4000-8000-000000000097', '55555555-eeee-4000-8000-000602000002', 2, 10, 18.9), ('66666666-7777-4000-8000-000000000097', '55555555-eeee-4000-8000-000602000002', 3, 12, 45.8), ('66666666-7777-4000-8000-000000000097', '55555555-eeee-4000-8000-000602000003', 1, 10, 31.9), ('66666666-7777-4000-8000-000000000097', '55555555-eeee-4000-8000-000602000003', 2, 10, 46.7), ('66666666-7777-4000-8000-000000000097', '55555555-eeee-4000-8000-000602000003', 3, 10, 47.2), ('66666666-7777-4000-8000-000000000097', '55555555-eeee-4000-8000-000602000004', 1, 12, 36.1), ('66666666-7777-4000-8000-000000000097', '55555555-eeee-4000-8000-000602000004', 2, 12, 48.9), ('66666666-7777-4000-8000-000000000097', '55555555-eeee-4000-8000-000602000004', 3, 12, 39.7) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000098', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000700000000', 'ab9768a5-a3a4-4163-bb63-5e771cf173fe', '2026-03-27T07:00:00.000Z'::timestamptz, '2026-03-27T07:48:00.000Z'::timestamptz, 48, 8, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000098', '55555555-eeee-4000-8000-000700000000', 1, 10, 38.8), ('66666666-7777-4000-8000-000000000098', '55555555-eeee-4000-8000-000700000000', 2, 10, 45), ('66666666-7777-4000-8000-000000000098', '55555555-eeee-4000-8000-000700000000', 3, 9, 26.3), ('66666666-7777-4000-8000-000000000098', '55555555-eeee-4000-8000-000700000001', 1, 9, 15.4), ('66666666-7777-4000-8000-000000000098', '55555555-eeee-4000-8000-000700000001', 2, 10, 28.2), ('66666666-7777-4000-8000-000000000098', '55555555-eeee-4000-8000-000700000001', 3, 8, 13.1), ('66666666-7777-4000-8000-000000000098', '55555555-eeee-4000-8000-000700000002', 1, 12, 33.9), ('66666666-7777-4000-8000-000000000098', '55555555-eeee-4000-8000-000700000002', 2, 10, 43.4), ('66666666-7777-4000-8000-000000000098', '55555555-eeee-4000-8000-000700000002', 3, 8, 47.5), ('66666666-7777-4000-8000-000000000098', '55555555-eeee-4000-8000-000700000003', 1, 9, 51.9), ('66666666-7777-4000-8000-000000000098', '55555555-eeee-4000-8000-000700000003', 2, 11, 57.1), ('66666666-7777-4000-8000-000000000098', '55555555-eeee-4000-8000-000700000003', 3, 11, 52.5) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000099', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000700000001', 'ab9768a5-a3a4-4163-bb63-5e771cf173fe', '2026-04-01T08:00:00.000Z'::timestamptz, '2026-04-01T08:58:00.000Z'::timestamptz, 58, 5, 'Pesado mas saiu.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000099', '55555555-eeee-4000-8000-000701000000', 1, 9, 30.7), ('66666666-7777-4000-8000-000000000099', '55555555-eeee-4000-8000-000701000000', 2, 10, 51.8), ('66666666-7777-4000-8000-000000000099', '55555555-eeee-4000-8000-000701000000', 3, 12, 8), ('66666666-7777-4000-8000-000000000099', '55555555-eeee-4000-8000-000701000000', 4, 9, 26.4), ('66666666-7777-4000-8000-000000000099', '55555555-eeee-4000-8000-000701000001', 1, 12, 49.4), ('66666666-7777-4000-8000-000000000099', '55555555-eeee-4000-8000-000701000001', 2, 8, 39.6), ('66666666-7777-4000-8000-000000000099', '55555555-eeee-4000-8000-000701000001', 3, 10, 42.6), ('66666666-7777-4000-8000-000000000099', '55555555-eeee-4000-8000-000701000002', 1, 10, 55.2), ('66666666-7777-4000-8000-000000000099', '55555555-eeee-4000-8000-000701000002', 2, 9, 58.1), ('66666666-7777-4000-8000-000000000099', '55555555-eeee-4000-8000-000701000002', 3, 8, 41.3), ('66666666-7777-4000-8000-000000000099', '55555555-eeee-4000-8000-000701000003', 1, 10, 30.6), ('66666666-7777-4000-8000-000000000099', '55555555-eeee-4000-8000-000701000003', 2, 10, 32.1), ('66666666-7777-4000-8000-000000000099', '55555555-eeee-4000-8000-000701000003', 3, 10, 28.3), ('66666666-7777-4000-8000-000000000099', '55555555-eeee-4000-8000-000701000004', 1, 12, 32.2), ('66666666-7777-4000-8000-000000000099', '55555555-eeee-4000-8000-000701000004', 2, 12, 21.9), ('66666666-7777-4000-8000-000000000099', '55555555-eeee-4000-8000-000701000004', 3, 12, 46.9) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000100', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000700000000', 'ab9768a5-a3a4-4163-bb63-5e771cf173fe', '2026-03-30T09:00:00.000Z'::timestamptz, '2026-03-30T10:04:00.000Z'::timestamptz, 64, 4, 'Foi top hoje.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000100', '55555555-eeee-4000-8000-000700000000', 1, 8, 39.4), ('66666666-7777-4000-8000-000000000100', '55555555-eeee-4000-8000-000700000000', 2, 8, 30.6), ('66666666-7777-4000-8000-000000000100', '55555555-eeee-4000-8000-000700000000', 3, 10, 15.4), ('66666666-7777-4000-8000-000000000100', '55555555-eeee-4000-8000-000700000001', 1, 8, 7.4), ('66666666-7777-4000-8000-000000000100', '55555555-eeee-4000-8000-000700000001', 2, 11, 48.2), ('66666666-7777-4000-8000-000000000100', '55555555-eeee-4000-8000-000700000001', 3, 12, 13), ('66666666-7777-4000-8000-000000000100', '55555555-eeee-4000-8000-000700000002', 1, 10, 55), ('66666666-7777-4000-8000-000000000100', '55555555-eeee-4000-8000-000700000002', 2, 12, 33.8), ('66666666-7777-4000-8000-000000000100', '55555555-eeee-4000-8000-000700000002', 3, 12, 52.1), ('66666666-7777-4000-8000-000000000100', '55555555-eeee-4000-8000-000700000003', 1, 12, 31.3), ('66666666-7777-4000-8000-000000000100', '55555555-eeee-4000-8000-000700000003', 2, 12, 16.2), ('66666666-7777-4000-8000-000000000100', '55555555-eeee-4000-8000-000700000003', 3, 10, 58.1) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000101', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000800000000', '02420861-f44e-4be0-9f2e-ffcf300add7d', '2026-03-09T07:00:00.000Z'::timestamptz, '2026-03-09T08:01:00.000Z'::timestamptz, 61, 4, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000101', '55555555-eeee-4000-8000-000800000000', 1, 9, 39.3), ('66666666-7777-4000-8000-000000000101', '55555555-eeee-4000-8000-000800000000', 2, 12, 51.8), ('66666666-7777-4000-8000-000000000101', '55555555-eeee-4000-8000-000800000000', 3, 8, 30.4), ('66666666-7777-4000-8000-000000000101', '55555555-eeee-4000-8000-000800000001', 1, 12, 12), ('66666666-7777-4000-8000-000000000101', '55555555-eeee-4000-8000-000800000001', 2, 11, 58.9), ('66666666-7777-4000-8000-000000000101', '55555555-eeee-4000-8000-000800000001', 3, 10, 9), ('66666666-7777-4000-8000-000000000101', '55555555-eeee-4000-8000-000800000002', 1, 11, 20.1), ('66666666-7777-4000-8000-000000000101', '55555555-eeee-4000-8000-000800000002', 2, 11, 57.8), ('66666666-7777-4000-8000-000000000101', '55555555-eeee-4000-8000-000800000002', 3, 11, 26.1), ('66666666-7777-4000-8000-000000000101', '55555555-eeee-4000-8000-000800000003', 1, 15, 26.7), ('66666666-7777-4000-8000-000000000101', '55555555-eeee-4000-8000-000800000003', 2, 15, 25.4), ('66666666-7777-4000-8000-000000000101', '55555555-eeee-4000-8000-000800000003', 3, 15, 10.8), ('66666666-7777-4000-8000-000000000101', '55555555-eeee-4000-8000-000800000004', 1, 11, 37.4), ('66666666-7777-4000-8000-000000000101', '55555555-eeee-4000-8000-000800000004', 2, 10, 25.2), ('66666666-7777-4000-8000-000000000101', '55555555-eeee-4000-8000-000800000004', 3, 9, 16.9) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000102', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000800000001', '02420861-f44e-4be0-9f2e-ffcf300add7d', '2026-03-23T08:00:00.000Z'::timestamptz, '2026-03-23T09:09:00.000Z'::timestamptz, 69, 6, 'Foi top hoje.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000102', '55555555-eeee-4000-8000-000801000000', 1, 9, 49.3), ('66666666-7777-4000-8000-000000000102', '55555555-eeee-4000-8000-000801000000', 2, 12, 12.4), ('66666666-7777-4000-8000-000000000102', '55555555-eeee-4000-8000-000801000000', 3, 9, 28.8), ('66666666-7777-4000-8000-000000000102', '55555555-eeee-4000-8000-000801000001', 1, 11, 31.5), ('66666666-7777-4000-8000-000000000102', '55555555-eeee-4000-8000-000801000001', 2, 10, 22.2), ('66666666-7777-4000-8000-000000000102', '55555555-eeee-4000-8000-000801000001', 3, 10, 24.3), ('66666666-7777-4000-8000-000000000102', '55555555-eeee-4000-8000-000801000002', 1, 9, 48.9), ('66666666-7777-4000-8000-000000000102', '55555555-eeee-4000-8000-000801000002', 2, 12, 12), ('66666666-7777-4000-8000-000000000102', '55555555-eeee-4000-8000-000801000002', 3, 11, 31.9), ('66666666-7777-4000-8000-000000000102', '55555555-eeee-4000-8000-000801000003', 1, 10, 38.3), ('66666666-7777-4000-8000-000000000102', '55555555-eeee-4000-8000-000801000003', 2, 11, 13.9), ('66666666-7777-4000-8000-000000000102', '55555555-eeee-4000-8000-000801000003', 3, 9, 50.3), ('66666666-7777-4000-8000-000000000102', '55555555-eeee-4000-8000-000801000004', 1, 12, 36.7), ('66666666-7777-4000-8000-000000000102', '55555555-eeee-4000-8000-000801000004', 2, 12, 55.9), ('66666666-7777-4000-8000-000000000102', '55555555-eeee-4000-8000-000801000004', 3, 12, 51.3) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000103', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000800000002', '02420861-f44e-4be0-9f2e-ffcf300add7d', '2026-03-25T09:00:00.000Z'::timestamptz, '2026-03-25T10:03:00.000Z'::timestamptz, 63, 8, 'Cabeça boa, treino bom.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000103', '55555555-eeee-4000-8000-000802000000', 1, 11, 27.9), ('66666666-7777-4000-8000-000000000103', '55555555-eeee-4000-8000-000802000000', 2, 9, 27.4), ('66666666-7777-4000-8000-000000000103', '55555555-eeee-4000-8000-000802000000', 3, 10, 34.1), ('66666666-7777-4000-8000-000000000103', '55555555-eeee-4000-8000-000802000000', 4, 10, 26.9), ('66666666-7777-4000-8000-000000000103', '55555555-eeee-4000-8000-000802000001', 1, 10, 20.7), ('66666666-7777-4000-8000-000000000103', '55555555-eeee-4000-8000-000802000001', 2, 11, 11.1), ('66666666-7777-4000-8000-000000000103', '55555555-eeee-4000-8000-000802000001', 3, 9, 15.9), ('66666666-7777-4000-8000-000000000103', '55555555-eeee-4000-8000-000802000002', 1, 9, 8.2), ('66666666-7777-4000-8000-000000000103', '55555555-eeee-4000-8000-000802000002', 2, 12, 18.5), ('66666666-7777-4000-8000-000000000103', '55555555-eeee-4000-8000-000802000002', 3, 12, 59.3), ('66666666-7777-4000-8000-000000000103', '55555555-eeee-4000-8000-000802000003', 1, 10, 44.7), ('66666666-7777-4000-8000-000000000103', '55555555-eeee-4000-8000-000802000003', 2, 10, 57.2), ('66666666-7777-4000-8000-000000000103', '55555555-eeee-4000-8000-000802000003', 3, 10, 22.7), ('66666666-7777-4000-8000-000000000103', '55555555-eeee-4000-8000-000802000004', 1, 12, 22.7), ('66666666-7777-4000-8000-000000000103', '55555555-eeee-4000-8000-000802000004', 2, 12, 27), ('66666666-7777-4000-8000-000000000103', '55555555-eeee-4000-8000-000802000004', 3, 12, 9.5) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000104', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000900000000', 'f08264bc-8c9b-4ae8-a25b-0ca1e0c603b2', '2026-03-27T07:00:00.000Z'::timestamptz, '2026-03-27T08:05:00.000Z'::timestamptz, 65, 4, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000104', '55555555-eeee-4000-8000-000900000000', 1, 45, 13.8), ('66666666-7777-4000-8000-000000000104', '55555555-eeee-4000-8000-000900000000', 2, 45, 31.7), ('66666666-7777-4000-8000-000000000104', '55555555-eeee-4000-8000-000900000000', 3, 45, 22.3), ('66666666-7777-4000-8000-000000000104', '55555555-eeee-4000-8000-000900000001', 1, 11, 56.3), ('66666666-7777-4000-8000-000000000104', '55555555-eeee-4000-8000-000900000001', 2, 11, 32.3), ('66666666-7777-4000-8000-000000000104', '55555555-eeee-4000-8000-000900000001', 3, 11, 22.2), ('66666666-7777-4000-8000-000000000104', '55555555-eeee-4000-8000-000900000002', 1, 20, 57.4), ('66666666-7777-4000-8000-000000000104', '55555555-eeee-4000-8000-000900000002', 2, 20, 14.2), ('66666666-7777-4000-8000-000000000104', '55555555-eeee-4000-8000-000900000002', 3, 20, 30.8), ('66666666-7777-4000-8000-000000000104', '55555555-eeee-4000-8000-000900000003', 1, 15, 7.9), ('66666666-7777-4000-8000-000000000104', '55555555-eeee-4000-8000-000900000003', 2, 15, 7.9), ('66666666-7777-4000-8000-000000000104', '55555555-eeee-4000-8000-000900000003', 3, 15, 55.6) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000105', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000900000001', 'f08264bc-8c9b-4ae8-a25b-0ca1e0c603b2', '2026-03-26T08:00:00.000Z'::timestamptz, '2026-03-26T09:10:00.000Z'::timestamptz, 70, 5, 'Pesado mas saiu.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000105', '55555555-eeee-4000-8000-000901000000', 1, 12, 52.5), ('66666666-7777-4000-8000-000000000105', '55555555-eeee-4000-8000-000901000000', 2, 8, 40.8), ('66666666-7777-4000-8000-000000000105', '55555555-eeee-4000-8000-000901000000', 3, 12, 9.4), ('66666666-7777-4000-8000-000000000105', '55555555-eeee-4000-8000-000901000001', 1, 11, 47.9), ('66666666-7777-4000-8000-000000000105', '55555555-eeee-4000-8000-000901000001', 2, 10, 52.2), ('66666666-7777-4000-8000-000000000105', '55555555-eeee-4000-8000-000901000001', 3, 10, 25.6), ('66666666-7777-4000-8000-000000000105', '55555555-eeee-4000-8000-000901000002', 1, 10, 40.3), ('66666666-7777-4000-8000-000000000105', '55555555-eeee-4000-8000-000901000002', 2, 9, 48.9), ('66666666-7777-4000-8000-000000000105', '55555555-eeee-4000-8000-000901000002', 3, 8, 55.3), ('66666666-7777-4000-8000-000000000105', '55555555-eeee-4000-8000-000901000003', 1, 9, 26), ('66666666-7777-4000-8000-000000000105', '55555555-eeee-4000-8000-000901000003', 2, 9, 47.2), ('66666666-7777-4000-8000-000000000105', '55555555-eeee-4000-8000-000901000003', 3, 9, 47.3) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000106', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-000900000000', 'f08264bc-8c9b-4ae8-a25b-0ca1e0c603b2', '2026-03-27T09:00:00.000Z'::timestamptz, '2026-03-27T09:55:00.000Z'::timestamptz, 55, 6, 'Pesado mas saiu.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000106', '55555555-eeee-4000-8000-000900000000', 1, 45, 16.4), ('66666666-7777-4000-8000-000000000106', '55555555-eeee-4000-8000-000900000000', 2, 45, 21.7), ('66666666-7777-4000-8000-000000000106', '55555555-eeee-4000-8000-000900000000', 3, 45, 13), ('66666666-7777-4000-8000-000000000106', '55555555-eeee-4000-8000-000900000001', 1, 8, 12), ('66666666-7777-4000-8000-000000000106', '55555555-eeee-4000-8000-000900000001', 2, 8, 10.9), ('66666666-7777-4000-8000-000000000106', '55555555-eeee-4000-8000-000900000001', 3, 11, 49.6), ('66666666-7777-4000-8000-000000000106', '55555555-eeee-4000-8000-000900000002', 1, 20, 39), ('66666666-7777-4000-8000-000000000106', '55555555-eeee-4000-8000-000900000002', 2, 20, 27.8), ('66666666-7777-4000-8000-000000000106', '55555555-eeee-4000-8000-000900000002', 3, 20, 51), ('66666666-7777-4000-8000-000000000106', '55555555-eeee-4000-8000-000900000003', 1, 15, 46.3), ('66666666-7777-4000-8000-000000000106', '55555555-eeee-4000-8000-000900000003', 2, 15, 14.3), ('66666666-7777-4000-8000-000000000106', '55555555-eeee-4000-8000-000900000003', 3, 15, 34.7) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000107', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-001000000000', 'cc659e82-dd94-4de4-9657-3166e7ad37ec', '2026-04-05T07:00:00.000Z'::timestamptz, '2026-04-05T07:53:00.000Z'::timestamptz, 53, 7, 'Cabeça boa, treino bom.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000107', '55555555-eeee-4000-8000-000a00000000', 1, 45, 28.7), ('66666666-7777-4000-8000-000000000107', '55555555-eeee-4000-8000-000a00000000', 2, 45, 44.1), ('66666666-7777-4000-8000-000000000107', '55555555-eeee-4000-8000-000a00000000', 3, 45, 9.5), ('66666666-7777-4000-8000-000000000107', '55555555-eeee-4000-8000-000a00000001', 1, 10, 18.7), ('66666666-7777-4000-8000-000000000107', '55555555-eeee-4000-8000-000a00000001', 2, 8, 54.8), ('66666666-7777-4000-8000-000000000107', '55555555-eeee-4000-8000-000a00000001', 3, 12, 18), ('66666666-7777-4000-8000-000000000107', '55555555-eeee-4000-8000-000a00000002', 1, 20, 48.9), ('66666666-7777-4000-8000-000000000107', '55555555-eeee-4000-8000-000a00000002', 2, 20, 30.3), ('66666666-7777-4000-8000-000000000107', '55555555-eeee-4000-8000-000a00000002', 3, 20, 9.1), ('66666666-7777-4000-8000-000000000107', '55555555-eeee-4000-8000-000a00000003', 1, 15, 53.8), ('66666666-7777-4000-8000-000000000107', '55555555-eeee-4000-8000-000a00000003', 2, 15, 17.6), ('66666666-7777-4000-8000-000000000107', '55555555-eeee-4000-8000-000a00000003', 3, 15, 27.9) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000108', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-001000000001', 'cc659e82-dd94-4de4-9657-3166e7ad37ec', '2026-03-15T08:00:00.000Z'::timestamptz, '2026-03-15T08:50:00.000Z'::timestamptz, 50, 6, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000108', '55555555-eeee-4000-8000-000a01000000', 1, 11, 20.3), ('66666666-7777-4000-8000-000000000108', '55555555-eeee-4000-8000-000a01000000', 2, 9, 38.9), ('66666666-7777-4000-8000-000000000108', '55555555-eeee-4000-8000-000a01000000', 3, 11, 38.5), ('66666666-7777-4000-8000-000000000108', '55555555-eeee-4000-8000-000a01000000', 4, 9, 39.6), ('66666666-7777-4000-8000-000000000108', '55555555-eeee-4000-8000-000a01000001', 1, 12, 38.3), ('66666666-7777-4000-8000-000000000108', '55555555-eeee-4000-8000-000a01000001', 2, 12, 23), ('66666666-7777-4000-8000-000000000108', '55555555-eeee-4000-8000-000a01000001', 3, 12, 25.5), ('66666666-7777-4000-8000-000000000108', '55555555-eeee-4000-8000-000a01000002', 1, 10, 57.2), ('66666666-7777-4000-8000-000000000108', '55555555-eeee-4000-8000-000a01000002', 2, 10, 31.5), ('66666666-7777-4000-8000-000000000108', '55555555-eeee-4000-8000-000a01000002', 3, 8, 44.5), ('66666666-7777-4000-8000-000000000108', '55555555-eeee-4000-8000-000a01000003', 1, 15, 24.2), ('66666666-7777-4000-8000-000000000108', '55555555-eeee-4000-8000-000a01000003', 2, 15, 6.4), ('66666666-7777-4000-8000-000000000108', '55555555-eeee-4000-8000-000a01000003', 3, 15, 44.6), ('66666666-7777-4000-8000-000000000108', '55555555-eeee-4000-8000-000a01000004', 1, 12, 16.6), ('66666666-7777-4000-8000-000000000108', '55555555-eeee-4000-8000-000a01000004', 2, 8, 44.6), ('66666666-7777-4000-8000-000000000108', '55555555-eeee-4000-8000-000a01000004', 3, 8, 9.3) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000109', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-001000000000', 'cc659e82-dd94-4de4-9657-3166e7ad37ec', '2026-03-10T09:00:00.000Z'::timestamptz, '2026-03-10T09:53:00.000Z'::timestamptz, 53, 8, 'Treino completo!')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000109', '55555555-eeee-4000-8000-000a00000000', 1, 45, 20.5), ('66666666-7777-4000-8000-000000000109', '55555555-eeee-4000-8000-000a00000000', 2, 45, 8.4), ('66666666-7777-4000-8000-000000000109', '55555555-eeee-4000-8000-000a00000000', 3, 45, 14.7), ('66666666-7777-4000-8000-000000000109', '55555555-eeee-4000-8000-000a00000001', 1, 8, 26.5), ('66666666-7777-4000-8000-000000000109', '55555555-eeee-4000-8000-000a00000001', 2, 10, 52.9), ('66666666-7777-4000-8000-000000000109', '55555555-eeee-4000-8000-000a00000001', 3, 11, 23.4), ('66666666-7777-4000-8000-000000000109', '55555555-eeee-4000-8000-000a00000002', 1, 20, 8.2), ('66666666-7777-4000-8000-000000000109', '55555555-eeee-4000-8000-000a00000002', 2, 20, 57.1), ('66666666-7777-4000-8000-000000000109', '55555555-eeee-4000-8000-000a00000002', 3, 20, 29.2), ('66666666-7777-4000-8000-000000000109', '55555555-eeee-4000-8000-000a00000003', 1, 15, 6.4), ('66666666-7777-4000-8000-000000000109', '55555555-eeee-4000-8000-000a00000003', 2, 15, 58.1), ('66666666-7777-4000-8000-000000000109', '55555555-eeee-4000-8000-000a00000003', 3, 15, 21.2) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000110', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-001100000000', '73c55850-2352-4f24-9cd7-73c171d6a012', '2026-03-18T07:00:00.000Z'::timestamptz, '2026-03-18T08:06:00.000Z'::timestamptz, 66, 7, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000110', '55555555-eeee-4000-8000-000b00000000', 1, 12, 50.5), ('66666666-7777-4000-8000-000000000110', '55555555-eeee-4000-8000-000b00000000', 2, 11, 39.8), ('66666666-7777-4000-8000-000000000110', '55555555-eeee-4000-8000-000b00000000', 3, 9, 6.4), ('66666666-7777-4000-8000-000000000110', '55555555-eeee-4000-8000-000b00000001', 1, 12, 28.6), ('66666666-7777-4000-8000-000000000110', '55555555-eeee-4000-8000-000b00000001', 2, 11, 10.5), ('66666666-7777-4000-8000-000000000110', '55555555-eeee-4000-8000-000b00000001', 3, 11, 19.4), ('66666666-7777-4000-8000-000000000110', '55555555-eeee-4000-8000-000b00000002', 1, 8, 37.2), ('66666666-7777-4000-8000-000000000110', '55555555-eeee-4000-8000-000b00000002', 2, 9, 34.8), ('66666666-7777-4000-8000-000000000110', '55555555-eeee-4000-8000-000b00000002', 3, 11, 26.3), ('66666666-7777-4000-8000-000000000110', '55555555-eeee-4000-8000-000b00000003', 1, 15, 12.3), ('66666666-7777-4000-8000-000000000110', '55555555-eeee-4000-8000-000b00000003', 2, 15, 59.5), ('66666666-7777-4000-8000-000000000110', '55555555-eeee-4000-8000-000b00000003', 3, 15, 45.7), ('66666666-7777-4000-8000-000000000110', '55555555-eeee-4000-8000-000b00000004', 1, 11, 41.5), ('66666666-7777-4000-8000-000000000110', '55555555-eeee-4000-8000-000b00000004', 2, 10, 10.7), ('66666666-7777-4000-8000-000000000110', '55555555-eeee-4000-8000-000b00000004', 3, 10, 43.2) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000111', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-001100000001', '73c55850-2352-4f24-9cd7-73c171d6a012', '2026-04-06T08:00:00.000Z'::timestamptz, '2026-04-06T08:54:00.000Z'::timestamptz, 54, 8, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000111', '55555555-eeee-4000-8000-000b01000000', 1, 11, 51), ('66666666-7777-4000-8000-000000000111', '55555555-eeee-4000-8000-000b01000000', 2, 11, 55.7), ('66666666-7777-4000-8000-000000000111', '55555555-eeee-4000-8000-000b01000000', 3, 11, 9.1), ('66666666-7777-4000-8000-000000000111', '55555555-eeee-4000-8000-000b01000001', 1, 10, 28.1), ('66666666-7777-4000-8000-000000000111', '55555555-eeee-4000-8000-000b01000001', 2, 9, 58.6), ('66666666-7777-4000-8000-000000000111', '55555555-eeee-4000-8000-000b01000001', 3, 8, 33.3), ('66666666-7777-4000-8000-000000000111', '55555555-eeee-4000-8000-000b01000002', 1, 12, 23.1), ('66666666-7777-4000-8000-000000000111', '55555555-eeee-4000-8000-000b01000002', 2, 10, 41.3), ('66666666-7777-4000-8000-000000000111', '55555555-eeee-4000-8000-000b01000002', 3, 11, 10.2), ('66666666-7777-4000-8000-000000000111', '55555555-eeee-4000-8000-000b01000003', 1, 9, 58.1), ('66666666-7777-4000-8000-000000000111', '55555555-eeee-4000-8000-000b01000003', 2, 10, 10.8), ('66666666-7777-4000-8000-000000000111', '55555555-eeee-4000-8000-000b01000003', 3, 10, 27.7), ('66666666-7777-4000-8000-000000000111', '55555555-eeee-4000-8000-000b01000004', 1, 12, 10), ('66666666-7777-4000-8000-000000000111', '55555555-eeee-4000-8000-000b01000004', 2, 12, 48.8), ('66666666-7777-4000-8000-000000000111', '55555555-eeee-4000-8000-000b01000004', 3, 12, 34.3) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000112', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-001100000002', '73c55850-2352-4f24-9cd7-73c171d6a012', '2026-03-19T09:00:00.000Z'::timestamptz, '2026-03-19T09:48:00.000Z'::timestamptz, 48, 5, 'Cabeça boa, treino bom.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000112', '55555555-eeee-4000-8000-000b02000000', 1, 12, 13.3), ('66666666-7777-4000-8000-000000000112', '55555555-eeee-4000-8000-000b02000000', 2, 11, 32.6), ('66666666-7777-4000-8000-000000000112', '55555555-eeee-4000-8000-000b02000000', 3, 10, 24), ('66666666-7777-4000-8000-000000000112', '55555555-eeee-4000-8000-000b02000000', 4, 9, 12.2), ('66666666-7777-4000-8000-000000000112', '55555555-eeee-4000-8000-000b02000001', 1, 11, 35.1), ('66666666-7777-4000-8000-000000000112', '55555555-eeee-4000-8000-000b02000001', 2, 10, 34.8), ('66666666-7777-4000-8000-000000000112', '55555555-eeee-4000-8000-000b02000001', 3, 10, 14.6), ('66666666-7777-4000-8000-000000000112', '55555555-eeee-4000-8000-000b02000002', 1, 12, 15.5), ('66666666-7777-4000-8000-000000000112', '55555555-eeee-4000-8000-000b02000002', 2, 8, 23.8), ('66666666-7777-4000-8000-000000000112', '55555555-eeee-4000-8000-000b02000002', 3, 12, 57.2), ('66666666-7777-4000-8000-000000000112', '55555555-eeee-4000-8000-000b02000003', 1, 10, 37.4), ('66666666-7777-4000-8000-000000000112', '55555555-eeee-4000-8000-000b02000003', 2, 10, 31.4), ('66666666-7777-4000-8000-000000000112', '55555555-eeee-4000-8000-000b02000003', 3, 10, 20.4), ('66666666-7777-4000-8000-000000000112', '55555555-eeee-4000-8000-000b02000004', 1, 12, 39.6), ('66666666-7777-4000-8000-000000000112', '55555555-eeee-4000-8000-000b02000004', 2, 12, 26.9), ('66666666-7777-4000-8000-000000000112', '55555555-eeee-4000-8000-000b02000004', 3, 12, 32) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000113', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-001200000000', '22304a85-7ce5-4bbc-b9c6-420edb71203a', '2026-03-29T07:00:00.000Z'::timestamptz, '2026-03-29T07:47:00.000Z'::timestamptz, 47, 4, 'Cabeça boa, treino bom.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000113', '55555555-eeee-4000-8000-000c00000000', 1, 11, 43.7), ('66666666-7777-4000-8000-000000000113', '55555555-eeee-4000-8000-000c00000000', 2, 10, 32.7), ('66666666-7777-4000-8000-000000000113', '55555555-eeee-4000-8000-000c00000000', 3, 9, 32.6), ('66666666-7777-4000-8000-000000000113', '55555555-eeee-4000-8000-000c00000000', 4, 8, 32.6), ('66666666-7777-4000-8000-000000000113', '55555555-eeee-4000-8000-000c00000001', 1, 12, 37.1), ('66666666-7777-4000-8000-000000000113', '55555555-eeee-4000-8000-000c00000001', 2, 12, 7.3), ('66666666-7777-4000-8000-000000000113', '55555555-eeee-4000-8000-000c00000001', 3, 12, 21.6), ('66666666-7777-4000-8000-000000000113', '55555555-eeee-4000-8000-000c00000002', 1, 9, 28.8), ('66666666-7777-4000-8000-000000000113', '55555555-eeee-4000-8000-000c00000002', 2, 8, 31.3), ('66666666-7777-4000-8000-000000000113', '55555555-eeee-4000-8000-000c00000002', 3, 11, 32.8), ('66666666-7777-4000-8000-000000000113', '55555555-eeee-4000-8000-000c00000003', 1, 15, 44.4), ('66666666-7777-4000-8000-000000000113', '55555555-eeee-4000-8000-000c00000003', 2, 15, 9.4), ('66666666-7777-4000-8000-000000000113', '55555555-eeee-4000-8000-000c00000003', 3, 15, 25.5), ('66666666-7777-4000-8000-000000000113', '55555555-eeee-4000-8000-000c00000004', 1, 8, 54.6), ('66666666-7777-4000-8000-000000000113', '55555555-eeee-4000-8000-000c00000004', 2, 10, 57.1), ('66666666-7777-4000-8000-000000000113', '55555555-eeee-4000-8000-000c00000004', 3, 12, 25.9) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000114', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-001300000000', '95795cb4-e6c9-485b-8c07-656108993343', '2026-03-12T07:00:00.000Z'::timestamptz, '2026-03-12T07:59:00.000Z'::timestamptz, 59, 5, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000114', '55555555-eeee-4000-8000-000d00000000', 1, 12, 37.9), ('66666666-7777-4000-8000-000000000114', '55555555-eeee-4000-8000-000d00000000', 2, 9, 46.4), ('66666666-7777-4000-8000-000000000114', '55555555-eeee-4000-8000-000d00000000', 3, 10, 44.3), ('66666666-7777-4000-8000-000000000114', '55555555-eeee-4000-8000-000d00000000', 4, 8, 23.5), ('66666666-7777-4000-8000-000000000114', '55555555-eeee-4000-8000-000d00000001', 1, 12, 44.4), ('66666666-7777-4000-8000-000000000114', '55555555-eeee-4000-8000-000d00000001', 2, 12, 5.8), ('66666666-7777-4000-8000-000000000114', '55555555-eeee-4000-8000-000d00000001', 3, 12, 27), ('66666666-7777-4000-8000-000000000114', '55555555-eeee-4000-8000-000d00000002', 1, 9, 51), ('66666666-7777-4000-8000-000000000114', '55555555-eeee-4000-8000-000d00000002', 2, 8, 29.8), ('66666666-7777-4000-8000-000000000114', '55555555-eeee-4000-8000-000d00000002', 3, 8, 47.6), ('66666666-7777-4000-8000-000000000114', '55555555-eeee-4000-8000-000d00000003', 1, 15, 53.5), ('66666666-7777-4000-8000-000000000114', '55555555-eeee-4000-8000-000d00000003', 2, 15, 53.7), ('66666666-7777-4000-8000-000000000114', '55555555-eeee-4000-8000-000d00000003', 3, 15, 18.6), ('66666666-7777-4000-8000-000000000114', '55555555-eeee-4000-8000-000d00000004', 1, 12, 37.2), ('66666666-7777-4000-8000-000000000114', '55555555-eeee-4000-8000-000d00000004', 2, 12, 54.3), ('66666666-7777-4000-8000-000000000114', '55555555-eeee-4000-8000-000d00000004', 3, 9, 21.9) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000115', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-001400000000', '6fc4ba15-472a-46ef-8f33-98d933723437', '2026-03-30T07:00:00.000Z'::timestamptz, '2026-03-30T07:40:00.000Z'::timestamptz, 40, 7, 'Treino completo!')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000115', '55555555-eeee-4000-8000-000e00000000', 1, 45, 23), ('66666666-7777-4000-8000-000000000115', '55555555-eeee-4000-8000-000e00000000', 2, 45, 33.6), ('66666666-7777-4000-8000-000000000115', '55555555-eeee-4000-8000-000e00000000', 3, 45, 49.8), ('66666666-7777-4000-8000-000000000115', '55555555-eeee-4000-8000-000e00000001', 1, 12, 22.3), ('66666666-7777-4000-8000-000000000115', '55555555-eeee-4000-8000-000e00000001', 2, 11, 23.8), ('66666666-7777-4000-8000-000000000115', '55555555-eeee-4000-8000-000e00000001', 3, 9, 37.7), ('66666666-7777-4000-8000-000000000115', '55555555-eeee-4000-8000-000e00000002', 1, 20, 32.7), ('66666666-7777-4000-8000-000000000115', '55555555-eeee-4000-8000-000e00000002', 2, 20, 7.6), ('66666666-7777-4000-8000-000000000115', '55555555-eeee-4000-8000-000e00000002', 3, 20, 39.8), ('66666666-7777-4000-8000-000000000115', '55555555-eeee-4000-8000-000e00000003', 1, 15, 25.7), ('66666666-7777-4000-8000-000000000115', '55555555-eeee-4000-8000-000e00000003', 2, 15, 55), ('66666666-7777-4000-8000-000000000115', '55555555-eeee-4000-8000-000e00000003', 3, 15, 41.4) ON CONFLICT DO NOTHING;
INSERT INTO workout_logs (id, tenant_id, workout_id, student_id, started_at, completed_at, duration_minutes, rpe, notes)
VALUES ('66666666-7777-4000-8000-000000000116', '918ed85f-e58a-4edf-bb1b-761f032e0019', '44444444-dddd-4000-8000-001500000000', '111eca04-631d-4fbe-a9ef-0506487fc459', '2026-03-22T07:00:00.000Z'::timestamptz, '2026-03-22T08:06:00.000Z'::timestamptz, 66, 5, 'Foi top hoje.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO exercise_logs (workout_log_id, workout_item_id, set_number, reps_done, load_kg) VALUES ('66666666-7777-4000-8000-000000000116', '55555555-eeee-4000-8000-000f00000000', 1, 12, 31.5), ('66666666-7777-4000-8000-000000000116', '55555555-eeee-4000-8000-000f00000000', 2, 9, 13.6), ('66666666-7777-4000-8000-000000000116', '55555555-eeee-4000-8000-000f00000000', 3, 11, 41.8), ('66666666-7777-4000-8000-000000000116', '55555555-eeee-4000-8000-000f00000000', 4, 8, 16.2), ('66666666-7777-4000-8000-000000000116', '55555555-eeee-4000-8000-000f00000001', 1, 12, 16.4), ('66666666-7777-4000-8000-000000000116', '55555555-eeee-4000-8000-000f00000001', 2, 12, 56.1), ('66666666-7777-4000-8000-000000000116', '55555555-eeee-4000-8000-000f00000001', 3, 12, 22.6), ('66666666-7777-4000-8000-000000000116', '55555555-eeee-4000-8000-000f00000002', 1, 12, 42), ('66666666-7777-4000-8000-000000000116', '55555555-eeee-4000-8000-000f00000002', 2, 9, 26.1), ('66666666-7777-4000-8000-000000000116', '55555555-eeee-4000-8000-000f00000002', 3, 8, 24.2), ('66666666-7777-4000-8000-000000000116', '55555555-eeee-4000-8000-000f00000003', 1, 15, 38.1), ('66666666-7777-4000-8000-000000000116', '55555555-eeee-4000-8000-000f00000003', 2, 15, 21.3), ('66666666-7777-4000-8000-000000000116', '55555555-eeee-4000-8000-000f00000003', 3, 15, 18.4), ('66666666-7777-4000-8000-000000000116', '55555555-eeee-4000-8000-000f00000004', 1, 10, 54.3), ('66666666-7777-4000-8000-000000000116', '55555555-eeee-4000-8000-000f00000004', 2, 12, 18.6), ('66666666-7777-4000-8000-000000000116', '55555555-eeee-4000-8000-000f00000004', 3, 8, 48.1) ON CONFLICT DO NOTHING;

-- ============ COMMUNITY POSTS (8 do owner) ============
INSERT INTO community_posts (id, tenant_id, author_id, content, pinned, published_at, created_at)
VALUES ('77777777-1111-4000-8000-000000000001', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'a7a1ed0a-937c-4de0-8071-e89a443930c5', 'Bora começar a semana com pé direito 🔥 Quem treina hoje?', TRUE, '2026-05-08T12:00:00.000Z'::timestamptz, '2026-05-08T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id, tenant_id, author_id, content, pinned, published_at, created_at)
VALUES ('77777777-1111-4000-8000-000000000002', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'a7a1ed0a-937c-4de0-8071-e89a443930c5', 'Lembrete: hidratação + descanso = resultado. Treinar bem é metade. Recuperar é a outra metade.', FALSE, '2026-05-06T12:00:00.000Z'::timestamptz, '2026-05-06T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id, tenant_id, author_id, content, pinned, published_at, created_at)
VALUES ('77777777-1111-4000-8000-000000000003', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'a7a1ed0a-937c-4de0-8071-e89a443930c5', 'Vídeo novo de agachamento livre subindo amanhã. Vou explicar tudo: pegada, profundidade, e o erro que 80% comete.', FALSE, '2026-05-04T12:00:00.000Z'::timestamptz, '2026-05-04T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id, tenant_id, author_id, content, pinned, published_at, created_at)
VALUES ('77777777-1111-4000-8000-000000000004', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'a7a1ed0a-937c-4de0-8071-e89a443930c5', 'Aula experimental aberta sábado pra quem quer testar antes de assinar. Chama na DM 💬', TRUE, '2026-05-01T12:00:00.000Z'::timestamptz, '2026-05-01T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id, tenant_id, author_id, content, pinned, published_at, created_at)
VALUES ('77777777-1111-4000-8000-000000000005', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'a7a1ed0a-937c-4de0-8071-e89a443930c5', 'Foco no processo, resultado vem como consequência. Ninguém vira monstro em 30 dias — vira em 3 anos de consistência.', FALSE, '2026-04-27T12:00:00.000Z'::timestamptz, '2026-04-27T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id, tenant_id, author_id, content, pinned, published_at, created_at)
VALUES ('77777777-1111-4000-8000-000000000006', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'a7a1ed0a-937c-4de0-8071-e89a443930c5', 'Indica uma amiga e ganha 10% no próximo plano 🎯 Compartilha esse post e vamo crescer juntas!', FALSE, '2026-04-22T12:00:00.000Z'::timestamptz, '2026-04-22T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id, tenant_id, author_id, content, pinned, published_at, created_at)
VALUES ('77777777-1111-4000-8000-000000000007', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'a7a1ed0a-937c-4de0-8071-e89a443930c5', 'Quem completou treino hoje, comenta aí 💪 Vou puxar a orelha de quem tá sumido.', FALSE, '2026-04-16T12:00:00.000Z'::timestamptz, '2026-04-16T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id, tenant_id, author_id, content, pinned, published_at, created_at)
VALUES ('77777777-1111-4000-8000-000000000008', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'a7a1ed0a-937c-4de0-8071-e89a443930c5', 'Lesão é o pior atalho. Forma > carga sempre. Se a técnica tá feia, abaixa o peso.', FALSE, '2026-04-11T12:00:00.000Z'::timestamptz, '2026-04-11T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;

-- reactions: 5-15 por post, mix dos 5 tipos
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000001', 'cc659e82-dd94-4de4-9657-3166e7ad37ec', 'clap', '2026-05-08T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000001' AND user_id = 'cc659e82-dd94-4de4-9657-3166e7ad37ec');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000001', '22304a85-7ce5-4bbc-b9c6-420edb71203a', 'heart', '2026-05-08T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000001' AND user_id = '22304a85-7ce5-4bbc-b9c6-420edb71203a');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000001', '73c55850-2352-4f24-9cd7-73c171d6a012', 'clap', '2026-05-08T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000001' AND user_id = '73c55850-2352-4f24-9cd7-73c171d6a012');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000001', '852695a0-6c02-457f-a958-045d11e66862', 'fire', '2026-05-08T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000001' AND user_id = '852695a0-6c02-457f-a958-045d11e66862');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000001', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', 'clap', '2026-05-08T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000001' AND user_id = 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000001', '57e67adf-c0a6-427c-8240-002bd0ce2a11', 'fire', '2026-05-08T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000001' AND user_id = '57e67adf-c0a6-427c-8240-002bd0ce2a11');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000001', '95795cb4-e6c9-485b-8c07-656108993343', 'like', '2026-05-08T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000001' AND user_id = '95795cb4-e6c9-485b-8c07-656108993343');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000001', 'ab9768a5-a3a4-4163-bb63-5e771cf173fe', 'clap', '2026-05-08T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000001' AND user_id = 'ab9768a5-a3a4-4163-bb63-5e771cf173fe');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000001', 'fedbf236-5041-40f4-bf20-266db8d5cfa8', 'heart', '2026-05-08T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000001' AND user_id = 'fedbf236-5041-40f4-bf20-266db8d5cfa8');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000001', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', 'fire', '2026-05-08T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000001' AND user_id = '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000001', 'f08264bc-8c9b-4ae8-a25b-0ca1e0c603b2', 'like', '2026-05-08T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000001' AND user_id = 'f08264bc-8c9b-4ae8-a25b-0ca1e0c603b2');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000002', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', 'like', '2026-05-07T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000002' AND user_id = '72834f17-0e60-435f-9d40-05dd2e7d2dd4');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000002', '95795cb4-e6c9-485b-8c07-656108993343', 'fire', '2026-05-08T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000002' AND user_id = '95795cb4-e6c9-485b-8c07-656108993343');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000002', '2abacf0a-9452-4120-81e1-0c3cd3bfffc3', 'clap', '2026-05-08T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000002' AND user_id = '2abacf0a-9452-4120-81e1-0c3cd3bfffc3');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000002', '95d058d3-5dbd-43ff-ad74-91977c255d34', 'like', '2026-05-06T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000002' AND user_id = '95d058d3-5dbd-43ff-ad74-91977c255d34');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000002', '22304a85-7ce5-4bbc-b9c6-420edb71203a', 'heart', '2026-05-08T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000002' AND user_id = '22304a85-7ce5-4bbc-b9c6-420edb71203a');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000002', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', 'clap', '2026-05-08T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000002' AND user_id = '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000002', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', 'fire', '2026-05-07T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000002' AND user_id = 'fa7f2a60-2a89-4db0-b23f-54998359ad57');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000002', 'cc659e82-dd94-4de4-9657-3166e7ad37ec', 'fire', '2026-05-07T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000002' AND user_id = 'cc659e82-dd94-4de4-9657-3166e7ad37ec');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000003', 'f08264bc-8c9b-4ae8-a25b-0ca1e0c603b2', 'clap', '2026-05-04T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000003' AND user_id = 'f08264bc-8c9b-4ae8-a25b-0ca1e0c603b2');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000003', 'ed29f6bd-a124-42b8-860f-8a48f4228b95', 'fire', '2026-05-04T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000003' AND user_id = 'ed29f6bd-a124-42b8-860f-8a48f4228b95');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000003', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', 'muscle', '2026-05-04T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000003' AND user_id = '72834f17-0e60-435f-9d40-05dd2e7d2dd4');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000003', '95d058d3-5dbd-43ff-ad74-91977c255d34', 'like', '2026-05-06T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000003' AND user_id = '95d058d3-5dbd-43ff-ad74-91977c255d34');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000003', 'fedbf236-5041-40f4-bf20-266db8d5cfa8', 'heart', '2026-05-07T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000003' AND user_id = 'fedbf236-5041-40f4-bf20-266db8d5cfa8');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000003', '6fc4ba15-472a-46ef-8f33-98d933723437', 'fire', '2026-05-07T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000003' AND user_id = '6fc4ba15-472a-46ef-8f33-98d933723437');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000003', '22304a85-7ce5-4bbc-b9c6-420edb71203a', 'muscle', '2026-05-05T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000003' AND user_id = '22304a85-7ce5-4bbc-b9c6-420edb71203a');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000003', '73c55850-2352-4f24-9cd7-73c171d6a012', 'heart', '2026-05-05T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000003' AND user_id = '73c55850-2352-4f24-9cd7-73c171d6a012');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000003', '852695a0-6c02-457f-a958-045d11e66862', 'muscle', '2026-05-07T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000003' AND user_id = '852695a0-6c02-457f-a958-045d11e66862');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000003', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', 'like', '2026-05-07T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000003' AND user_id = 'fa7f2a60-2a89-4db0-b23f-54998359ad57');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000003', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', 'clap', '2026-05-06T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000003' AND user_id = '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000003', '95795cb4-e6c9-485b-8c07-656108993343', 'clap', '2026-05-04T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000003' AND user_id = '95795cb4-e6c9-485b-8c07-656108993343');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000003', 'cc659e82-dd94-4de4-9657-3166e7ad37ec', 'clap', '2026-05-07T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000003' AND user_id = 'cc659e82-dd94-4de4-9657-3166e7ad37ec');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000003', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', 'like', '2026-05-04T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000003' AND user_id = 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000003', '57e67adf-c0a6-427c-8240-002bd0ce2a11', 'fire', '2026-05-06T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000003' AND user_id = '57e67adf-c0a6-427c-8240-002bd0ce2a11');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000004', '2abacf0a-9452-4120-81e1-0c3cd3bfffc3', 'clap', '2026-05-04T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000004' AND user_id = '2abacf0a-9452-4120-81e1-0c3cd3bfffc3');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000004', '95795cb4-e6c9-485b-8c07-656108993343', 'muscle', '2026-05-03T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000004' AND user_id = '95795cb4-e6c9-485b-8c07-656108993343');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000004', 'fedbf236-5041-40f4-bf20-266db8d5cfa8', 'like', '2026-05-02T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000004' AND user_id = 'fedbf236-5041-40f4-bf20-266db8d5cfa8');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000004', 'cc659e82-dd94-4de4-9657-3166e7ad37ec', 'heart', '2026-05-03T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000004' AND user_id = 'cc659e82-dd94-4de4-9657-3166e7ad37ec');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000004', 'ab9768a5-a3a4-4163-bb63-5e771cf173fe', 'muscle', '2026-05-03T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000004' AND user_id = 'ab9768a5-a3a4-4163-bb63-5e771cf173fe');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000004', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', 'clap', '2026-05-02T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000004' AND user_id = '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000004', '95d058d3-5dbd-43ff-ad74-91977c255d34', 'fire', '2026-05-04T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000004' AND user_id = '95d058d3-5dbd-43ff-ad74-91977c255d34');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000004', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', 'muscle', '2026-05-03T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000004' AND user_id = '72834f17-0e60-435f-9d40-05dd2e7d2dd4');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000005', '22304a85-7ce5-4bbc-b9c6-420edb71203a', 'clap', '2026-04-28T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000005' AND user_id = '22304a85-7ce5-4bbc-b9c6-420edb71203a');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000005', 'fedbf236-5041-40f4-bf20-266db8d5cfa8', 'clap', '2026-04-28T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000005' AND user_id = 'fedbf236-5041-40f4-bf20-266db8d5cfa8');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000005', '2abacf0a-9452-4120-81e1-0c3cd3bfffc3', 'like', '2026-04-28T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000005' AND user_id = '2abacf0a-9452-4120-81e1-0c3cd3bfffc3');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000005', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', 'muscle', '2026-04-28T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000005' AND user_id = 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000005', 'b2895e21-3ef6-494a-bce9-ab9af4e68234', 'fire', '2026-04-27T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000005' AND user_id = 'b2895e21-3ef6-494a-bce9-ab9af4e68234');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000005', 'ed29f6bd-a124-42b8-860f-8a48f4228b95', 'heart', '2026-04-28T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000005' AND user_id = 'ed29f6bd-a124-42b8-860f-8a48f4228b95');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000005', 'f08264bc-8c9b-4ae8-a25b-0ca1e0c603b2', 'like', '2026-04-29T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000005' AND user_id = 'f08264bc-8c9b-4ae8-a25b-0ca1e0c603b2');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000005', '111eca04-631d-4fbe-a9ef-0506487fc459', 'like', '2026-04-28T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000005' AND user_id = '111eca04-631d-4fbe-a9ef-0506487fc459');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000005', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', 'like', '2026-04-30T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000005' AND user_id = 'fa7f2a60-2a89-4db0-b23f-54998359ad57');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000005', '95d058d3-5dbd-43ff-ad74-91977c255d34', 'clap', '2026-04-27T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000005' AND user_id = '95d058d3-5dbd-43ff-ad74-91977c255d34');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000006', 'f08264bc-8c9b-4ae8-a25b-0ca1e0c603b2', 'fire', '2026-04-23T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000006' AND user_id = 'f08264bc-8c9b-4ae8-a25b-0ca1e0c603b2');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000006', 'b2895e21-3ef6-494a-bce9-ab9af4e68234', 'fire', '2026-04-23T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000006' AND user_id = 'b2895e21-3ef6-494a-bce9-ab9af4e68234');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000006', '95795cb4-e6c9-485b-8c07-656108993343', 'clap', '2026-04-25T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000006' AND user_id = '95795cb4-e6c9-485b-8c07-656108993343');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000006', '852695a0-6c02-457f-a958-045d11e66862', 'like', '2026-04-23T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000006' AND user_id = '852695a0-6c02-457f-a958-045d11e66862');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000006', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', 'clap', '2026-04-25T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000006' AND user_id = '72834f17-0e60-435f-9d40-05dd2e7d2dd4');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000006', '95d058d3-5dbd-43ff-ad74-91977c255d34', 'muscle', '2026-04-25T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000006' AND user_id = '95d058d3-5dbd-43ff-ad74-91977c255d34');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000006', '2abacf0a-9452-4120-81e1-0c3cd3bfffc3', 'fire', '2026-04-23T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000006' AND user_id = '2abacf0a-9452-4120-81e1-0c3cd3bfffc3');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000006', 'ab9768a5-a3a4-4163-bb63-5e771cf173fe', 'like', '2026-04-24T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000006' AND user_id = 'ab9768a5-a3a4-4163-bb63-5e771cf173fe');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000006', '57e67adf-c0a6-427c-8240-002bd0ce2a11', 'like', '2026-04-22T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000006' AND user_id = '57e67adf-c0a6-427c-8240-002bd0ce2a11');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000006', '111eca04-631d-4fbe-a9ef-0506487fc459', 'fire', '2026-04-24T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000006' AND user_id = '111eca04-631d-4fbe-a9ef-0506487fc459');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000006', 'ed29f6bd-a124-42b8-860f-8a48f4228b95', 'like', '2026-04-22T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000006' AND user_id = 'ed29f6bd-a124-42b8-860f-8a48f4228b95');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000007', 'ed29f6bd-a124-42b8-860f-8a48f4228b95', 'clap', '2026-04-19T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000007' AND user_id = 'ed29f6bd-a124-42b8-860f-8a48f4228b95');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000007', 'fedbf236-5041-40f4-bf20-266db8d5cfa8', 'clap', '2026-04-16T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000007' AND user_id = 'fedbf236-5041-40f4-bf20-266db8d5cfa8');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000007', '57e67adf-c0a6-427c-8240-002bd0ce2a11', 'muscle', '2026-04-16T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000007' AND user_id = '57e67adf-c0a6-427c-8240-002bd0ce2a11');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000007', 'b2895e21-3ef6-494a-bce9-ab9af4e68234', 'muscle', '2026-04-18T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000007' AND user_id = 'b2895e21-3ef6-494a-bce9-ab9af4e68234');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000007', '111eca04-631d-4fbe-a9ef-0506487fc459', 'clap', '2026-04-18T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000007' AND user_id = '111eca04-631d-4fbe-a9ef-0506487fc459');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000007', '852695a0-6c02-457f-a958-045d11e66862', 'clap', '2026-04-16T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000007' AND user_id = '852695a0-6c02-457f-a958-045d11e66862');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000007', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', 'muscle', '2026-04-18T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000007' AND user_id = '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000007', '2abacf0a-9452-4120-81e1-0c3cd3bfffc3', 'fire', '2026-04-18T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000007' AND user_id = '2abacf0a-9452-4120-81e1-0c3cd3bfffc3');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000007', 'cc659e82-dd94-4de4-9657-3166e7ad37ec', 'like', '2026-04-19T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000007' AND user_id = 'cc659e82-dd94-4de4-9657-3166e7ad37ec');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000007', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', 'heart', '2026-04-17T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000007' AND user_id = '72834f17-0e60-435f-9d40-05dd2e7d2dd4');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000007', '95d058d3-5dbd-43ff-ad74-91977c255d34', 'fire', '2026-04-19T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000007' AND user_id = '95d058d3-5dbd-43ff-ad74-91977c255d34');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000008', 'b2895e21-3ef6-494a-bce9-ab9af4e68234', 'muscle', '2026-04-14T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000008' AND user_id = 'b2895e21-3ef6-494a-bce9-ab9af4e68234');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000008', 'cc659e82-dd94-4de4-9657-3166e7ad37ec', 'like', '2026-04-13T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000008' AND user_id = 'cc659e82-dd94-4de4-9657-3166e7ad37ec');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000008', '852695a0-6c02-457f-a958-045d11e66862', 'fire', '2026-04-11T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000008' AND user_id = '852695a0-6c02-457f-a958-045d11e66862');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000008', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', 'clap', '2026-04-13T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000008' AND user_id = '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000008', '95d058d3-5dbd-43ff-ad74-91977c255d34', 'fire', '2026-04-13T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000008' AND user_id = '95d058d3-5dbd-43ff-ad74-91977c255d34');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000008', '57e67adf-c0a6-427c-8240-002bd0ce2a11', 'heart', '2026-04-14T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000008' AND user_id = '57e67adf-c0a6-427c-8240-002bd0ce2a11');
INSERT INTO community_reactions (post_id, user_id, reaction, created_at)
SELECT '77777777-1111-4000-8000-000000000008', '02420861-f44e-4be0-9f2e-ffcf300add7d', 'like', '2026-04-12T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM community_reactions WHERE post_id = '77777777-1111-4000-8000-000000000008' AND user_id = '02420861-f44e-4be0-9f2e-ffcf300add7d');

-- comments: 2-6 por post, vindos das alunas
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000100000000', '77777777-1111-4000-8000-000000000001', 'ab9768a5-a3a4-4163-bb63-5e771cf173fe', 'vou indicar minha irmã', '2026-05-08T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000100000001', '77777777-1111-4000-8000-000000000001', 'f08264bc-8c9b-4ae8-a25b-0ca1e0c603b2', 'completei sim, prof!', '2026-05-08T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000100000002', '77777777-1111-4000-8000-000000000001', 'ab9768a5-a3a4-4163-bb63-5e771cf173fe', 'vou indicar minha irmã', '2026-05-08T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000100000003', '77777777-1111-4000-8000-000000000001', '2abacf0a-9452-4120-81e1-0c3cd3bfffc3', 'tô amando os resultados', '2026-05-08T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000100000004', '77777777-1111-4000-8000-000000000001', 'b2895e21-3ef6-494a-bce9-ab9af4e68234', 'dia de descansar, amanhã volto com tudo', '2026-05-08T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000200000000', '77777777-1111-4000-8000-000000000002', 'f08264bc-8c9b-4ae8-a25b-0ca1e0c603b2', 'foi pesado mas saiu', '2026-05-06T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000200000001', '77777777-1111-4000-8000-000000000002', 'fedbf236-5041-40f4-bf20-266db8d5cfa8', 'pode crer', '2026-05-07T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000200000002', '77777777-1111-4000-8000-000000000002', '2abacf0a-9452-4120-81e1-0c3cd3bfffc3', 'meta da semana batida', '2026-05-07T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000200000003', '77777777-1111-4000-8000-000000000002', 'fedbf236-5041-40f4-bf20-266db8d5cfa8', 'completei sim, prof!', '2026-05-06T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000200000004', '77777777-1111-4000-8000-000000000002', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', 'pode crer', '2026-05-07T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000200000005', '77777777-1111-4000-8000-000000000002', '02420861-f44e-4be0-9f2e-ffcf300add7d', 'vou indicar minha irmã', '2026-05-08T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000300000000', '77777777-1111-4000-8000-000000000003', 'f08264bc-8c9b-4ae8-a25b-0ca1e0c603b2', 'dia de descansar, amanhã volto com tudo', '2026-05-06T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000300000001', '77777777-1111-4000-8000-000000000003', '02420861-f44e-4be0-9f2e-ffcf300add7d', 'glúteo de aço hoje 🍑', '2026-05-04T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000300000002', '77777777-1111-4000-8000-000000000003', '95795cb4-e6c9-485b-8c07-656108993343', 'tô amando os resultados', '2026-05-04T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000300000003', '77777777-1111-4000-8000-000000000003', '6fc4ba15-472a-46ef-8f33-98d933723437', 'essa frase eu vou guardar', '2026-05-06T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000300000004', '77777777-1111-4000-8000-000000000003', '111eca04-631d-4fbe-a9ef-0506487fc459', 'dia de descansar, amanhã volto com tudo', '2026-05-04T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000400000000', '77777777-1111-4000-8000-000000000004', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', 'completei sim, prof!', '2026-05-03T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000400000001', '77777777-1111-4000-8000-000000000004', '73c55850-2352-4f24-9cd7-73c171d6a012', 'concordo demais!', '2026-05-02T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000400000002', '77777777-1111-4000-8000-000000000004', '2abacf0a-9452-4120-81e1-0c3cd3bfffc3', 'treino marcado pra hoje à noite 💪', '2026-05-01T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000400000003', '77777777-1111-4000-8000-000000000004', '22304a85-7ce5-4bbc-b9c6-420edb71203a', 'foi pesado mas saiu', '2026-05-02T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000500000000', '77777777-1111-4000-8000-000000000005', '57e67adf-c0a6-427c-8240-002bd0ce2a11', 'bora!', '2026-04-28T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000500000001', '77777777-1111-4000-8000-000000000005', 'ab9768a5-a3a4-4163-bb63-5e771cf173fe', 'essa frase eu vou guardar', '2026-04-28T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000600000000', '77777777-1111-4000-8000-000000000006', '22304a85-7ce5-4bbc-b9c6-420edb71203a', 'bora!', '2026-04-23T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000600000001', '77777777-1111-4000-8000-000000000006', '95795cb4-e6c9-485b-8c07-656108993343', 'essa frase eu vou guardar', '2026-04-24T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000700000000', '77777777-1111-4000-8000-000000000007', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', 'amei a aula de ontem', '2026-04-17T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000700000001', '77777777-1111-4000-8000-000000000007', '73c55850-2352-4f24-9cd7-73c171d6a012', 'concordo demais!', '2026-04-16T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000700000002', '77777777-1111-4000-8000-000000000007', '73c55850-2352-4f24-9cd7-73c171d6a012', 'concordo demais!', '2026-04-16T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000700000003', '77777777-1111-4000-8000-000000000007', '852695a0-6c02-457f-a958-045d11e66862', 'bora!', '2026-04-17T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000700000004', '77777777-1111-4000-8000-000000000007', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', 'meta da semana batida', '2026-04-16T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000700000005', '77777777-1111-4000-8000-000000000007', '95795cb4-e6c9-485b-8c07-656108993343', 'bora!', '2026-04-18T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000800000000', '77777777-1111-4000-8000-000000000008', '57e67adf-c0a6-427c-8240-002bd0ce2a11', 'completei sim, prof!', '2026-04-12T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000800000001', '77777777-1111-4000-8000-000000000008', 'f08264bc-8c9b-4ae8-a25b-0ca1e0c603b2', 'amei a aula de ontem', '2026-04-12T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES ('88888888-2222-4000-8000-000800000002', '77777777-1111-4000-8000-000000000008', 'f08264bc-8c9b-4ae8-a25b-0ca1e0c603b2', 'amei a aula de ontem', '2026-04-13T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;

-- ============ REFERRALS (5) ============
INSERT INTO referrals (id, tenant_id, referrer_id, referred_id, status, reward_label, rewarded_at, created_at)
VALUES ('99999999-3333-4000-8000-000000000000', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', 'rewarded', '10% no próximo plano', '2026-04-18T12:00:00.000Z'::timestamptz, '2026-03-09T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO referrals (id, tenant_id, referrer_id, referred_id, status, reward_label, rewarded_at, created_at)
VALUES ('99999999-3333-4000-8000-000000000001', '918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', 'ab9768a5-a3a4-4163-bb63-5e771cf173fe', 'rewarded', '10% no próximo plano', '2026-05-02T12:00:00.000Z'::timestamptz, '2026-03-20T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO referrals (id, tenant_id, referrer_id, referred_id, status, reward_label, rewarded_at, created_at)
VALUES ('99999999-3333-4000-8000-000000000002', '918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', 'cc659e82-dd94-4de4-9657-3166e7ad37ec', 'active', '10% no próximo plano', NULL, '2026-03-09T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO referrals (id, tenant_id, referrer_id, referred_id, status, reward_label, rewarded_at, created_at)
VALUES ('99999999-3333-4000-8000-000000000003', '918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '6fc4ba15-472a-46ef-8f33-98d933723437', 'active', '10% no próximo plano', NULL, '2026-04-08T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO referrals (id, tenant_id, referrer_id, referred_id, status, reward_label, rewarded_at, created_at)
VALUES ('99999999-3333-4000-8000-000000000004', '918ed85f-e58a-4edf-bb1b-761f032e0019', '02420861-f44e-4be0-9f2e-ffcf300add7d', '22304a85-7ce5-4bbc-b9c6-420edb71203a', 'active', '10% no próximo plano', NULL, '2026-03-14T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;

-- ============ PERSONAL RECORDS (~15) ============
INSERT INTO personal_records (id, tenant_id, user_id, exercise_name, prev_max, new_max, achieved_at)
VALUES ('aaaaaaaa-4444-4000-8000-000000000000', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', 'Agachamento livre', 30, 35, '2026-04-24T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO personal_records (id, tenant_id, user_id, exercise_name, prev_max, new_max, achieved_at)
VALUES ('aaaaaaaa-4444-4000-8000-000000000001', '918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', 'Agachamento livre', 40, 45, '2026-04-29T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO personal_records (id, tenant_id, user_id, exercise_name, prev_max, new_max, achieved_at)
VALUES ('aaaaaaaa-4444-4000-8000-000000000002', '918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', 'Supino reto', 20, 22.5, '2026-04-10T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO personal_records (id, tenant_id, user_id, exercise_name, prev_max, new_max, achieved_at)
VALUES ('aaaaaaaa-4444-4000-8000-000000000003', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', 'Hip thrust', 60, 70, '2026-05-02T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO personal_records (id, tenant_id, user_id, exercise_name, prev_max, new_max, achieved_at)
VALUES ('aaaaaaaa-4444-4000-8000-000000000004', '918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', 'Hip thrust', 50, 60, '2026-04-29T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO personal_records (id, tenant_id, user_id, exercise_name, prev_max, new_max, achieved_at)
VALUES ('aaaaaaaa-4444-4000-8000-000000000005', '918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', 'Leg press 45°', 100, 120, '2026-05-04T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO personal_records (id, tenant_id, user_id, exercise_name, prev_max, new_max, achieved_at)
VALUES ('aaaaaaaa-4444-4000-8000-000000000006', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'ed29f6bd-a124-42b8-860f-8a48f4228b95', 'Stiff', 30, 35, '2026-04-27T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO personal_records (id, tenant_id, user_id, exercise_name, prev_max, new_max, achieved_at)
VALUES ('aaaaaaaa-4444-4000-8000-000000000007', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'ab9768a5-a3a4-4163-bb63-5e771cf173fe', 'Remada curvada', 25, 27.5, '2026-04-19T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO personal_records (id, tenant_id, user_id, exercise_name, prev_max, new_max, achieved_at)
VALUES ('aaaaaaaa-4444-4000-8000-000000000008', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', 'Desenvolvimento com halteres', 10, 12, '2026-04-30T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO personal_records (id, tenant_id, user_id, exercise_name, prev_max, new_max, achieved_at)
VALUES ('aaaaaaaa-4444-4000-8000-000000000009', '918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', 'Rosca direta', 12, 14, '2026-04-08T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO personal_records (id, tenant_id, user_id, exercise_name, prev_max, new_max, achieved_at)
VALUES ('aaaaaaaa-4444-4000-8000-000000000010', '918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', 'Tríceps na polia', 20, 22.5, '2026-04-11T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO personal_records (id, tenant_id, user_id, exercise_name, prev_max, new_max, achieved_at)
VALUES ('aaaaaaaa-4444-4000-8000-000000000011', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', 'Cadeira extensora', 35, 40, '2026-04-28T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO personal_records (id, tenant_id, user_id, exercise_name, prev_max, new_max, achieved_at)
VALUES ('aaaaaaaa-4444-4000-8000-000000000012', '918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', 'Mesa flexora', 30, 32.5, '2026-04-08T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO personal_records (id, tenant_id, user_id, exercise_name, prev_max, new_max, achieved_at)
VALUES ('aaaaaaaa-4444-4000-8000-000000000013', '918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', 'Crucifixo na máquina', 25, 27.5, '2026-04-27T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;
INSERT INTO personal_records (id, tenant_id, user_id, exercise_name, prev_max, new_max, achieved_at)
VALUES ('aaaaaaaa-4444-4000-8000-000000000014', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'ed29f6bd-a124-42b8-860f-8a48f4228b95', 'Levantamento terra romeno', 40, 45, '2026-04-23T12:00:00.000Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;

-- ============ STRENGTH SNAPSHOTS (6 alunas × 30 dias) ============
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-04-08', 39, 38, 50, 36, 32, 45)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-04-09', 43, 41, 51, 36, 34, 46)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-04-10', 42, 38, 52, 37, 33, 48)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-04-11', 42, 41, 52, 36, 35, 46)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-04-12', 40, 41, 54, 36, 33, 48)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-04-13', 43, 41, 52, 40, 36, 46)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-04-14', 44, 40, 53, 37, 36, 47)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-04-15', 43, 42, 55, 39, 36, 50)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-04-16', 44, 42, 55, 39, 36, 48)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-04-17', 44, 44, 57, 40, 38, 49)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-04-18', 44, 43, 58, 41, 38, 47)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-04-19', 49, 44, 59, 39, 38, 51)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-04-20', 47, 44, 59, 39, 36, 52)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-04-21', 49, 43, 59, 43, 37, 50)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-04-22', 47, 48, 60, 42, 38, 50)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-04-23', 49, 45, 61, 43, 38, 51)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-04-24', 51, 47, 64, 43, 40, 51)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-04-25', 49, 47, 60, 43, 43, 51)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-04-26', 49, 46, 63, 43, 44, 51)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-04-27', 50, 47, 63, 46, 43, 52)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-04-28', 51, 50, 67, 43, 42, 54)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-04-29', 53, 49, 64, 45, 44, 53)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-04-30', 54, 51, 66, 45, 46, 53)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-05-01', 52, 51, 68, 47, 44, 54)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-05-02', 53, 53, 69, 49, 46, 54)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-05-03', 55, 52, 69, 47, 43, 53)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-05-04', 58, 52, 67, 49, 45, 56)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-05-05', 57, 52, 68, 48, 46, 57)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-05-06', 59, 56, 72, 48, 48, 55)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '2026-05-07', 58, 54, 71, 51, 46, 56)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-04-08', 43, 43, 54, 39, 36, 45)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-04-09', 42, 43, 53, 40, 38, 47)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-04-10', 43, 43, 56, 39, 38, 47)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-04-11', 47, 44, 57, 41, 38, 47)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-04-12', 44, 46, 56, 39, 38, 49)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-04-13', 46, 46, 56, 40, 38, 47)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-04-14', 45, 45, 56, 42, 41, 49)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-04-15', 47, 46, 57, 41, 40, 49)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-04-16', 50, 48, 59, 42, 38, 49)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-04-17', 47, 45, 59, 44, 42, 49)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-04-18', 48, 49, 59, 43, 39, 49)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-04-19', 50, 49, 61, 44, 43, 49)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-04-20', 51, 47, 63, 45, 43, 53)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-04-21', 52, 49, 62, 47, 44, 52)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-04-22', 52, 50, 61, 47, 44, 55)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-04-23', 52, 52, 66, 44, 43, 55)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-04-24', 52, 52, 67, 47, 47, 53)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-04-25', 52, 53, 65, 47, 46, 54)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-04-26', 53, 54, 65, 48, 45, 52)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-04-27', 53, 52, 68, 47, 47, 56)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-04-28', 55, 52, 68, 49, 47, 54)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-04-29', 57, 53, 69, 47, 46, 54)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-04-30', 58, 55, 69, 48, 49, 57)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-05-01', 58, 55, 70, 51, 49, 56)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-05-02', 56, 54, 69, 50, 50, 56)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-05-03', 56, 58, 73, 51, 51, 56)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-05-04', 61, 55, 70, 51, 51, 56)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-05-05', 61, 58, 73, 54, 50, 58)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-05-06', 58, 58, 74, 53, 50, 59)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '2026-05-07', 58, 59, 74, 53, 50, 59)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-04-08', 46, 44, 58, 39, 41, 49)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-04-09', 49, 45, 59, 40, 42, 49)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-04-10', 47, 46, 55, 43, 42, 52)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-04-11', 48, 46, 58, 41, 41, 50)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-04-12', 46, 48, 61, 41, 41, 53)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-04-13', 48, 47, 60, 44, 44, 52)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-04-14', 50, 48, 61, 46, 45, 51)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-04-15', 49, 51, 63, 47, 44, 53)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-04-16', 53, 50, 60, 47, 44, 50)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-04-17', 52, 49, 62, 45, 44, 52)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-04-18', 53, 51, 64, 47, 45, 52)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-04-19', 53, 53, 66, 48, 45, 52)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-04-20', 55, 52, 64, 48, 45, 53)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-04-21', 56, 53, 67, 49, 48, 52)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-04-22', 52, 53, 67, 49, 46, 53)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-04-23', 56, 54, 66, 49, 49, 54)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-04-24', 56, 56, 69, 49, 48, 56)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-04-25', 54, 54, 69, 49, 49, 57)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-04-26', 58, 56, 69, 50, 49, 55)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-04-27', 59, 55, 68, 53, 49, 56)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-04-28', 57, 58, 70, 51, 50, 58)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-04-29', 61, 58, 73, 53, 51, 59)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-04-30', 60, 57, 72, 53, 53, 58)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-05-01', 59, 57, 73, 54, 53, 58)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-05-02', 60, 60, 73, 53, 53, 60)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-05-03', 59, 59, 73, 55, 54, 60)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-05-04', 63, 60, 75, 53, 53, 59)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-05-05', 61, 60, 77, 53, 55, 60)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-05-06', 63, 63, 79, 56, 56, 60)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '2026-05-07', 61, 62, 76, 56, 54, 62)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-04-08', 51, 48, 61, 46, 43, 51)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-04-09', 50, 50, 61, 47, 45, 49)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-04-10', 49, 53, 60, 47, 46, 51)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-04-11', 52, 51, 60, 46, 44, 51)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-04-12', 53, 53, 62, 48, 48, 52)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-04-13', 53, 54, 65, 46, 46, 54)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-04-14', 52, 53, 63, 46, 47, 53)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-04-15', 53, 54, 65, 48, 48, 53)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-04-16', 55, 57, 67, 47, 50, 53)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-04-17', 54, 55, 64, 50, 49, 53)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-04-18', 54, 55, 66, 48, 50, 56)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-04-19', 55, 57, 66, 50, 51, 55)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-04-20', 55, 58, 67, 48, 50, 55)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-04-21', 57, 58, 68, 52, 51, 55)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-04-22', 58, 56, 70, 51, 50, 57)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-04-23', 57, 59, 71, 51, 50, 58)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-04-24', 59, 60, 69, 50, 54, 59)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-04-25', 60, 61, 72, 53, 54, 56)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-04-26', 59, 61, 71, 51, 54, 59)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-04-27', 60, 61, 71, 52, 55, 58)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-04-28', 63, 59, 73, 53, 57, 57)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-04-29', 63, 62, 74, 57, 54, 58)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-04-30', 63, 60, 76, 56, 57, 60)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-05-01', 61, 61, 74, 57, 54, 61)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-05-02', 64, 64, 77, 57, 56, 62)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-05-03', 66, 64, 77, 59, 59, 59)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-05-04', 64, 63, 79, 56, 59, 63)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-05-05', 65, 65, 79, 56, 56, 61)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-05-06', 67, 66, 81, 59, 57, 64)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '2026-05-07', 65, 65, 82, 59, 58, 65)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-04-08', 54, 52, 63, 48, 49, 55)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-04-09', 52, 54, 65, 48, 50, 51)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-04-10', 54, 53, 64, 46, 51, 56)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-04-11', 55, 57, 64, 48, 50, 55)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-04-12', 53, 55, 66, 51, 52, 57)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-04-13', 54, 57, 65, 49, 50, 55)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-04-14', 55, 57, 66, 50, 51, 56)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-04-15', 58, 60, 68, 50, 51, 57)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-04-16', 56, 60, 68, 53, 51, 57)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-04-17', 56, 58, 71, 51, 54, 55)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-04-18', 57, 61, 67, 51, 52, 57)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-04-19', 59, 60, 71, 53, 54, 56)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-04-20', 58, 59, 72, 55, 53, 57)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-04-21', 59, 62, 72, 52, 55, 59)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-04-22', 60, 64, 73, 54, 55, 58)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-04-23', 61, 62, 72, 53, 56, 57)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-04-24', 63, 64, 74, 54, 57, 60)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-04-25', 63, 66, 72, 58, 57, 58)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-04-26', 63, 65, 74, 57, 56, 60)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-04-27', 61, 64, 76, 58, 58, 61)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-04-28', 65, 66, 79, 58, 59, 60)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-04-29', 63, 67, 77, 59, 60, 61)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-04-30', 67, 66, 79, 59, 58, 62)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-05-01', 66, 67, 77, 61, 62, 63)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-05-02', 66, 69, 79, 60, 63, 64)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-05-03', 66, 69, 80, 58, 61, 61)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-05-04', 66, 70, 80, 58, 62, 61)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-05-05', 67, 68, 80, 59, 64, 65)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-05-06', 68, 70, 82, 60, 65, 62)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '95d058d3-5dbd-43ff-ad74-91977c255d34', '2026-05-07', 68, 72, 83, 64, 63, 66)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-04-08', 53, 59, 65, 48, 52, 54)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-04-09', 55, 60, 66, 50, 53, 55)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-04-10', 55, 58, 66, 51, 51, 57)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-04-11', 56, 59, 68, 52, 55, 54)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-04-12', 55, 61, 70, 50, 52, 55)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-04-13', 59, 62, 70, 51, 53, 55)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-04-14', 60, 61, 70, 51, 54, 59)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-04-15', 58, 64, 71, 55, 57, 58)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-04-16', 61, 62, 72, 54, 57, 59)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-04-17', 59, 65, 73, 54, 57, 57)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-04-18', 60, 63, 71, 54, 57, 58)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-04-19', 60, 63, 74, 56, 57, 60)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-04-20', 60, 66, 73, 55, 59, 60)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-04-21', 62, 64, 74, 59, 57, 62)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-04-22', 63, 67, 77, 55, 59, 60)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-04-23', 66, 69, 75, 57, 62, 60)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-04-24', 63, 69, 75, 58, 63, 62)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-04-25', 63, 67, 78, 61, 60, 62)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-04-26', 65, 67, 79, 58, 63, 63)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-04-27', 65, 70, 78, 61, 61, 63)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-04-28', 67, 69, 81, 61, 64, 64)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-04-29', 68, 71, 80, 60, 61, 61)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-04-30', 68, 72, 81, 63, 65, 64)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-05-01', 68, 73, 82, 61, 63, 64)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-05-02', 70, 71, 82, 63, 63, 64)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-05-03', 70, 71, 82, 63, 65, 63)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-05-04', 72, 75, 84, 62, 68, 64)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-05-05', 72, 75, 84, 64, 68, 66)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-05-06', 73, 75, 87, 63, 67, 67)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;
INSERT INTO strength_snapshots (tenant_id, user_id, snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core)
VALUES ('918ed85f-e58a-4edf-bb1b-761f032e0019', '57e67adf-c0a6-427c-8240-002bd0ce2a11', '2026-05-07', 72, 76, 86, 65, 69, 67)
ON CONFLICT (user_id, snapshot_date) DO NOTHING;

-- ============ PUSH SUBSCRIPTIONS (5 alunas) ============
INSERT INTO push_subscriptions (user_id, tenant_id, endpoint, p256dh, auth, user_agent)
VALUES ('fa7f2a60-2a89-4db0-b23f-54998359ad57', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'https://fcm.googleapis.com/fcm/send/seed-fa7f2a60-0', 'BNcZmE3ZjJhNjBwMjU2', 'ZmE3ZjJhNjBhdXRo', 'Mozilla/5.0 seed')
ON CONFLICT (endpoint) DO NOTHING;
INSERT INTO push_subscriptions (user_id, tenant_id, endpoint, p256dh, auth, user_agent)
VALUES ('72834f17-0e60-435f-9d40-05dd2e7d2dd4', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'https://fcm.googleapis.com/fcm/send/seed-72834f17-1', 'BNcNzI4MzRmMTdwMjU2', 'NzI4MzRmMTdhdXRo', 'Mozilla/5.0 seed')
ON CONFLICT (endpoint) DO NOTHING;
INSERT INTO push_subscriptions (user_id, tenant_id, endpoint, p256dh, auth, user_agent)
VALUES ('4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'https://fcm.googleapis.com/fcm/send/seed-4018d9df-2', 'BNcNDAxOGQ5ZGZwMjU2', 'NDAxOGQ5ZGZhdXRo', 'Mozilla/5.0 seed')
ON CONFLICT (endpoint) DO NOTHING;
INSERT INTO push_subscriptions (user_id, tenant_id, endpoint, p256dh, auth, user_agent)
VALUES ('f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'https://fcm.googleapis.com/fcm/send/seed-f0df7fd4-3', 'BNcZjBkZjdmZDRwMjU2', 'ZjBkZjdmZDRhdXRo', 'Mozilla/5.0 seed')
ON CONFLICT (endpoint) DO NOTHING;
INSERT INTO push_subscriptions (user_id, tenant_id, endpoint, p256dh, auth, user_agent)
VALUES ('95d058d3-5dbd-43ff-ad74-91977c255d34', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'https://fcm.googleapis.com/fcm/send/seed-95d058d3-4', 'BNcOTVkMDU4ZDNwMjU2', 'OTVkMDU4ZDNhdXRo', 'Mozilla/5.0 seed')
ON CONFLICT (endpoint) DO NOTHING;

-- ============ BADGES EARNED ============
INSERT INTO badges_earned (user_id, tenant_id, badge_key, earned_at)
SELECT 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'first-workout', '2026-04-18T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM badges_earned WHERE user_id = 'fa7f2a60-2a89-4db0-b23f-54998359ad57' AND badge_key = 'first-workout');
INSERT INTO badges_earned (user_id, tenant_id, badge_key, earned_at)
SELECT '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'first-workout', '2026-04-29T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM badges_earned WHERE user_id = '72834f17-0e60-435f-9d40-05dd2e7d2dd4' AND badge_key = 'first-workout');
INSERT INTO badges_earned (user_id, tenant_id, badge_key, earned_at)
SELECT '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'first-workout', '2026-04-28T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM badges_earned WHERE user_id = '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4' AND badge_key = 'first-workout');
INSERT INTO badges_earned (user_id, tenant_id, badge_key, earned_at)
SELECT 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'first-workout', '2026-04-15T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM badges_earned WHERE user_id = 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc' AND badge_key = 'first-workout');
INSERT INTO badges_earned (user_id, tenant_id, badge_key, earned_at)
SELECT '95d058d3-5dbd-43ff-ad74-91977c255d34', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'first-workout', '2026-03-09T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM badges_earned WHERE user_id = '95d058d3-5dbd-43ff-ad74-91977c255d34' AND badge_key = 'first-workout');
INSERT INTO badges_earned (user_id, tenant_id, badge_key, earned_at)
SELECT '57e67adf-c0a6-427c-8240-002bd0ce2a11', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'first-workout', '2026-03-20T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM badges_earned WHERE user_id = '57e67adf-c0a6-427c-8240-002bd0ce2a11' AND badge_key = 'first-workout');
INSERT INTO badges_earned (user_id, tenant_id, badge_key, earned_at)
SELECT 'ed29f6bd-a124-42b8-860f-8a48f4228b95', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'first-workout', '2026-03-19T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM badges_earned WHERE user_id = 'ed29f6bd-a124-42b8-860f-8a48f4228b95' AND badge_key = 'first-workout');
INSERT INTO badges_earned (user_id, tenant_id, badge_key, earned_at)
SELECT 'ab9768a5-a3a4-4163-bb63-5e771cf173fe', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'first-workout', '2026-04-11T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM badges_earned WHERE user_id = 'ab9768a5-a3a4-4163-bb63-5e771cf173fe' AND badge_key = 'first-workout');
INSERT INTO badges_earned (user_id, tenant_id, badge_key, earned_at)
SELECT '02420861-f44e-4be0-9f2e-ffcf300add7d', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'first-workout', '2026-03-17T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM badges_earned WHERE user_id = '02420861-f44e-4be0-9f2e-ffcf300add7d' AND badge_key = 'first-workout');
INSERT INTO badges_earned (user_id, tenant_id, badge_key, earned_at)
SELECT 'f08264bc-8c9b-4ae8-a25b-0ca1e0c603b2', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'first-workout', '2026-03-24T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM badges_earned WHERE user_id = 'f08264bc-8c9b-4ae8-a25b-0ca1e0c603b2' AND badge_key = 'first-workout');
INSERT INTO badges_earned (user_id, tenant_id, badge_key, earned_at)
SELECT 'cc659e82-dd94-4de4-9657-3166e7ad37ec', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'first-workout', '2026-04-14T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM badges_earned WHERE user_id = 'cc659e82-dd94-4de4-9657-3166e7ad37ec' AND badge_key = 'first-workout');
INSERT INTO badges_earned (user_id, tenant_id, badge_key, earned_at)
SELECT '73c55850-2352-4f24-9cd7-73c171d6a012', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'first-workout', '2026-03-11T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM badges_earned WHERE user_id = '73c55850-2352-4f24-9cd7-73c171d6a012' AND badge_key = 'first-workout');
INSERT INTO badges_earned (user_id, tenant_id, badge_key, earned_at)
SELECT 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'streak-3', '2026-03-09T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM badges_earned WHERE user_id = 'fa7f2a60-2a89-4db0-b23f-54998359ad57' AND badge_key = 'streak-3');
INSERT INTO badges_earned (user_id, tenant_id, badge_key, earned_at)
SELECT '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'streak-3', '2026-04-26T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM badges_earned WHERE user_id = '72834f17-0e60-435f-9d40-05dd2e7d2dd4' AND badge_key = 'streak-3');
INSERT INTO badges_earned (user_id, tenant_id, badge_key, earned_at)
SELECT '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'streak-3', '2026-03-09T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM badges_earned WHERE user_id = '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4' AND badge_key = 'streak-3');
INSERT INTO badges_earned (user_id, tenant_id, badge_key, earned_at)
SELECT 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'streak-3', '2026-04-05T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM badges_earned WHERE user_id = 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc' AND badge_key = 'streak-3');
INSERT INTO badges_earned (user_id, tenant_id, badge_key, earned_at)
SELECT '95d058d3-5dbd-43ff-ad74-91977c255d34', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'streak-3', '2026-05-06T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM badges_earned WHERE user_id = '95d058d3-5dbd-43ff-ad74-91977c255d34' AND badge_key = 'streak-3');
INSERT INTO badges_earned (user_id, tenant_id, badge_key, earned_at)
SELECT 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'streak-7', '2026-04-21T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM badges_earned WHERE user_id = 'fa7f2a60-2a89-4db0-b23f-54998359ad57' AND badge_key = 'streak-7');
INSERT INTO badges_earned (user_id, tenant_id, badge_key, earned_at)
SELECT '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'streak-7', '2026-05-05T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM badges_earned WHERE user_id = '72834f17-0e60-435f-9d40-05dd2e7d2dd4' AND badge_key = 'streak-7');
INSERT INTO badges_earned (user_id, tenant_id, badge_key, earned_at)
SELECT '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'streak-7', '2026-04-03T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM badges_earned WHERE user_id = '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4' AND badge_key = 'streak-7');
INSERT INTO badges_earned (user_id, tenant_id, badge_key, earned_at)
SELECT 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '918ed85f-e58a-4edf-bb1b-761f032e0019', '10-workouts', '2026-04-03T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM badges_earned WHERE user_id = 'fa7f2a60-2a89-4db0-b23f-54998359ad57' AND badge_key = '10-workouts');
INSERT INTO badges_earned (user_id, tenant_id, badge_key, earned_at)
SELECT '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '918ed85f-e58a-4edf-bb1b-761f032e0019', '10-workouts', '2026-04-27T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM badges_earned WHERE user_id = '72834f17-0e60-435f-9d40-05dd2e7d2dd4' AND badge_key = '10-workouts');
INSERT INTO badges_earned (user_id, tenant_id, badge_key, earned_at)
SELECT 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'streak-30', '2026-04-18T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM badges_earned WHERE user_id = 'fa7f2a60-2a89-4db0-b23f-54998359ad57' AND badge_key = 'streak-30');
INSERT INTO badges_earned (user_id, tenant_id, badge_key, earned_at)
SELECT 'fa7f2a60-2a89-4db0-b23f-54998359ad57', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'pr-load', '2026-03-11T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM badges_earned WHERE user_id = 'fa7f2a60-2a89-4db0-b23f-54998359ad57' AND badge_key = 'pr-load');
INSERT INTO badges_earned (user_id, tenant_id, badge_key, earned_at)
SELECT '72834f17-0e60-435f-9d40-05dd2e7d2dd4', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'pr-load', '2026-03-23T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM badges_earned WHERE user_id = '72834f17-0e60-435f-9d40-05dd2e7d2dd4' AND badge_key = 'pr-load');
INSERT INTO badges_earned (user_id, tenant_id, badge_key, earned_at)
SELECT '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'pr-load', '2026-04-29T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM badges_earned WHERE user_id = '4018d9df-4d5b-453c-a8f8-b390d0a7a0a4' AND badge_key = 'pr-load');
INSERT INTO badges_earned (user_id, tenant_id, badge_key, earned_at)
SELECT 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc', '918ed85f-e58a-4edf-bb1b-761f032e0019', 'pr-load', '2026-04-18T12:00:00.000Z'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM badges_earned WHERE user_id = 'f0df7fd4-9654-48fc-8d36-44f3bf3ceadc' AND badge_key = 'pr-load');

COMMIT;

-- =====================================================================
-- VALIDATION
-- =====================================================================
-- select count(*) as alunas from profiles where tenant_id='918ed85f-e58a-4edf-bb1b-761f032e0019' and role='student';
-- select count(*) as workouts from workouts where tenant_id='918ed85f-e58a-4edf-bb1b-761f032e0019';
-- select count(*) as logs from workout_logs where tenant_id='918ed85f-e58a-4edf-bb1b-761f032e0019' and completed_at is not null;
-- select count(*) as posts from community_posts where tenant_id='918ed85f-e58a-4edf-bb1b-761f032e0019';
-- select count(*) as anamneses from anamneses where tenant_id='918ed85f-e58a-4edf-bb1b-761f032e0019';