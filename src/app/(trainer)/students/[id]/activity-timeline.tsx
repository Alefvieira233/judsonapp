import {
  CameraIcon,
  ClipboardCheckIcon,
  DumbbellIcon,
  MessageCircleIcon,
} from "lucide-react";

import { Surface } from "@/components/ui/surface";
import { timeAgo } from "@/lib/dates";

export type TimelineItem = {
  id: string;
  type: "workout" | "photo" | "anamnese" | "comment";
  title: string;
  detail?: string | null;
  ts: string;
};

const ICON: Record<TimelineItem["type"], React.ReactNode> = {
  workout: <DumbbellIcon className="size-4" />,
  photo: <CameraIcon className="size-4" />,
  anamnese: <ClipboardCheckIcon className="size-4" />,
  comment: <MessageCircleIcon className="size-4" />,
};

export function ActivityTimeline({ items }: { items: TimelineItem[] }) {
  if (items.length === 0) return null;
  return (
    <Surface className="flex flex-col gap-3 p-4">
      <h2 className="font-display text-lg leading-none">Última atividade</h2>
      <ul className="flex flex-col gap-2">
        {items.slice(0, 5).map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-[var(--brand-primary)]/15 text-[var(--brand-primary)]">
              {ICON[item.type]}
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium leading-tight">
                {item.title}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {timeAgo(item.ts)}
                {item.detail ? ` · ${item.detail}` : ""}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Surface>
  );
}
