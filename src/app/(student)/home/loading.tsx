import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <section className="flex flex-1 flex-col gap-8 px-6 pb-8 pt-10">
      <header className="flex flex-col gap-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-4 w-64" />
      </header>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/40 p-5">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-2 h-11 w-full" />
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
