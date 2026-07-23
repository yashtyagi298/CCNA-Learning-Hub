import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/utils/cn";

interface HeatmapCell {
  date?: string;
  intensity: number;
  title: string;
  detail: string;
  minutes: number;
}

export function Heatmap({ data }: { data?: HeatmapCell[] }) {
  const [selected, setSelected] = useState(0);
  const reset = useAppStore((state) => state.progressResetVersion > 0);
  const fallbackCells = Array.from({ length: 98 }, (_, index) => {
    const intensity = reset ? 0 : (index * 7 + index ** 2) % 5;
    return {
      intensity,
      title: reset ? "No progress recorded" : ["Subnetting drills", "OSPF lab", "VLAN review", "ACL wildcards", "Wireless notes"][index % 5],
      detail: reset ? "Progress was reset. New study activity will appear here after you save work again." : ["Solved MCQs and reviewed masks", "Built adjacency and fixed timer mismatch", "Checked trunks and native VLAN", "Practiced placement and verification", "Reviewed channels and roaming"][index % 5],
      minutes: reset ? 0 : 25 + ((index * 13) % 95)
    };
  });
  const cells = data?.length ? data : fallbackCells;
  const active = cells[selected];

  return (
    <div>
      <div className="grid grid-cols-[repeat(14,minmax(0,1fr))] gap-1">
        {cells.map((cell, index) => (
          <button
            key={index}
            onClick={() => setSelected(index)}
            className={cn(
              "aspect-square rounded-[3px] border border-white/[0.04] transition hover:scale-125",
              selected === index && "ring-2 ring-cyan-200",
              cell.intensity === 0 && "bg-white/[0.04]",
              cell.intensity === 1 && "bg-cyan-950",
              cell.intensity === 2 && "bg-cyan-800",
              cell.intensity === 3 && "bg-cyan-500",
              cell.intensity === 4 && "bg-fuchsia-400"
            )}
            title={`${cell.title}: ${cell.minutes} minutes`}
          />
        ))}
      </div>
      <div className="mt-4 rounded-lg bg-white/[0.05] p-3 text-sm">
        <p className="font-medium text-white">{active.title}</p>
        <p className="mt-1 text-xs text-zinc-400">{active.detail} - {active.minutes} minutes studied</p>
      </div>
    </div>
  );
}
