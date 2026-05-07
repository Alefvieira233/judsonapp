import Link from "next/link";

export const metadata = {
  title: "Termos de uso",
  description: "Termos de uso do app Judson Lobato.",
};

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
        <h1 className="font-display text-4xl leading-[0.9]">
          Termos de uso
        </h1>
        <p className="text-xs text-muted-foreground">
          Versão 1 · vigência a partir do uso.
        </p>
      </header>

      <section className="flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          Ao usar este aplicativo (&quot;app&quot;) você concorda com os termos
          abaixo. O app é um espaço privado entre o personal trainer Judson
          Lobato (&quot;personal&quot;) e suas alunas (&quot;usuárias&quot;)
          para acompanhamento de treinos e comunidade.
        </p>

        <h2 className="font-display text-xl text-foreground">Cadastro</h2>
        <p>
          O acesso é por convite individual. O personal envia um link único; ao
          abri-lo e fornecer email, você recebe um link de entrada — sem senha.
          O link de convite é válido por 14 dias e é único por usuária.
        </p>

        <h2 className="font-display text-xl text-foreground">
          Conteúdo e responsabilidade
        </h2>
        <p>
          Os treinos prescritos são pessoais e elaborados pelo personal com base
          no objetivo informado. Antes de iniciar qualquer programa de
          treinamento, é recomendado consultar um médico. Este app não
          substitui acompanhamento médico nem prescrição clínica.
        </p>

        <h2 className="font-display text-xl text-foreground">Comunidade</h2>
        <p>
          Posts e reações na comunidade ficam visíveis para outras usuárias do
          mesmo personal. Não publique conteúdo ofensivo, discriminatório, de
          terceiros sem permissão ou de cunho comercial. O personal pode
          remover conteúdo que viole essa diretriz.
        </p>

        <h2 className="font-display text-xl text-foreground">Encerramento</h2>
        <p>
          Você pode pedir o encerramento da sua conta a qualquer momento pelo
          WhatsApp do personal. Ao encerrar, seu perfil é desativado e seus
          treinos não ficam mais visíveis no app.
        </p>

        <h2 className="font-display text-xl text-foreground">Contato</h2>
        <p>
          Dúvidas sobre estes termos? Fale com o personal pelo WhatsApp listado
          no perfil dele dentro do app.
        </p>
      </section>
    </main>
  );
}
