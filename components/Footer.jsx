import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { tools } from "@/lib/tools";

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-white/10 px-5 pb-8 pt-14">
      <div className="absolute -bottom-24 left-1/4 -z-10 h-64 w-64 animate-blob rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="absolute -right-10 top-0 -z-10 h-56 w-56 animate-blob rounded-full bg-cyan-500/10 blur-3xl [animation-delay:-6s]" />
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2">
        <div>
          <div className="flex items-center gap-2 text-lg font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400"><GraduationCap size={20} /></span>
            Study<span className="gradient-text">AI</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-slate-400">Study smarter. Learn faster.</p>
        </div>
        <div>
          <p className="mb-3 font-semibold">Study tools</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-400">
            {tools.map((t) => (
              <li key={t.href}><Link href={t.href} className="transition hover:text-white">{t.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6 text-center text-xs text-slate-500">Created by Ravi</p>
    </footer>
  );
}
