import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, BookOpen, CheckCircle2, Clock, ExternalLink, FlaskConical, HelpCircle, ListChecks, Search, TerminalSquare, X } from "lucide-react";
import { Page } from "@/components/common/Page";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { mockApi } from "@/services/api";
import type { CcnaTopic } from "@/types";
import { cn } from "@/utils/cn";

export function RoadmapPage({ compact = false }: { compact?: boolean }) {
  const { data = [] } = useQuery({ queryKey: ["topics"], queryFn: mockApi.getTopics });
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<CcnaTopic | null>(null);
  const filters = ["All", "Beginner", "Intermediate", "Advanced", "completed", "learning", "review"];

  const filtered = useMemo(
    () =>
      data.filter((topic) => {
        const byFilter = filter === "All" || topic.difficulty === filter || topic.status === filter;
        const bySearch = `${topic.title} ${topic.description} ${topic.commands.join(" ")}`.toLowerCase().includes(search.toLowerCase());
        return byFilter && bySearch;
      }),
    [data, filter, search]
  );

  return (
    <Page title={compact ? "Topics" : "CCNA Roadmap"} kicker={compact ? "Topic library" : "Exam-aligned path"}>
      <Card className="mb-5 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search topic, command, lab..." className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] pl-9 pr-3 text-sm outline-none focus:border-cyan-300/40" />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button key={item} onClick={() => setFilter(item)} className={cn("rounded-lg px-3 py-2 text-xs font-medium transition", filter === item ? "bg-cyan-300 text-zinc-950" : "bg-white/[0.06] text-zinc-400 hover:text-white")}>
                {item}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {filtered.map((topic, index) => (
          <Card key={topic.id} className="group relative overflow-hidden transition hover:border-cyan-300/30 hover:bg-white/[0.065]">
            <div className="absolute right-4 top-4 text-5xl font-semibold text-white/[0.03]">{String(index + 1).padStart(2, "0")}</div>
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">{topic.title}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{topic.description}</p>
              </div>
              <span className={cn("rounded-md px-2 py-1 text-xs font-medium", topic.status === "completed" ? "bg-emerald-300/15 text-emerald-200" : topic.status === "learning" ? "bg-cyan-300/15 text-cyan-200" : "bg-white/10 text-zinc-300")}>{topic.status}</span>
            </div>
            <div className="mb-4 flex flex-wrap gap-2 text-xs">
              <span className="rounded-md bg-white/[0.06] px-2 py-1">{topic.difficulty}</span>
              <span className="inline-flex items-center gap-1 rounded-md bg-white/[0.06] px-2 py-1"><Clock size={12} /> {topic.estimatedHours}h</span>
            </div>
            <ProgressBar value={topic.progress} />
            <div className="mt-5 grid gap-3 text-sm">
              <div className="rounded-lg bg-black/30 p-3 font-mono text-xs text-cyan-100">{topic.commands.slice(0, 3).join("  |  ")}</div>
              <p className="flex gap-2 text-zinc-300"><FlaskConical className="mt-0.5 shrink-0 text-fuchsia-300" size={16} /> {topic.lab}</p>
              <p className="flex gap-2 text-zinc-400"><HelpCircle className="mt-0.5 shrink-0 text-amber-200" size={16} /> {topic.interviewQuestions[0]}</p>
              <p className="flex gap-2 text-zinc-400"><CheckCircle2 className="mt-0.5 shrink-0 text-emerald-300" size={16} /> {topic.practiceTasks[0]}</p>
            </div>
            <Button variant="secondary" className="mt-5 w-full" onClick={() => setSelectedTopic(topic)}>
              View Details
            </Button>
          </Card>
        ))}
      </div>
      <TopicDetails topic={selectedTopic} onClose={() => setSelectedTopic(null)} />
    </Page>
  );
}

function TopicDetails({ topic, onClose }: { topic: CcnaTopic | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {topic && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.section
            className="max-h-[88vh] w-full max-w-5xl overflow-auto rounded-lg border border-white/10 bg-zinc-950 p-5 shadow-2xl"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-cyan-300">Roadmap Detail</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">{topic.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">{topic.description}</p>
              </div>
              <button onClick={onClose} aria-label="Close details" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/[0.06] text-zinc-300 transition hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="mb-5 grid gap-3 sm:grid-cols-3">
              <DetailStat label="Difficulty" value={topic.difficulty} />
              <DetailStat label="Study Time" value={`${topic.estimatedHours} hours`} />
              <DetailStat label="Status" value={topic.status} />
            </div>
            <ProgressBar value={topic.progress} />

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <DetailBlock icon={TerminalSquare} title="Commands" items={topic.commands} mono />
              <DetailBlock icon={FlaskConical} title="Packet Tracer Lab" items={[topic.lab, "Capture before/after screenshots and verify every step with show commands."]} />
              <DetailBlock icon={HelpCircle} title="Interview Questions" items={topic.interviewQuestions} />
              <DetailBlock icon={BookOpen} title="Revision Notes" items={topic.revisionNotes} />
              <DetailBlock icon={AlertTriangle} title="Common Mistakes" items={topic.commonMistakes} />
              <DetailBlock icon={ListChecks} title="Practice Tasks" items={topic.practiceTasks} />
            </div>

            <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <div className="mb-3 flex items-center gap-2">
                <ExternalLink className="text-cyan-300" size={18} />
                <h3 className="font-semibold">Useful Resources</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {topic.resources.map((resource) => (
                  <span key={resource} className="rounded-md bg-cyan-300/10 px-2 py-1 text-xs text-cyan-100">
                    {resource}
                  </span>
                ))}
              </div>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DetailStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/[0.05] p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function DetailBlock({ icon: Icon, title, items, mono = false }: { icon: typeof TerminalSquare; title: string; items: string[]; mono?: boolean }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="text-cyan-300" size={18} />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item} className={cn("rounded-md bg-black/25 p-3 text-sm leading-6 text-zinc-300", mono && "font-mono text-xs text-cyan-100")}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
