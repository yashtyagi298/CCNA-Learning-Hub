import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactMarkdown from "react-markdown";
import { ImagePlus, Save } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Page } from "@/components/common/Page";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { backendApi } from "@/services/api";
import { useAppStore } from "@/store/useAppStore";

const journalSchema = z.object({
  todayStudy: z.string().min(3),
  hours: z.coerce.number().min(0).max(24),
  topics: z.string().min(2),
  commands: z.string().min(2),
  problems: z.string(),
  goals: z.string(),
  mentorNotes: z.string()
});

type JournalInput = z.input<typeof journalSchema>;
type JournalOutput = z.output<typeof journalSchema>;

export function JournalPage() {
  const { journal, updateJournal, user } = useAppStore();
  const queryClient = useQueryClient();
  const { register, handleSubmit, watch } = useForm<JournalInput, unknown, JournalOutput>({ resolver: zodResolver(journalSchema), defaultValues: journal });
  const markdown = watch("todayStudy");
  const onDrop = useCallback(() => toast.success("Image queued for future backend upload"), []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "image/*": [] } });

  return (
    <Page title="Daily Journal" kicker="Reflection and proof">
      <form onSubmit={handleSubmit(async (values) => {
        updateJournal(values);
        if (user) {
          await backendApi.saveJournal(values);
          await queryClient.invalidateQueries();
          toast.success("Journal saved to MongoDB for senior review");
        } else {
          toast.success("Journal saved locally. Login to sync with senior/admin dashboard.");
        }
      })} className="grid gap-4 xl:grid-cols-[1fr_0.85fr]">
        <Card className="space-y-4">
          <Field label="Today's Study"><textarea {...register("todayStudy")} rows={6} className="input resize-none" /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Hours Studied"><input {...register("hours")} type="number" step="0.25" className="input" /></Field>
            <Field label="Topics Learned"><input {...register("topics")} className="input" /></Field>
          </div>
          <Field label="Commands Practiced"><input {...register("commands")} className="input font-mono" /></Field>
          <Field label="Problems Faced"><textarea {...register("problems")} rows={4} className="input resize-none" /></Field>
          <Field label="Tomorrow Goals"><textarea {...register("goals")} rows={4} className="input resize-none" /></Field>
          <Field label="Mentor Notes"><textarea {...register("mentorNotes")} rows={3} className="input resize-none" /></Field>
          <Button type="submit"><Save size={17} /> Save Journal</Button>
        </Card>
        <div className="space-y-4">
          <Card>
            <h2 className="mb-4 text-lg font-semibold">Markdown Preview</h2>
            <div className="prose prose-invert max-w-none text-sm">
              <ReactMarkdown>{markdown || "Start writing your study log..."}</ReactMarkdown>
            </div>
          </Card>
          <Card>
            <div {...getRootProps()} className="grid min-h-52 cursor-pointer place-items-center rounded-lg border border-dashed border-white/15 bg-white/[0.035] p-6 text-center transition hover:border-cyan-300/40">
              <input {...getInputProps()} />
              <div>
                <ImagePlus className="mx-auto text-cyan-300" size={30} />
                <p className="mt-3 text-sm font-medium">{isDragActive ? "Drop the study screenshot" : "Upload topology screenshot"}</p>
                <p className="mt-1 text-xs text-zinc-500">Static UI now, API-ready later</p>
              </div>
            </div>
          </Card>
        </div>
      </form>
    </Page>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-zinc-300"><span className="mb-2 block">{label}</span>{children}</label>;
}
