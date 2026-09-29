"use client";
import { motion } from "framer-motion";
import { FileDown, ExternalLink } from "lucide-react";
import { Shell, Card } from "@/components/ui";

// Apna PDF compressor link yahan badal dena
const COMPRESSOR_URL = "https://www.ilovepdf.com/compress_pdf";

export default function Compress() {
  return (
    <Shell title="Compress PDF" sub="Reduce your PDF file size quickly.">
      <Card className="flex flex-col items-center gap-6 py-12 text-center">
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} className="grid h-24 w-24 place-items-center rounded-3xl bg-gradient-to-br from-sky-400 to-indigo-500 shadow-xl shadow-indigo-900/40">
          <FileDown size={44} />
        </motion.div>
        <a href={COMPRESSOR_URL} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-lg font-semibold">
          Open PDF Compressor <ExternalLink size={18} />
        </a>
      </Card>
    </Shell>
  );
}
