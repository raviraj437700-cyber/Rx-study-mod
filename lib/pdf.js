import { loadScript } from "./cdn";

// blocks: { t: "h1" | "h2" | "p" | "b", x: "text" }
export async function makePdf(title, blocks, filename) {
  try {
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
    const { jsPDF } = window.jspdf;
    const d = new jsPDF({ unit: "pt", format: "a4" });
    const W = d.internal.pageSize.getWidth(), H = d.internal.pageSize.getHeight(), m = 48;
    let y = m + 8;
    d.setFont("helvetica", "bold"); d.setFontSize(11); d.setTextColor(99, 102, 241); d.text("Study AI", m, y); y += 26;
    d.setFontSize(22); d.setTextColor(20, 20, 40);
    const tl = d.splitTextToSize(title, W - 2 * m); d.text(tl, m, y); y += tl.length * 28 + 6;
    for (const b of blocks) {
      const size = b.t === "h1" ? 16 : b.t === "h2" ? 13 : 11;
      d.setFont("helvetica", b.t === "p" || b.t === "b" ? "normal" : "bold");
      d.setFontSize(size);
      if (b.t === "h1") d.setTextColor(60, 60, 200); else if (b.t === "h2") d.setTextColor(30, 30, 60); else d.setTextColor(40, 40, 50);
      const lines = d.splitTextToSize((b.t === "b" ? "-  " : "") + b.x, W - 2 * m);
      const h = lines.length * size * 1.35;
      if (y + h > H - 70) { d.addPage(); y = m; }
      if (b.t === "h1" || b.t === "h2") y += 6;
      d.text(lines, m, y); y += h + 4;
    }
    const n = d.getNumberOfPages();
    for (let i = 1; i <= n; i++) {
      d.setPage(i); d.setFont("helvetica", "normal"); d.setFontSize(9); d.setTextColor(140);
      d.text("Study AI", m, H - 24); d.text(`Page ${i} of ${n}`, W - m, H - 24, { align: "right" });
    }
    d.setPage(n); d.setFont("helvetica", "bold"); d.setFontSize(12); d.setTextColor(99, 102, 241);
    d.text("Created by Ravi", W / 2, H - 44, { align: "center" });
    d.save(filename);
  } catch {
    alert("Could not create the PDF. Check your internet and try again.");
  }
}
