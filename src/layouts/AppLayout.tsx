import { Outlet, useLocation, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bell, ChevronLeft, ChevronRight, Command, LogOut, Menu, Moon, Network, Search, Sparkles, Sun, X } from "lucide-react";
import { motion } from "framer-motion";
import { navItems } from "@/constants/navigation";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/utils/cn";

export function AppLayout() {
  const { sidebarCollapsed, toggleSidebar, query, setQuery, toggleTheme, theme, user, logout } = useAppStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const adminAllowedPaths = ["/app/admin", "/app/settings", "/app/search"];
    if (user?.role === "admin" && !adminAllowedPaths.includes(location.pathname)) {
      navigate("/app/admin", { replace: true });
    }
  }, [location.pathname, navigate, user?.role]);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  const visibleNavItems = navItems.filter((item) => {
    if (item.adminOnly) return user?.role === "admin";
    if (user?.role === "admin") return ["/app/settings", "/app/search"].includes(item.path);
    return true;
  });

  const sidebarContent = (
    <div className="flex h-full flex-col p-4">
      <div className="mb-5 flex items-center justify-between">
        <NavLink to="/" className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-cyan-300 to-fuchsia-400 text-zinc-950 shadow-[0_0_40px_rgba(34,211,238,0.25)]">
            <Network size={21} />
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">CCNA Hub</p>
              <p className="truncate text-xs text-zinc-500">Learning OS</p>
            </div>
          )}
          <div className="min-w-0 lg:hidden">
            <p className="truncate text-sm font-semibold text-white">CCNA Hub</p>
            <p className="truncate text-xs text-zinc-500">Learning OS</p>
          </div>
        </NavLink>
        <button
          aria-label="Toggle sidebar"
          className="hidden h-8 w-8 place-items-center rounded-lg text-zinc-400 transition hover:bg-white/10 hover:text-white lg:grid"
          onClick={toggleSidebar}
        >
          {sidebarCollapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
        </button>
        <button aria-label="Close mobile menu" className="grid h-8 w-8 place-items-center rounded-lg text-zinc-400 transition hover:bg-white/10 hover:text-white lg:hidden" onClick={() => setMobileSidebarOpen(false)}>
          <X size={18} />
        </button>
      </div>

      <nav className="space-y-1 overflow-y-auto pr-1">
        {visibleNavItems.map((item) => {
          const active = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "group relative flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-zinc-400 transition",
                active && "bg-white/[0.08] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
                !active && "hover:bg-white/[0.05] hover:text-white",
                sidebarCollapsed && "lg:justify-center lg:px-0"
              )}
            >
              {active && (
                <motion.span
                  layoutId="active-nav"
                  className="absolute left-0 h-5 w-0.5 rounded-full bg-cyan-300"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <Icon size={18} />
              <span className={cn("truncate", sidebarCollapsed && "lg:hidden")}>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] p-3">
        <div className="mb-2 flex items-center gap-2 text-cyan-200">
          <Sparkles size={16} />
          <span className={cn("text-sm font-medium", sidebarCollapsed && "lg:hidden")}>Exam Focus</span>
        </div>
        <p className={cn("text-xs leading-5 text-zinc-400", sidebarCollapsed && "lg:hidden")}>Track journals, streaks, quiz scores, tasks, and admin reviews.</p>
      </div>
    </div>
  );

  return (
    <div className={cn("min-h-screen bg-zinc-950 text-zinc-100", theme === "light" && "theme-light")}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_32%),linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:auto,48px_48px,48px_48px]" />
      </div>

      <aside
        className={cn(
          "fixed left-0 top-0 z-30 hidden h-screen border-r border-white/10 bg-zinc-950/72 backdrop-blur-2xl transition-all duration-300 lg:block",
          sidebarCollapsed ? "w-20" : "w-72"
        )}
      >
        {sidebarContent}
      </aside>

      {sidebarCollapsed && (
        <button
          aria-label="Expand sidebar"
          onClick={toggleSidebar}
          className="fixed left-[4.4rem] top-5 z-40 hidden h-9 w-9 place-items-center rounded-full border border-white/10 bg-zinc-950/90 text-cyan-200 shadow-xl backdrop-blur-xl transition hover:scale-105 hover:bg-white/[0.08] lg:grid"
        >
          <ChevronRight size={18} />
        </button>
      )}

      {mobileSidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileSidebarOpen(false)} />}
      <aside className={cn("fixed inset-y-0 left-0 z-50 w-[min(86vw,320px)] border-r border-white/10 bg-zinc-950/95 backdrop-blur-2xl transition-transform duration-300 lg:hidden", mobileSidebarOpen ? "translate-x-0" : "-translate-x-full")}>
        {sidebarContent}
      </aside>

      <div className={cn("relative z-10 min-h-screen transition-all duration-300", sidebarCollapsed ? "lg:pl-20" : "lg:pl-72")}>
        <header className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/70 backdrop-blur-2xl">
          <div className="flex min-h-16 flex-wrap items-center gap-2 px-3 py-3 sm:gap-3 sm:px-6 lg:px-8">
            <button aria-label="Open mobile menu" className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-zinc-300 lg:hidden" onClick={() => setMobileSidebarOpen(true)}>
              <Menu size={18} />
            </button>
            <div className="relative min-w-0 flex-[1_1_180px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={17} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search topics, commands, resources..."
                className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.05] pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-cyan-300/50 focus:bg-white/[0.08] sm:pr-12"
              />
              <div className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md border border-white/10 px-1.5 py-1 text-[10px] text-zinc-500 sm:flex">
                <Command size={11} /> K
              </div>
            </div>
            <button aria-label="Toggle theme" onClick={toggleTheme} className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-zinc-300 transition hover:text-white">
              {theme === "dark" ? <Moon size={17} /> : <Sun size={17} />}
            </button>
            <button aria-label="Notifications" className="relative grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-zinc-300 transition hover:text-white">
              <Bell size={17} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-300" />
            </button>
            <NavLink to={user ? "/app/profile" : "/login"} className="flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] px-2">
              <div className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-cyan-300 to-fuchsia-400 text-xs font-bold text-zinc-950">{user?.name?.slice(0, 2).toUpperCase() ?? "YT"}</div>
              <span className="hidden text-sm font-medium text-white sm:inline">{user?.name?.split(" ")[0] ?? "Login"}</span>
            </NavLink>
            {user && (
              <button aria-label="Logout" onClick={logout} className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-zinc-300 transition hover:text-white">
                <LogOut size={17} />
              </button>
            )}
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
