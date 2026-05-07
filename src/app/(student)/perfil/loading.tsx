import { Skeleton } from "@/components/ui/skeleton";

export default function PerfilLoading() {
  return (
    <section className="flex flex-1 flex-col gap-8 px-6 pb-8 pt-10">
      <header className="flex items-center gap-4">
        <Skeleton className="size-16 rounded-2xl" />
        <div className="flex min-w-0 flex-col gap-1">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-3 w-40" />
        </div>
      </header>

      <ul className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <li
            key={i}
            className="flex flex-col gap-1 rounded-xl border border-border bg-card/40 p-3"
          >
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-7 w-12" />
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-32" />
        <ul className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </ul>
      </div>
    </section>
  );
}
