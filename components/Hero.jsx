"use client";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, BookOpen, Brain, Atom, Calculator, FlaskConical, Layers, Route } from "lucide-react";

const icons = [
  { I: BookOpen, cls: "left-[6%] top-[22%]", d: "0s" },
  { I: Atom, cls: "right-[8%] top-[20%]", d: "1s" },
  { I: Calculator, cls: "left-[12%] bottom-[18%]", d: "2s" },
  { I: FlaskConical, cls: "right-[12%] bottom-[24%]", d: "3s" },
  { I: Brain, cls: "left-[46%] top-[12%]", d: "1.5s" },
];
const particles = Array.from({ length: 14 }, (_, i) => ({ left: `${(i * 37) % 100}%`, top: `${40 + ((i * 53) % 55)}%`, delay: `${(i * 0.7) % 7}s`, size: 2 + (i % 3) }));

export default function Hero() {
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 }), sy = useSpring(my, { stiffness: 60, damping: 18 });
  const cardX = useTransform(sx, [-1, 1], [-18, 18]), cardY = useTransform(sy, [-1, 1], [-12, 12]);
  const blobX = useTransform(sx, [-1, 1], [24, -24]);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };

  const words = ["Study", "Smarter.", "Learn", "Faster."];

  return (
    <section onMouseMove={onMove} className="relative isolate flex min-h-[100svh] items-center overflow-hidden px-5 pb-16 pt-28">
      <div className="absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0 animate-gridmove" />
        <motion.div style={{ x: blobX }} className="absolute -left-24 top-10 h-72 w-72 animate-blob rounded-full bg-indigo-600/40 blur-3xl md:h-96 md:w-96" />
        <div className="absolute -right-20 top-1/3 h-72 w-72 animate-blob rounded-full bg-cyan-500/30 blur-3xl [animation-delay:-5s] md:h-96 md:w-96" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 animate-blob rounded-full bg-fuchsia-600/25 blur-3xl [animation-delay:-9s]" />
        {particles.map((p, i) => (
          <span key={i} className="absolute animate-rise rounded-full bg-cyan-200/80" style={{ left: p.left, top: p.top, width: p.size, height: p.size, animationDelay: p.delay }} />
        ))}
        {icons.map(({ I, cls, d }, i) => (
          <div key={i} className={`absolute hidden animate-float text-indigo-300/40 sm:block ${cls}`} style={{ animationDelay: d }}>
            <I size={38} strokeWidth={1.4} />
          </div>
        ))}
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-slate-300">
            <Sparkles size={15} className="text-cyan-300" /> AI study companion for students
          </motion.div>

          <h1 className="text-[2.6rem] font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            {words.map((w, i) => (
              <motion.span key={i} initial={{ opacity: 0, y: 28, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.25 + i * 0.12, duration: 0.7, ease: "easeOut" }} className={`mr-3 inline-block ${i > 1 ? "gradient-text" : ""}`}>
                {w}{i === 1 && <br className="hidden sm:block" />}
              </motion.span>
            ))}
          </h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }} className="mt-6 max-w-xl text-base text-slate-400 sm:text-lg">
            Your AI-powered study companion for roadmaps, flashcards, quizzes, notes and doubts.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/roadmap" className="btn-primary group inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-4 font-semibold">
              Start Learning <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="#features" className="glass group inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-4 font-semibold transition hover:scale-[1.03] hover:bg-white/10">
              Explore Features <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>
        </div>

        <motion.div style={{ x: cardX, y: cardY }} className="relative hidden h-[420px] lg:block" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, duration: 0.8 }}>
          <div className="glass gborder absolute left-4 top-6 w-72 animate-float rounded-3xl p-5 shadow-2xl shadow-indigo-900/30">
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-300"><Route size={16} className="text-indigo-300" /> Day 12 - Physics</div>
            <div className="space-y-2">
              <div className="h-2 w-full rounded-full bg-white/10"><div className="h-2 w-[72%] rounded-full bg-gradient-to-r from-indigo-400 to-cyan-300" /></div>
              <p className="text-xs text-slate-400">Motion in a Straight Line - 2h study, 1h practice</p>
            </div>
          </div>
          <div className="glass gborder absolute right-2 top-36 w-64 animate-float rounded-3xl p-5 shadow-2xl shadow-cyan-900/30 [animation-delay:-2s]">
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-300"><Layers size={16} className="text-cyan-300" /> Card 4 / 30</div>
            <p className="font-semibold">What is Newton&apos;s second law?</p>
            <p className="mt-1 text-xs text-slate-500">Tap to flip</p>
          </div>
          <div className="glass gborder absolute bottom-2 left-16 w-60 animate-float rounded-3xl p-5 shadow-2xl shadow-fuchsia-900/30 [animation-delay:-4s]">
            <p className="text-sm text-slate-400">Quiz score</p>
            <p className="gradient-text text-4xl font-extrabold">86%</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
