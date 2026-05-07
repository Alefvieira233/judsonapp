import { Skeleton } from "@/components/ui/skeleton";

export default function WorkoutsLoading() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 md:gap-8 md:px-6 md:py-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-4 w-52" />
        </div>
        <Skeleton className="h-11 w-36" />
      </div>

      <ul className="flex flex-col gap-3">
        {[0, 1, 2, 3].map((i) => (
          <li key={i} className="flex flex-col gap-3 rounded-xl border border-border bg-card/40 p-4">
            <Skeleton className="h-7 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                <Skeleton key={d} className="size-7" />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
