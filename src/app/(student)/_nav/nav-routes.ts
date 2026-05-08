import {
  HomeIcon,
  DumbbellIcon,
  MessageCircleIcon,
  SendIcon,
  UserIcon,
  type LucideIcon,
} from "lucide-react";

export type StudentNavItem = {
  href: string;
  segment: string;
  label: string;
  icon: LucideIcon;
  // Pseudo-segment used to highlight nested routes (e.g. /perfil/chat lights
  // up the "Chat" tab even though its top segment is /perfil).
  matchPath?: string;
};

export const STUDENT_NAV_ITEMS: StudentNavItem[] = [
  { href: "/home",        segment: "home",    label: "Hoje",       icon: HomeIcon },
  { href: "/treinos",     segment: "treinos", label: "Treinos",    icon: DumbbellIcon },
  { href: "/feed",        segment: "feed",    label: "Comunidade", icon: MessageCircleIcon },
  { href: "/perfil/chat", segment: "chat",    label: "Chat",       icon: SendIcon, matchPath: "/perfil/chat" },
  { href: "/perfil",      segment: "perfil",  label: "Perfil",     icon: UserIcon },
];

export function activeStudentSegment(pathname: string): string {
  if (pathname.startsWith("/perfil/chat")) return "chat";
  return pathname.split("/")[1] ?? "";
}
