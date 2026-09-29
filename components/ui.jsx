"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, AlertCircle, BookOpen, Brain, Atom, Calculator } from "lucide-react";

const css = `
.flip{perspective:1200px}
.flip-inner{transition:transform .6s cubic-bezier(.4,.2,.2,1);transform-style:preserve-3d}
.flip-inner.on{transform:rotateY(180deg)}
.face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden}
.back{transform:rotateY(180deg)}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
.shake{animation:shake .35s}
@keyframes load{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}
@keyframes ripple{from{transform:scale(0);opacity:.5}to{transform:scale(9);opacity:0}}
`;

export const inp = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-base outline-none transition focus:border-indigo-400 focus:bg-white/10 focus:shadow-[0_0_0_4px_rgba(99,102,241,.2)] [&>option]:bg-slate-900";

export function Shell({ title, sub, children }) {
  return (
    <section className="mx-auto max-w-4xl px-5 pb-20 pt-28">
      <style>{css}</style>
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl"><span className="gradient-text">{title}</span></h1>
        <p className="mb-8 mt-3 text-slate-400">{sub}</p>
        {children}
      </motion.div>
    </section>
  );
}
export const Card = ({ children, className = "" }) => <div className={`glass rounded-3xl p-5 sm:p-6 ${className}`}>{children}</div>;
export const Field = ({ label, children }) => (<label className="block"><span className="mb-1.5 block text-sm text-slate-300">{label}</span>{children}</label>);
export const Select = ({ label, value, onChange, options, ph = "Select" }) => (
  <Field label={label}>
    <select className={inp} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{ph}</option>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  </Field>
);

export function Btn({ children, onClick, ...p }) {
  const [rip, setRip] = useState([]);
  const click = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const id = Date.now() + Math.random();
    setRip((a) => [...a, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
    setTimeout(() => setRip((a) => a.filter((z) => z.id !== id)), 650);
    if (onClick) onClick(e);
  };
  return (
    <button {...p} onClick={click} className="btn-primary group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl px-7 py-4 font-semibold disabled:opacity-50 sm:w-auto">
      {children}
      {rip.map((z) => (
        <span key={z.id} className="pointer-events-none absolute h-6 w-6 rounded-full bg-white/50" style={{ left: z.x - 12, top: z.y - 12, animation: "ripple .65s ease-out forwards" }} />
      ))}
    </button>
  );
}

export const ErrorBox = ({ msg }) => msg ? (
  <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200"><AlertCircle size={18} className="mt-0.5 shrink-0" />{msg}</div>
) : null;

const spin = [BookOpen, Brain, Atom, Calculator];
export function Loader({ text }) {
  const [k, setK] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setK((x) => (x + 1) % spin.length), 900);
    return () => clearInterval(t);
  }, []);
  const Icon = spin[k];
  return (
    <div className="glass mx-auto flex max-w-md flex-col items-center gap-5 rounded-3xl p-10 text-center">
      <div className="relative grid h-20 w-20 place-items-center">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-white/10 border-t-cyan-300" />
        <div className="absolute inset-3 animate-spin rounded-full border-4 border-white/10 border-b-indigo-400 [animation-direction:reverse]" />
        <AnimatePresence mode="wait">
          <motion.span key={k} initial={{ opacity: 0, scale: 0.5, rotate: -30 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.5, rotate: 30 }} transition={{ duration: 0.25 }}>
            <Icon size={26} className="text-cyan-200" />
          </motion.span>
        </AnimatePresence>
      </div>
      <p className="font-semibold">{text}</p>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-1/3 animate-[load_1.4s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-indigo-400 to-cyan-300" />
      </div>
    </div>
  );
}

export function Upload({ kind = "pdf", file, onFile, onError, maxMB = 3 }) {
  const [drag, setDrag] = useState(false);
  const ref = useRef();
  const take = (f) => {
    if (!f) return;
    const ok = kind === "pdf" ? f.type === "application/pdf" : f.type.startsWith("image/");
    if (!ok) return onError(kind === "pdf" ? "Unsupported file type. Please upload a PDF." : "Unsupported file type. Please upload an image.");
    if (f.size > maxMB * 1024 * 1024) return onError(`File is larger than ${maxMB} MB.`);
    onError(""); onFile(f);
  };
  return (
    <div>
      <div
        onClick={() => ref.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); take(e.dataTransfer.files[0]); }}
        className={`cursor-pointer rounded-3xl border-2 border-dashed p-8 text-center transition duration-300 ${drag ? "scale-[1.02] border-cyan-300 bg-cyan-400/10" : "border-white/20 bg-white/5 hover:border-indigo-400"}`}
      >
        <UploadCloud className="mx-auto mb-3 text-cyan-300" size={36} />
        <p className="font-semibold">{file ? file.name : kind === "pdf" ? "Tap to upload PDF or drag & drop" : "Tap to upload question image"}</p>
        <input ref={ref} type="file" hidden accept={kind === "pdf" ? "application/pdf" : "image/*"} onChange={(e) => take(e.target.files[0])} />
      </div>
      <p className="mt-2 text-sm text-amber-300/90">Maximum file size: {maxMB} MB</p>
    </div>
  );
}

export function shrinkImage(file, max = 1400) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = img.width * k; c.height = img.height * k;
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      res(c.toDataURL("image/jpeg", 0.85).split(",")[1]);
    };
    img.onerror = () => rej(new Error("Could not read this image."));
    img.src = URL.createObjectURL(file);
  });
}
