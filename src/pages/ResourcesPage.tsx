import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bookmark, ExternalLink, FileText, Heart, Search } from "lucide-react";
import { Page } from "@/components/common/Page";
import { Card } from "@/components/ui/Card";
import { mockApi } from "@/services/api";
import { cn } from "@/utils/cn";

export function ResourcesPage() {
  const { data = [] } = useQuery({ queryKey: ["resources"], queryFn: mockApi.getResources });
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const categories = ["All", "Docs", "Video", "Lab", "PDF", "Cheatsheet", "Blog", "Favorites"];
  const filtered = useMemo(
    () => data.filter((item) => (category === "All" || item.category === category || (category === "Favorites" && item.favorite)) && item.title.toLowerCase().includes(search.toLowerCase())),
    [data, category, search]
  );

  return (
    <Page title="Resource Library" kicker="Clickable CCNA library">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search Cisco docs, NetworkChuck, CBT Nuggets, labs..." className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.05] pl-9 pr-3 text-sm outline-none focus:border-cyan-300/40" />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <button key={item} onClick={() => setCategory(item)} className={cn("rounded-lg px-3 py-2 text-xs font-medium transition", category === item ? "bg-white text-zinc-950" : "bg-white/[0.06] text-zinc-400 hover:text-white")}>{item}</button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((resource) => (
          <Card key={resource.id} className="transition hover:border-cyan-300/30 hover:bg-white/[0.07]">
            <div className="flex items-start justify-between">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-cyan-300/10 text-cyan-200">
                <FileText size={20} />
              </div>
              <button aria-label="Favorite" className={cn("grid h-9 w-9 place-items-center rounded-lg bg-white/[0.06]", resource.favorite ? "text-rose-300" : "text-zinc-500")}>
                <Heart size={17} fill={resource.favorite ? "currentColor" : "none"} />
              </button>
            </div>
            <a href={resource.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-lg font-semibold transition hover:text-cyan-200">
              {resource.title} <ExternalLink size={16} />
            </a>
            <p className="mt-2 text-sm text-zinc-500">{resource.source} - {resource.duration}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-md bg-cyan-300/10 px-2 py-1 text-xs text-cyan-200">{resource.category}</span>
              {resource.tags.map((tag) => <span key={tag} className="rounded-md bg-white/[0.06] px-2 py-1 text-xs text-zinc-400">{tag}</span>)}
            </div>
            <a href={resource.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cyan-200">
              <Bookmark size={16} /> Open resource
            </a>
          </Card>
        ))}
      </div>
    </Page>
  );
}
