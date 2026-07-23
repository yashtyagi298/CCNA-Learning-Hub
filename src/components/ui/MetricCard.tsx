import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "./Card";

interface MetricCardProps {
  title: string;
  value: string;
  delta: string;
  icon: LucideIcon;
  accent?: string;
}

export function MetricCard({ title, value, delta, icon: Icon, accent = "from-cyan-400 to-blue-500" }: MetricCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
      <Card className="relative overflow-hidden">
        <div className={`absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${accent} opacity-20 blur-2xl`} />
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-zinc-400">{title}</p>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</h3>
          </div>
          <div className={`rounded-lg bg-gradient-to-br ${accent} p-2.5 text-white shadow-lg`}>
            <Icon size={18} />
          </div>
        </div>
        <p className="mt-5 text-xs font-medium text-emerald-300">{delta}</p>
      </Card>
    </motion.div>
  );
}
