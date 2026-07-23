import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { topicProgress, weeklyStudy } from "@/mock/data";
import { useAppStore } from "@/store/useAppStore";

const chartText = { fill: "#a1a1aa", fontSize: 12 };
const colors = ["#22d3ee", "#60a5fa", "#a78bfa", "#f472b6", "#34d399"];

export function WeeklyAreaChart({ data: inputData }: { data?: Array<{ day: string; hours: number; topics?: number }> } = {}) {
  const reset = useAppStore((state) => state.progressResetVersion > 0);
  const data = inputData ?? (reset ? weeklyStudy.map((item) => ({ ...item, hours: 0, topics: 0 })) : weeklyStudy);
  return <WeeklyAreaChartView data={data} />;
}

export function WeeklyAreaChartView({ data }: { data: Array<{ day: string; hours: number; topics?: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="hours" x1="0" x2="0" y1="0" y2="1">
            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#ffffff12" vertical={false} />
        <XAxis dataKey="day" tick={chartText} axisLine={false} tickLine={false} />
        <YAxis tick={chartText} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ background: "#09090b", border: "1px solid #ffffff1a", borderRadius: 8 }} />
        <Area type="monotone" dataKey="hours" stroke="#22d3ee" strokeWidth={2} fill="url(#hours)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function TopicBarChart({ data: inputData }: { data?: Array<{ name: string; value: number }> }) {
  const reset = useAppStore((state) => state.progressResetVersion > 0);
  const data = inputData ?? (reset ? topicProgress.map((item) => ({ ...item, value: 0 })) : topicProgress);
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data}>
        <CartesianGrid stroke="#ffffff12" vertical={false} />
        <XAxis dataKey="name" tick={chartText} axisLine={false} tickLine={false} />
        <YAxis tick={chartText} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ background: "#09090b", border: "1px solid #ffffff1a", borderRadius: 8 }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={index} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CompletionPieChart({ data: inputData }: { data?: Array<{ name: string; value: number }> }) {
  const reset = useAppStore((state) => state.progressResetVersion > 0);
  const data = inputData ?? (reset ? topicProgress.map((item) => ({ ...item, value: 0 })) : topicProgress);
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={86} paddingAngle={4}>
          {data.map((_, index) => (
            <Cell key={index} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ background: "#09090b", border: "1px solid #ffffff1a", borderRadius: 8 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function RadarProgressChart({ data: inputData }: { data?: Array<{ name: string; value: number }> }) {
  const reset = useAppStore((state) => state.progressResetVersion > 0);
  const data = inputData ?? (reset ? topicProgress.map((item) => ({ ...item, value: 0 })) : topicProgress);
  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data}>
        <PolarGrid stroke="#ffffff18" />
        <PolarAngleAxis dataKey="name" tick={chartText} />
        <Radar dataKey="value" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.28} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function StudyLineChart() {
  const reset = useAppStore((state) => state.progressResetVersion > 0);
  const data = reset ? weeklyStudy.map((item) => ({ ...item, hours: 0, topics: 0 })) : weeklyStudy;
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <CartesianGrid stroke="#ffffff12" vertical={false} />
        <XAxis dataKey="day" tick={chartText} axisLine={false} tickLine={false} />
        <YAxis tick={chartText} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ background: "#09090b", border: "1px solid #ffffff1a", borderRadius: 8 }} />
        <Line type="monotone" dataKey="topics" stroke="#f472b6" strokeWidth={2} dot={{ fill: "#f472b6" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
