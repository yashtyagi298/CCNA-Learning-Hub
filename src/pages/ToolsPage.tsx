import { useEffect, useMemo, useState } from "react";
import { Binary, Calculator, Clock, Copy, Route, TimerReset } from "lucide-react";
import { toast } from "sonner";
import { Page } from "@/components/common/Page";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

function maskFromCidr(cidr: number) {
  const mask = (0xffffffff << (32 - cidr)) >>> 0;
  return [24, 16, 8, 0].map((shift) => (mask >>> shift) & 255).join(".");
}

function wildcardFromCidr(cidr: number) {
  return maskFromCidr(cidr).split(".").map((octet) => 255 - Number(octet)).join(".");
}

export function ToolsPage() {
  const [cidr, setCidr] = useState(24);
  const [decimal, setDecimal] = useState(192);
  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const subnet = useMemo(() => ({ mask: maskFromCidr(cidr), wildcard: wildcardFromCidr(cidr), hosts: cidr === 32 ? 1 : Math.max(0, 2 ** (32 - cidr) - 2), block: 2 ** (32 - cidr) }), [cidr]);
  const tools = ["Subnetting Calculator", "IPv4 Calculator", "Wildcard Calculator", "CIDR Calculator", "Binary Converter", "Hex Converter", "Study Timer", "Pomodoro Timer", "Command Cheat Sheet", "Flashcards", "Revision Planner"];

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setRunning(false);
          toast.success("Focus session complete");
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [running]);

  function setTimerMinutes(value: number) {
    const next = Math.max(5, value);
    setMinutes(next);
    setSecondsLeft(next * 60);
    setRunning(false);
  }

  const timerLabel = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;

  return (
    <Page title="Networking Tools" kicker="Practice utilities">
      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <div className="mb-5 flex items-center gap-3"><Calculator className="text-cyan-300" /><h2 className="text-lg font-semibold">Subnetting, IPv4, Wildcard, CIDR</h2></div>
          <label className="text-sm text-zinc-300">CIDR Prefix: /{cidr}</label>
          <input type="range" min="1" max="32" value={cidr} onChange={(event) => setCidr(Number(event.target.value))} className="mt-4 w-full accent-cyan-300" />
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <ToolStat label="Subnet Mask" value={subnet.mask} />
            <ToolStat label="Wildcard Mask" value={subnet.wildcard} />
            <ToolStat label="Usable Hosts" value={subnet.hosts.toLocaleString()} />
            <ToolStat label="Block Size" value={subnet.block.toLocaleString()} />
          </div>
        </Card>
        <Card>
          <div className="mb-5 flex items-center gap-3"><Binary className="text-fuchsia-300" /><h2 className="text-lg font-semibold">Binary and Hex Converter</h2></div>
          <input type="number" min="0" max="255" value={decimal} onChange={(event) => setDecimal(Number(event.target.value))} className="input" />
          <div className="mt-4 grid gap-3">
            <ToolStat label="Binary" value={decimal.toString(2).padStart(8, "0")} />
            <ToolStat label="Hex" value={`0x${decimal.toString(16).toUpperCase().padStart(2, "0")}`} />
          </div>
        </Card>
        <Card>
          <div className="mb-5 flex items-center gap-3"><TimerReset className="text-emerald-300" /><h2 className="text-lg font-semibold">Study Timer and Pomodoro</h2></div>
          <div className="flex items-center gap-3">
            <button onClick={() => setTimerMinutes(minutes - 5)} className="grid h-10 w-10 place-items-center rounded-lg bg-white/[0.06]">-</button>
            <div className="flex-1 rounded-lg bg-black/30 p-5 text-center text-4xl font-semibold">{timerLabel}</div>
            <button onClick={() => setTimerMinutes(minutes + 5)} className="grid h-10 w-10 place-items-center rounded-lg bg-white/[0.06]">+</button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={() => setRunning((current) => !current)}><Clock size={17} /> {running ? "Pause" : "Start"} Focus</Button>
            <Button variant="secondary" onClick={() => setTimerMinutes(minutes)}>Reset</Button>
          </div>
        </Card>
        <Card>
          <div className="mb-5 flex items-center gap-3"><Route className="text-cyan-300" /><h2 className="text-lg font-semibold">Command Cheat Sheet</h2></div>
          <div className="space-y-2 font-mono text-xs text-cyan-100">
            {["show ip interface brief", "show vlan brief", "show interfaces trunk", "show ip route", "show access-lists", "show ip nat translations"].map((command) => (
              <button key={command} onClick={() => navigator.clipboard?.writeText(command).then(() => toast.success("Command copied"))} className="flex w-full items-center justify-between rounded-lg bg-black/30 p-3 text-left transition hover:bg-white/[0.06]">{command}<Copy size={14} /></button>
            ))}
          </div>
        </Card>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-4">
        {tools.map((tool) => <Card key={tool} className="p-4 text-sm font-medium text-zinc-300">{tool}</Card>)}
      </div>
    </Page>
  );
}

function ToolStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-white/[0.05] p-4"><p className="text-xs text-zinc-500">{label}</p><p className="mt-2 font-mono text-lg text-white">{value}</p></div>;
}
