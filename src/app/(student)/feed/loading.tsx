import { Skeleton } from "@/components/ui/skeleton";

export default function FeedLoading() {
  return (
    <section className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-10">
      <header className="flex flex-col gap-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
      </header>

      <ul className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <li
            key={i}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card/40 p-4"
          >
            <div className="flex flex-col gap-1">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-3/4" />
          </li>
        ))}
      </ul>
    </section>
  );
}
