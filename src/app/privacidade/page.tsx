import Link from "next/link";

export const metadata = {
  title: "Política de privacidade",
  description: "Como tratamos os dados das alunas no app Judson Lobato.",
};

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
          Versão 1 · LGPD (Lei 13.709/2018).
        </p>
      </header>

      <section className="flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
        <h2 className="font-display text-xl text-foreground">
          Quem é o controlador dos dados
        </h2>
        <p>
          O personal trainer Judson Lobato (CREF 002133-G/AP) é o controlador
          dos dados pessoais coletados neste app, conforme a LGPD.
        </p>

        <h2 className="font-display text-xl text-foreground">
          Dados que coletamos
        </h2>
        <ul className="list-disc pl-5">
          <li>Nome, email e telefone (você fornece no cadastro).</li>
          <li>Objetivo, observações e foto de perfil (opcionais).</li>
          <li>
            Treinos executados: data, duração, séries marcadas, carga e
            percepção de esforço (RPE) — registrados por você ao usar o app.
          </li>
          <li>
            Posts e reações na comunidade quando você interage com o feed.
          </li>
        </ul>

        <h2 className="font-display text-xl text-foreground">
          Como usamos seus dados
        </h2>
        <ul className="list-disc pl-5">
          <li>
            Permitir o acompanhamento dos seus treinos pelo personal.
          </li>
          <li>
            Mostrar seu histórico, métricas e progressão dentro do app.
          </li>
          <li>
            Manter a comunidade da equipe — posts e curtidas são vistos por
            outras usuárias do mesmo personal.
          </li>
        </ul>

        <h2 className="font-display text-xl text-foreground">Compartilhamento</h2>
        <p>
          Não compartilhamos seus dados com terceiros para fins comerciais.
          Operacionalmente, usamos apenas:
        </p>
        <ul className="list-disc pl-5">
          <li>
            Supabase (banco de dados e autenticação) — armazena os dados em
            infraestrutura na nuvem, com criptografia em trânsito e em repouso.
          </li>
          <li>
            Vercel (hospedagem do app) — serve o app via CDN.
          </li>
        </ul>

        <h2 className="font-display text-xl text-foreground">Seus direitos</h2>
        <p>
          Pela LGPD você pode, a qualquer momento, pedir: acesso aos seus
          dados, correção, anonimização, exclusão, portabilidade ou revogação
          de consentimento. Pedidos podem ser feitos pelo WhatsApp do personal.
        </p>

        <h2 className="font-display text-xl text-foreground">Retenção</h2>
        <p>
          Mantemos seus dados enquanto você for aluna ativa. Ao encerrar o
          vínculo, o perfil é desativado em até 7 dias e os logs anônimos
          podem ser mantidos por até 12 meses para análise estatística do
          personal.
        </p>

        <h2 className="font-display text-xl text-foreground">Cookies</h2>
        <p>
          Usamos apenas cookies estritamente necessários — mantemos a sessão de
          login. Não usamos cookies de rastreamento de terceiros nem ads.
        </p>

        <h2 className="font-display text-xl text-foreground">Contato</h2>
        <p>
          Dúvidas sobre privacidade? Fala direto com o Judson pelo WhatsApp
          dentro do app ou pela seção &quot;Falar com o personal&quot; no
          perfil.
        </p>
      </section>
    </main>
  );
}
