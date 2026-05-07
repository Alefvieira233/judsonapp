import { Skeleton } from "@/components/ui/skeleton";

export default function TreinoLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-5 pb-8 pt-6">
      <Skeleton className="h-3 w-16" />

      <header className="flex flex-col gap-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-9 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-32" />
      </header>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/40 p-5">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>

      <ul className="flex flex-col gap-4">
        {[0, 1, 2, 3].map((i) => (
          <li
            key={i}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card/40 p-4"
          >
            <div className="flex flex-col gap-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-7 w-2/3" />
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="flex flex-col gap-2">
              {[0, 1, 2].map((j) => (
                <Skeleton key={j} className="h-12 w-full" />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
