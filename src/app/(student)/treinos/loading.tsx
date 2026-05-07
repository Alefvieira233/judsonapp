import { Skeleton } from "@/components/ui/skeleton";

export default function TreinosLoading() {
  return (
    <section className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-10">
      <header className="flex flex-col gap-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-10 w-40" />
      </header>

      <ul className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <li
            key={i}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card/40 p-4"
          >
            <Skeleton className="h-7 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                <Skeleton key={d} className="size-6" />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
