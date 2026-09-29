"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Download, Sparkles, RotateCcw } from "lucide-react";
import { Shell, Card, Select, Btn, ErrorBox, Upload, Loader } from "@/components/ui";
import { useAI, ai } from "@/lib/useAI";
import { pdfToText } from "@/lib/pdftext";
import { makePdf } from "@/lib/pdf";
import { LANGS } from "@/lib/data";

export default function Flashcards() {
  const [file, setFile] = useState(null), [count, setCount] = useState(""), [lang, setLang] = useState("");
  const [cards, setCards] = useState(null), [i, setI] = useState(0), [flip, setFlip] = useState(false);
  const { loading, error, setError, run } = useAI();

  const go = async () => {
    if (!file) return setError("Please upload a PDF.");
    if (!count) return setError("Choose the number of flashcards.");
    if (!lang) return setError("Choose a language.");
    const d = await run(async () => ai("flashcards", { text: await pdfToText(file), count, language: lang }));
    if (d?.cards?.length) { setCards(d.cards); setI(0); setFlip(false); }
  };
  const move = (k) => { setFlip(false); setI((x) => Math.min(cards.length - 1, Math.max(0, x + k))); };
  const pdf = () => makePdf("Flashcards", cards.flatMap((c, n) => [{ t: "h2", x: `Card ${n + 1}: ${c.q}` }, { t: "p", x: `Answer: ${c.a}` }]), "flashcards.pdf");

  if (loading) return <Shell title="Flashcards" sub=""><Loader text="AI is creating your flashcards..." /></Shell>;

  if (cards) {
    const c = cards[i];
    return (
      <Shell title="Flashcards" sub="Tap the card to flip it.">
        <motion.div key={i} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          <div className="flip mx-auto h-72 max-w-xl cursor-pointer sm:h-80" onClick={() => setFlip(!flip)}>
            <div className={`flip-inner relative h-full w-full ${flip ? "on" : ""}`}>
              <div className="face glass gborder grid place-items-center rounded-3xl p-6 text-center text-xl font-semibold">{c.q}</div>
              <div className="face back grid place-items-center rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600/40 to-cyan-500/30 p-6 text-center text-lg">{c.a}</div>
            </div>
          </div>
        </motion.div>
        <div className="mx-auto mt-6 max-w-xl">
          <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
            <button aria-label="Previous" onClick={() => move(-1)} disabled={i === 0} className="glass grid h-12 w-12 place-items-center rounded-xl disabled:opacity-30"><ChevronLeft /></button>
            <span>Card {i + 1} / {cards.length}</span>
            <button aria-label="Next" onClick={() => move(1)} disabled={i === cards.length - 1} className="glass grid h-12 w-12 place-items-center rounded-xl disabled:opacity-30"><ChevronRight /></button>
          </div>
          <div className="h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-cyan-300 transition-all duration-500" style={{ width: `${((i + 1) / cards.length) * 100}%` }} /></div>
        </div>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Btn onClick={pdf}><Download size={18} /> Download Flashcards PDF</Btn>
          <button onClick={() => setCards(null)} className="glass inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-semibold"><RotateCcw size={18} /> New PDF</button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell title="Flashcards" sub="Upload a chapter PDF and get flashcards made from it.">
      <Card className="space-y-4">
        <Upload file={file} onFile={setFile} onError={setError} />
        <Select label="Number of flashcards" value={count} onChange={setCount} options={["15", "20", "30", "40", "50", "60", "70", "80"]} />
        <Select label="Language" value={lang} onChange={setLang} options={LANGS} />
        <ErrorBox msg={error} />
        <Btn onClick={go}><Sparkles size={18} /> Generate Flashcards</Btn>
      </Card>
    </Shell>
  );
  }
