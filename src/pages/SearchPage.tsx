import { Search } from "lucide-react";
import { Page } from "@/components/common/Page";
import { Card } from "@/components/ui/Card";
import { resources, topics } from "@/mock/data";
import { useAppStore } from "@/store/useAppStore";

export function SearchPage() {
  const { query, setQuery } = useAppStore();
  const q = query.toLowerCase();
  const topicResults = topics.filter((topic) => `${topic.title} ${topic.commands.join(" ")}`.toLowerCase().includes(q)).slice(0, 8);
  const resourceResults = resources.filter((resource) => `${resource.title} ${resource.tags.join(" ")}`.toLowerCase().includes(q)).slice(0, 6);
  const commands = topics.flatMap((topic) => topic.commands.map((command) => ({ command, topic: topic.title }))).filter((item) => item.command.toLowerCase().includes(q)).slice(0, 8);

  return (
    <Page title="Global Search" kicker="Topic, resource, command">
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try OSPF, subnetting, show vlan..." className="h-13 w-full rounded-lg border border-white/10 bg-white/[0.05] pl-12 pr-4 text-sm outline-none focus:border-cyan-300/40" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <ResultColumn title="Topics" items={topicResults.map((topic) => [topic.title, topic.description])} />
        <ResultColumn title="Resources" items={resourceResults.map((resource) => [resource.title, `${resource.category} · ${resource.source}`])} />
        <ResultColumn title="Commands" items={commands.map((item) => [item.command, item.topic])} mono />
      </div>
    </Page>
  );
}

function ResultColumn({ title, items, mono = false }: { title: string; items: string[][]; mono?: boolean }) {
  return <Card><h2 className="mb-4 text-lg font-semibold">{title}</h2><div className="space-y-3">{items.map(([name, meta]) => <div key={`${title}-${name}`} className="rounded-lg bg-white/[0.04] p-3"><p className={mono ? "font-mono text-sm text-cyan-100" : "text-sm font-medium"}>{name}</p><p className="mt-1 text-xs text-zinc-500">{meta}</p></div>)}</div></Card>;
}
