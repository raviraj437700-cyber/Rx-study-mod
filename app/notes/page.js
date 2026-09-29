"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Sparkles, RotateCcw } from "lucide-react";
import { Shell, Card, Field, Select, Btn, ErrorBox, Loader, inp } from "@/components/ui";
import { useAI, ai } from "@/lib/useAI";
import { makePdf } from "@/lib/pdf";
import { SUBJECTS } from "@/lib/data";

export default function Notes() {
  const [topic, setTopic] = useState(""), [subject, setSubject] = useState(""), [other, setOther] = useState("");
  const [cls, setCls] = useState(""), [board, setBoard] = useState(""), [sb, setSb] = useState(""), [kind, setKind] = useState("");
  const [notes, setNotes] = useState(null);
  const { loading, error, setError, run } = useAI();

  const go = async () => {
    const sub = subject === "Others" ? other.trim() : subject, bd = board === "State Board" ? sb.trim() : board;
    if (topic.trim().length < 2) return setError("Please enter a topic.");
    if (!sub) return setError("Please choose or enter a subject.");
    if (!cls) return setError("Please choose your class.");
    if (!bd) return setError("Please choose or enter your board.");
    if (!kind) return setError("Please choose the notes type.");
    const d = await run(() => ai("notes", { topic: topic.trim(), subject: sub, cls, board: bd, kind }));
    if (d) setNotes(d);
  };
  const pdf = () => makePdf(notes.title, notes.sections.flatMap((s) => [{ t: "h1", x: s.heading }, ...s.points.map((p) => ({ t: "b", x: p }))]), "notes.pdf");

  if (loading) return <Shell title="Notes Maker" sub=""><Loader text="AI is writing your notes..." /></Shell>;

  if (notes) return (
    <Shell title={notes.title} sub="Your smart notes">
      <Card className="space-y-6">
        {notes.sections.map((s, k) => (
          <motion.div key={k} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: k * 0.08 }}>
            <h2 className="mb-2 text-xl font-bold text-cyan-200">{s.heading}</h2>
            <ul className="list-disc space-y-1.5 pl-5 text-slate-200">{s.points.map((p, j) => <li key={j}>{p}</li>)}</ul>
          </motion.div>
        ))}
      </Card>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Btn onClick={pdf}><Download size={18} /> Download Notes PDF</Btn>
        <button onClick={() => setNotes(null)} className="glass inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-semibold"><RotateCcw size={18} /> New notes</button>
      </div>
    </Shell>
  );

  return (
    <Shell title="Create Smart Notes with AI" sub="Structured notes for your class, subject and board.">
      <Card className="space-y-4">
        <Field label="Topic"><input className={inp} placeholder="e.g. Photosynthesis" value={topic} onChange={(e) => setTopic(e.target.value)} /></Field>
        <Select label="Subject" value={subject} onChange={setSubject} options={SUBJECTS} />
        {subject === "Others" && <input className={inp} placeholder="Enter subject name" value={other} onChange={(e) => setOther(e.target.value)} />}
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Class" value={cls} onChange={setCls} options={["6", "7", "8", "9", "10", "11", "12"]} />
          <Select label="Board" value={board} onChange={setBoard} options={["CBSE", "BSEB", "State Board"]} />
        </div>
        {board === "State Board" && <input className={inp} placeholder="Enter your State Board" value={sb} onChange={(e) => setSb(e.target.value)} />}
        <Select label="Notes Type" value={kind} onChange={setKind} options={["Short Notes", "Long Notes"]} />
        <ErrorBox msg={error} />
        <Btn onClick={go}><Sparkles size={18} /> Generate Notes</Btn>
      </Card>
    </Shell>
  );
         }
