import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AppLayout } from "@/layouts/AppLayout";
import { LandingPage } from "@/pages/LandingPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { RoadmapPage } from "@/pages/RoadmapPage";
import { ResourcesPage } from "@/pages/ResourcesPage";
import { JournalPage } from "@/pages/JournalPage";
import { TaskBoardPage } from "@/pages/TaskBoardPage";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import { LeaderboardPage } from "@/pages/LeaderboardPage";
import { AchievementsPage } from "@/pages/AchievementsPage";
import { ToolsPage } from "@/pages/ToolsPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { SearchPage } from "@/pages/SearchPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { SubnettingSheetPage } from "@/pages/SubnettingSheetPage";
import { LoginPage } from "@/pages/LoginPage";
import { AdminDashboardPage } from "@/pages/AdminDashboardPage";
import { useAppStore } from "@/store/useAppStore";

export function AppRouter() {
  return (
    <HashRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/app" element={<ProtectedApp />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="roadmap" element={<Navigate to="/app/topics" replace />} />
            <Route path="topics" element={<RoadmapPage compact />} />
            <Route path="subnetting-sheet" element={<SubnettingSheetPage />} />
            <Route path="resources" element={<ResourcesPage />} />
            <Route path="journal" element={<JournalPage />} />
            <Route path="tasks" element={<TaskBoardPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
            <Route path="achievements" element={<AchievementsPage />} />
            <Route path="tools" element={<ToolsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="admin" element={<AdminDashboardPage />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </HashRouter>
  );
}

function ProtectedApp() {
  const user = useAppStore((state) => state.user);
  if (!user) return <Navigate to="/" replace />;
  return <AppLayout />;
}
