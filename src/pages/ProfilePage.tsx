import { Award, Bookmark, Briefcase, CalendarDays, CheckCircle2 } from "lucide-react";
import { CompletionPieChart, WeeklyAreaChart } from "@/components/charts/StudyCharts";
import { Heatmap } from "@/components/common/Heatmap";
import { Page } from "@/components/common/Page";
import { Card } from "@/components/ui/Card";
import { achievements, resources, topics } from "@/mock/data";

export function ProfilePage() {
  const completed = topics.filter((topic) => topic.status === "completed");
  return (
    <Page title="Profile" kicker="GitHub-inspired study identity">
      <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950/62 backdrop-blur-xl">
        <div className="h-40 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.5),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(244,114,182,0.35),transparent_30%),linear-gradient(135deg,#0a0a0a,#18181b)]" />
        <div className="px-5 pb-5">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="grid h-24 w-24 place-items-center rounded-2xl border-4 border-zinc-950 bg-gradient-to-br from-cyan-300 to-fuchsia-400 text-3xl font-bold text-zinc-950">YT</div>
            <div className="pb-1">
              <h2 className="text-2xl font-semibold">Yash Tyagi</h2>
              <p className="text-sm text-zinc-400">CCNA candidate building disciplined network troubleshooting muscle.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          <Card><h2 className="mb-4 text-lg font-semibold">Current Goal</h2><p className="text-sm leading-6 text-zinc-400">Complete OSPF, ACL, and NAT labs before the next full mock exam.</p></Card>
          <Card><h2 className="mb-4 text-lg font-semibold">Skills</h2><div className="flex flex-wrap gap-2">{["Subnetting", "Routing", "Switching", "Troubleshooting", "Packet Tracer"].map((skill) => <span key={skill} className="rounded-md bg-white/[0.06] px-2 py-1 text-xs text-zinc-300">{skill}</span>)}</div></Card>
          <Card><h2 className="mb-4 text-lg font-semibold">Certificates</h2><p className="flex items-center gap-2 text-sm text-zinc-400"><Briefcase size={16} /> CCNA prep certificate placeholder</p></Card>
        </div>
        <div className="space-y-4">
          <Card><h2 className="mb-4 text-lg font-semibold">Study Calendar</h2><Heatmap /></Card>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card><h2 className="mb-4 text-lg font-semibold">Study Trend</h2><WeeklyAreaChart /></Card>
            <Card><h2 className="mb-4 text-lg font-semibold">Completion</h2><CompletionPieChart /></Card>
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Card><Award className="text-cyan-300" /><h2 className="mt-4 font-semibold">Achievements</h2><p className="mt-1 text-sm text-zinc-500">{achievements.filter((a) => a.unlocked).length} unlocked</p></Card>
        <Card><CheckCircle2 className="text-emerald-300" /><h2 className="mt-4 font-semibold">Completed Topics</h2><p className="mt-1 text-sm text-zinc-500">{completed.length} finished</p></Card>
        <Card><Bookmark className="text-fuchsia-300" /><h2 className="mt-4 font-semibold">Bookmarks</h2><p className="mt-1 text-sm text-zinc-500">{resources.filter((r) => r.favorite).length} saved</p></Card>
      </div>
    </Page>
  );
}
