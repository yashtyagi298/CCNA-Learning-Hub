import { useQuery } from "@tanstack/react-query";
import { BookOpenCheck, CalendarClock, Clock3, Flame, Layers3, ListChecks, Network, TrendingUp } from "lucide-react";
import { Page } from "@/components/common/Page";
import { Heatmap } from "@/components/common/Heatmap";
import { TopicBarChart, WeeklyAreaChart } from "@/components/charts/StudyCharts";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MetricCard } from "@/components/ui/MetricCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { backendApi, mockApi } from "@/services/api";
import { useAppStore } from "@/store/useAppStore";

export function DashboardPage() {
  const { user, subnettingScore, subnettingAttempts } = useAppStore();
  const { data } = useQuery({ queryKey: ["dashboard"], queryFn: mockApi.getDashboard });
  const { data: backendDashboard } = useQuery({ queryKey: ["backend-dashboard", user?.id], queryFn: backendApi.getDashboard, enabled: Boolean(user) });
  const dbStats = backendDashboard?.stats;
  const score = Math.max(subnettingScore, dbStats?.bestSubnetting ?? 0);
  const attempts = Math.max(subnettingAttempts, dbStats?.attempts ?? 0);
  const completedTasks = dbStats?.completedTasks ?? 0;
  const totalTasks = dbStats?.totalTasks ?? 0;
  const todayProgress = dbStats?.updatedToday ? 100 : 0;
  const weeklyData = backendDashboard?.weeklyStudy;
  const heatmapData = backendDashboard?.heatmap;
  const domainData = backendDashboard?.topicProgress?.length ? backendDashboard.topicProgress : [
    { name: "Journals", value: Math.min(100, (dbStats?.journalCount ?? 0) * 10) },
    { name: "Tasks", value: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0 },
    { name: "Subnetting", value: score },
    { name: "Streak", value: Math.min(100, (dbStats?.streak ?? 0) * 14) },
    { name: "Consistency", value: dbStats?.updatedToday ? 100 : 0 }
  ];
  const recentRows = [
    ...(backendDashboard?.journals ?? []).slice(0, 2).map((journal: any) => ({ title: journal.todayStudy || "Journal saved", meta: `${journal.topics || "No topics"} - ${journal.hours ?? 0}h` })),
    ...(backendDashboard?.attempts ?? []).slice(0, 1).map((attempt: any) => ({ title: "Subnetting attempt submitted", meta: `${attempt.score}/${attempt.total}` })),
    ...(backendDashboard?.tasks ?? []).slice(0, 2).map((task: any) => ({ title: task.title, meta: `${task.status} - ${task.topic}` }))
  ];

  return (
    <Page title="Dashboard" kicker="Command center" action={<Button variant="secondary">Plan Today</Button>}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard title="Today's Progress" value={`${todayProgress}%`} delta={dbStats?.updatedToday ? "Updated today" : "No update today"} icon={TrendingUp} />
        <MetricCard title="Learning Streak" value={`${dbStats?.streak ?? 0} days`} delta="Calculated from journal days" icon={Flame} accent="from-orange-300 to-rose-400" />
        <MetricCard title="Hours Studied" value={`${dbStats?.hoursStudied?.toFixed?.(1) ?? "0.0"}h`} delta="Synced from journals" icon={Clock3} accent="from-emerald-300 to-cyan-400" />
        <MetricCard title="Completed Tasks" value={`${completedTasks}/${totalTasks}`} delta="Synced from task board" icon={BookOpenCheck} accent="from-violet-300 to-fuchsia-400" />
        <MetricCard title="Subnetting Score" value={`${score}/100`} delta={`${attempts} saved attempts`} icon={ListChecks} accent="from-cyan-300 to-emerald-400" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_0.9fr]">
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Weekly Progress</h2>
              <p className="text-sm text-zinc-500">Study hours and consistency</p>
            </div>
            <CalendarClock className="text-cyan-300" size={20} />
          </div>
          <WeeklyAreaChart data={weeklyData} />
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-white">Topic Progress</h2>
          <p className="mb-5 text-sm text-zinc-500">Backend learner activity domains</p>
          <TopicBarChart data={domainData} />
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_0.9fr_0.9fr]">
        <Card>
          <h2 className="text-lg font-semibold">GitHub-style Study Heatmap</h2>
          <p className="mb-5 text-sm text-zinc-500">Daily study density for the last 14 weeks</p>
          <Heatmap data={heatmapData} />
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Open Tasks</h2>
          <div className="mt-4 space-y-4">
            {(backendDashboard?.tasks ?? []).filter((task: any) => task.status !== "completed").slice(0, 4).map((topic: any) => (
              <div key={topic._id ?? topic.id}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>{topic.title}</span>
                  <span className="text-zinc-500">{topic.status}</span>
                </div>
                <ProgressBar value={topic.status === "review" ? 80 : topic.status === "in-progress" ? 55 : 15} />
              </div>
            ))}
            {!(backendDashboard?.tasks ?? []).length && <p className="text-sm text-zinc-500">No tasks yet. Add tasks from Task Board.</p>}
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <div className="mt-4 space-y-3">
            {(recentRows.length ? recentRows : data?.activities ?? []).map((activity: any, index: number) => (
              <div key={activity.id ?? `${activity.title}-${index}`} className="flex gap-3 rounded-lg bg-white/[0.04] p-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-cyan-300" />
                <div>
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-zinc-500">{activity.meta}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {[
          { icon: Network, title: "Start Packet Tracer Lab", text: "Launch the next topology and verification checklist." },
          { icon: ListChecks, title: "Review Mistakes", text: "Revisit saved failure modes before new material." },
          { icon: Layers3, title: "Practice Commands", text: "Run a focused command recall session." }
        ].map((item) => (
          <Card key={item.title} className="transition hover:border-cyan-300/30 hover:bg-white/[0.07]">
            <item.icon className="text-cyan-300" size={22} />
            <h3 className="mt-4 font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{item.text}</p>
          </Card>
        ))}
      </div>
    </Page>
  );
}
