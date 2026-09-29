import { loadScript } from "./cdn";
const B = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/";

export async function pdfToText(file) {
  await loadScript(B + "pdf.min.js");
  const pdfjs = window.pdfjsLib;
  pdfjs.GlobalWorkerOptions.workerSrc = B + "pdf.worker.min.js";
  const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  let t = "";
  for (let i = 1; i <= doc.numPages && t.length < 45000; i++) {
    const c = await (await doc.getPage(i)).getTextContent();
    t += c.items.map((x) => x.str).join(" ") + "\n";
  }
  if (t.trim().length < 50) throw new Error("No readable text found in this PDF (it may be a scanned PDF).");
  return t.slice(0, 45000);
}
