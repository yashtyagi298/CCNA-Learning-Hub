import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, CheckCircle2, GripVertical, Plus } from "lucide-react";
import { Page } from "@/components/common/Page";
import { Card } from "@/components/ui/Card";
import { backendApi, mockApi } from "@/services/api";
import { useAppStore } from "@/store/useAppStore";
import type { StudyTask, TaskStatus } from "@/types";
import { cn } from "@/utils/cn";

type NewTaskForm = {
  title: string;
  description: string;
  topic: string;
  due: string;
  priority: "Low" | "Medium" | "High";
  checklist: string;
};

const columns: { id: TaskStatus; title: string }[] = [
  { id: "todo", title: "Todo" },
  { id: "in-progress", title: "In Progress" },
  { id: "completed", title: "Completed" },
  { id: "review", title: "Review" }
];

export function TaskBoardPage() {
  const { user } = useAppStore();
  const queryClient = useQueryClient();
  const { data = [] } = useQuery<StudyTask[]>({ queryKey: ["tasks", user?.id], queryFn: async () => (user ? backendApi.getTasks() : mockApi.getTasks()) });
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [newTask, setNewTask] = useState<NewTaskForm>({
    title: "",
    description: "",
    topic: "",
    due: "Today",
    priority: "Medium" as const,
    checklist: ""
  });
  const board = tasks.length ? tasks : data;
  const grouped = useMemo(() => columns.map((column) => ({ ...column, tasks: board.filter((task: StudyTask) => task.status === column.id) })), [board]);

  useEffect(() => {
    if (data.length) {
      setTasks(data.map((task: StudyTask & { _id?: string }) => ({ ...task, id: task.id ?? task._id ?? "" })));
    }
  }, [data]);

  async function moveTask(id: string, status: TaskStatus) {
    setTasks(board.map((task: StudyTask) => (task.id === id ? { ...task, status } : task)));
    if (user) {
      await backendApi.updateTask(id, { status });
      await queryClient.invalidateQueries();
    }
  }

  async function addTodo() {
    if (!newTask.title.trim()) return;
    const payload = {
      title: newTask.title.trim(),
      description: newTask.description.trim() || "No description added.",
      checklist: newTask.checklist.split(",").map((item) => item.trim()).filter(Boolean).length ? newTask.checklist.split(",").map((item) => item.trim()).filter(Boolean) : ["Define outcome", "Study or lab", "Verify with notes"],
      status: "todo" as const,
      priority: newTask.priority,
      due: newTask.due.trim() || "Today",
      topic: newTask.topic.trim() || "Custom"
    };
    if (user) {
      const created = await backendApi.createTask(payload);
      setTasks([{ ...created, id: created.id ?? created._id }, ...board]);
      await queryClient.invalidateQueries();
    } else {
      setTasks([{ id: `local-${Date.now()}`, ...payload }, ...board]);
    }
    setNewTask({ title: "", description: "", topic: "", due: "Today", priority: "Medium", checklist: "" });
  }

  return (
    <Page title="Task Board" kicker="Kanban study flow">
      <Card className="mb-5 p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_0.8fr_0.5fr_0.4fr]">
          <input
            value={newTask.title}
            onChange={(event) => setNewTask({ ...newTask, title: event.target.value })}
            onKeyDown={(event) => {
              if (event.key === "Enter") addTodo();
            }}
            placeholder="Task title, e.g. Build OSPF lab"
            className="h-11 flex-1 rounded-lg border border-white/10 bg-white/[0.05] px-3 text-sm outline-none focus:border-cyan-300/40"
          />
          <input value={newTask.topic} onChange={(event) => setNewTask({ ...newTask, topic: event.target.value })} placeholder="Topic, e.g. OSPF" className="h-11 rounded-lg border border-white/10 bg-white/[0.05] px-3 text-sm outline-none focus:border-cyan-300/40" />
          <input value={newTask.due} onChange={(event) => setNewTask({ ...newTask, due: event.target.value })} placeholder="Due" className="h-11 rounded-lg border border-white/10 bg-white/[0.05] px-3 text-sm outline-none focus:border-cyan-300/40" />
          <select value={newTask.priority} onChange={(event) => setNewTask({ ...newTask, priority: event.target.value as "Low" | "Medium" | "High" })} className="h-11 rounded-lg border border-white/10 bg-zinc-950 px-3 text-sm outline-none focus:border-cyan-300/40">
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
          <textarea value={newTask.description} onChange={(event) => setNewTask({ ...newTask, description: event.target.value })} rows={3} placeholder="Task details: what exactly has to be done?" className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm outline-none focus:border-cyan-300/40" />
          <textarea value={newTask.checklist} onChange={(event) => setNewTask({ ...newTask, checklist: event.target.value })} rows={3} placeholder="Checklist separated by commas: configure, verify, document" className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm outline-none focus:border-cyan-300/40" />
          <button onClick={addTodo} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-zinc-950 transition hover:bg-cyan-100">
            <Plus size={17} /> Add Todo
          </button>
        </div>
      </Card>
      <div className="grid gap-4 xl:grid-cols-4">
        {grouped.map((column) => (
          <Card key={column.id} className="min-h-[540px] p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">{column.title}</h2>
              <span className="rounded-md bg-white/[0.07] px-2 py-1 text-xs text-zinc-400">{column.tasks.length}</span>
            </div>
            <div className="space-y-3">
              {column.tasks.map((task) => (
                <div key={task.id} draggable onDragStart={(event) => event.dataTransfer.setData("task", task.id)} className="rounded-lg border border-white/10 bg-white/[0.045] p-3 transition hover:border-cyan-300/30">
                  <div className="mb-3 flex items-start gap-2">
                    <GripVertical className="mt-0.5 text-zinc-600" size={16} />
                    <div>
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="mt-1 text-xs text-zinc-500">{task.topic}</p>
                    </div>
                  </div>
                  <p className="mb-3 text-xs leading-5 text-zinc-400">{task.description}</p>
                  <div className="mb-3 space-y-1.5">
                    {task.checklist.map((item) => (
                      <p key={item} className="flex items-center gap-2 text-xs text-zinc-500">
                        <CheckCircle2 size={12} className="text-cyan-300" /> {item}
                      </p>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={cn("rounded-md px-2 py-1 text-xs", task.priority === "High" ? "bg-rose-300/15 text-rose-200" : task.priority === "Medium" ? "bg-amber-300/15 text-amber-200" : "bg-emerald-300/15 text-emerald-200")}>{task.priority}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-zinc-500"><Calendar size={12} /> {task.due}</span>
                  </div>
                </div>
              ))}
              <div onDragOver={(event) => event.preventDefault()} onDrop={(event) => moveTask(event.dataTransfer.getData("task"), column.id)} className="grid h-16 place-items-center rounded-lg border border-dashed border-white/10 text-xs text-zinc-600">Drop task here</div>
            </div>
          </Card>
        ))}
      </div>
    </Page>
  );
}
