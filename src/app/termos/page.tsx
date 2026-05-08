import Link from "next/link";

import { LGPD_TERMS_VERSION } from "@/lib/consent";

export const metadata = {
  title: "Termos de uso",
  description: "Termos de uso do app Judson Lobato.",
};

// ⚠ ESTE TEXTO PRECISA DE REVISÃO JURÍDICA antes do lançamento público.
// Bumpa LGPD_TERMS_VERSION em src/lib/consent quando mudar materialmente.

export default function TermsPage() {
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
          Termos
        </span>
        <h1 className="font-display text-4xl leading-[0.9]">Termos de uso</h1>
        <p className="text-xs text-muted-foreground">
          Versão {LGPD_TERMS_VERSION} · vigência a partir do uso.
        </p>
      </header>

      <section className="flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          Ao usar este aplicativo (&quot;app&quot;) você concorda com os termos
          abaixo. O app é um espaço privado entre o personal trainer{" "}
          <strong className="text-foreground">Judson Lobato</strong> (&quot;personal&quot;)
          e suas alunas (&quot;usuárias&quot;) para acompanhamento de treinos
          e comunidade.
        </p>

        <h2 className="font-display text-xl text-foreground">1. Aceite</h2>
        <p>
          Ao marcar a caixa de aceite no convite, ao usar o login recorrente
          ou ao acessar qualquer funcionalidade do app, você manifesta concordância
          com estes termos e com a{" "}
          <Link
            href="/privacidade"
            className="text-foreground underline-offset-2 hover:underline"
          >
            Política de Privacidade
          </Link>
          . Se não concordar, não use o app.
        </p>

        <h2 className="font-display text-xl text-foreground">2. Cadastro</h2>
        <p>
          O acesso é por convite individual e intransferível. O personal envia
          um link único — ao abri-lo e fornecer e-mail e nome, você recebe
          um link mágico de entrada (sem senha). O convite é válido por 14 dias.
          O login recorrente exige apenas o e-mail cadastrado.
        </p>
        <p>
          Você é responsável por manter o e-mail seguro e por avisar o personal
          em caso de suspeita de acesso indevido.
        </p>

        <h2 className="font-display text-xl text-foreground">
          3. Treinos e responsabilidade
        </h2>
        <p>
          Os treinos são prescritos pelo personal com base no objetivo
          informado e na anamnese (quando preenchida). Antes de iniciar
          qualquer programa, é{" "}
          <strong className="text-foreground">
            recomendado consultar um médico
          </strong>
          . Este app não substitui acompanhamento médico nem prescrição clínica.
        </p>
        <p>
          A usuária declara estar apta à prática de atividade física, ou
          informará no app caso não esteja, isentando o personal e o app
          de responsabilidade por agravos pré-existentes não declarados.
          A execução dos exercícios é de responsabilidade da própria usuária.
        </p>

        <h2 className="font-display text-xl text-foreground">
          4. Comunidade e conteúdo
        </h2>
        <p>
          Posts, comentários e reações na comunidade ficam visíveis para
          outras usuárias do mesmo personal. <strong className="text-foreground">É proibido</strong>:
        </p>
        <ul className="list-disc pl-5">
          <li>Conteúdo ofensivo, discriminatório, ilegal ou que viole direitos de terceiros.</li>
          <li>Postar imagem ou áudio de outra pessoa sem consentimento.</li>
          <li>Conteúdo comercial, publicitário ou spam.</li>
          <li>Compartilhar treinos prescritos pelo personal com terceiros.</li>
        </ul>
        <p>
          O personal pode editar ou remover qualquer conteúdo que viole estas
          regras, inclusive sem aviso prévio em casos graves.
        </p>

        <h2 className="font-display text-xl text-foreground">
          5. Propriedade intelectual
        </h2>
        <p>
          Todo o conteúdo prescrito (treinos, vídeos, instruções, planos
          alimentares quando houver) é propriedade intelectual exclusiva do
          personal trainer Judson Lobato. A licença concedida à usuária é
          pessoal, intransferível, não-exclusiva e revogável — limitada ao
          uso dentro do app durante o período de assinatura.
        </p>
        <p>
          Ao publicar conteúdo na comunidade (texto, foto, vídeo, comentário),
          você concede ao personal uma licença não-exclusiva, gratuita e
          mundial para exibi-lo dentro do app pra outras usuárias do mesmo
          personal. Você mantém a propriedade do que publica e pode pedir
          remoção a qualquer momento.
        </p>

        <h2 className="font-display text-xl text-foreground">
          6. Pagamento e inadimplência
        </h2>
        <p>
          Os planos pagos são contratados diretamente com o personal. Hoje
          o pagamento é processado por canais externos (PIX, transferência,
          maquininha). No futuro, pagamento via cartão e Pix recorrente
          será feito por gateways integrados — termos específicos serão
          apresentados no momento da contratação.
        </p>
        <p>
          Em caso de inadimplência, o personal pode suspender o acesso da
          usuária ao app após aviso prévio, sem que isso configure quebra
          contratual.
        </p>

        <h2 className="font-display text-xl text-foreground">
          7. Encerramento e exclusão
        </h2>
        <p>
          Você pode pedir o encerramento da conta a qualquer momento pelo
          botão{" "}
          <Link
            href="/perfil"
            className="text-foreground underline-offset-2 hover:underline"
          >
            &quot;Excluir minha conta&quot;
          </Link>{" "}
          no perfil ou por escrito ao encarregado. O perfil é desativado
          imediatamente e os dados pessoais são anonimizados em até 90 dias
          (alguns logs e dados financeiros são mantidos pelo prazo legal —
          ver Política de Privacidade).
        </p>
        <p>
          O personal pode encerrar a conta da usuária por descumprimento
          destes termos, com aviso prévio quando possível.
        </p>

        <h2 className="font-display text-xl text-foreground">
          8. Limitação de responsabilidade
        </h2>
        <p>
          O app é fornecido &quot;como está&quot;, com esforço de melhor
          uptime mas sem garantia de disponibilidade ininterrupta. O personal
          e o desenvolvedor parceiro não respondem por danos indiretos,
          lucros cessantes ou prejuízos decorrentes de:
        </p>
        <ul className="list-disc pl-5">
          <li>Falhas em provedores de hospedagem ou autenticação.</li>
          <li>Interrupções planejadas para manutenção.</li>
          <li>Uso indevido do app pela usuária ou por terceiros via dispositivos compartilhados.</li>
          <li>
            Lesões ou agravos resultantes da prática de atividade física,
            inclusive por descumprimento de orientações médicas ou da
            anamnese.
          </li>
        </ul>

        <h2 className="font-display text-xl text-foreground">
          9. Alterações dos termos
        </h2>
        <p>
          Estes termos podem ser atualizados pra refletir mudanças no app
          ou na legislação. Mudanças materiais geram nova versão (visível
          no topo da página) e novo aceite no próximo login. O uso continuado
          após a notificação implica aceite.
        </p>

        <h2 className="font-display text-xl text-foreground">
          10. Lei aplicável e foro
        </h2>
        <p>
          Estes termos são regidos pelas leis da República Federativa do
          Brasil. Fica eleito o foro da{" "}
          <strong className="text-foreground">Comarca de Macapá-AP</strong>{" "}
          para dirimir qualquer controvérsia, com renúncia a qualquer outro
          por mais privilegiado que seja.
        </p>

        <h2 className="font-display text-xl text-foreground">11. Contato</h2>
        <p>
          Dúvidas? Fala direto com o Judson pelo WhatsApp listado no perfil
          dele dentro do app, ou com o encarregado em{" "}
          <a
            href="mailto:privacidade@judsonlobato.com.br"
            className="text-foreground underline-offset-2 hover:underline"
          >
            privacidade@judsonlobato.com.br
          </a>
          .
        </p>
      </section>
    </main>
  );
}
