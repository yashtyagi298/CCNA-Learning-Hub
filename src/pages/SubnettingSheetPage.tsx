import { useMemo, useState } from "react";
import { Award, CheckCircle2, RotateCcw } from "lucide-react";
import { Page } from "@/components/common/Page";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { subnettingQuestions } from "@/mock/subnettingQuiz";
import { backendApi } from "@/services/api";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/utils/cn";

export function SubnettingSheetPage() {
  const { subnettingScore, subnettingAttempts, setSubnettingScore, user } = useAppStore();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(
    () => subnettingQuestions.reduce((total, question) => total + (answers[question.id] === question.answer ? 1 : 0), 0),
    [answers]
  );

  async function submitQuiz() {
    setSubmitted(true);
    setSubnettingScore(score);
    if (user) await backendApi.saveSubnettingAttempt({ score, total: 100, answers });
  }

  function resetQuiz() {
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <Page
      title="Subnetting MCQ Sheet"
      kicker="100-question scoring practice"
      action={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={resetQuiz}><RotateCcw size={17} /> Reset</Button>
          <Button onClick={submitQuiz}><CheckCircle2 size={17} /> Submit Score</Button>
        </div>
      }
    >
      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-zinc-500">Current Attempt</p>
          <h2 className="mt-2 text-3xl font-semibold">{score}/100</h2>
          <div className="mt-4"><ProgressBar value={score} /></div>
        </Card>
        <Card>
          <p className="text-sm text-zinc-500">Best / Saved Score</p>
          <h2 className="mt-2 text-3xl font-semibold">{subnettingScore}/100</h2>
          <p className="mt-2 text-xs text-cyan-300">Shown on Dashboard and Achievements</p>
        </Card>
        <Card>
          <p className="text-sm text-zinc-500">Attempts</p>
          <h2 className="mt-2 flex items-center gap-2 text-3xl font-semibold"><Award className="text-cyan-300" /> {subnettingAttempts}</h2>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {subnettingQuestions.map((question) => {
          const selected = answers[question.id];
          const correct = selected === question.answer;
          return (
            <Card key={question.id} className={cn(submitted && correct && "border-emerald-300/30", submitted && selected && !correct && "border-rose-300/30")}>
              <h2 className="text-sm font-semibold leading-6">{question.question}</h2>
              <div className="mt-4 grid gap-2">
                {question.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => setAnswers((current) => ({ ...current, [question.id]: option }))}
                    className={cn(
                      "rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-left text-sm transition hover:border-cyan-300/35",
                      selected === option && "border-cyan-300/50 bg-cyan-300/10 text-cyan-100",
                      submitted && option === question.answer && "border-emerald-300/50 bg-emerald-300/10 text-emerald-100",
                      submitted && selected === option && option !== question.answer && "border-rose-300/50 bg-rose-300/10 text-rose-100"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {submitted && <p className="mt-3 text-xs leading-5 text-zinc-400">{question.explanation}</p>}
            </Card>
          );
        })}
      </div>
    </Page>
  );
}
