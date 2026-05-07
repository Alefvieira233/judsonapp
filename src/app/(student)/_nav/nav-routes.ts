import {
  HomeIcon,
  DumbbellIcon,
  MessageCircleIcon,
  UserIcon,
  type LucideIcon,
} from "lucide-react";

export type StudentNavItem = {
  href: string;
  segment: string;
  label: string;
  icon: LucideIcon;
};

export const STUDENT_NAV_ITEMS: StudentNavItem[] = [
  { href: "/home",    segment: "home",    label: "Hoje",       icon: HomeIcon },
  { href: "/treinos", segment: "treinos", label: "Treinos",    icon: DumbbellIcon },
  { href: "/feed",    segment: "feed",    label: "Comunidade", icon: MessageCircleIcon },
  { href: "/perfil",  segment: "perfil",  label: "Perfil",     icon: UserIcon },
];

export function activeStudentSegment(pathname: string): string {
  return pathname.split("/")[1] ?? "";
}
