import { Skeleton } from "@/components/ui/skeleton";

export default function PlansLoading() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 md:gap-8 md:px-6 md:py-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-12 w-28" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-11 w-32" />
      </div>

      <ul className="grid gap-3 md:grid-cols-2">
        {[0, 1, 2].map((i) => (
          <li key={i} className="flex flex-col gap-3 rounded-2xl border border-border bg-card/40 p-5">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-9 w-32" />
            <ul className="flex flex-col gap-1.5">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-4/5" />
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
