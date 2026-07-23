import { useQuery } from "@tanstack/react-query";
import { Award, CalendarCheck, Crown, Flame, NotebookText, Target, Trophy, UserRoundCheck } from "lucide-react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { WeeklyAreaChart } from "@/components/charts/StudyCharts";
import { Heatmap } from "@/components/common/Heatmap";
import { Page } from "@/components/common/Page";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { backendApi } from "@/services/api";
import { useAppStore } from "@/store/useAppStore";

export function AdminDashboardPage() {
  const { user } = useAppStore();
  const [selectedLearnerId, setSelectedLearnerId] = useState<string | null>(null);
  const { data, isLoading } = useQuery({ queryKey: ["admin-overview"], queryFn: backendApi.getAdminOverview, enabled: user?.role === "admin", refetchInterval: 15_000 });
  const { data: learnerDetail, isLoading: learnerLoading } = useQuery({
    queryKey: ["admin-learner-detail", selectedLearnerId],
    queryFn: () => backendApi.getAdminLearner(selectedLearnerId!),
    enabled: Boolean(selectedLearnerId)
  });

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") {
    return (
      <Page title="Admin Track" kicker="Senior access">
        <Card><p className="text-sm text-zinc-400">Is page ko dekhne ke liye senior/admin account se login karo.</p></Card>
      </Page>
    );
  }

  const learners = data?.learners ?? [];

  return (
    <Page title="Admin Tracking Dashboard" kicker="Senior learner overview">
      <div className="mb-5 grid gap-4 md:grid-cols-4">
        <Card><Crown className="text-cyan-300" /><p className="mt-4 text-sm text-zinc-500">Learners</p><h2 className="text-3xl font-semibold">{learners.length}</h2></Card>
        <Card><NotebookText className="text-fuchsia-300" /><p className="mt-4 text-sm text-zinc-500">Journal Entries</p><h2 className="text-3xl font-semibold">{learners.reduce((sum: number, row: any) => sum + row.journalCount, 0)}</h2></Card>
        <Card><Target className="text-emerald-300" /><p className="mt-4 text-sm text-zinc-500">Completed Tasks</p><h2 className="text-3xl font-semibold">{learners.reduce((sum: number, row: any) => sum + row.tasks.completed, 0)}</h2></Card>
        <Card><Trophy className="text-amber-300" /><p className="mt-4 text-sm text-zinc-500">Top Subnetting</p><h2 className="text-3xl font-semibold">{Math.max(0, ...learners.map((row: any) => row.bestSubnetting))}/100</h2></Card>
      </div>

      <div className="grid gap-4">
        {isLoading && <Card>Loading admin data...</Card>}
        {learners.map((row: any) => (
          <Card key={row.user.id} className="cursor-pointer transition hover:border-cyan-300/30 hover:bg-white/[0.065]" onClick={() => setSelectedLearnerId(row.user.id)}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold">{row.user.name}</h2>
                  <span className={`rounded-md px-2 py-1 text-xs ${row.updatedToday ? "bg-emerald-300/15 text-emerald-200" : "bg-rose-300/15 text-rose-200"}`}>
                    {row.updatedToday ? "Updated today" : "No update today"}
                  </span>
                </div>
                <p className="text-sm text-zinc-500">{row.user.email}</p>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Latest journal: {row.latestJournal?.todayStudy ?? "No journal submitted yet"}
                </p>
              </div>
              <div className="grid min-w-80 gap-3 sm:grid-cols-4">
                <MiniStat label="Journals" value={row.journalCount} />
                <MiniStat label="Tasks" value={`${row.tasks.completed}/${row.tasks.total}`} />
                <MiniStat label="Subnetting" value={`${row.bestSubnetting}/100`} />
                <MiniStat label="Streak" value={`${row.stats?.streak ?? 0}d`} />
              </div>
            </div>
            <div className="mt-4"><ProgressBar value={row.bestSubnetting} /></div>
          </Card>
        ))}
      </div>

      {selectedLearnerId && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/70 p-4 backdrop-blur-sm" onClick={() => setSelectedLearnerId(null)}>
          <div className="mx-auto max-w-6xl rounded-lg border border-white/10 bg-zinc-950 p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-medium text-cyan-300">Learner Deep Report</p>
                <h2 className="mt-2 text-3xl font-semibold">{learnerDetail?.user?.name ?? "Loading learner..."}</h2>
                <p className="text-sm text-zinc-500">{learnerDetail?.user?.email}</p>
              </div>
              <button onClick={() => setSelectedLearnerId(null)} className="rounded-lg bg-white/[0.06] px-4 py-2 text-sm">Close</button>
            </div>

            {learnerLoading && <Card>Loading learner detail...</Card>}
            {learnerDetail && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-5">
                  <Card><NotebookText className="text-cyan-300" /><p className="mt-4 text-xs text-zinc-500">Reports</p><h3 className="text-2xl font-semibold">{learnerDetail.stats.journalCount}</h3></Card>
                  <Card><Flame className="text-orange-300" /><p className="mt-4 text-xs text-zinc-500">Streak</p><h3 className="text-2xl font-semibold">{learnerDetail.stats.streak}d</h3></Card>
                  <Card><Trophy className="text-amber-300" /><p className="mt-4 text-xs text-zinc-500">Subnetting</p><h3 className="text-2xl font-semibold">{learnerDetail.stats.bestSubnetting}/100</h3></Card>
                  <Card><Target className="text-emerald-300" /><p className="mt-4 text-xs text-zinc-500">Tasks</p><h3 className="text-2xl font-semibold">{learnerDetail.stats.completedTasks}/{learnerDetail.stats.totalTasks}</h3></Card>
                  <Card><CalendarCheck className={learnerDetail.stats.updatedToday ? "text-emerald-300" : "text-rose-300"} /><p className="mt-4 text-xs text-zinc-500">Today</p><h3 className="text-lg font-semibold">{learnerDetail.stats.updatedToday ? "Updated" : "Pending"}</h3></Card>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  <Card><h3 className="mb-4 text-lg font-semibold">Weekly Study</h3><WeeklyAreaChart data={learnerDetail.weeklyStudy} /></Card>
                  <Card><h3 className="mb-4 text-lg font-semibold">Study Calendar</h3><Heatmap data={learnerDetail.heatmap} /></Card>
                </div>

                <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                  <Card>
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold"><NotebookText className="text-cyan-300" /> Daily Reports</h3>
                    <div className="max-h-96 space-y-3 overflow-auto">
                      {learnerDetail.journals.map((journal: any) => (
                        <div key={journal._id} className="rounded-lg bg-white/[0.04] p-4">
                          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                            <p className="font-medium">{journal.todayStudy || "Study report"}</p>
                            <span className="text-xs text-zinc-500">{new Date(journal.createdAt).toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-zinc-400">Topics: {journal.topics || "Not added"}</p>
                          <p className="mt-1 font-mono text-xs text-cyan-100">Commands: {journal.commands || "Not added"}</p>
                          <p className="mt-2 text-sm text-zinc-400">Problems: {journal.problems || "None"}</p>
                          <p className="mt-1 text-sm text-zinc-400">Tomorrow: {journal.goals || "No goals added"}</p>
                        </div>
                      ))}
                      {!learnerDetail.journals.length && <p className="text-sm text-zinc-500">No daily reports yet.</p>}
                    </div>
                  </Card>

                  <Card>
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold"><Award className="text-fuchsia-300" /> Achievements</h3>
                    <div className="space-y-3">
                      {learnerDetail.achievements.map((achievement: any) => (
                        <div key={achievement.id} className="rounded-lg bg-white/[0.04] p-3">
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <p className="text-sm font-medium">{achievement.title}</p>
                            <span className={achievement.unlocked ? "text-xs text-emerald-300" : "text-xs text-zinc-500"}>{achievement.unlocked ? "Unlocked" : `${achievement.progress}%`}</span>
                          </div>
                          <ProgressBar value={achievement.progress} />
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  <Card>
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold"><UserRoundCheck className="text-emerald-300" /> Tasks</h3>
                    <div className="space-y-2">
                      {learnerDetail.tasks.slice(0, 10).map((task: any) => (
                        <div key={task._id} className="flex items-center justify-between rounded-lg bg-white/[0.04] p-3 text-sm">
                          <span>{task.title}</span>
                          <span className="text-xs text-zinc-500">{task.status}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card>
                    <h3 className="mb-4 text-lg font-semibold">Quiz Attempts</h3>
                    <div className="space-y-2">
                      {learnerDetail.attempts.slice(0, 10).map((attempt: any) => (
                        <div key={attempt._id} className="flex items-center justify-between rounded-lg bg-white/[0.04] p-3 text-sm">
                          <span>{new Date(attempt.createdAt).toLocaleString()}</span>
                          <span className="font-semibold text-cyan-200">{attempt.score}/{attempt.total}</span>
                        </div>
                      ))}
                      {!learnerDetail.attempts.length && <p className="text-sm text-zinc-500">No quiz attempts yet.</p>}
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Page>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-lg bg-white/[0.05] p-3"><p className="text-xs text-zinc-500">{label}</p><p className="mt-1 font-semibold">{value}</p></div>;
}
