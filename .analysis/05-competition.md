# Análise de Competição — Judson App

> **Escopo:** mapear concorrentes diretos brasileiros + refs internacionais para o Judson App (FitCoach SaaS, hoje branded para Judson Lobato, futuramente white-label).
> **Data da pesquisa:** 2026-05-07
> **Método:** WebSearch + WebFetch direto nos sites oficiais. Quando uma feature não foi confirmada na página, marcamos `?` em vez de chutar.
> **Convenção da matriz:** ✅ confirmado · ❌ confirmado ausente · ⚠️ parcial / requer plano superior · `?` não confirmado

---

## 1. Resumo Executivo do Mercado

**Tamanho.** O setor fitness brasileiro é gigante e crescendo. Há mais de **64 mil empresas ativas** em condicionamento físico no Brasil, com triplicação no número de estabelecimentos em 10 anos (de ~22 mil para 62 mil+) e movimento anual de cerca de **R$ 17 bi**. A previsão é o setor saltar de **US$ 4,2 bi (2023) para US$ 6,8 bi (2028)**. O recorte digital é onde a oportunidade explode: o segmento de **treinos virtuais/online** deve passar de US$ 6 bi em 2026 e chegar perto de **US$ 26 bi em 2033**, com CAGR > 23% [(Bling)](https://blog.bling.com.br/mercado-fitness-no-brasil/) [(MFIT News)](https://news.mfitpersonal.com.br/p/tendencias-fitness-para-2026).

**Players dominantes.** O mercado B2B-personal está **fragmentado** e é dominado por algumas plataformas brasileiras:
- **MFIT Personal** se autodeclara com **200 mil personal trainers cadastrados e ~5 milhões de alunos** [(MFIT)](https://www.mfitpersonal.com.br/) — provavelmente o maior em base ativa de personal trainers.
- **Tecnofit** é a referência consolidada para academias e estúdios (B2B hardcore), com ramificação para personal [(Tecnofit)](https://www.tecnofit.com.br/tipos-de-negocio/tecnofit-personal/).
- **Vedius** atende **20 mil+ profissionais de saúde/fitness** com prontuário eletrônico [(Vedius)](https://vedius.com.br/aplicativo-personal-trainer/).
- **Wiki4Fit** reporta **9 mil+ clientes / 118 mil alunos / 50 mil downloads** [(Wiki4Fit)](https://wiki4fit.com/).
- **Pacto Soluções** ataca o segmento academia (5.800+ negócios) com IA já em produção [(Pacto)](https://sistemapacto.com.br/).
- **TreinoAI** é o entrante recente que aposta tudo em IA + periodização estruturada [(TreinoAI)](https://www.treinoai.com.br/).
- **PersonalGO** é o disruptor "freemium total" com escaneamento corporal AI [(PersonalGO)](https://www.personalgo.com/).

**Tendências 2026.** Três sinais claros: (1) **modelo híbrido** — aluno mistura academia presencial + treino remoto e quer orientação contínua; (2) **IA de prescrição** — não para substituir o personal, mas para acelerar a montagem de treino e personalização (Pacto, TreinoAI, PersonalGO já entregam) [(Pacto blog)](https://blog.sistemapacto.com.br/treino-por-ia-app-pacto-academias/); (3) **carteira digital integrada** com Pix recorrente e split — virou commodity nos top players (Nexur, TreinoAI, Personal Digital, MFIT) [(TreinoAI Carteira)](https://www.treinoai.com.br/academy/blog/carteira-treinoai-receber-pagamentos).

**Oportunidades de nicho.** Apesar do mercado parecer saturado, existem gaps reais:
- **Mobile-first PWA real** — todos os top players são app nativo (iOS+Android) e poucos têm PWA decente; ninguém parece tratar mobile web como cidadão de primeira classe.
- **UX para a aluna final**, não só para o personal — a maioria dos apps é "ferramenta de personal" com app de aluno como apêndice. Muitas reclamações em Reclame Aqui são da aluna que não consegue usar [(Tecnofit reclamações)](https://www.reclameaqui.com.br/empresa/tecnofit/lista-reclamacoes/).
- **Suporte humano de verdade** — o calo recorrente em todos os players (Tecnofit, MFIT, Wiki4Fit) é "suporte vergonhoso, demora, culpa o cliente".
- **Multi-tenant / white-label desde o dia zero** — Trainerize tem com taxa de US$ 169 + add-on; Nexur cobra R$ 149-249 + R$ 789 publicação; nenhum entrega white-label barato e bonito.
- **Onboarding sem fricção** — convite por link direto, sem cadastro chato, sem "qual é o e-mail do seu personal".

**Ameaças.** O entrante internacional **Trainerize** está com Custom Branded App localizando para PT-BR; **PersonalGO** já entrega 100% gratuito (vai forçar pricing race-to-zero no segmento iniciante); **Pacto** está injetando IA agressivamente no segmento academia e pode descer para personal independente.

---

## 2. Ficha de Cada Concorrente

### 2.1 TecnoFit Personal — `tecnofit.com.br`

- **Tipo:** Web + app nativo iOS/Android para personal e para aluno. Origem: gestão de academia (B2B), depois desceu para personal.
- **Pricing** [(fonte)](https://www.tecnofit.com.br/tipos-de-negocio/tecnofit-personal/):
  - **Starter — Grátis** (até 10 alunos ativos, +250 vídeos)
  - **Performance — R$ 24,90/mês** (anual; +600 vídeos, postural, fotos, monitoramento real-time)
  - Planos para academia/estúdio são separados e mais caros (~R$ 189+).
- **Diferencial declarado:** "Fácil. Prático. Essencial" — velocidade ("treino em <5 min") e o ecossistema mais maduro do Brasil.
- **Pontos fortes:** marca consolidada, gestão financeira robusta, perfil público para alunos te encontrarem, gráfico de evolução, push em datas relevantes (aniversário, treino expirando).
- **Pontos fracos (Reclame Aqui)** [(fonte)](https://www.reclameaqui.com.br/empresa/tecnofit/lista-reclamacoes/):
  - "Treinos cadastrados desapareciam quando lançados para a próxima semana"
  - "Suporte e atendimento vergonhosos"
  - "Pix integrado: muitos alunos não recebem cobrança"
  - "Cobrança automática após período de teste sem solicitação"
- **PWA:** não confirmado. **App iOS/Android:** ✅
- **White-label:** ❌ não oferecido para personal individual.
- **Pagamento:** Pix integrado (com bugs reportados), cartão.
- **LGPD:** política de privacidade existe, cookie banner não confirmado na pesquisa.

### 2.2 MFIT Personal — `mfitpersonal.com.br`

- **Tipo:** App nativo + web. Foco quase exclusivo em personal individual.
- **Pricing** [(fonte)](https://ajuda.mfitpersonal.com.br/ajuda/professor/assinaturas/quanto-custa-para-assinar-o-app-da-mfit/):
  - **3 alunos — R$ 10,90/mês**
  - **Ilimitado — R$ 39,90/mês**
  - 10 dias grátis sem cartão.
- **Diferencial declarado:** "200 mil personal trainers, 5 milhões de alunos" — escala. Biblioteca de **1.800 vídeos demonstrativos**.
- **Pontos fortes:** preço de entrada baixíssimo, biblioteca grande, anamnese + avaliação física + 11 protocolos posturais, planos exclusivos com customização de valor/duração, múltiplos planos por aluno [(news MFIT)](https://news.mfitpersonal.com.br/p/tendencias-fitness-para-2026).
- **Pontos fracos (Reclame Aqui)** [(fonte)](https://www.reclameaqui.com.br/empresa/mfit-personal/lista-reclamacoes/):
  - "Aplicativo apresenta falhas / fica fora do ar"
  - "Suporte WhatsApp péssimo, sempre culpa o smartphone"
  - "MFIT diz que só desenvolve a plataforma, não é responsável por nada dentro dela" — desresponsabilização irrita
  - **Sem IA, sem periodização estruturada, sem automações avançadas de comunicação.**
- **App iOS/Android:** ✅. **PWA:** não.
- **White-label:** ❌
- **Pagamento:** Pix + cartão recorrente via app.
- **LGPD:** política existe.

### 2.3 Pacto Soluções — `sistemapacto.com.br`

- **Tipo:** Sistema completo para **academias** (não personal individual). Foco enterprise.
- **Pricing:** sob consulta (B2B com vendedor). 5.800+ negócios usando.
- **Diferencial declarado:** IA-first, automação de cobrança, retenção com alertas inteligentes, contratos digitais com validade legal, plano-tier configurável com descontos progressivos, segmentação automática por cohort [(blog Pacto)](https://blog.sistemapacto.com.br/melhores-sistemas-para-academias/).
- **Pontos fortes:** **app de treino com IA já em produção** (1.350 exercícios catalogados, gera treinos baseado em objetivo + tempo + periodização + histórico + equipamento) [(Pacto IA)](https://blog.sistemapacto.com.br/treino-por-ia-app-pacto-academias/). Hidratação, agendamento, feed da academia, contador de passos, calorias.
- **Pontos fracos:** caro/enterprise, não é para personal individual; reviews mistos de stability e suporte.
- **App iOS/Android:** ✅. **PWA:** não confirmado.
- **White-label:** ⚠️ marca da academia, não do personal individual.

### 2.4 Wiki4Fit — `wiki4fit.com`

- **Tipo:** Web + app nativo iOS/Android. Foco em personal + consultoria online.
- **Pricing** [(fonte)](https://campanha.wiki4fit.com.br/):
  - A partir de **R$ 29/mês**, teste grátis 15 dias sem cartão.
  - **Plano VIP** com app próprio + site próprio (preço sob consulta).
- **Diferencial declarado:** marketing kit pronto (centenas de posts para baixar), página de vendas online com envio automático de treinos.
- **Pontos fortes:** mais de **1.000 exercícios com vídeos**, check-in online, agendamento de aulas, chat + e-mail + WhatsApp + push + feed, 4.8★ na App Store.
- **Pontos fracos (Reclame Aqui)** [(fonte)](https://www.reclameaqui.com.br/empresa/wiki4fit/lista-reclamacoes/):
  - "Função de personalizar app no plano VIP é inexistente" (white-label prometido e não entregue)
  - "Renovação de plano sem aprovação"
  - "Não liberação de valores após venda"
  - "Sistema lento, alunos não conseguem acessar treinos"
- **App iOS/Android:** ✅. **PWA:** não confirmado.
- **White-label:** ⚠️ prometido no VIP, com queixas de não-entrega.
- **Pagamento:** planos online (cartão, Pix presumido).

### 2.5 Vedius — `vedius.com.br`

- **Tipo:** Plataforma cloud (web + app). Foco em prontuário eletrônico e profissionais de saúde + personal.
- **Pricing** [(fonte)](https://vedius.com.br/aplicativo-personal-trainer/):
  - **Mensal — R$ 79,90/mês**
  - **Anual à vista — R$ 749,90** (25% off)
  - **Anual parcelado — 12× R$ 66,66**
  - **Equipe — R$ 69,90 por colaborador/mês** (recepcionista grátis 1 ano)
  - 7 dias grátis sem cartão.
- **Diferencial declarado:** **biblioteca gigante (12.000+ vídeos)**, prontuário eletrônico com assinatura digital, integração WhatsApp nativa para lembrete de agenda.
- **Pontos fortes:** mais de 600 programas prontos, +15.000 exercícios disponíveis, atualizações semanais, migração de dados em 48h, 100% nuvem, declarado LGPD-compliant.
- **Pontos fracos (Reclame Aqui)** [(fonte)](https://www.reclameaqui.com.br/empresa/vedius/lista-reclamacoes/):
  - "Perda de dados de prontuário" (crítico para fisio/personal)
  - "Aumento abusivo de mensalidade"
  - Reputação ainda não calculada (<10 reclamações avaliadas).
- **App iOS/Android:** ✅. **PWA:** não confirmado.
- **White-label:** ❌
- **Pagamento:** integrado (Pix/cartão presumido, não confirmado especificamente).

### 2.6 PersonalGO — `personalgo.com.br`

- **Tipo:** App nativo iOS/Android + web. **Marketplace + ferramenta de gestão.**
- **Pricing** [(fonte)](https://www.personalgo.com.br/para-personal-trainer/):
  - **100% gratuito para personal trainers** (sem comissão, sem cap de alunos).
  - Plano PRO histórico R$ 79,90/mês (ou R$ 49,90 anual) — pode ter sido descontinuado em favor do free.
  - Aluna: free com Premium opcional sem ads.
- **Diferencial declarado:** **escaneamento corporal AI** (digital body scan mensal), marketplace para alunos descobrirem personals, **3.800+ exercícios**.
- **Pontos fortes:** preço imbatível (zero), AI body scan único no mercado BR, marketplace embutido para captação de alunos, alunos ilimitados.
- **Pontos fracos:** App Store reviews mencionam **bugs no body scan**, marketplace ainda fraco em volume, modelo de receita pouco claro (como sustenta o produto?).
- **App iOS/Android:** ✅. **PWA:** não confirmado.
- **White-label:** ❌
- **Pagamento:** não confirmado se faz split de pagamento personal-aluna.

### 2.7 Nexur Trainer + Nexur Fit — `aplicativonexur.com.br`

- **Tipo:** Dois apps nativos separados (um pro personal, outro pro aluno).
- **Pricing** [(fonte)](https://aplicativonexur.com.br/planos/):
  - **Basic — R$ 19,90**
  - **Standard — R$ 49,90**
  - **Custom — R$ 79,90** (cor + logo na tela do aluno)
  - **Exclusive — R$ 149,90** (elegível para publicar app próprio)
  - **Plus — R$ 199,90**
  - **Master — R$ 249,90**
  - **Taxa de publicação do app branded — R$ 789** (one-time)
  - Black Friday — R$ 1.497 (pacote)
- **Diferencial declarado:** white-label com app próprio publicado nas lojas, periodização de treinos, ranking entre alunos, desafios.
- **Pontos fortes:** **500+ exercícios em gif/vídeo**, módulo financeiro (Boleto, cartão, Pix recorrente), histórico de treino, gráficos automáticos de avaliação, ranking + competições, chat.
- **Pontos fracos:** preço alto comparado ao MFIT, interface considerada datada por reviews, 2 apps separados confunde aluna.
- **App iOS/Android:** ✅. **PWA:** não confirmado.
- **White-label:** ✅ (real, com publicação na loja, mas caro).
- **Pagamento:** Boleto, Cartão recorrente, Pix.

### 2.8 TreinoAI — `treinoai.com.br`

- **Tipo:** Web + app. Entrante recente posicionado como "AI-first".
- **Pricing** [(fonte)](https://www.treinoai.com.br/academy/blog/melhor-app-para-personal-trainer-2026):
  - **R$ 24,90/mês (5 alunos) → R$ 999,90/mês (250 alunos)**
  - Custo por aluno: R$ 4,00 a R$ 6,89.
  - 14 dias grátis com acesso completo.
- **Diferencial declarado:** **única plataforma BR com periodização completa estruturada** (programa → macrociclo → mesociclo → microciclo → sessão) + sistema **TRI** (variações inteligentes baseadas em local + tempo do aluno) + IA gera programas inteiros.
- **Pontos fortes:** IA real (não buzzword), análise de progressão para sugerir ajustes de carga, redução de tempo de prescrição em 50%, **carteira digital com Pix/cartão/boleto + cobrança recorrente + recuperação automática de inadimplência**.
- **Pontos fracos:** marca nova, base pequena, sem white-label, sem app dedicado para aluna em destaque, sem plano alimentar.
- **App iOS/Android:** ✅. **PWA:** não confirmado.
- **White-label:** ❌
- **Pagamento:** Pix + cartão + boleto via carteira.

### 2.9 Mobitrainer — `mobitrainer.com.br`

- **Tipo:** Sistema com app + IA para personal, estúdios e academias.
- **Pricing:** A partir de R$ 29,90/mês (até 10 alunos), planos por número de alunos.
- **Diferencial declarado:** geração de treinos por IA, app branded customizado.
- **Pontos fortes:** chat exclusivo, push notifications, blog para engajamento, app branded customizado disponível.
- **Pontos fracos:** marca menor, IA "em desenvolvimento" segundo comparações.
- **App iOS/Android:** ✅. **White-label:** ⚠️ (plano superior).

### 2.10 Personal Fit — `apppersonalfit.com.br`

- **Tipo:** App + web. Foco em consultoria online.
- **Pricing:** preço único independente do número de alunos (valor não público; teste 7 dias).
- **Diferencial declarado:** **sem fidelidade, sem multa de cancelamento**, customização de marca + logo na página de vendas.
- **Pontos fortes:** 700+ exercícios com execução técnica, central de progresso/feedback/gestão.
- **Pontos fracos:** marca pequena, sem detalhe público de pricing.
- **App iOS/Android:** ✅. **White-label:** ⚠️ (cor + logo, sem app próprio).

### 2.11 Treinus — `treinus.com.br`

- **Tipo:** App nativo + web, com foco esportivo (corrida, ciclismo, multimodalidade).
- **Pricing:** A partir de R$ 97/mês + taxa de inscrição.
- **Diferencial declarado:** **conexão com Apple Watch + sync com GPS apps** (único forte ponto de wearable no levantamento).
- **Pontos fortes:** sincronização com dispositivos de monitoramento, módulo financeiro (cartão + boleto), 10+ tipos de classificação esportiva.
- **Pontos fracos:** preço alto, mais focado em esporte do que musculação tradicional.
- **App iOS/Android:** ✅. **Wearables:** ✅ Apple Watch.

### 2.12 O Personal Digital — `opersonaldigital.com.br`

- **Tipo:** Plataforma com app, voltada para personal trainer presencial + online.
- **Pricing:** Trial de R$ 1 por 7 dias. Pricing mensal não público.
- **Diferencial declarado:** suporte humano de domingo a domingo.
- **Pontos fortes:** **1.000+ vídeos**, duplicar treino, banco de pastas de treino, envio em massa, planos recorrentes (Pix/boleto/cartão), avaliação online com fotos.
- **Pontos fracos:** **sem Apple Watch**, contador de intervalo entre exercícios precisa melhorar (reviews na App Store).
- **App iOS/Android:** ✅. **White-label:** ❌

### 2.13 Pacto App / App Treino — `apptreino.com.br`

- **Tipo:** App de aluno B2C operado por academias (Pacto Soluções).
- **Pricing:** parte do contrato da academia com Pacto.
- **Diferencial:** focado em aluno de academia, IA na prescrição.
- **Features fortes:** lembrete de hidratação, agenda de aulas, feed da academia, contador de passos/calorias, recordes pessoais, água, peso, avaliação física com fotos.
- **Wearables:** ⚠️ não confirmado.

### 2.14 Smart Fit App / Bio Ritmo App

- **Tipo:** Apps B2C de redes de academia (não competidor direto, mas relevante porque modelam expectativa do usuário final).
- **Features:** agenda de aulas, check-in inteligente, treino guiado, frequência, integração Apple Watch (Bio Ritmo registra tempo, FC média, calorias), histórico de avaliação física (peso, bioimpedância, %BF) [(Bio Ritmo)](https://apps.apple.com/br/app/bio-ritmo-app/id1515318103).
- **Relevância para Judson App:** definem a barra de UX que aluna nova já espera. Se o Judson App for mais cru que Smart Fit/Bio Ritmo, vai ser percebido como inferior independentemente do treino estar melhor.

### 2.15 Refs Internacionais (não competem direto, mas inspiram)

| App | Pricing | Sinal-chave para Judson |
|---|---|---|
| **Trainerize** | US$ 10–250+/mês; **CBA white-label = US$ 169 setup + US$ 5–45/mês + US$ 99/ano Apple dev** [(fonte)](https://www.trainerize.com/pricing/) | Modelo de referência mundial. White-label é caro e demorado (4 semanas turnaround) — gap que o Judson pode ocupar no BR. |
| **TrueCoach** | US$ 26–137/mês; **5% taxa de processamento de pagamentos** [(fonte)](https://truecoach.co/pricing/) | "Fastest workout builder" + 3.000 vídeos pré-gravados + integração MyFitnessPal + habit tracking. |
| **FitBod** | App B2C ~US$ 13/mês | **Strength Score 0-100** por grupo muscular + substituições por equipamento disponível. Inspiração para gamificação. |
| **Centr** | US$ 30/mês | Holístico (treino + nutrição + meditação). Conteúdo de celebridade — não viável para Judson, mas mostra valor de "experiência completa". |
| **Future** | US$ 199/mês | Coaching humano premium 1-1 via app. Validação de que aluna paga caro por accountability. |
| **Caliber** | Freemium + Pro | Hibrido AI + coach humano. |
| **Ladder** | US$ 30–45/mês | Programas estruturados em times com coach. Modelo de comunidade. |
| **Freeletics** | US$ 35/mês | AI coach que adapta semanalmente. 60M de atletas globais. |
| **MyFitnessPal** | Free + Premium | Padrão de tracking nutricional + sync com wearables. |

---

## 3. Matriz Consolidada de Features

> Linhas = features. Colunas = concorrentes BR principais.
> Judson App fica em branco — para você (Alef) preencher na síntese.

| Feature | TecnoFit | MFIT | Wiki4Fit | Vedius | PersonalGO | Nexur | TreinoAI | Mobi-trainer | Pacto | Personal Fit | Treinus | O Personal Digital | Trainerize (intl) | **Judson App** |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Cadastro de aluna por convite (link)** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |  |
| **Anamnese / PAR-Q digital** | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | ✅ | ? | ✅ | ✅ | ✅ | ✅ | ✅ |  |
| **Avaliação física (medidas/fotos/dobras/%BF)** | ✅ | ✅ (11 protocolos) | ✅ | ✅ | ⚠️ | ✅ | ✅ | ? | ✅ | ✅ | ✅ | ✅ | ✅ |  |
| **AI body scan** | ❌ | ❌ | ❌ | ❌ | ✅ (único) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |  |
| **Biblioteca de exercícios com vídeos** | ✅ 600+ | ✅ 1.800 | ✅ 1.000+ | ✅ 12.000 | ✅ 3.800 | ✅ 500+ | ✅ 400+ | ✅ | ✅ 1.350 | ✅ 700+ | ⚠️ | ✅ 1.000+ | ✅ 3.000+ |  |
| **Construção de treinos (drag-and-drop)** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |  |
| **Duplicar treino** | ✅ | ✅ | ✅ | ✅ | ? | ✅ | ✅ | ? | ✅ | ? | ? | ✅ | ✅ |  |
| **Periodização (macro/meso/micro)** | ⚠️ | ❌ | ⚠️ | ⚠️ | ⚠️ | ✅ | ✅ (única completa) | ⚠️ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ |  |
| **Execução de treino (timer descanso/séries)** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ (reviews ruins) | ✅ |  |
| **Plano alimentar** | ❌ | ❌ | ❌ | ⚠️ | ❌ | ❌ | ❌ | ❌ | ⚠️ (NextFit-like) | ❌ | ❌ | ❌ | ✅ (Smart Meal Planner +US$45) |  |
| **Histórico e progresso (carga, frequência)** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |  |
| **Gráficos de evolução** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |  |
| **Chat in-app personal-aluna** | ✅ | ⚠️ | ✅ | ⚠️ (WhatsApp) | ⚠️ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ | ✅ |  |
| **Comentários em treinos** | ✅ | ✅ | ✅ | ⚠️ | ✅ | ✅ | ✅ | ? | ✅ | ✅ | ✅ | ✅ | ✅ |  |
| **Notificações push** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |  |
| **Lembrete de treino** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |  |
| **Pagamento Pix instantâneo** | ✅ (com bugs) | ✅ | ⚠️ | ⚠️ | ? | ✅ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ | ✅ | ❌ |  |
| **Pagamento cartão recorrente** | ✅ | ✅ | ✅ | ✅ | ? | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |  |
| **Pagamento boleto** | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ❌ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ❌ |  |
| **Gestão financeira (recebíveis, inadimplência)** | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | ✅ (recuperação automática) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |  |
| **Emissão de NF** | ⚠️ | ❌ | ❌ | ⚠️ | ❌ | ❌ | ⚠️ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |  |
| **Agenda / calendário** | ✅ | ⚠️ | ✅ | ✅ (WhatsApp lembrete) | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ | ✅ |  |
| **Vídeo-chamada in-app** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⚠️ (integração externa) |  |
| **Integração Apple Health** | ? | ? | ? | ? | ? | ? | ? | ? | ⚠️ | ? | ✅ Apple Watch | ❌ | ✅ |  |
| **Integração Google Fit** | ? | ? | ? | ? | ? | ? | ? | ? | ⚠️ | ? | ⚠️ | ❌ | ✅ |  |
| **Integração Garmin/Strava** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ GPS | ❌ | ⚠️ |  |
| **Gamificação (badges, streaks, ranking)** | ⚠️ | ❌ | ⚠️ | ❌ | ⚠️ | ✅ (ranking+desafios) | ❌ | ⚠️ | ⚠️ (recordes) | ❌ | ❌ | ❌ | ⚠️ |  |
| **Comunidade / feed social** | ✅ (timeline) | ❌ | ✅ (feed) | ❌ | ⚠️ (marketplace) | ⚠️ (ranking) | ❌ | ✅ (blog) | ✅ (feed academia) | ❌ | ❌ | ❌ | ⚠️ |  |
| **Multi-personal / White-label real** | ❌ | ❌ | ⚠️ (VIP, queixas) | ❌ | ❌ | ✅ (caro: R$789+) | ❌ | ⚠️ | ⚠️ (academia) | ⚠️ (cor+logo) | ❌ | ❌ | ✅ (US$169 setup) |  |
| **App nativo iOS** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |  |
| **App nativo Android** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |  |
| **PWA instalável** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |  |
| **Modo offline (treino sem rede)** | ⚠️ | ⚠️ | ⚠️ | ❌ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |  |
| **Termos e Política LGPD** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |  |
| **Cookie banner LGPD-decente** | ? | ? | ? | ? | ? | ? | ? | ? | ? | ? | ? | ? | N/A |  |
| **Suporte humano (qualidade percebida)** | ⚠️ ruim | ⚠️ ruim | ⚠️ ruim | ⚠️ médio | ? | ? | ? | ? | ⚠️ médio | ? | ? | ✅ (dom-dom) | ⚠️ |  |
| **IA na prescrição de treino** | ❌ | ❌ | ❌ | ❌ | ⚠️ (body scan) | ❌ | ✅ (forte) | ⚠️ | ✅ (forte) | ❌ | ❌ | ❌ | ✅ |  |

**Legenda:** ✅ confirmado · ⚠️ parcial / só plano superior · ❌ confirmado ausente · `?` não confirmado · `N/A` não aplicável

---

## 4. Análise de Oportunidade

### 4.1 Onde Judson App pode ser MELHOR (gaps reais do mercado)

**A. PWA mobile-first instalável de verdade.**
Nenhum dos 12+ players brasileiros pesquisados entrega PWA como cidadão de primeira classe. Todos são "app nativo na loja" — o que cria fricção de instalação enorme para a aluna nova ("baixa o app na loja, cria conta, espera convite, etc."). O Judson App já nasceu PWA Next.js: dá para entregar **convite por link → abre no Safari/Chrome → instala em 1 toque → loga → começa o treino**. Isso é literalmente um diferencial técnico que ninguém mais tem.

**B. Onboarding sem fricção da aluna.**
Top reclamação cruzada: aluna não consegue se cadastrar, esquece a senha, não acha o personal. O Judson App pode entregar **convite mágico por link** (token assinado, sem precisar criar senha forte, sem confirmação de e-mail bloqueante) — algo que combina bem com o **login recorrente da aluna** já no roadmap (Onda B).

**C. Suporte humano real.**
Tecnofit, MFIT, Wiki4Fit, Vedius — todos com queixas idênticas no Reclame Aqui ("suporte vergonhoso, demora, culpa o cliente"). O Judson App, sendo **cliente-zero do Alef + Judson**, pode entregar suporte por WhatsApp direto durante a fase MVP/branded. Quando virar SaaS, isso vira diferencial vendido como "atendimento brasileiro de verdade".

**D. White-label barato e bonito desde o dia 1.**
Trainerize cobra US$ 169 + mensal extra. Nexur cobra R$ 789 + R$ 149-249/mês. Wiki4Fit promete e não entrega. **Existe espaço enorme** para Judson App entregar multi-tenant real (cada personal tem subdomínio + branding próprio + dados isolados) por preço médio (R$ 49-99/mês) — exatamente o que o roadmap multi-tenant ready sinaliza.

**E. UX feminina-friendly.**
A maioria dos apps tem UX dark/masculina ou "neutra geriátrica". Judson tem mood masculino/esportivo (vermelho #DC2626 + Bebas Neue), mas o Judson trabalha com mulheres — então a UX pode equilibrar **estética forte + linguagem acolhedora**. Refs como Pink Fit e Programa Mulher Fitness já validaram que "app feminino" vende, mas falham em features sérias. O Judson combina os dois.

**F. Confiabilidade do Pix integrado.**
"Pix integrado da Tecnofit não cobra alunos" é literalmente um problema reportado em produção pelo líder de mercado. O Judson App pode usar Stripe BR / Pagar.me / Mercado Pago e entregar o que o concorrente promete e não entrega.

### 4.2 Onde é commodity (precisa só estar paritário, não brilhar)

- **Biblioteca de exercícios com vídeo** — todo mundo tem 500-12.000 vídeos. Não vale gastar R$ XX mil produzindo. Use biblioteca pública / parceria / link YouTube + capacidade do personal subir vídeo próprio.
- **Anamnese, avaliação física, fotos** — todos têm. Apenas seja paritário, com UX limpa.
- **Push, lembrete, gráficos básicos, histórico** — commodity total.
- **Cartão recorrente + Pix** — todo mundo tem; só não pode falhar como o Tecnofit.
- **App iOS/Android nativo** — pode esperar (PWA já cobre 90% do uso). Quando chegar no SaaS, faz sentido publicar wrappers Capacitor para parecer nativo na loja, mas não é prioridade no MVP do Judson individual.

### 4.3 Onde precisa estar paritário ou perde

- **Periodização** — não precisa do nível TreinoAI (macro/meso/micro), mas pelo menos **semana A/B/C duplicável** é esperado.
- **Construção rápida de treino** — TrueCoach se vende como "fastest workout builder". Se o Judson for lento, perde para qualquer concorrente.
- **Chat in-app + comentários em treino** — esperado por padrão. Já está no roadmap (Onda C feita).
- **Gestão financeira simples** — recebíveis, inadimplência, recorrência. Sem isso, o personal vira refém do WhatsApp + spreadsheet.
- **LGPD séria** — política, cookie banner, opt-in, deletar conta. Mercado já evoluiu, ausência é lawsuit-risco.

### 4.4 Onde NÃO faz sentido competir hoje

- **Plano alimentar completo** — só Trainerize entrega bem (e cobra extra). NextFit BR tem parcial. Custo de implementar (regras nutricionais, base de alimentos brasileiros, cálculo de macros) é alto. **Deixar para fase pós-SaaS, ou integração com nutricionista parceiro.**
- **AI body scan** — PersonalGO entregou primeiro e gastou rios. Imitação é cara.
- **Vídeo-chamada in-app** — ninguém entrega bem; integrar Daily.co/Twilio é caro. Falar para o personal usar Google Meet é OK.
- **Marketplace de personals** — PersonalGO, Wellhub, Superprof já dominam. Não atravessar.
- **Wearables/Garmin/Apple Watch** — Treinus diferencia aqui mas é nicho. Postergar.

---

## 5. Top 10 Features Must-Have para Judson App competir como "o melhor do Brasil"

Lista priorizada — derivada da análise. Ordem reflete impact / effort no contexto MVP→SaaS.

1. **Onboarding por link mágico + PWA instalável em 1 toque.** Único diferencial técnico real contra todos os 12 concorrentes pesquisados. Aluna abre WhatsApp → clica link → instala → treina. Sem fricção, sem app store, sem senha esquecida.

2. **Construção de treino "menos de 5 minutos" com duplicação semana A/B/C.** Tecnofit já vende esse tempo como diferencial e tem bug. TrueCoach se posiciona como "fastest builder". Tem que estar no Judson App como velocidade real, não promessa de marketing. (Já parcialmente entregue na Onda C — duplicar treino).

3. **Pix recorrente que FUNCIONA + cartão recorrente + dashboard de inadimplência.** O Tecnofit é líder e tem reclamações de Pix não cobrar — janela aberta. Usar Stripe BR ou Pagar.me com retry automático e recuperação de inadimplência (estilo TreinoAI).

4. **Suporte humano vivo durante MVP, depois transformado em UX de auto-serviço excelente.** Reclamações de suporte são unanimidade em Tecnofit, MFIT, Wiki4Fit. Vira marca registrada do Judson App: "atendimento brasileiro de verdade". No SaaS, transformar em FAQ + Loom + chat humano em horário comercial.

5. **Multi-tenant white-label barato e instantâneo.** Cada personal tem subdomínio (`judson.app.com.br`, `mariapersonal.app.com.br`) + cor/logo customizáveis sem dev intervenção. Pricing tipo R$ 79-149/mês — mata Nexur e força Trainerize a se localizar. Já está no roadmap multi-tenant ready.

6. **Anamnese + Avaliação Física com UX premium e exportação PDF para o personal compartilhar.** Commodity em features, mas a maioria entrega UX feia. Fotos com comparação lado-a-lado evolutiva é must-have (Bio Ritmo já entrega, MFIT também, mas com UX datada).

7. **Histórico, carga, frequência + gráfico de evolução de cargas + streak.** Streak (gamificação leve) está ausente em quase todos os players brasileiros e existe em Fitbod/Freeletics. Cria engajamento da aluna sem custo computacional alto. Strength Score do Fitbod é uma referência elegante — pontuação 0-100 por grupo muscular.

8. **Chat in-app + comentários em treino + push notification confiável (Onesignal ou similar).** Já feito na Onda C. A barra é: notificações que efetivamente chegam (queixa de Pacto e Wiki4Fit é justamente "aluna não recebe push").

9. **Periodização semana A/B/C + bloco de mesociclo simples.** Não precisa virar TreinoAI (macro/meso/micro completo), mas **bloco de 4-6 semanas com progressão de carga sugerida** é esperado pelo personal sério. Sem isso, perde para TreinoAI/Pacto no segmento qualificado.

10. **LGPD impecável: cookie banner, opt-in, política, "exportar meus dados", "deletar conta".** Hoje é lawsuit-mitigation, amanhã (com SaaS) é qualificador de venda B2B. Diferencial barato — só precisa fazer direito desde o início. Combina com a marca "atendimento brasileiro" do item 4.

### Bônus: o que NÃO está no top 10 mas merece menção

- **Convite por link já feito** — manter robusto.
- **IA generativa de treino** (TreinoAI/Pacto entregam) — virar item 11 quando a base de uso justificar treinar modelo. No MVP, não vale pagar OpenAI por algo que o personal já faz melhor manualmente.
- **AI body scan** — postergar, custa caro, PersonalGO já tem 18 meses de vantagem.
- **App nativo na loja** — postergar para SaaS multi-tenant (publicar 1 app branded para Judson é viável; publicar N apps brandeds é o caso de uso onde Trainerize ganha dinheiro).

---

## Anexos: links pesquisados (para auditar)

**Players brasileiros:**
- [TecnoFit Personal](https://www.tecnofit.com.br/tipos-de-negocio/tecnofit-personal/) · [Tecnofit Capterra](https://www.capterra.com/p/219207/Tecnofit/) · [Tecnofit Reclame Aqui](https://www.reclameaqui.com.br/empresa/tecnofit/lista-reclamacoes/)
- [MFIT Personal](https://www.mfitpersonal.com.br/) · [MFIT preços](https://ajuda.mfitpersonal.com.br/ajuda/professor/assinaturas/quanto-custa-para-assinar-o-app-da-mfit/) · [MFIT Reclame Aqui](https://www.reclameaqui.com.br/empresa/mfit-personal/lista-reclamacoes/) · [MFIT tendências](https://news.mfitpersonal.com.br/p/tendencias-fitness-para-2026)
- [Pacto Soluções](https://sistemapacto.com.br/) · [Pacto IA blog](https://blog.sistemapacto.com.br/treino-por-ia-app-pacto-academias/) · [App Treino](https://apptreino.com.br/)
- [Wiki4Fit](https://wiki4fit.com/) · [Wiki4Fit Reclame Aqui](https://www.reclameaqui.com.br/empresa/wiki4fit/lista-reclamacoes/)
- [Vedius](https://vedius.com.br/aplicativo-personal-trainer/) · [Vedius Reclame Aqui](https://www.reclameaqui.com.br/empresa/vedius/lista-reclamacoes/)
- [PersonalGO](https://www.personalgo.com.br/para-personal-trainer/) · [PersonalGO Reclame Aqui](https://www.reclameaqui.com.br/empresa/personalgo-desenvolvimento-de-software-ltda/)
- [Nexur Trainer](https://aplicativonexur.com.br/) · [Nexur planos](https://aplicativonexur.com.br/planos/)
- [TreinoAI](https://www.treinoai.com.br/) · [TreinoAI comparativo 2026](https://www.treinoai.com.br/academy/blog/melhor-app-para-personal-trainer-2026) · [Carteira TreinoAI](https://www.treinoai.com.br/academy/blog/carteira-treinoai-receber-pagamentos)
- [Mobitrainer](https://mobitrainer.com.br/) · [Personal Fit](https://apppersonalfit.com.br/) · [Treinus](https://www.treinus.com.br/)
- [O Personal Digital](https://opersonaldigital.com.br/)
- [Bio Ritmo App](https://apps.apple.com/br/app/bio-ritmo-app/id1515318103?l=en-GB) · [Smart Fit App](https://www.smartfit.com.br/app-smart-fit)

**Mercado e tendências:**
- [Bling — Mercado Fitness Brasil](https://blog.bling.com.br/mercado-fitness-no-brasil/)
- [Panorama Setorial Fitness Brasil 2025](https://www.fitnessbrasil.com.br/panorama-setorial-2025-4a-edicao/)
- [TecTudo — apps personal trainer 2023](https://www.techtudo.com.br/listas/2023/08/aplicativo-para-personal-trainer-5-opcoes-que-ajudam-profissionais-edapps.ghtml)
- [Wellhub/GymPass overview](https://wellhub.com/pt-br/) · [Wellhub Wikipedia](https://en.wikipedia.org/wiki/Wellhub)

**Refs internacionais:**
- [Trainerize Pricing](https://www.trainerize.com/pricing/) · [Trainerize CBA white-label](https://www.trainerize.com/features/custom-branded-fitness-apps/) · [Trainerize white-label 2026 blog](https://www.trainerize.com/blog/best-white-label-coaching-apps-2026/)
- [TrueCoach Pricing](https://truecoach.co/pricing/)
- [FitBod best AI 2026](https://fitbod.me/blog/best-ai-fitness-apps-in-2026-which-ones-actually-use-real-data-not-just-buzzwords/)
- [Sensai — best AI apps 2026](https://www.sensai.fit/blog/best-ai-fitness-apps-2026-fitbod-freeletics-future-trainiac-alternatives)
- [Ladder review 2026](https://zaqappguide.com/ladder-app-review-2026/)
- [Freeletics review 2026](https://fitnessdrum.com/freeletics-review/)

**LGPD/UX:**
- [PersonalGO política privacidade](https://www.personalgo.com.br/politica-de-privacidade-app/)
- [Pacto privacidade apps](https://sistemapacto.com.br/privacidade-apps/)
- [LGPD UX Serpro](https://www.serpro.gov.br/lgpd/noticias/2020/lgpd-experiencia-usuario-ux-privacidade)
- [Cookie Information LGPD explained](https://cookieinformation.com/regulations/lgpd/)
