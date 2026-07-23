import {
  Award,
  BarChart3,
  BookOpen,
  Crown,
  Gauge,
  Home,
  Library,
  ListTodo,
  Medal,
  Search,
  Settings,
  Sheet,
  TerminalSquare,
  Trophy
} from "lucide-react";
import type { NavItem } from "@/types";

export const navItems: NavItem[] = [
  { label: "Dashboard", path: "/app/dashboard", icon: Home },
  { label: "Topics", path: "/app/topics", icon: BookOpen },
  { label: "Subnetting Sheet", path: "/app/subnetting-sheet", icon: Sheet },
  { label: "Resources", path: "/app/resources", icon: Library },
  { label: "Daily Journal", path: "/app/journal", icon: ListTodo },
  { label: "Task Board", path: "/app/tasks", icon: Gauge },
  { label: "Analytics", path: "/app/analytics", icon: BarChart3 },
  { label: "Leaderboard", path: "/app/leaderboard", icon: Trophy },
  { label: "Achievements", path: "/app/achievements", icon: Award },
  { label: "Admin Track", path: "/app/admin", icon: Crown, adminOnly: true },
  { label: "Tools", path: "/app/tools", icon: TerminalSquare },
  { label: "Profile", path: "/app/profile", icon: Medal },
  { label: "Settings", path: "/app/settings", icon: Settings },
  { label: "Search", path: "/app/search", icon: Search }
];
