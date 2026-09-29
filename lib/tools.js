import { Route, Layers, ListChecks, ScanSearch, NotebookPen, FileDown } from "lucide-react";

export const tools = [
  { href: "/roadmap", label: "Roadmap", title: "Study Roadmap", desc: "Day-by-day plan built around your exam date and subjects.", icon: Route, color: "from-indigo-500 to-violet-500" },
  { href: "/flashcards", label: "Flashcards", title: "Flashcards", desc: "Upload a PDF and flip through cards made from it.", icon: Layers, color: "from-cyan-400 to-blue-500" },
  { href: "/quiz", label: "MCQ / Quiz", title: "MCQ Quiz", desc: "Practice questions generated from your chapter.", icon: ListChecks, color: "from-emerald-400 to-teal-500" },
  { href: "/doubt", label: "Doubt Solver", title: "Doubt Solver", desc: "Snap a question, get step-by-step help.", icon: ScanSearch, color: "from-fuchsia-500 to-pink-500" },
  { href: "/notes", label: "Notes Maker", title: "Notes Maker", desc: "Short or detailed notes for any topic, class and board.", icon: NotebookPen, color: "from-amber-400 to-orange-500" },
  { href: "/compress", label: "PDF Compressor", title: "Compress PDF", desc: "Shrink big PDFs so they fit the 3 MB limit.", icon: FileDown, color: "from-sky-400 to-indigo-500" },
];
