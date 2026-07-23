import { useQuery } from "@tanstack/react-query";
import { Crown, Flame, Medal } from "lucide-react";
import { Page } from "@/components/common/Page";
import { Card } from "@/components/ui/Card";
import { mockApi } from "@/services/api";

export function LeaderboardPage() {
  const { data = [] } = useQuery({ queryKey: ["leaderboard"], queryFn: mockApi.getLeaderboard });
  return (
    <Page title="Leaderboard" kicker="Friendly competition">
      <div className="grid gap-4 lg:grid-cols-3">
        {data.slice(0, 3).map((learner, index) => (
          <Card key={learner.id} className="text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-gradient-to-br from-cyan-300 to-fuchsia-400 text-zinc-950"><Crown size={24} /></div>
            <p className="mt-4 text-sm text-zinc-500">Rank #{index + 1}</p>
            <h2 className="mt-1 text-xl font-semibold">{learner.name}</h2>
            <p className="text-sm text-zinc-500">{learner.handle}</p>
            <div className="mt-5 grid grid-cols-3 gap-2 text-sm">
              <Stat label="Streak" value={`${learner.streak}`} />
              <Stat label="Topics" value={`${learner.topics}`} />
              <Stat label="Labs" value={`${learner.labs}`} />
            </div>
          </Card>
        ))}
      </div>
      <Card className="mt-4">
        <h2 className="mb-4 text-lg font-semibold">Weekly, Monthly, Overall Ranking</h2>
        <div className="space-y-3">
          {data.map((learner, index) => (
            <div key={learner.id} className="flex items-center gap-4 rounded-lg bg-white/[0.04] p-3">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/[0.07] text-sm font-semibold">{index + 1}</div>
              <div className="flex-1"><p className="font-medium">{learner.name}</p><p className="text-xs text-zinc-500">{learner.score.toLocaleString()} XP</p></div>
              <span className="hidden items-center gap-1 text-sm text-zinc-400 sm:inline-flex"><Flame size={15} /> {learner.streak}</span>
              <Medal className="text-cyan-300" size={18} />
            </div>
          ))}
        </div>
      </Card>
    </Page>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-white/[0.05] p-3"><p className="font-semibold">{value}</p><p className="text-xs text-zinc-500">{label}</p></div>;
}
