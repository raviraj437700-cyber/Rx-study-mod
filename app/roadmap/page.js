"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Sparkles, RotateCcw } from "lucide-react";
import { Shell, Card, Field, Select, Btn, ErrorBox, Loader, inp } from "@/components/ui";
import { useAI } from "@/lib/useAI";
import { makePlan } from "@/lib/plan";
import { makePdf } from "@/lib/pdf";
import { SUBJECTS } from "@/lib/data";

const nums = (n) => Array.from({ length: n }, (_, i) => String(i + 1));

export default function Roadmap() {
  const [name, setName] = useState(""), [days, setDays] = useState(""), [hours, setHours] = useState(""), [num, setNum] = useState("");
  const [subs, setSubs] = useState([]), [plan, setPlan] = useState(null);
  const { loading, error, setError, run } = useAI();

  const setN = (v) => { setNum(v); setSubs(Array.from({ length: Number(v) || 0 }, (_, k) => subs[k] || { name: "", other: "", cc: "", chapters: [] })); };
  const upd = (k, p) => setSubs(subs.map((s, j) => (j === k ? { ...s, ...p } : s)));
  const setCC = (k, v) => upd(k, { cc: v, chapters: Array.from({ length: Number(v) || 0 }, (_, c) => subs[k].chapters[c] || "") });
  const setCh = (k, c, v) => upd(k, { chapters: subs[k].chapters.map((x, j) => (j === c ? v : x)) });

  const go = async () => {
    const d = Number(days), h = Number(hours);
    if (!name.trim()) return setError("Please enter your name.");
    if (!Number.isInteger(d) || d < 1 || d > 365) return setError("Days remaining must be a number from 1 to 365.");
    if (!(h >= 0.5 && h <= 16)) return setError("Daily study time must be between 0.5 and 16 hours.");
    if (!subs.length) return setError("Please choose the number of subjects.");
    const subjects = [];
    for (let k = 0; k < subs.length; k++) {
      const s = subs[k], nm = s.name === "Others" ? s.other.trim() : s.name;
      if (!nm) return setError(`Subject ${k + 1}: please choose or enter a subject.`);
      if (!s.chapters.length) return setError(`Subject ${k + 1}: please choose the number of chapters.`);
      if (s.chapters.some((c) => !c.trim())) return setError(`Subject ${k + 1}: please fill all chapter names.`);
      subjects.push({ name: nm, chapters: s.chapters.map((c) => c.trim()) });
    }
    const p = await run(async () => { await new Promise((r) => setTimeout(r, 1000)); return makePlan({ days: d, hours: h, subjects }); });
    if (p) setPlan(p);
  };

  const pdf = () => {
    const b = [{ t: "p", x: `Student: ${name} | Days left: ${days} | Daily study: ${hours} h` }];
    plan.forEach((d) => {
      b.push({ t: "h2", x: `Day ${d.day}${d.kind === "final" ? " - Final revision" : d.kind === "revision" ? " - Revision" : ""}` });
      d.items.forEach((i) => b.push({ t: "b", x: `${i.s}: ${i.c}` }));
      b.push({ t: "p", x: `Study ${d.study} h | Practice ${d.practice} h | Revision ${d.revision} h. ${d.note}` });
    });
    makePdf(`Study Roadmap - ${name}`, b, "study-roadmap.pdf");
  };

  if (loading) return <Shell title="Roadmap" sub=""><Loader text="AI is creating your study plan..." /></Shell>;

  if (plan) return (
    <Shell title="Your Roadmap" sub={`${name}, ${plan.length} days plan`}>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <Btn onClick={pdf}><Download size={18} /> Download Roadmap PDF</Btn>
        <button onClick={() => setPlan(null)} className="glass inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-semibold"><RotateCcw size={18} /> Edit details</button>
      </div>
      <div className="relative pl-6 sm:pl-8">
        <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1.4 }} style={{ originY: 0 }} className="absolute bottom-0 left-2 top-0 w-0.5 bg-gradient-to-b from-indigo-400 via-cyan-300 to-fuchsia-400 sm:left-3" />
        {plan.map((d, i) => (
          <motion.div key={d.day} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }} transition={{ delay: Math.min(i, 3) * 0.06 }} className="relative mb-4">
            <span className={`absolute -left-[22px] top-6 h-3.5 w-3.5 rounded-full ring-4 ring-ink sm:-left-[29px] ${d.kind === "study" ? "bg-indigo-400" : d.kind === "revision" ? "bg-cyan-300" : "bg-fuchsia-400"}`} />
            <Card className="gborder">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-bold">Day {d.day}</h3>
                {d.kind !== "study" && <span className="rounded-full bg-white/10 px-3 py-1 text-xs">{d.kind === "final" ? "Final revision" : "Revision"}</span>}
              </div>
              {d.items.map((it, k) => <p key={k} className="text-sm"><span className="font-semibold text-cyan-200">{it.s}</span> - {it.c}</p>)}
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-xl bg-indigo-500/15 p-2">Study<br /><b className="text-sm">{d.study} h</b></div>
                <div className="rounded-xl bg-cyan-500/15 p-2">Practice<br /><b className="text-sm">{d.practice} h</b></div>
                <div className="rounded-xl bg-fuchsia-500/15 p-2">Revision<br /><b className="text-sm">{d.revision} h</b></div>
              </div>
              <p className="mt-3 text-xs text-slate-400">{d.note}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </Shell>
  );

  return (
    <Shell title="Roadmap" sub="Tell us about your exam and get a day-by-day study plan.">
      <Card className="space-y-4">
        <Field label="Student Name"><input className={inp} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Days remaining for exam"><input className={inp} inputMode="numeric" value={days} onChange={(e) => setDays(e.target.value)} placeholder="e.g. 60" /></Field>
          <Field label="Daily study time (hours)"><input className={inp} inputMode="decimal" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="e.g. 4" /></Field>
        </div>
        <Select label="Number of subjects" value={num} onChange={setN} options={nums(10)} />
        {subs.map((s, k) => (
          <motion.div key={k} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 rounded-2xl border border-white/10 bg-white/[.03] p-4">
            <p className="font-semibold">Subject {k + 1}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Select label="Subject" value={s.name} onChange={(v) => upd(k, { name: v })} options={SUBJECTS} />
              <Select label="Number of chapters" value={s.cc} onChange={(v) => setCC(k, v)} options={nums(20)} />
            </div>
            {s.name === "Others" && <input className={inp} placeholder="Enter subject name" value={s.other} onChange={(e) => upd(k, { other: e.target.value })} />}
            <div className="grid gap-2 sm:grid-cols-2">
              {s.chapters.map((c, ci) => <input key={ci} className={inp} placeholder={`Chapter ${ci + 1}`} value={c} onChange={(e) => setCh(k, ci, e.target.value)} />)}
            </div>
          </motion.div>
        ))}
        <ErrorBox msg={error} />
        <Btn onClick={go}><Sparkles size={18} /> Generate Roadmap</Btn>
      </Card>
    </Shell>
  );
                                  }
