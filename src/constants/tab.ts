import {
  DumbbellIcon,
  HomeIcon,
  UserIcon,
  type LucideIcon,
} from "lucide-react";

export const TAB_ITEMS: Array<{
  path: string;
  label: string;
  icon: LucideIcon;
  match: (pathname: string) => boolean;
}> = [
  {
    path: "/",
    label: "홈",
    icon: HomeIcon,
    match: (pathname) => pathname === "/",
  },
  {
    path: "/session",
    label: "세션",
    icon: DumbbellIcon,
    match: (pathname) => pathname.startsWith("/session"),
  },
  {
    path: "/profile",
    label: "프로필",
    icon: UserIcon,
    match: (pathname) => pathname.startsWith("/profile"),
  },
];
