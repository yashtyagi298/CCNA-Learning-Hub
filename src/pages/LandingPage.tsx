import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CheckCircle2, Network, Play, Shield, Sparkles, TerminalSquare, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/store/useAppStore";

const features = [
  { icon: Network, title: "Structured CCNA Roadmap", text: "Every topic is mapped to labs, commands, revision notes, and mistakes worth remembering." },
  { icon: TerminalSquare, title: "Built-in Network Tools", text: "Subnetting, wildcard masks, CIDR, binary conversion, timers, flashcards, and command sheets." },
  { icon: Trophy, title: "Progress That Feels Real", text: "Study heatmaps, streaks, achievements, leaderboards, and analytics keep momentum visible." }
];

export function LandingPage() {
  const user = useAppStore((state) => state.user);
  const appEntry = user ? (user.role === "admin" ? "/app/admin" : "/app/dashboard") : "/login";

  return (
    <main className="min-h-screen overflow-hidden bg-zinc-950 text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px]" />
        <div className="absolute left-[10%] top-20 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute right-[8%] top-40 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <nav className="relative z-10 mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-cyan-300 to-fuchsia-400 text-zinc-950">
            <Network size={21} />
          </div>
          <span className="text-sm font-semibold">CCNA Learning Hub</span>
        </Link>
        <Link to={appEntry}>
          <Button variant="secondary">{user ? "Open Dashboard" : "Login"}</Button>
        </Link>
      </nav>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-10 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-[1fr_0.82fr] lg:px-8">
        <div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-sm text-cyan-200">
            <Sparkles size={15} /> Premium CCNA command center
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
            CCNA Learning Hub
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            A polished learning OS for mastering networking foundations, labs, commands, and revision rhythm with the calm precision of a modern developer dashboard.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-8 flex flex-wrap gap-3">
            <Link to={appEntry}><Button>{user ? "Open Dashboard" : "Login to Start"} <ArrowRight size={17} /></Button></Link>
            <Link to={user ? "/app/topics" : "/login"}><Button variant="secondary"><Play size={17} /> View Topics</Button></Link>
          </motion.div>
          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
            {[
              ["38", "CCNA topics"],
              ["42", "labs tracked"],
              ["27", "day streak"]
            ].map(([value, label]) => (
              <Card key={label} className="p-4">
                <p className="text-3xl font-semibold">{value}</p>
                <p className="mt-1 text-xs text-zinc-400">{label}</p>
              </Card>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.12 }} className="relative">
          <div className="absolute -left-8 top-12 hidden rounded-lg border border-white/10 bg-zinc-950/80 p-3 shadow-2xl backdrop-blur-xl lg:block">
            <div className="flex items-center gap-2 text-sm text-cyan-200"><Zap size={16} /> OSPF lab live</div>
          </div>
          <Card className="overflow-hidden p-0">
            <div className="border-b border-white/10 bg-white/[0.03] px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-amber-300" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-3">
                {["Router A", "Switch 1", "Core", "Cloud"].map((node, index) => (
                  <motion.div
                    key={node}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 4, delay: index * 0.2, repeat: Infinity }}
                    className="rounded-lg border border-white/10 bg-white/[0.05] p-4"
                  >
                    <Network className="mb-8 text-cyan-300" size={28} />
                    <p className="font-medium">{node}</p>
                    <p className="text-xs text-zinc-500">10.10.{index}.1/24</p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-5 rounded-lg bg-black/40 p-4 font-mono text-xs leading-6 text-cyan-100">
                <p>R1# show ip route ospf</p>
                <p className="text-zinc-500">O 10.20.30.0/24 [110/20] via 10.10.0.2</p>
                <p className="text-emerald-300">Verification passed: adjacency FULL</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <feature.icon className="text-cyan-300" size={24} />
              <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{feature.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-sm font-medium text-cyan-300">Learning timeline</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">From fundamentals to exam-ready troubleshooting.</h2>
        </div>
        <div className="space-y-3">
          {["Networking basics and addressing", "Switching, VLANs, and STP", "Routing, services, and security", "Automation, review, and final labs"].map((item) => (
            <Card key={item} className="flex items-center gap-3 p-4">
              <CheckCircle2 className="text-emerald-300" size={19} />
              <span className="text-sm text-zinc-200">{item}</span>
            </Card>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {["Feels like a professional workspace, not a study spreadsheet.", "The command and lab context makes progress practical.", "Clean enough to use daily without visual fatigue."].map((quote, index) => (
            <Card key={quote}>
              <p className="text-sm leading-6 text-zinc-300">&quot;{quote}&quot;</p>
              <p className="mt-5 text-xs text-zinc-500">Mentor review #{index + 1}</p>
            </Card>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 px-4 py-10 text-center text-sm text-zinc-500">
        Built for disciplined CCNA preparation. Ready for future API and authentication layers.
      </footer>
    </main>
  );
}
