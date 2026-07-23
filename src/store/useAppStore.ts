import { create } from "zustand";
import type { JournalEntry } from "@/types";

type Theme = "dark" | "light";
type Role = "learner" | "admin";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AppState {
  sidebarCollapsed: boolean;
  theme: Theme;
  query: string;
  subnettingScore: number;
  subnettingAttempts: number;
  progressResetVersion: number;
  token: string | null;
  user: AuthUser | null;
  journal: JournalEntry;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  setQuery: (query: string) => void;
  setSession: (token: string, user: AuthUser) => void;
  logout: () => void;
  setSubnettingScore: (score: number) => void;
  resetLocalProgress: () => void;
  updateJournal: (journal: Partial<JournalEntry>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  theme: (typeof localStorage !== "undefined" ? localStorage.getItem("ccna-theme") : null) === "light" ? "light" : "dark",
  query: "",
  subnettingScore: Number(typeof localStorage !== "undefined" ? localStorage.getItem("ccna-subnetting-score") ?? 0 : 0),
  subnettingAttempts: Number(typeof localStorage !== "undefined" ? localStorage.getItem("ccna-subnetting-attempts") ?? 0 : 0),
  progressResetVersion: Number(typeof localStorage !== "undefined" ? localStorage.getItem("ccna-progress-reset-version") ?? 0 : 0),
  token: typeof localStorage !== "undefined" ? localStorage.getItem("ccna-token") : null,
  user: typeof localStorage !== "undefined" && localStorage.getItem("ccna-user") ? JSON.parse(localStorage.getItem("ccna-user") ?? "null") : null,
  journal: {
    todayStudy: "OSPF neighbor states and VLAN trunk verification",
    hours: 2.5,
    topics: "OSPF, VLAN, Subnetting",
    commands: "show ip ospf neighbor, show interfaces trunk, show ip route",
    problems: "Mixed up OSPF two-way and full state on broadcast links.",
    goals: "Finish ACL wildcard drills and build NAT overload lab.",
    mentorNotes: "Focus on proving each fix with show commands before moving on."
  },
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  toggleTheme: () =>
    set((state) => {
      const theme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("ccna-theme", theme);
      return { theme };
    }),
  setQuery: (query) => set({ query }),
  setSession: (token, user) => {
    localStorage.setItem("ccna-token", token);
    localStorage.setItem("ccna-user", JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem("ccna-token");
    localStorage.removeItem("ccna-user");
    set({ token: null, user: null });
  },
  setSubnettingScore: (score) =>
    set((state) => {
      localStorage.setItem("ccna-subnetting-score", String(score));
      localStorage.setItem("ccna-subnetting-attempts", String(state.subnettingAttempts + 1));
      return { subnettingScore: score, subnettingAttempts: state.subnettingAttempts + 1 };
    }),
  resetLocalProgress: () =>
    set((state) => {
      const nextVersion = state.progressResetVersion + 1;
      localStorage.setItem("ccna-subnetting-score", "0");
      localStorage.setItem("ccna-subnetting-attempts", "0");
      localStorage.setItem("ccna-progress-reset-version", String(nextVersion));
      return {
        subnettingScore: 0,
        subnettingAttempts: 0,
        progressResetVersion: nextVersion,
        journal: {
          todayStudy: "",
          hours: 0,
          topics: "",
          commands: "",
          problems: "",
          goals: "",
          mentorNotes: ""
        }
      };
    }),
  updateJournal: (journal) => set((state) => ({ journal: { ...state.journal, ...journal } }))
}));
