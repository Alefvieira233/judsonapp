export const metadata = {
  title: "Sem conexão",
};

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
        Sem internet
      </span>
      <h1 className="font-display text-5xl leading-none">Você está offline</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Reconecte pra continuar treinando. Seus dados sincronizam assim que voltar.
      </p>
    </main>
  );
}
