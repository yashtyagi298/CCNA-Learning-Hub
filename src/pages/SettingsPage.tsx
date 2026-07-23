import { Bell, Database, Moon, RotateCcw, Shield, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Page } from "@/components/common/Page";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { backendApi } from "@/services/api";
import { useAppStore } from "@/store/useAppStore";

export function SettingsPage() {
  const { user, resetLocalProgress } = useAppStore();
  const queryClient = useQueryClient();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function resetProgress() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    try {
      setLoading(true);
      if (user?.role === "learner") await backendApi.resetProgress();
      resetLocalProgress();
      await queryClient.invalidateQueries();
      toast.success("Your progress, charts, heatmap, journals, tasks, and quiz scores are reset.");
      setConfirming(false);
    } catch {
      toast.error("Reset failed. Check backend server, then try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page title="Settings" kicker="Future-ready preferences">
      <div className="grid gap-4 lg:grid-cols-2">
        {[
          { icon: Moon, title: "Appearance", text: "Dark-first visual system with a prepared light-mode toggle." },
          { icon: Bell, title: "Notifications", text: "Static reminder controls ready for scheduler integration." },
          { icon: Database, title: "Data Layer", text: "Mock API and Axios client can be swapped for REST endpoints later." },
          { icon: Shield, title: "Authentication Ready", text: "No auth implemented, but routes and layout are prepared for protected shells." }
        ].map((item) => (
          <Card key={item.title}>
            <item.icon className="text-cyan-300" />
            <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{item.text}</p>
            <label className="mt-5 flex items-center justify-between rounded-lg bg-white/[0.04] p-3 text-sm">
              Enable {item.title}
              <input type="checkbox" className="h-4 w-4 accent-cyan-300" defaultChecked />
            </label>
          </Card>
        ))}
      </div>
      {user?.role !== "admin" && (
        <Card className="mt-4 border-rose-300/25">
          <Trash2 className="text-rose-300" />
          <h2 className="mt-4 text-lg font-semibold">Reset My Progress</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            This clears your learner journals, tasks, subnetting attempts, dashboard stats, charts, achievements progress, and study heatmap. Admin accounts cannot reset learner data from here.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button variant={confirming ? "primary" : "secondary"} onClick={resetProgress} disabled={loading}>
              <RotateCcw size={17} /> {loading ? "Resetting..." : confirming ? "Confirm Reset" : "Reset Progress"}
            </Button>
            {confirming && <Button variant="ghost" onClick={() => setConfirming(false)}>Cancel</Button>}
          </div>
        </Card>
      )}
    </Page>
  );
}
