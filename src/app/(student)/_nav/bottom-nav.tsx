import { cn } from "@/lib/utils";

import { StudentNavLink } from "./nav-link";
import { STUDENT_NAV_ITEMS } from "./nav-routes";

export function StudentBottomNav({ className }: { className?: string }) {
  return (
    <nav
      aria-label="Navegação principal"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-card/80",
        className,
      )}
    >
      <ul className="grid grid-cols-4">
        {STUDENT_NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <StudentNavLink item={item} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
