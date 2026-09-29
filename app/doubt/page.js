"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Sparkles, RotateCcw } from "lucide-react";
import { Shell, Card, Select, Btn, ErrorBox, Upload, Loader, shrinkImage, inp } from "@/components/ui";
import { useAI, ai } from "@/lib/useAI";
import { makePdf } from "@/lib/pdf";
import { SUBJECTS, LANGS } from "@/lib/data";

export default function Doubt() {
  const [file, setFile] = useState(null), [subject, setSubject] = useState(""), [other, setOther] = useState(""), [lang, setLang] = useState("");
  const [res, setRes] = useState(null);
  const { loading, error, setError, run } = useAI();

  const go = async () => {
    const sub = subject === "Others" ? other.trim() : subject;
    if (!file) return setError("Please upload a question image.");
    if (!sub) return setError("Please choose or enter a subject.");
    if (!lang) return setError("Please choose the answer language.");
    const d = await run(async () => ai("doubt", { image: await shrinkImage(file), subject: sub, language: lang }));
    if (d) setRes(d);
  };
  const pdf = () => makePdf("Doubt Solution", [
    { t: "h2", x: "Question" }, { t: "p", x: res.question },
    { t: "h2", x: "Understanding" }, { t: "p", x: res.understanding },
    { t: "h2", x: "Step-by-step solution" }, ...res.steps.map((s, k) => ({ t: "p", x: `Step ${k + 1}: ${s}` })),
    { t: "h2", x: "Explanation" }, { t: "p", x: res.explanation },
    { t: "h2", x: "Final Answer" }, { t: "p", x: res.answer },
  ], "solution.pdf");

  if (loading) return <Shell title="Doubt Solver" sub=""><Loader text="AI is solving your doubt..." /></Shell>;

  if (res) {
    const box = (t, c) => <Card><h3 className="mb-2 font-bold text-cyan-200">{t}</h3>{c}</Card>;
    return (
      <Shell title="Solution" sub="Step by step.">
        <div className="space-y-4">
          {[box("Question", <p>{res.question}</p>), box("Understanding", <p>{res.understanding}</p>),
            box("Step-by-step solution", <ol className="list-decimal space-y-2 pl-5">{res.steps.map((s, k) => <li key={k}>{s}</li>)}</ol>),
            box("Explanation", <p>{res.explanation}</p>),
            <Card className="border-emerald-400/40 bg-emerald-500/10"><h3 className="mb-2 font-bold text-emerald-300">Final Answer</h3><p className="text-lg font-semibold">{res.answer}</p></Card>,
          ].map((n, k) => <motion.div key={k} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: k * 0.12 }}>{n}</motion.div>)}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Btn onClick={pdf}><Download size={18} /> Download Solution PDF</Btn>
          <button onClick={() => setRes(null)} className="glass inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-semibold"><RotateCcw size={18} /> New doubt</button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell title="Doubt Solver" sub="Upload a photo of your question and get a clear solution.">
      <Card className="space-y-4">
        <Upload kind="image" maxMB={10} file={file} onFile={setFile} onError={setError} />
        <Select label="Subject" value={subject} onChange={setSubject} options={SUBJECTS} />
        {subject === "Others" && <input className={inp} placeholder="Enter subject name" value={other} onChange={(e) => setOther(e.target.value)} />}
        <Select label="Answer Language" value={lang} onChange={setLang} options={LANGS} />
        <ErrorBox msg={error} />
        <Btn onClick={go}><Sparkles size={18} /> Solve Doubt</Btn>
      </Card>
    </Shell>
  );
    }
