import { Skeleton } from "@/components/ui/skeleton";

export default function CommunityLoading() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 md:gap-8 md:px-6 md:py-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-12 w-44" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-11 w-28" />
      </div>

      <ul className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <li key={i} className="flex flex-col gap-3 rounded-xl border border-border bg-card/40 p-4">
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
    </div>
  );
}
