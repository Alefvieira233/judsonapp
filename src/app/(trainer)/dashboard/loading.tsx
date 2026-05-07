import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 md:gap-10 md:px-6 md:py-12">
      <div className="rounded-3xl border border-border bg-card/40 p-6 md:p-10">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-44" />
          <Skeleton className="h-12 w-48 md:h-16 md:w-64" />
          <Skeleton className="h-4 w-72" />
          <div className="mt-3 flex gap-2">
            <Skeleton className="h-11 w-32" />
            <Skeleton className="h-11 w-32" />
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-border bg-card/40 p-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-9 w-16" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card/40 p-5 lg:col-span-2">
          <Skeleton className="h-6 w-40" />
          <ul className="mt-3 flex flex-col gap-3">
            {[0, 1, 2, 3].map((i) => (
              <li key={i} className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-full" />
                <div className="flex flex-1 flex-col gap-1.5">
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-2.5 w-1/3" />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </div>
    </main>
  );
}
