import { useQuery } from "@tanstack/react-query";
import { Page } from "@/components/common/Page";
import { CompletionPieChart, RadarProgressChart, StudyLineChart, TopicBarChart, WeeklyAreaChart } from "@/components/charts/StudyCharts";
import { Card } from "@/components/ui/Card";
import { backendApi } from "@/services/api";
import { useAppStore } from "@/store/useAppStore";

export function AnalyticsPage() {
  const { user } = useAppStore();
  const { data } = useQuery({ queryKey: ["analytics-dashboard", user?.id], queryFn: backendApi.getDashboard, enabled: Boolean(user) });
  const topicProgress = data?.topicProgress ?? [];
  const strong = [...topicProgress].sort((a: any, b: any) => b.value - a.value).slice(0, 2).map((item: any) => item.name).join(", ") || "No strong topics yet";
  const weak = [...topicProgress].sort((a: any, b: any) => a.value - b.value).slice(0, 2).map((item: any) => item.name).join(", ") || "No weak topics yet";

  return (
    <Page title="Analytics" kicker="Learning intelligence">
      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Study Hours"><WeeklyAreaChart data={data?.weeklyStudy} /></ChartCard>
        <ChartCard title="Topic Progress From Journals"><TopicBarChart data={topicProgress} /></ChartCard>
        <ChartCard title="Completion Mix"><CompletionPieChart data={topicProgress} /></ChartCard>
        <ChartCard title="Domain Radar"><RadarProgressChart data={topicProgress} /></ChartCard>
        <ChartCard title="Topics Completed"><StudyLineChart /></ChartCard>
        <Card>
          <h2 className="text-lg font-semibold">Weak vs Strong Topics</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-rose-300/10 p-4"><p className="text-sm text-rose-200">Weak</p><p className="mt-2 text-xl font-semibold">{weak}</p></div>
            <div className="rounded-lg bg-emerald-300/10 p-4"><p className="text-sm text-emerald-200">Strong</p><p className="mt-2 text-xl font-semibold">{strong}</p></div>
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-400">These values come from saved journal topics. If learner writes Routing, Switching, Wireless, OSPF, VLAN, ACL, etc., analytics updates from backend.</p>
        </Card>
      </div>
    </Page>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <Card><h2 className="mb-4 text-lg font-semibold">{title}</h2>{children}</Card>;
}
