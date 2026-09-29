"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { tools } from "@/lib/tools";

export default function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-7xl scroll-mt-20 px-5 py-20 sm:py-28">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} className="mb-12 max-w-2xl">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">Everything you need to <span className="gradient-text">prepare</span></h2>
        <p className="mt-4 text-slate-400">Six tools, one place. Pick one and start.</p>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t, i) => (
          <motion.div key={t.href} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ delay: (i % 3) * 0.1, duration: 0.5 }}>
            <Link href={t.href} className="glass gborder group block h-full rounded-3xl p-6 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-900/30">
              <div className={`mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${t.color} shadow-lg transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110`}>
                <t.icon size={24} />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{t.title}</h3>
                <ArrowUpRight size={20} className="text-slate-500 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{t.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
