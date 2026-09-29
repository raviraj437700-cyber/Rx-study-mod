"use client";
import { useEffect, useState } from "react";
import { Download, Sparkles, RotateCcw } from "lucide-react";
import { Shell, Card, Select, Btn, ErrorBox, Upload, Loader } from "@/components/ui";
import { useAI, ai } from "@/lib/useAI";
import { pdfToText } from "@/lib/pdftext";
import { makePdf } from "@/lib/pdf";
import { LANGS } from "@/lib/data";

function useCount(target) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let s, raf;
    const f = (t) => { s = s ?? t; const k = Math.min(1, (t - s) / 1200); setV(Math.round(target * k)); if (k < 1) raf = requestAnimationFrame(f); };
    raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return v;
}

function Result({ total, correct, onPdf, onAgain }) {
  const pct = Math.round((correct / total) * 100), v = useCount(pct), C = 2 * Math.PI * 52;
  const stats = [["Total Questions", total], ["Correct Answers", correct], ["Wrong Answers", total - correct], ["Score", `${correct}/${total}`]];
  return (
    <Card className="text-center">
      <div className="relative mx-auto h-40 w-40">
        <svg viewBox="0 0 120 120" className="-rotate-90">
          <defs><linearGradient id="g"><stop offset="0" stopColor="#818cf8" /><stop offset="1" stopColor="#22d3ee" /></linearGradient></defs>
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="10" />
          <circle cx="60" cy="60" r="52" fill="none" stroke="url(#g)" strokeWidth="10" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - v / 100)} />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-4xl font-extrabold">{v}%</div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
        {stats.map(([k, x]) => <div key={k} className="rounded-2xl bg-white/5 p-3"><p className="text-slate-400">{k}</p><p className="text-xl font-bold">{x}</p></div>)}
      </div>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Btn onClick={onPdf}><Download size={18} /> Download Quiz PDF</Btn>
        <button onClick={onAgain} className="glass inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-semibold"><RotateCcw size={18} /> New Quiz</button>
      </div>
    </Card>
  );
}

export default function Quiz() {
  const [file, setFile] = useState(null), [count, setCount] = useState(""), [lang, setLang] = useState("");
  const [qs, setQs] = useState(null), [i, setI] = useState(0), [sel, setSel] = useState(null), [score, setScore] = useState(0), [done, setDone] = useState(false);
  const { loading, error, setError, run } = useAI();

  const go = async () => {
    if (!file) return setError("Please upload a PDF.");
    if (!count) return setError("Choose the number of MCQs.");
    if (!lang) return setError("Choose a language.");
    const d = await run(async () => ai("quiz", { text: await pdfToText(file), count, language: lang }));
    if (d?.questions?.length) { setQs(d.questions); setI(0); setSel(null); setScore(0); setDone(false); }
  };
  const pick = (o) => { if (sel !== null) return; setSel(o); if (o === qs[i].answer) setScore((s) => s + 1); };
  const next = () => { if (i + 1 >= qs.length) setDone(true); else { setI(i + 1); setSel(null); } };
  const pdf = () => {
    const b = qs.flatMap((q, n) => [
      { t: "h2", x: `Q${n + 1}. ${q.q}` },
      ...q.options.map((o, k) => ({ t: "b", x: `${k + 1}. ${o}` })),
      { t: "p", x: `Correct answer: ${q.answer + 1}. ${q.options[q.answer]}` },
    ]);
    b.push({ t: "h1", x: `Result: ${score}/${qs.length} (${Math.round((score / qs.length) * 100)}%)` });
    makePdf("MCQ Quiz", b, "quiz.pdf");
  };

  if (loading) return <Shell title="MCQ / Quiz" sub=""><Loader text="AI is creating your quiz..." /></Shell>;
  if (qs && done) return <Shell title="Quiz Result" sub="Well done!"><Result total={qs.length} correct={score} onPdf={pdf} onAgain={() => setQs(null)} /></Shell>;

  if (qs) {
    const q = qs[i];
    return (
      <Shell title="MCQ / Quiz" sub={`Question ${i + 1} of ${qs.length}`}>
        <div className="mb-5 h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-cyan-300 transition-all duration-500" style={{ width: `${((i + 1) / qs.length) * 100}%` }} /></div>
        <Card>
          <p className="mb-5 text-lg font-semibold">Q{i + 1}. {q.q}</p>
          <div className="space-y-3">
            {q.options.map((o, k) => {
              let cls = "border-white/10 bg-white/5 hover:border-indigo-400";
              if (sel !== null) cls = k === q.answer ? "border-emerald-400 bg-emerald-500/20" : k === sel ? "border-red-400 bg-red-500/20 shake" : "border-white/10 bg-white/5 opacity-50";
              return <button key={k} onClick={() => pick(k)} className={`w-full rounded-2xl border p-4 text-left transition duration-300 ${cls}`}>{k + 1}. {o}</button>;
            })}
          </div>
          {sel !== null && <div className="mt-6"><Btn onClick={next}>{i + 1 >= qs.length ? "See Result" : "Next Question"}</Btn></div>}
        </Card>
      </Shell>
    );
  }

  return (
    <Shell title="MCQ / Quiz" sub="Upload a chapter PDF and practice with questions made from it.">
      <Card className="space-y-4">
        <Upload file={file} onFile={setFile} onError={setError} />
        <Select label="Number of MCQs" value={count} onChange={setCount} options={["10", "20", "30", "40", "50"]} />
        <Select label="Language" value={lang} onChange={setLang} options={LANGS} />
        <ErrorBox msg={error} />
        <Btn onClick={go}><Sparkles size={18} /> Generate Quiz</Btn>
      </Card>
    </Shell>
  );
    }
