import { useQuery } from "@tanstack/react-query";
import { Award, Lock } from "lucide-react";
import { Page } from "@/components/common/Page";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { backendApi } from "@/services/api";
import { useAppStore } from "@/store/useAppStore";

interface BackendAchievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress: number;
}

export function AchievementsPage() {
  const { user } = useAppStore();
  const { data } = useQuery({ queryKey: ["backend-achievements", user?.id], queryFn: backendApi.getDashboard, enabled: Boolean(user) });
  const dynamicAchievements: BackendAchievement[] = data?.achievements ?? [];
  return (
    <Page title="Achievements" kicker="Milestones that matter">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dynamicAchievements.map((achievement) => (
          <Card key={achievement.id} className={achievement.unlocked ? "border-cyan-300/25" : ""}>
            <div className="flex items-start justify-between">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-white/[0.06] text-cyan-200">
                {achievement.unlocked ? <Award size={21} /> : <Lock size={21} />}
              </div>
              <span className="text-xs text-zinc-500">{achievement.progress}%</span>
            </div>
            <h2 className="mt-5 font-semibold">{achievement.title}</h2>
            <p className="mt-2 min-h-12 text-sm leading-6 text-zinc-400">{achievement.description}</p>
            <div className="mt-4"><ProgressBar value={achievement.progress} /></div>
          </Card>
        ))}
      </div>
    </Page>
  );
}
