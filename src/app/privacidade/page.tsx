import Link from "next/link";

import { LGPD_POLICY_VERSION } from "@/lib/consent";

export const metadata = {
  title: "Política de privacidade",
  description: "Como tratamos os dados das alunas no app Judson Lobato.",
};

// ⚠ ESTE TEXTO PRECISA DE REVISÃO JURÍDICA antes do lançamento público.
// Foi redigido pra cobrir os elementos exigidos pela LGPD (Lei 13.709/18) com
// linguagem amigável, mas não substitui parecer de advogado especializado.
// Quando atualizar materialmente, bumpa LGPD_POLICY_VERSION em src/lib/consent.

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-12">
      <Link
        href="/"
        className="text-xs text-muted-foreground hover:text-foreground"
      >
        ← Voltar
      </Link>

      <header className="flex flex-col gap-1">
        <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Privacidade
        </span>
        <h1 className="font-display text-4xl leading-[0.9]">
          Política de privacidade
        </h1>
        <p className="text-xs text-muted-foreground">
          Versão {LGPD_POLICY_VERSION} · LGPD (Lei 13.709/2018).
        </p>
      </header>

      <section className="flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          Esta política descreve como o app <strong className="text-foreground">Judson Lobato</strong>{" "}
          coleta, usa, armazena e protege seus dados pessoais. Lê com atenção
          — qualquer dúvida, fala com o encarregado pelos canais no fim da
          página.
        </p>

        <h2 className="font-display text-xl text-foreground">
          1. Quem é o controlador
        </h2>
        <p>
          <strong className="text-foreground">Judson Lobato</strong>, personal
          trainer (CREF 002133-G/AP), atua como controlador dos dados nos
          termos do art. 5º, VI, da LGPD. Macapá-AP, Brasil. CNPJ/CPF e
          endereço completo disponíveis sob solicitação ao encarregado.
        </p>
        <p>
          A operação técnica do app é mantida pelo desenvolvedor parceiro
          Alef Christian Vieira como operador de dados, sob instrução
          documentada do controlador.
        </p>

        <h2 className="font-display text-xl text-foreground">
          2. Encarregado pelo tratamento (DPO)
        </h2>
        <p>
          Para exercer direitos LGPD ou tirar dúvidas sobre privacidade,
          procura o encarregado por escrito:
        </p>
        <ul className="list-disc pl-5">
          <li>
            E-mail:{" "}
            <a
              href="mailto:privacidade@judsonlobato.com.br"
              className="text-foreground underline-offset-2 hover:underline"
            >
              privacidade@judsonlobato.com.br
            </a>
          </li>
          <li>WhatsApp do personal (canal informal, com prazo limitado de resposta).</li>
        </ul>

        <h2 className="font-display text-xl text-foreground">
          3. Dados que tratamos
        </h2>
        <ul className="list-disc pl-5">
          <li>
            <strong className="text-foreground">Cadastrais:</strong> nome
            completo, e-mail, telefone, foto de perfil opcional, data de
            nascimento (quando informada).
          </li>
          <li>
            <strong className="text-foreground">Saúde e treinamento</strong>{" "}
            (categoria sensível, art. 5º, II): objetivo, observações,
            anamnese (lesões, condições, medicamentos), histórico de
            treinos, séries marcadas, carga, percepção de esforço (RPE),
            avaliação física (peso, medidas, %BF) e fotos de progresso —
            quando você fornece.
          </li>
          <li>
            <strong className="text-foreground">Conteúdo:</strong> posts,
            comentários e reações que você publica na comunidade.
          </li>
          <li>
            <strong className="text-foreground">Técnicos:</strong> IP,
            user-agent, eventos de erro/performance, logs de acesso. Usados
            só pra segurança e estabilidade.
          </li>
        </ul>

        <h2 className="font-display text-xl text-foreground">
          4. Bases legais (art. 7º e art. 11)
        </h2>
        <ul className="list-disc pl-5">
          <li>
            <strong className="text-foreground">Execução de contrato</strong>{" "}
            (art. 7º, V) — pra prestar o serviço de acompanhamento de treinos
            que você contratou.
          </li>
          <li>
            <strong className="text-foreground">Consentimento</strong>{" "}
            (art. 7º, I e art. 11, I) — pra dados de saúde e qualquer
            tratamento opcional. Marcar a caixa de aceite no convite e/ou
            fornecer dados de saúde no app constitui consentimento livre e
            específico.
          </li>
          <li>
            <strong className="text-foreground">Legítimo interesse</strong>{" "}
            (art. 7º, IX) — pra logs técnicos de segurança e prevenção a fraude.
          </li>
          <li>
            <strong className="text-foreground">Cumprimento de obrigação legal</strong>{" "}
            (art. 7º, II) — pra manter registros mínimos exigidos pela
            legislação aplicável (financeira, fiscal, defesa em processos).
          </li>
        </ul>

        <h2 className="font-display text-xl text-foreground">
          5. Como usamos seus dados
        </h2>
        <ul className="list-disc pl-5">
          <li>Permitir o acompanhamento dos treinos pelo personal.</li>
          <li>Mostrar histórico, métricas e progressão dentro do app.</li>
          <li>
            Manter a comunidade da equipe — posts e curtidas são vistos por
            outras usuárias do mesmo personal, nunca por terceiros.
          </li>
          <li>
            Enviar notificações relacionadas ao serviço (lembrete de treino,
            atualizações importantes). Você pode desativar a qualquer momento.
          </li>
          <li>
            Diagnosticar erros e melhorar o app — agregando dados de uso de
            forma anonimizada.
          </li>
        </ul>
        <p>
          <strong className="text-foreground">Não usamos seus dados</strong>{" "}
          pra publicidade, perfilamento comercial, ou treinamento de modelos
          de IA externos.
        </p>

        <h2 className="font-display text-xl text-foreground">
          6. Compartilhamento e operadores
        </h2>
        <p>
          Não vendemos nem licenciamos seus dados. Trabalhamos com os seguintes
          operadores e subprocessadores, todos sob contrato com cláusulas LGPD:
        </p>
        <ul className="list-disc pl-5">
          <li>
            <strong className="text-foreground">Supabase Inc.</strong> — banco
            de dados e autenticação. Servidores localizados nos EUA. Dados
            criptografados em trânsito e em repouso.
          </li>
          <li>
            <strong className="text-foreground">Vercel Inc.</strong> —
            hospedagem do app. Servidores localizados nos EUA, com CDN global.
          </li>
          <li>
            <strong className="text-foreground">Upstash Inc.</strong> —
            limitação de taxa (rate-limit) anti-abuso. Armazena somente
            chaves técnicas, não dados pessoais.
          </li>
          <li>
            <strong className="text-foreground">Sentry Inc.</strong> (quando
            ativo) — coleta de erros técnicos para diagnóstico, com
            mascaramento de campos sensíveis.
          </li>
        </ul>

        <h2 className="font-display text-xl text-foreground">
          7. Transferência internacional (art. 33)
        </h2>
        <p>
          Por usar Supabase e Vercel, parte do tratamento ocorre nos EUA.
          A transferência se baseia em (i) execução de contrato com você
          (art. 33, V) e (ii) cláusulas contratuais padrão entre os
          operadores e o controlador. Você consente expressamente com essa
          transferência ao aceitar esta política.
        </p>

        <h2 className="font-display text-xl text-foreground">
          8. Tempo de retenção
        </h2>
        <ul className="list-disc pl-5">
          <li>
            <strong className="text-foreground">Cadastro e treinos:</strong>{" "}
            enquanto você for aluna ativa. Após encerramento do vínculo, o
            perfil é desativado em até 7 dias e excluído ou anonimizado em
            até 90 dias mediante solicitação.
          </li>
          <li>
            <strong className="text-foreground">Logs técnicos e auditoria:</strong>{" "}
            até 12 meses. Os registros de consentimento são mantidos pelo
            mesmo período, como prova de cumprimento da LGPD.
          </li>
          <li>
            <strong className="text-foreground">Dados financeiros</strong>{" "}
            (futuro, quando ativarmos pagamento integrado): pelo prazo legal
            mínimo (5 anos) após a última transação, conforme legislação
            tributária.
          </li>
        </ul>

        <h2 className="font-display text-xl text-foreground">
          9. Seus direitos (art. 18)
        </h2>
        <p>Você pode, a qualquer momento, exercer:</p>
        <ul className="list-disc pl-5">
          <li>Confirmação da existência de tratamento.</li>
          <li>Acesso aos dados.</li>
          <li>Correção de dados incompletos, inexatos ou desatualizados.</li>
          <li>Anonimização, bloqueio ou eliminação de dados desnecessários.</li>
          <li>
            <strong className="text-foreground">Portabilidade</strong> —
            exporta tudo em JSON pelo botão{" "}
            <Link
              href="/perfil"
              className="text-foreground underline-offset-2 hover:underline"
            >
              &quot;Exportar meus dados&quot;
            </Link>{" "}
            no perfil.
          </li>
          <li>
            <strong className="text-foreground">Eliminação</strong> dos dados
            tratados com base em consentimento (botão{" "}
            <Link
              href="/perfil"
              className="text-foreground underline-offset-2 hover:underline"
            >
              &quot;Excluir minha conta&quot;
            </Link>{" "}
            no perfil).
          </li>
          <li>Informação sobre compartilhamentos.</li>
          <li>Revogação do consentimento.</li>
        </ul>
        <p>
          Pedidos por escrito ao encarregado são respondidos em até 15 dias.
        </p>

        <h2 className="font-display text-xl text-foreground">
          10. Cookies e tecnologias similares
        </h2>
        <p>
          Usamos apenas cookies estritamente necessários para manter a
          sessão de login. O service worker do app armazena em cache
          recursos públicos (imagens, scripts, manifest) pra funcionar offline
          — nunca páginas autenticadas. Não usamos cookies de rastreamento
          publicitário, nem pixels de redes sociais.
        </p>

        <h2 className="font-display text-xl text-foreground">
          11. Segurança
        </h2>
        <p>
          Adotamos medidas técnicas e administrativas: criptografia em trânsito
          (TLS 1.3) e em repouso, controle de acesso por sessão autenticada,
          isolamento por tenant via row-level security do banco, headers de
          segurança (CSP, HSTS, X-Frame-Options), rate-limit em endpoints
          sensíveis e revisão regular de permissões.
        </p>

        <h2 className="font-display text-xl text-foreground">
          12. Menores de 18 anos
        </h2>
        <p>
          O app não é destinado a menores de 18 anos. Se você for menor,
          o cadastro só é válido com consentimento expresso de pelo menos
          um responsável legal, conforme art. 14 da LGPD. O personal pode
          recusar o atendimento a menores sem essa autorização.
        </p>

        <h2 className="font-display text-xl text-foreground">
          13. Alterações desta política
        </h2>
        <p>
          Podemos atualizar esta política para refletir mudanças no app ou na
          legislação. Mudanças materiais geram nova versão (visível no topo)
          e novo aceite no próximo login. Versão atual: {LGPD_POLICY_VERSION}.
        </p>

        <h2 className="font-display text-xl text-foreground">
          14. Reclamações
        </h2>
        <p>
          Se entender que seus direitos foram violados, você pode reclamar
          ao controlador (encarregado acima) ou diretamente à Autoridade
          Nacional de Proteção de Dados —{" "}
          <a
            href="https://www.gov.br/anpd/pt-br"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline-offset-2 hover:underline"
          >
            ANPD
          </a>
          .
        </p>
      </section>
    </main>
  );
}
