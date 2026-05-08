import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <section className="flex flex-1 flex-col gap-7 px-5 pb-8 pt-6">
      <header className="flex flex-col items-center gap-5 rounded-3xl border border-border bg-card/40 px-5 pb-6 pt-7">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-24 w-32 md:h-28 md:w-40" />
        <Skeleton className="h-3 w-28" />
        <div className="flex w-full justify-center gap-2">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
        <Skeleton className="h-13 w-full" />
      </header>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/30 p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-8" />
        </div>
        <div className="flex items-end justify-between gap-2">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <Skeleton className="h-9 w-full rounded-md" />
              <Skeleton className="h-2 w-3" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/40 p-5">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-32" />
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </section>
  );
}
