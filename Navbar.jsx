"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Menu, X } from "lucide-react";
import { tools } from "@/lib/tools";

const links = [{ href: "/", label: "Home" }, ...tools.map((t) => ({ href: t.href, label: t.label }))];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-4"}`}
      >
        <div className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 transition-all duration-300 ${scrolled ? "glass mx-3 py-2 shadow-lg shadow-black/30 xl:mx-auto" : "py-2"}`}>
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-lg shadow-indigo-500/40">
              <GraduationCap size={20} />
            </span>
            <span className="text-lg">Study<span className="gradient-text">AI</span></span>
          </Link>

          <nav className="hidden items-center gap-1 xl:flex">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link key={l.href} href={l.href} className={`relative rounded-xl px-3 py-2 text-sm transition-colors ${active ? "text-white" : "text-slate-400 hover:text-white"}`}>
                  {active && <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-xl bg-white/10" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                  {l.label}
                  {active && <motion.span layoutId="nav-dot" className="absolute -bottom-0.5 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-300" />}
                </Link>
              );
            })}
          </nav>

          <button aria-label="Open menu" onClick={() => setOpen(true)} className="grid h-11 w-11 place-items-center rounded-xl glass xl:hidden">
            <Menu size={22} />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div key="bg" className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside key="panel" className="fixed right-0 top-0 z-[70] flex h-full w-[82%] max-w-sm flex-col bg-panel p-5 shadow-2xl" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 320, damping: 34 }}>
              <div className="mb-6 flex items-center justify-between">
                <span className="text-lg font-bold">Menu</span>
                <button aria-label="Close menu" onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center rounded-xl glass"><X size={22} /></button>
              </div>
              <div className="flex flex-col gap-1.5">
                {links.map((l, i) => (
                  <motion.div key={l.href} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.045 }}>
                    <Link href={l.href} className={`block rounded-xl px-4 py-3.5 text-base ${pathname === l.href ? "bg-gradient-to-r from-indigo-500/25 to-cyan-400/10 text-white" : "text-slate-300 active:bg-white/5"}`}>
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <p className="mt-auto text-center text-xs text-slate-500">Created by Ravi</p>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
