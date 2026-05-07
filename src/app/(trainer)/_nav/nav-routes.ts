import {
  HomeIcon,
  UsersIcon,
  DumbbellIcon,
  MessageCircleIcon,
  BookOpenIcon,
  SettingsIcon,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  segment: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", segment: "dashboard", label: "Início",     icon: HomeIcon },
  { href: "/students",  segment: "students",  label: "Alunas",     icon: UsersIcon },
  { href: "/workouts",  segment: "workouts",  label: "Treinos",    icon: DumbbellIcon },
  { href: "/community", segment: "community", label: "Comunidade", icon: MessageCircleIcon },
];

export const MORE_ITEMS: NavItem[] = [
  { href: "/exercises", segment: "exercises", label: "Exercícios", icon: BookOpenIcon },
  { href: "/settings",  segment: "settings",  label: "Ajustes",    icon: SettingsIcon },
];

export const ALL_ITEMS: NavItem[] = [...NAV_ITEMS, ...MORE_ITEMS];

export function activeSegment(pathname: string): string {
  return pathname.split("/")[1] ?? "";
}
