export function ComingSoon({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
        {eyebrow}
      </span>
      <h1 className="font-display text-5xl leading-[0.9]">{title}</h1>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
    </section>
  );
}
